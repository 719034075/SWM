#!usr/bin/python
#-*- coding:utf-8 _*-
from django.conf.urls import url

from apps.student import views

urlpatterns = [
    # edit
    url(r'^edit/$', views.edit_student_information, name='edit'),
]