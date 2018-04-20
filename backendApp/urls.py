from django.urls import path
from . import views


urlpatterns = [
    path('', views.index, name='index'),
    path('upload/', views.upload, name='upload'),
    path('dataset/', views.get_data, name='get_data'),
    path('all/', views.get_all, name='get_all'),
    path('view1/', views.view1, name='view1'),
    path('view2/', views.view2, name='view2'),
]
