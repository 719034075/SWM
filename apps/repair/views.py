from django.contrib.auth.decorators import permission_required, login_required
from django.shortcuts import render

# Create your views here.
from apps.account.forms import UserEditForm
from apps.repair.forms import RepairInformationEditForm


@permission_required('repair.view_repair_dashboard')
@login_required
def view_repair_dashboard(request):
    return render(request,
                  'repair/dashboard.html')


@permission_required('repair.edit_repair_information')
@login_required
def edit_repair_information(request):
    if request.method == 'POST':
        user_form = UserEditForm(instance=request.user,
                                 data=request.POST)
        repair_information_form = RepairInformationEditForm(instance=request.user.repairinformation,
                                                            data=request.POST)
        if user_form.is_valid() and repair_information_form.is_valid():
            user_form.save()
            repair_information_form.save()
            return render(request,
                          'repair/dashboard.html')
    else:
        user_form = UserEditForm(instance=request.user)
        repair_information_form = RepairInformationEditForm(instance=request.user.repairinformation)

    return render(request,
                  'repair/edit.html',
                  {'user_form': user_form,
                   'repair_information_form': repair_information_form})
