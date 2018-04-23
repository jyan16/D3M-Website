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

    #
    #
    # try:
    #     data = csv.DictReader(open(file_dir, 'r'))
    #
    # except:
    #     return HttpResponse('open file %s fail' % file_dir)
    #
    # cache = dict()
    # time = None
    # for row in data:
    #     if row['Score'] == '':
    #         continue
    #
    #     # process csv data
    #     name = row['Dataset'].lower()
    #     task_type = row['TaskType'].lower()
    #     metric = row['ScoreMetric'].lower()
    #     cur_time = get_time(row['TimeStamp'])
    #     method = row['Method'].lower()
    #     score = float(row['Score'])
    #     duration = int(float(row['Duration']))
    #
    #     # record statistic data
    #     if cur_time != time:
    #         if time is not None:
    #             add_statistic(cache, time)
    #         cache = dict()
    #         time = cur_time
    #     else:
    #         if task_type not in cache:
    #             cache[task_type] = dict()
    #         task_map = cache[task_type]
    #
    #         if method not in task_map:
    #             task_map[method] = [0, 0]
    #         method_list = task_map[method]
    #         method_list[0] += score
    #         method_list[1] += 1
    #
    #     # record dataset info
    #     try:
    #         dataset = DataSet.objects.get(name=name)
    #         dataset.most_recent_time = time
    #
    #     except ObjectDoesNotExist:
    #         print('create new dataset: %s' % name)
    #         dataset = DataSet.objects.create(
    #             name=name,
    #             most_recent_time=time,
    #             type=task_type,
    #             metric=metric,
    #         )
    #     dataset.save()
    #
    #     try:
    #         result = Result.objects.get(dataset=dataset, time=time)
    #     except ObjectDoesNotExist:
    #         result = Result.objects.create(time=time, dataset=dataset)
    #         result.save()
    #
    #     record = Record.objects.create(
    #         method=method,
    #         score=score,
    #         duration=duration,
    #         result=result
    #     )
    #     record.save()
    #
    # add_statistic(cache, time)
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

    for result in results:
        tmp = dict()
        tmp['time'] = result.time
        records = result.record_set.all()
        for record in records:
            tmp[record.method] = record.score
            tmp[record.method + ' Duration'] = record.duration
        response['results'].append(tmp)
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
    response['statistic'] = dict()

    threshold = make_aware(datetime.now() - timedelta(days=10))
    print('get statistic after %s' % threshold)
    statistics = Statistic.objects.filter(time__gte=threshold)

    for statistic in statistics:
        if statistic.type not in response['statistic']:
            response['statistic'][statistic.type] = dict()
        class_entry = response['statistic'][statistic.type]

        tmp_key = str(statistic.time)
        if tmp_key not in class_entry:
            class_entry[tmp_key] = dict()
        class_entry_time = class_entry[tmp_key]
        class_entry_time[statistic.method] = statistic.score_avg

    return JsonResponse(response)
