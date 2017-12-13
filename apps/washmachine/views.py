import json

from django.contrib.auth.decorators import login_required, permission_required
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404

# Create your views here.
from django.views.decorators.csrf import csrf_exempt

from apps.washmachine.models import WashMachine
from utils.ResponseBean import ResponseBean


@permission_required('washmachine.add_washmachine')
@login_required
@csrf_exempt
def add_washmachine(request):
    if request.method == 'POST':
        machine_id = request.POST.get('machine_id')
        dormitory_building_number = request.POST.get('dormitory_building_number')
        state = 'F'
        new_washmachine = WashMachine.objects.create(machine_id=machine_id,
                                                     dormitory_building_number=dormitory_building_number,
                                                     state=state)
        new_washmachine.save()
        response = ResponseBean().get_success_instance()
        response.message = '新建洗衣机成功。'
        print(json.dumps(response.__dict__))
        return JsonResponse(json.dumps(response.__dict__))
    else:
        response = ResponseBean().get_fail_instance()
        response.message = '新建洗衣机失败。'
        print(json.dumps(response.__dict__))
        return JsonResponse(json.dumps(response.__dict__))


@permission_required('washmachine.remove_washmachine')
@login_required
@csrf_exempt
def remove_washmachine(request, id):
    washmachine = get_object_or_404(WashMachine, id=id)
    washmachine.delete()
    response = ResponseBean().get_success_instance()
    response.message = '删除洗衣机成功。'
    print(json.dumps(response.__dict__))
    return JsonResponse(json.dumps(response.__dict__))


@permission_required('washmachine.modify_washmachine')
@login_required
@csrf_exempt
def modify_washmachine(request):
    pass


@permission_required('washmachine.findOne_washmachine')
@login_required
@csrf_exempt
def findOne_washmachine(request, id):
    washmachine = get_object_or_404(WashMachine, id=id)
    response = ResponseBean().get_success_instance()
    response.message = '查询成功。'
    response.data = washmachine
    print(json.dumps(response.__dict__))
    return JsonResponse(json.dumps(response.__dict__))


@permission_required('washmachine.findAllOfCondition_washmachine')
@login_required
@csrf_exempt
def findAllOfCondition_washmachine(request):
    if request.method == 'POST':
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
            element.__dict__.pop('_state')
            data_list.append(element.__dict__)
        response.data = data_list
        return JsonResponse(response.__dict__)


@permission_required('washmachine.view_washmachine')
@login_required
def view_washmachine(request):
    print("view_washmachine")
    return render(request,
                  'washmachine/washmachine.html')
