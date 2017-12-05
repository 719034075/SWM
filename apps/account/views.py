from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
from apps.account.forms import LoginForm, UserRegistrationForm, UserEditForm, ProfileEditForm
from apps.account.models import Profile


def user_login(request):
    """
    1. 当user_login被一个GET请求（request）调用，我们实例化一个新的登录表单（form）并通过form = LoginForm()在模板（template）中展示它。
    2. 当user_login被一个POST请求（request）提交表单（form）时，我们执行以下操作：
        i.   通过使用form = LoginForm(request.POST)使用提交的数据实例化表单（form）
        ii.  检查这个表单是否有效。如果无效，我们在模版（template）中展示表单错误信息（举个例子，比如用户没有填写其中一个字段就进行提交）
        iii. 如果提交的数据是有效的，我们使用authenticate()方法通过数据库对这个用户进行认证（registration）。这个方法带入一个username和一个
             password,如果这个用户成功地进行了认证则返回一个用户对象，否则是None。如果用户没用被认证通过，我们返回一个HttpResponse展示一条信息。
        iv.  如果这个用户认证（registration）成功，我们使用is_active属性来检查用户是否可用。这是一个Django的User模型（model)属性。
             如果这个用户不可用，我们返回一个HttpResponse展示信息。
        v.   如果用户可用，我们登录这个用户到网站中。我们通过调用login()方法集合用户到会话（session）中然后返回一条成功消息。
    :param request:
    :return:
    """
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            cd = form.cleaned_data
            user = authenticate(username=cd['username'],
                                password=cd['password'])
            if user is not None:
                if user.is_active:
                    login(request, user)
                    return HttpResponse('Authenticated successfully')
                else:
                    return HttpResponse('Disabled account')
            else:
                return HttpResponse('Invalid login')
    else:
        form = LoginForm()
    return render(request, 'account/login.html', {'form': form})


@login_required
def dashboard(request):
    return render(request,
                  'account/dashboard.html',
                  {'section': 'dashboard'})


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
            # Create the user profile
            profile = Profile.objects.create(user=new_user)
            return render(request,
                          'account/register_done.html',
                          {'new_user': new_user})
    else:
        user_form = UserRegistrationForm()
    return render(request,
                  'account/register.html',
                  {'user_form': user_form})

@login_required
def edit(request):
    if request.method == 'POST':
        user_form = UserEditForm(instance=request.user,
                                data=request.POST)
        profile_form = ProfileEditForm(instance=request.user.profile,
                                        data=request.POST,
                                        files=request.FILES)
        if user_form.is_valid() and profile_form.is_valid():
            user_form.save()
            profile_form.save()
    else:
        user_form = UserEditForm(instance=request.user)
        print(request.user.profile)
            # profile = Profile.objects.create(user=request.user)
        profile_form = ProfileEditForm(instance=request.user.profile)
    return render(request,
                 'account/edit.html',
                 {'user_form': user_form,
                 'profile_form': profile_form})
