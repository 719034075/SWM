#!usr/bin/python
#-*- coding:utf-8 _*-
from django.conf.urls import url

from apps.repair import views

urlpatterns = [
    # dashboard
    url(r'^$', views.view_repair_dashboard, name='view_repair_dashboard'),

    # edit
    url(r'^edit/$', views.edit_repair_information, name='edit_repair_information'),
]