from django.shortcuts import render
from backendApp.models import *
from django.http import HttpResponse, JsonResponse
import json
import pprint
from django.utils import timezone
from .utils import *
from django.core.exceptions import ObjectDoesNotExist
from django.core.serializers import serialize
from django.db.models import Max
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
    # create object
    for index, name in data['Dataset'].items():

        # get dataset object
        try:
            dataset = DataSet.objects.get(name=name)
            dataset.most_recent_time = time
        except ObjectDoesNotExist:
            print('create new dataset: %s' % name)
            dataset = DataSet.objects.create()

            dataset.name = name
            dataset.most_recent_time = time

            dataset.type = data['TaskType'][index]
            dataset.metric = data['Metric'][index]
            dataset.save()

        result = Result.objects.create(
            time=time,
            Baseline_Score=get_field(data, ['Baseline Score', 'Normalized Baseline Score'], index),
            Our_Score=get_field(data, ['Our Score'], index),
            Our_Duration=get_field(data, ['Duration', 'Our Duration'], index),
            AutoSklearn_Score=get_field(data, ['AutoSklearn Score', 'Normalized AutoSklearn Score'], index),
            AutoSklearn_Duration=get_field(data, ['AutoSklearn Duration'], index),
        )

        result.dataset = dataset
        result.save()

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
        result = Result.objects.filter(dataset=dataset)[0]
        data['Baseline_Score'] = result.Baseline_Score
        data['Our_Score'] = result.Our_Score

        response[dataset.type].append(data)

    return JsonResponse(response)