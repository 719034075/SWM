from django.conf import settings
from django.contrib.auth.models import User
from django.db import models


# Create your models here.

class Profile(models.Model):
    ROLE_CHOICES = (
        ('A', 'Admin'),
        ('U', 'User'),
        ('R', 'Repair')
    )

    user = models.OneToOneField(settings.AUTH_USER_MODEL)
    role = models.CharField('用户类型', max_length=1, choices=ROLE_CHOICES)
    avatar = models.ImageField('头像', upload_to='users/%Y/%m/%d', blank=True)

    class Meta:
        db_table = 'user'

    def __str__(self):
        return 'Profile for user {}'.format(self.user.username)
