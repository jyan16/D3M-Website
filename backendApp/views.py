from django.shortcuts import render
from backendApp.models import *
from django.http import HttpResponse
import json
import pprint
from django.utils import timezone
from .utils import *
from django.core.exceptions import ObjectDoesNotExist

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

    time = timezone.now()
    # create object
    for index, name in data['Dataset'].items():

        # get dataset object
        try:
            dataset = DataSet.objects.get(name=name)
        except ObjectDoesNotExist:
            print('create new dataset: %s' % name)
            dataset = DataSet.objects.create()

            dataset.name = name
            dataset.most_recent_time = time

            dataset.type = check_type(data['TaskType'][index])
            dataset.metric = check_metric(data['Metric'][index])
            dataset.save()

        result = Result.objects.create(
            time=time,
            RS_Score=data['RS Score'][index],
            HB_Score=data['HB Score'][index],
            BO_Score=data['BO Score'][index],
            AP_Score=data['AP Score'][index],
            RS_Duration=data['Duration(RS)'][index],
            HB_Duration=data['Duration(HB)'][index],
            BO_Duration=data['Duration(BO)'][index],
            AP_Duration=data['Duration(AP)'][index],
            Baseline_Score=data['Baseline Score'][index]
        )
        dataset.train_results.add(result)
        dataset.save()

    return HttpResponse('you are uploading file')


def get_data(name):
    return HttpResponse('get name: %s' % name)


def get_all():
    pass