from django.urls import path
from . import views


urlpatterns = [

    path('', views.index, name='index'),
    path('lab/', views.lab, name='lab'),
    path('view1/', views.data, name='view1'),

    path('upload/', views.upload, name='upload'),
    path('all/', views.get_all, name='get_all'),
    path('dataset/', views.get_data, name='get_data'),

    path('test/', views.test, name='test'),
]
