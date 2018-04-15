from django.shortcuts import render
from backendApp.models import *


# Create your views here.
def index(request):
    return render(request, 'view1.html')


def view2(request):
    return render(request, 'view2.html')
