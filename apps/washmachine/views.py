import decimal
import json

import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from django.contrib.auth.decorators import login_required, permission_required
from django.contrib.auth.models import User
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404

# Create your views here.
from django.views.decorators.csrf import csrf_exempt

from apps.appointment.models import Appointment
from apps.appointment.tasks import washmachine_task
from apps.money.models import Money
from apps.student.models import StudentInformation
from apps.washmachine.models import WashMachine
from utils.ResponseBean import ResponseBean


@permission_required('washmachine.add_washmachine')
@login_required
@csrf_exempt
def add_washmachine(request):
    if request.method == 'POST':
        d = json.loads(str(request.body, encoding="utf-8"))
        machine_id = d['machine_id']
        dormitory_building_number = d['dormitory_building_number']
        state = 'F'
        new_washmachine = WashMachine.objects.create(machine_id=machine_id,
                                                     dormitory_building_number=dormitory_building_number,
                                                     state=state)
        new_washmachine.save()
        response = ResponseBean().get_success_instance()
        response.message = '新建洗衣机成功。'
        print(json.dumps(response.__dict__))
        return JsonResponse(response.__dict__)


@permission_required('washmachine.remove_washmachine')
@login_required
@csrf_exempt
def remove_washmachine(request, id):
    washmachine = get_object_or_404(WashMachine, id=id)
    washmachine.delete()
    response = ResponseBean().get_success_instance()
    response.message = '删除洗衣机成功。'
    return JsonResponse(response.__dict__)


@permission_required('washmachine.modify_washmachine')
@login_required
@csrf_exempt
def modify_washmachine(request):
    if request.method == 'POST':
        d = json.loads(str(request.body, encoding="utf-8"))
        washmachine = get_object_or_404(WashMachine, id=d['id'])
        if 'machine_id' in d.keys():
            washmachine.machine_id = d['machine_id']
        if 'dormitory_building_number' in d.keys():
            washmachine.dormitory_building_number = d['dormitory_building_number']
        if 'state' in d.keys():
            washmachine.state = d['state']
        washmachine.save()
        response = ResponseBean().get_success_instance()
        response.message = '修改洗衣机信息成功。'
        return JsonResponse(response.__dict__)


@permission_required('washmachine.findOne_washmachine')
@login_required
@csrf_exempt
def findOne_washmachine(request, id):
    washmachine = get_object_or_404(WashMachine, id=id)
    washmachine.__dict__.pop('_state')
    response = ResponseBean().get_success_instance()
    response.message = '查询成功。'
    response.data = washmachine.__dict__
    return JsonResponse(response.__dict__)


@permission_required('washmachine.findAllOfCondition_washmachine')
@login_required
@csrf_exempt
def findAllOfCondition_washmachine(request):
    if request.method == 'POST':
        user = User.objects.get(id=request.user.id)
        data = WashMachine.objects.all()
        d = json.loads(str(request.body, encoding="utf-8"))
        if 'machine_id' in d.keys():
            data = data.filter(machine_id=d['machine_id'])
        if 'dormitory_building_number' in d.keys():
            data = data.filter(dormitory_building_number=d['dormitory_building_number'])
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
            element.is_me = False
            if element.state == 'A':
                appointment = get_object_or_404(Appointment, machine_id=element.machine_id, state='A')
                element.start_time = appointment.start_time
                element.end_time = appointment.end_time
                if appointment.account == user.username:
                    element.is_me = True
            elif element.state == 'W':
                if element.account == user.username:
                    element.is_me = True
            element.__dict__.pop('_state')
            data_list.append(element.__dict__)
        response.data = data_list
        return JsonResponse(response.__dict__)


@permission_required('washmachine.view_washmachine')
@login_required
def view_washmachine(request):
    return render(request,
                  'washmachine/washmachine.html')


@permission_required('washmachine.view_washmachineForm')
@login_required
def view_washmachineForm(request):
    return render(request,
                  'washmachine/washmachineForm.html')


@permission_required('washmachine.use_washmachine')
@login_required
@csrf_exempt
def use_washmachine(request, id):
    scheduler = BackgroundScheduler()
    washmachine = get_object_or_404(WashMachine, id=id)
    user = User.objects.get(id=request.user.id)
    student = get_object_or_404(StudentInformation, user=user)
    if student.balance < 5:
        msg = '余额不足，请充值。'
    else:
        machine_id = washmachine.machine_id
        start_time = datetime.datetime.now()
        end_time = start_time + datetime.timedelta(seconds=+45)
        washmachine.start_time = start_time
        washmachine.end_time = end_time
        washmachine.account = user.username
        trading_account = user.username
        trading_amount = decimal.Decimal('-5.00')
        student.balance = student.balance + trading_amount
        balance = student.balance
        transaction_type = 'P'
        new_money = Money.objects.create(trading_account=trading_account,
                                         trading_amount=trading_amount,
                                         balance=balance,
                                         transaction_type=transaction_type)
        washmachine.state = 'W'
        appointment = get_object_or_404(Appointment, machine_id=machine_id, state='A')
        appointment.state = 'E'
        student.save()
        new_money.save()
        washmachine.save()
        appointment.save()
        scheduler.add_job(washmachine_task, 'date', run_date=end_time)
        scheduler.start()
        msg = '开始使用洗衣机，将在45分钟之后结束工作。'
    response = ResponseBean().get_success_instance()
    response.message = msg
    return JsonResponse(response.__dict__)
