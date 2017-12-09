from django.conf import settings
from django.db import models


# Create your models here.

class StudentInformation(models.Model):
    GENDER_CHOICES = (
        ('M', '男'),
        ('F', '女')
    )

    user = models.OneToOneField(settings.AUTH_USER_MODEL)
    gender = models.CharField('性别', max_length=1, choices=GENDER_CHOICES)
    mobile_phone = models.CharField('手机号码', max_length=15)
    dormitory_building_number = models.IntegerField('寝室楼号', null=True)
    balance = models.DecimalField('余额', max_digits=20, decimal_places=2, default=0.00)
    credit = models.IntegerField('信用分', default=100)
    integral = models.IntegerField('积分', default=0)

    class Meta:
        db_table = 'student_information'

    def __str__(self):
        return 'Student information for user {}'.format(self.user.username)
