from django.urls import path
from . import views


urlpatterns = [
    path('', views.index, name='index'),
    path('view1/', views.view1, name='view1'),
    path('view2/', views.view2, name='view2'),
    path('upload/', views.upload, name='upload')

]
