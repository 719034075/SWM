#!usr/bin/python
# -*- coding:utf-8 _*-
import datetime

from django.shortcuts import get_object_or_404

from apps.appointment.models import Appointment
from apps.washmachine.models import WashMachine


def appointment_task():
    now = datetime.datetime.now()
    data = Appointment.objects.order_by('-start_time')
    data = data.filter(state='A')
    print("start appointment_task")
    for element in data:
        if element.end_time <= now:
            washmachine = get_object_or_404(WashMachine, machine_id=element.machine_id)
            washmachine.state = 'F'
            element.state = 'O'
            element.save()
            washmachine.save()


def washmachine_task():
    now = datetime.datetime.now()
    data = WashMachine.objects.all()
    data = data.filter(state='W')
    print("start washmachine_task")
    for element in data:
        if element.end_time <= now:
            element.account = None
            element.start_time = None
            element.end_time = None
            element.state = 'F'
            element.save()
