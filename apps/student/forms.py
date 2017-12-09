#!usr/bin/python
# -*- coding:utf-8 _*-
from django import forms

from apps.student.models import StudentInformation


class StudentInformationEditForm(forms.ModelForm):
    gender = forms.CharField(widget=forms.Select(choices=StudentInformation.GENDER_CHOICES))
    mobile_phone = forms.CharField(widget=forms.TextInput(attrs={'class': 'layui-input'}))
    dormitory_building_number = forms.IntegerField(widget=forms.NumberInput(attrs={'class': 'layui-input'}))

    class Meta:
        model = StudentInformation
        exclude = ['user','balance', 'credit', 'integral']
