from django.shortcuts import render
from backendApp.models import *
from django.http import HttpResponse
import json, pprint

pp = pprint.PrettyPrinter(indent=4)


# Create your views here.
def index(request):
    return render(request, 'view1.html')


def view2(request):
    return render(request, 'view2.html')


def upload(request, file_dir):
    file_dir = '/' + file_dir.replace('_', '/')
    with open(file_dir, 'r') as file:
        data = json.load(file)

    pp.pprint(data)
    return HttpResponse('you are uploading file from %s' % file_dir)
