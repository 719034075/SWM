from django.contrib import admin

# Register your models here.
from apps.appointment.models import Appointment

admin.site.register(Appointment)