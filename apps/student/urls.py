#!usr/bin/python
#-*- coding:utf-8 _*-
from django.conf.urls import url

from apps.student import views

urlpatterns = [
    # dashboard
    url(r'^$', views.view_student_dashboard, name='view_student_dashboard'),

    # edit
    url(r'^edit/$', views.edit_student_information, name='edit_student_information'),
]