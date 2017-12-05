#!usr/bin/python
#-*- coding:utf-8 _*-
from django import forms


class LoginForm(forms.Form):
    """
    this is a login form.
    """
    username = forms.CharField()
    password = forms.CharField(widget=forms.PasswordInput)