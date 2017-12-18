import datetime
import time
from django.contrib.auth.models import User, Group
from django.shortcuts import render

# Create your views here.
import json

from django.contrib.auth.decorators import login_required, permission_required
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404

# Create your views here.
from django.utils.timezone import now
from django.views.decorators.csrf import csrf_exempt

from apps.appointment.models import Appointment
from utils.ResponseBean import ResponseBean


@permission_required('appointment.add_appointment')
@login_required
@csrf_exempt
def add_appointment(request):
    if request.method == 'POST':
        d = json.loads(str(request.body, encoding="utf-8"))
        user = User.objects.get(id=request.user.id)
        machine_id = d['machine_id']
        account = user.username
        start_time = datetime.datetime.now()
        end_time = start_time + datetime.timedelta(minutes=+10)
        state = 'A'
        new_appointment = Appointment.objects.create(machine_id=machine_id,
                                                     account=account,
                                                     start_time=start_time,
                                                     end_time=end_time,
                                                     state=state)
        new_appointment.save()
        response = ResponseBean().get_success_instance()
        response.message = '预约成功。'
        return JsonResponse(response.__dict__)


@permission_required('appointment.remove_appointment')
@login_required
@csrf_exempt
def remove_appointment(request, id):
    appointment = get_object_or_404(Appointment, id=id)
    appointment.delete()
    response = ResponseBean().get_success_instance()
    response.message = '删除预约记录成功。'
    return JsonResponse(response.__dict__)


@permission_required('appointment.modify_appointment')
@login_required
@csrf_exempt
def modify_appointment(request):
    if request.method == 'POST':
        d = json.loads(str(request.body, encoding="utf-8"))
        appointment = get_object_or_404(Appointment, id=d['id'])
        if 'machine_id' in d.keys():
            appointment.machine_id = d['machine_id']
        if 'account' in d.keys():
            appointment.account = d['account']
        if 'start_time' in d.keys():
            appointment.start_time = d['start_time']
        if 'end_time' in d.keys():
            appointment.end_time = d['end_time']
        if 'state' in d.keys():
            appointment.state = d['state']
        appointment.save()
        response = ResponseBean().get_success_instance()
        response.message = '修改预约成功。'
        return JsonResponse(response.__dict__)


@permission_required('appointment.findOne_appointment')
@login_required
@csrf_exempt
def findOne_appointment(request, id):
    appointment = get_object_or_404(Appointment, id=id)
    appointment.start_time = time.mktime(appointment.start_time.timetuple())
    appointment.end_time = time.mktime(appointment.end_time.timetuple())
    appointment.__dict__.pop('_state')
    response = ResponseBean().get_success_instance()
    response.message = '查询成功。'
    response.data = appointment.__dict__
    return JsonResponse(response.__dict__)


@permission_required('appointment.findAllOfCondition_appointment')
@login_required
@csrf_exempt
def findAllOfCondition_appointment(request):
    if request.method == 'POST':
        user = User.objects.get(id=request.user.id)
        data = Appointment.objects.order_by('-start_time')
        d = json.loads(str(request.body, encoding="utf-8"))
        account = user.username
        if 'machine_id' in d.keys():
            data = data.filter(machine_id=d['machine_id'])
        if account is not None and Group.objects.get(user=user) == Group.objects.get(name='U'):
            data = data.filter(account=account)
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
            element.start_time = time.mktime(element.start_time.timetuple())
            element.end_time = time.mktime(element.end_time.timetuple())
            data_list.append(element.__dict__)
        response.data = data_list
        return JsonResponse(response.__dict__)


@permission_required('appointment.view_appointment')
@login_required
def view_appointment(request):
    return render(request,
                  'appointment/appointment.html')
