from django.shortcuts import render
from backendApp.models import *
from django.utils import timezone


# Create your views here.
def index(request):
    q = Question(question_text='fuck', pub_date=timezone.now())
    q.save()
    return render(request, 'view1.html')


def view2(request):
    return render(request, 'view2.html')
