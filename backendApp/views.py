from django.shortcuts import render
from backendApp.models import *
from django.http import HttpResponse, JsonResponse
import csv
import pprint
from .utils import *
from django.core.exceptions import ObjectDoesNotExist
from django.core.serializers import serialize
from django.db.models import Avg, Max


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
    try:
        data = csv.DictReader(open(file_dir, 'r'))

    except:
        return HttpResponse('open file %s fail' % file_dir)

    for row in data:
        name = row['Dataset'].lower()
        time = get_time(row['TimeStamp'])
        try:
            dataset = DataSet.objects.get(name=name)
            dataset.most_recent_time = time

        except ObjectDoesNotExist:
            print('create new dataset: %s' % name)
            dataset = DataSet.objects.create(
                name=name,
                most_recent_time=time,
                type=row['TaskType'].lower(),
                metric=row['ScoreMetric'].lower()
            )
            dataset.save()

        dataset.most_recent_time = time

        try:
            result = Result.objects.get(dataset=dataset, time=time)
        except ObjectDoesNotExist:
            result = Result.objects.create(time=time, dataset=dataset)
            result.save()
        score = None if row['Score'] == '' else float(row['Score'])
        duration = None if row['Duration'] == '' else int(float(row['Duration']))
        record = Record.objects.create(
            method=row['Method'],
            score=score,
            duration=duration,
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

    for dataset in datasets:
        if dataset.type not in response.keys():
            response[dataset.type] = list()
        data = dict()
        data['name'] = dataset.name
        data['most_recent_time'] = dataset.most_recent_time
        data['metric'] = dataset.metric
        data['most_recent_result'] = dict()
        result = dataset.result_set.get(time=dataset.most_recent_time)
        records = result.record_set.all()
        for record in records:
            data['most_recent_result'][record.method] = record.score
        response[dataset.type].append(data)

    pp.pprint(response)
    return JsonResponse(response)
