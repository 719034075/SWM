from django.contrib.auth.decorators import login_required
from django.shortcuts import render

# Create your views here.
from apps.account.forms import UserEditForm, ProfileEditForm
from apps.student.forms import StudentInformationEditForm


@login_required
def edit_student_information(request):
    if request.method == 'POST':
        user_form = UserEditForm(instance=request.user,
                                 data=request.POST)
        student_information_form = StudentInformationEditForm(instance=request.user.studentinformation,
                                                              data=request.POST)
        if user_form.is_valid() and student_information_form.is_valid():
            user_form.save()
            student_information_form.save()
            return render(request,
                          'account/dashboard.html')
    else:
        user_form = UserEditForm(instance=request.user)
        student_information_form = StudentInformationEditForm(instance=request.user.studentinformation)

    return render(request,
                  'student/edit.html',
                  {'user_form': user_form,
                   'student_information_form': student_information_form})
