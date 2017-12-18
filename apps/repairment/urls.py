#!usr/bin/python
#-*- coding:utf-8 _*-
from django.conf.urls import url

from apps.repairment import views

urlpatterns = [
    url(r'^$', views.view_repairment, name="view_repairment"),
    url(r'^add/$', views.add_repairment, name='add_repairment'),
    url(r'^findOne/(?P<id>\d+)/$', views.findOne_repairment, name='findOne_repairment'),
    url(r'^findAllOfCondition/$', views.findAllOfCondition_repairment, name='findAllOfCondition_repairment'),
    url(r'^repairmentForm/$', views.view_repairmentForm, name='view_repairmentForm'),
    url(r'^complete/(?P<id>\d+)/$', views.complete_repairment, name='complete_repairment')
]
