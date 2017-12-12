from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import Group
from django.http import HttpResponse
from django.shortcuts import render, redirect

# Create your views here.
from apps.account.forms import UserRegistrationForm, UserEditForm, LoginForm

from apps.repair.models import RepairInformation
from apps.student.models import StudentInformation


# @login_required
# def dashboard(request):
#     return render(request,
#                   'account/dashboard.html')

def user_login(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            cd = form.cleaned_data
            user = authenticate(username=cd['username'],
                                password=cd['password'])
            if user is not None:
                if user.is_active:
                    login(request, user)
                    if Group.objects.get(user=user) == Group.objects.get(name='U'):
                        return render(request,
                                      'student/dashboard.html')
                    elif Group.objects.get(user=user) == Group.objects.get(name='R'):
                        return render(request,
                                      'repair/dashboard.html')
                else:
                    form = LoginForm()
                    return render(request,
                                  'registration/login.html',
                                  {'form': form, 'error': "您的账号或者密码不正确!"})
            else:
                form = LoginForm()
                return render(request,
                              'registration/login.html',
                              {'form': form, 'error': "您的账号或者密码不正确!"})
    else:
        form = LoginForm()
    return render(request, 'registration/login.html', {'form': form})


# 登出函数完成
def user_logout(request):
    logout(request)
    return redirect('/login')


# 注册函数完成
def register(request):
    if request.method == 'POST':
        user_form = UserRegistrationForm(request.POST)
        if user_form.is_valid():
            # Create a new user object but avoid saving it yet
            new_user = user_form.save(commit=False)
            # Set the chosen password
            new_user.set_password(
                user_form.cleaned_data['password'])
            # Save the User object
            new_user.save()
            # add the user to group
            if request.POST.get('name') == 'U':
                group = Group.objects.get(name='U')
                new_user.groups.add(group)
                student_information = StudentInformation.objects.create(user=new_user)
            elif request.POST.get('name') == 'R':
                group = Group.objects.get(name='R')
                new_user.groups.add(group)
                repair_information = RepairInformation.objects.create(user=new_user)
            form = LoginForm()
            return render(request,
                          'registration/login.html',
                          {'form': form, 'message': "注册成功，请登录!"})
    else:
        user_form = UserRegistrationForm()
    return render(request,
                  'account/register.html',
                  {'user_form': user_form})
