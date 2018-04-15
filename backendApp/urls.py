from django.urls import path
from . import views


urlpatterns = [
    path('view1/', views.index, name='view1'),
    path('view2/', views.view2, name='view2'),
]
