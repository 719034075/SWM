#!usr/bin/python
#-*- coding:utf-8 _*-
from django.conf.urls import url

from apps.money import views

urlpatterns = [
    url(r'^$', views.view_money, name="view_money"),
    url(r'^rechargeForm/$', views.view_rechargeForm, name="view_rechargeForm"),
    url(r'^add/$', views.add_money, name='add_money'),
    url(r'^remove/(?P<id>\d+)/$', views.remove_money, name='remove_money'),
    url(r'^findOne/(?P<id>\d+)/$', views.findOne_money, name='findOne_money'),
    url(r'^findAllOfCondition/$', views.findAllOfCondition_money, name='findAllOfCondition_money'),
    url(r'^recharge/$', views.recharge_money, name='recharge_money'),

]
