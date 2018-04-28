from django.urls import path
from . import views


urlpatterns = [

    path('', views.index, name='index'),
    path('lab/', views.lab, name='lab'),
    path('data/', views.data, name='data'),

    path('upload/', views.upload, name='upload'),
    path('all/', views.get_all, name='get_all'),
    path('dataset/', views.get_data, name='get_data'),
    path('contact/', views.contact, name='contact'),

    path('test/', views.test, name='test'),
]
