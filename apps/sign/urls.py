#!usr/bin/python
#-*- coding:utf-8 _*-

from django.conf.urls import url, include
from django.contrib import admin
from .import views

urlpatterns = [
    url(r'^$', views.index,name='index'),
    url(r'^signIn/', views.sign_in),
    url(r'^signUp/',views.sign_up)
]