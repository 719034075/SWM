import time

import datetime
from django.contrib.auth.models import User, Group
from django.shortcuts import render

# Create your views here.
import json

from django.contrib.auth.decorators import login_required, permission_required
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404

# Create your views here.
from django.views.decorators.csrf import csrf_exempt

from apps.repairment.models import Repairment
from apps.washmachine.models import WashMachine
from utils.ResponseBean import ResponseBean

@permission_required('repairment.add_repairment')
@login_required
@csrf_exempt
def add_repairment(request):
    if request.method == 'POST':
        user = User.objects.get(id=request.user.id)
        d = json.loads(str(request.body, encoding="utf-8"))
        washmachine = get_object_or_404(WashMachine, id=d['id'])
        machine_id = washmachine.machine_id
        repair_account = user.username
        washmachine_state = d['state']
        remarks = d['remarks']
        if washmachine_state == 'B':
            washmachine.state = 'B'
            state = 'R'
        else:
            washmachine.state = 'D'
            state = 'W'
        new_repairment = Repairment.objects.create(machine_id=machine_id,
                                                   repair_account=repair_account,
                                                   remarks=remarks,
                                                   state=state)
        washmachine.save()
        new_repairment.save()
        response = ResponseBean().get_success_instance()
        response.message = '提交异常成功。'
        return JsonResponse(response.__dict__)

@permission_required('repairment.findOne_repairment')
@login_required
@csrf_exempt
def findOne_repairment(request, id):
    repairment = get_object_or_404(Repairment, id=id)
    repairment.__dict__.pop('_state')
    if repairment.repair_time:
        repairment.repair_time = time.mktime(repairment.repair_time.timetuple()) * 1000
    if repairment.complete_time:
        repairment.complete_time = time.mktime(repairment.complete_time.timetuple()) * 1000
    response = ResponseBean().get_success_instance()
    response.message = '查询成功。'
    response.data = repairment.__dict__
    return JsonResponse(response.__dict__)


@permission_required('repairment.findAllOfCondition_repairment')
@login_required
@csrf_exempt
def findAllOfCondition_repairment(request):
    if request.method == 'POST':
        user = User.objects.get(id=request.user.id)
        data = Repairment.objects.order_by('-repair_time')
        d = json.loads(str(request.body, encoding="utf-8"))
        repair_account = user.username
        if 'machine_id' in d.keys():
            data = data.filter(machine_id=d['machine_id'])
        if repair_account is not None and Group.objects.get(user=user) == Group.objects.get(name='U'):
            data = data.filter(repair_account=repair_account)
        if 'state' in d.keys():
            data = data.filter(state=d['state'])
        if 'page_index' in d.keys():
            page_index = d['page_index']
        else:
            page_index = 1
        if 'page_size' in d.keys():
            page_size = d['page_size']
        else:
            page_size = 10

        totol = data.__len__()
        paginator = Paginator(data, page_size)
        try:
            data = paginator.page(page_index)
        except PageNotAnInteger:
            data = paginator.page(1)
        except EmptyPage:
            data = paginator.page(paginator.num_pages)
        response = ResponseBean().get_success_instance()
        response.message = "查询成功。"
        response.total = totol
        data_list = []
        for element in data:
            element.__dict__.pop('_state')
            if element.repair_time:
                element.repair_time = time.mktime(element.repair_time.timetuple()) * 1000
            if element.complete_time:
                element.complete_time = time.mktime(element.complete_time.timetuple()) * 1000
            data_list.append(element.__dict__)
        response.data = data_list
        return JsonResponse(response.__dict__)


@permission_required('repairment.view_repairment')
@login_required
def view_repairment(request):
    return render(request,
                  'repairment/repairment.html')


@permission_required('repairment.view_repairmentForm')
@login_required
def view_repairmentForm(request):
    return render(request,
                  'repairment/repairmentForm.html')


@permission_required('repairment.complete_repairment')
@login_required
def complete_repairment(request, id):
    user = User.objects.get(id=request.user.id)
    repairment = get_object_or_404(Repairment, id=id)
    washmachine = get_object_or_404(WashMachine, machine_id=repairment.machine_id)
    complete_account = user.username
    repairment.complete_account = complete_account
    repairment.complete_time = datetime.datetime.now()
    repairment.state = 'E'
    washmachine.state = 'F'
    repairment.save()
    washmachine.save()
    response = ResponseBean().get_success_instance()
    response.message = '处理成功。'
    return JsonResponse(response.__dict__)


@permission_required('repairment.cancel_repairment')
@login_required
def cancel_repairment(request, id):
    repairment = get_object_or_404(Repairment, id=id)
    washmachine = get_object_or_404(WashMachine, machine_id=repairment.machine_id)
    repairment.state = 'C'
    washmachine.state = 'F'
    repairment.save()
    washmachine.save()
    response = ResponseBean().get_success_instance()
    response.message = '撤销成功。'
    return JsonResponse(response.__dict__)