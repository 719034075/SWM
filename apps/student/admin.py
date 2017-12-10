from django.contrib import admin

# Register your models here.
from apps.student.models import StudentInformation

admin.site.register(StudentInformation)
