from django.contrib import admin

# Register your models here.
from apps.money.models import Money

admin.site.register(Money)
