from django.contrib import admin

# Register your models here.
from apps.repair.models import RepairInformation

admin.site.register(RepairInformation)
