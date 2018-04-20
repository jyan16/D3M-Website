from django.shortcuts import render
from backendApp.models import *
from django.http import HttpResponse, JsonResponse
import json
import pprint
from django.utils import timezone
from .utils import *
from django.core.exceptions import ObjectDoesNotExist
from django.core.serializers import serialize
from django.db.models import Avg, Max
from .config import *

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
        with open(file_dir, 'r') as file:
            data = json.load(file)
    except:
        return HttpResponse('open file %s fail' % file_dir)

    time = get_time(file_dir)
    keys = data.keys()
    # create object
    for index, name in data['Dataset'].items():

        # get dataset object
        try:
            dataset = DataSet.objects.get(name=name.lower())
            dataset.most_recent_time = time
        except ObjectDoesNotExist:
            print('create new dataset: %s' % name)
            dataset = DataSet.objects.create(
                name=name.lower(),
                most_recent_time=time,
                type=data['TaskType'][index].lower(),
                metric=data['Metric'][index].lower(),
            )
            dataset.save()

        result = Result.objects.create(
            time=time,
            dataset=dataset
        )
        result.save()
        for key in keys:
            if key.lower() in DATASET_FIELD:
                continue
            record = Record.objects.create(
                method=key.lower(),
                score=data[key][index],
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

    dataset = json.loads(serialize('json', dataset))[0]
    response['dataset'] = dataset['fields']

    train_results = Result.objects.filter(dataset__name=name)
    train_results = json.loads(serialize('json', train_results))

    response['train'] = list()
    for item in train_results:
        response['train'].append(item['fields'])

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
        result = Result.objects.filter(dataset=dataset)
        for field in RESULT_FIELD:
            data[field] = result.aggregate(Max(field))
        response[dataset.type].append(data)

    pp.pprint(response)
    return JsonResponse(response)