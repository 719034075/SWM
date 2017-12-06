#!usr/bin/python
# -*- coding:utf-8 _*-
from django import forms

from apps.student.models import StudentInformation


class StudentInformationEditForm(forms.ModelForm):
    class Meta:
        model = StudentInformation
        exclude = ['balance', 'credit', 'integral']
