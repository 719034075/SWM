from django.db import models


# Create your models here.

class Appointment(models.Model):
    STATE_CHOICES = (
        ('A', '预约中'),
        ('E', '已完成'),
        ('C', '已取消'),
    )
    machine_id = models.IntegerField('洗衣机编号')
    account = models.CharField('预约账号', max_length=30)
    start_time = models.DateTimeField('起始时间', auto_now_add=True)
    end_time = models.DateTimeField('结束时间', auto_now_add=True)
    state = models.CharField('预约状态', max_length=1, choices=STATE_CHOICES)

    class Meta:
        db_table = 'appointment'

    def __str__(self):
        return self.machine_id
