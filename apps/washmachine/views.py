from django.contrib.auth.decorators import login_required, permission_required
from django.shortcuts import render


# Create your views here.
@permission_required('washmachine.add_washmachine')
@login_required
def add_washmachine(request):
    pass


@permission_required('washmachine.remove_washmachine')
@login_required
def remove_washmachine(request):
    pass


@permission_required('washmachine.modify_washmachine')
@login_required
def modify_washmachine(request):
    pass


@permission_required('washmachine.findOne_washmachine')
@login_required
def findOne_washmachine(request):
    pass


@permission_required('washmachine.findAllOfCondition_washmachine')
@login_required
def findAllOfCondition_washmachine(request):
    pass


@permission_required('washmachine.view_washmachine')
@login_required
def view_washmachine(request):
    print("view_washmachine")
    return render(request,
                  'washmachine/washmachine.html')
