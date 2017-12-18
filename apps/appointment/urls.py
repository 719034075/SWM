#!usr/bin/python
#-*- coding:utf-8 _*-
from django.conf.urls import url

from apps.appointment import views

urlpatterns = [
    url(r'^$', views.view_appointment, name="view_appointment"),
    url(r'^add/(?P<id>\d+)/$', views.add_appointment, name='add_appointment'),
    url(r'^remove/(?P<id>\d+)/$', views.remove_appointment, name='remove_appointment'),
    url(r'^modify/$', views.modify_appointment, name='modify_appointment'),
    url(r'^findOne/(?P<id>\d+)/$', views.findOne_appointment, name='findOne_appointment'),
    url(r'^findAllOfCondition/$', views.findAllOfCondition_appointment, name='findAllOfCondition_appointment'),
    url(r'^cancel/(?P<id>\d+)/$', views.cancel_appointment, name='cancel_appointment'),

]
