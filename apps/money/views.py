from django.contrib.auth.models import User
from django.db.migrations import state
from django.shortcuts import render

# Create your views here.
import json

from django.contrib.auth.decorators import login_required, permission_required
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404

# Create your views here.
from django.views.decorators.csrf import csrf_exempt

from apps.money.models import Money
from apps.student.models import StudentInformation
from utils.ResponseBean import ResponseBean


@permission_required('money.add_money')
@login_required
@csrf_exempt
def add_money(request):
    if request.method == 'POST':
        user = User.objects.get(id=request.user.id)
        student = get_object_or_404(StudentInformation, user=user)
        d = json.loads(str(request.body, encoding="utf-8"))
        trading_account = user.username
        trading_amount = d['trading_amount']
        balance = student.balance
        transaction_type = d['transaction_type']
        new_money = Money.objects.create(trading_account=trading_account,
                                         trading_amount=trading_amount,
                                         balance=balance,
                                         transaction_type=transaction_type)
        new_money.save()
        response = ResponseBean().get_success_instance()
        response.message = '新建现金交易记录成功。'
        return JsonResponse(response.__dict__)


@permission_required('money.remove_money')
@login_required
@csrf_exempt
def remove_money(request, id):
    money = get_object_or_404(Money, id=id)
    money.delete()
    response = ResponseBean().get_success_instance()
    response.message = '删除现金交易记录成功。'
    return JsonResponse(response.__dict__)


@permission_required('money.findOne_money')
@login_required
@csrf_exempt
def findOne_money(request, id):
    money = get_object_or_404(Money, id=id)
    money.__dict__.pop('_state')
    response = ResponseBean().get_success_instance()
    response.message = '查询成功。'
    response.data = money.__dict__
    return JsonResponse(response.__dict__)


@permission_required('money.findAllOfCondition_money')
@login_required
@csrf_exempt
def findAllOfCondition_money(request):
    if request.method == 'POST':
        user = User.objects.get(id=request.user.id)
        data = Money.objects.all()
        d = json.loads(str(request.body, encoding="utf-8"))
        trading_account = user.username
        if trading_account is not None:
            data = data.filter(trading_account=trading_account)
        if 'transaction_type' in d.keys():
            data = data.filter(transaction_type=d['transaction_type'])
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


@permission_required('money.view_money')
@login_required
def view_money(request):
    return render(request,
                  'money/money.html')


