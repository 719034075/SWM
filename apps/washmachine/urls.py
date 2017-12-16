#!usr/bin/python
# -*- coding:utf-8 _*-
from django.conf.urls import url

from apps.washmachine import views

urlpatterns = [

    url(r'^$', views.view_washmachine, name="view_washmachine"),
    url(r'^add/$', views.add_washmachine, name='add_washmachine'),
    url(r'^remove/(?P<id>\d+)/$', views.remove_washmachine, name='remove_washmachine'),
    url(r'^modify/$', views.modify_washmachine, name='modify_washmachine'),
    url(r'^findOne/(?P<id>\d+)/$', views.findOne_washmachine, name='findOne_washmachine'),
    url(r'^findAllOfCondition/$', views.findAllOfCondition_washmachine, name='findAllOfCondition_washmachine'),
    url(r'^washmachineForm/$', views.view_washmachineForm, name='view_washmachineForm'),

]
