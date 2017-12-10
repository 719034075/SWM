#!usr/bin/python
# -*- coding:utf-8 _*-
from django import forms

from apps.repair.models import RepairInformation


class RepairInformationEditForm(forms.ModelForm):
    gender = forms.CharField(widget=forms.Select(choices=RepairInformation.GENDER_CHOICES))
    mobile_phone = forms.CharField(widget=forms.TextInput(attrs={'class': 'layui-input'}))

    class Meta:
        model = RepairInformation
        exclude = ['user', ]
