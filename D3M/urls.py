from django.urls import path
from . import views


app_name = 'd3m'
urlpatterns = [
    path('', views.index, name='index')
]
