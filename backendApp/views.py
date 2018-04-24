from django.shortcuts import render
from backendApp.models import *
from django.http import HttpResponse, JsonResponse
import pprint
from .utils import *
from django.core.exceptions import ObjectDoesNotExist
from django.core.serializers import serialize
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

pp = pprint.PrettyPrinter(indent=4)


# Create your views here.
def index(request):
    return render(request, 'index.html')


def view1(request):
    return render(request, 'view1.html')


def view2(request):
    return render(request, 'view2.html')


def upload(request):
    file_dir = request.POST['file_dir']

    # read data
    try:
        df = pd.read_csv(file_dir).dropna()
    except:
        return HttpResponse('open file %s fail' % file_dir)

    # clean data
    df['Dataset'] = df['Dataset'].str.lower()
    df['Method'] = df['Method'].str.lower()
    df['ScoreMetric'] = df['ScoreMetric'].str.lower()
    df['TaskType'] = df['TaskType'].str.lower()

    # calculate and store statistic results
    grouped_df = df[['Method', 'Score', 'TaskType', 'TimeStamp']].groupby(['Method', 'TaskType', 'TimeStamp'])
    avg_result = grouped_df.aggregate(np.average).dropna()
    for _, row in avg_result.iterrows():
        create_statistic(row)

    #
    for _, row in df.iterrows():
        time = get_time(row.TimeStamp)

        # get / create dataset object
        try:
            dataset = DataSet.objects.get(name=row.Dataset)
            dataset.most_recent_time = time
        except ObjectDoesNotExist:
            print('create new dataset: %s' % row.Dataset)
            dataset = DataSet.objects.create(
                name=row.Dataset,
                most_recent_time=time,
                type=row.TaskType,
                metric=row.ScoreMetric,
            )
        dataset.save()

        # get / create result object
        try:
            result = Result.objects.get(dataset=dataset, time=time)
        except ObjectDoesNotExist:
            result = Result.objects.create(time=time, dataset=dataset)
            result.save()

        # create record object
        record = Record.objects.create(
            method=row.Method,
            score=row.Score,
            duration=int(row.Duration),
            result=result
        )
        record.save()

    return HttpResponse('you are uploading file')


def get_data(request):
    name = request.GET['data_name']
    response = dict()
    try:
        dataset = DataSet.objects.filter(name=name)
        response['ok'] = True

    except ObjectDoesNotExist:
        return JsonResponse({'ok': False})

    response['dataset'] = json.loads(serialize('json', dataset))[0]['fields']
    dataset = dataset.first()
    results = dataset.result_set.all()
    response['results'] = list()

    statistic = dict()
    for result in results:
        tmp = dict()
        tmp['time'] = result.time
        records = result.record_set.all()
        for record in records:
            if record.method not in statistic:
                statistic[record.method] = list()
            statistic[record.method].append(record.score)
            tmp[record.method] = record.score
            tmp[record.method + ' Duration'] = record.duration
        response['results'].append(tmp)

    response['statistic'] = dict()

    # process statistic data
    for key, value_list in statistic.items():
        response['statistic'][key] = get_statistic(key, value_list)

    pp.pprint(response)
    return JsonResponse(response)


def get_all(request):
    datasets = DataSet.objects.all()
    response = dict()
    response['ok'] = True
    response['data'] = dict()
    for dataset in datasets:
        if dataset.type not in response['data'].keys():
            response['data'][dataset.type] = list()
        data = dict()
        data['name'] = dataset.name
        data['most_recent_time'] = dataset.most_recent_time
        data['metric'] = dataset.metric
        data['most_recent_result'] = dict()
        result = dataset.result_set.get(time=dataset.most_recent_time)
        records = result.record_set.all()
        for record in records:
            data['most_recent_result'][record.method] = record.score
        response['data'][dataset.type].append(data)

    # pp.pprint(response)

    threshold = make_aware(datetime.now() - timedelta(days=10))
    print('get statistic after %s' % threshold)
    statistics = Statistic.objects.filter(time__gte=threshold)

    tmp_dict = dict()
    for statistic in statistics:
        if statistic.type not in tmp_dict:
            tmp_dict[statistic.type] = dict()
        class_entry = tmp_dict[statistic.type]

        tmp_key = str(statistic.time)
        if tmp_key not in class_entry:
            class_entry[tmp_key] = dict()
        class_entry_time = class_entry[tmp_key]
        class_entry_time[statistic.method] = statistic.score_avg

    response['statistic'] = dict()
    for class_name, class_entry in tmp_dict.items():
        response['statistic'][class_name] = list()
        for time, data in class_entry.items():
            data['time'] = time
            response['statistic'][class_name].append(data)

    return JsonResponse(response)
