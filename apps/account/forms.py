#!usr/bin/python
# -*- coding:utf-8 _*-
from django import forms
from django.contrib.auth.models import User, Group



class LoginForm(forms.Form):
    username = forms.CharField(widget=forms.TextInput(attrs={'class': 'layui-input'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'class': 'layui-input'}))


class UserRegistrationForm(forms.ModelForm):
    password = forms.CharField(label='Password',
                               widget=forms.PasswordInput)
    password2 = forms.CharField(label='Repeat password',
                                widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email')

    def clean_password2(self):
        cd = self.cleaned_data
        if cd['password'] != cd['password2']:
            raise forms.ValidationError('Passwords don\'t match.')
        return cd['password2']




class UserEditForm(forms.ModelForm):
    first_name = forms.CharField(widget=forms.TextInput(attrs={'class': 'layui-input'}))
    last_name = forms.CharField(widget=forms.TextInput(attrs={'class': 'layui-input'}))
    email = forms.EmailField(widget=forms.EmailInput(attrs={'class': 'layui-input'}))

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'email')
