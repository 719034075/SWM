from django.contrib import admin

# Register your models here.
from apps.account.models import Profile


class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'avatar']


admin.site.register(Profile, ProfileAdmin)
