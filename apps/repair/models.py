from django.conf import settings
from django.db import models


# Create your models here.

class RepairInformation(models.Model):
    GENDER_CHOICES = (
        ('M', '男'),
        ('F', '女')
    )

    user = models.OneToOneField(settings.AUTH_USER_MODEL)
    gender = models.CharField('性别', max_length=1, choices=GENDER_CHOICES)
    mobile_phone = models.CharField('手机号码', max_length=15)

    class Meta:
        db_table = 'repair_information'

    def __str__(self):
        return 'Repair information for user {}'.format(self.user.username)
