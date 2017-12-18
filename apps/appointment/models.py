from django.db import models


# Create your models here.

class Appointment(models.Model):
    STATE_CHOICES = (
        ('A', '预约中'),
        ('E', '已完成'),
        ('C', '已取消'),
    )
    machine_id = models.CharField('洗衣机编号', max_length=10)
    account = models.CharField('预约账号', max_length=30)
    start_time = models.DateTimeField('起始时间')
    end_time = models.DateTimeField('结束时间')
    state = models.CharField('预约状态', max_length=1, choices=STATE_CHOICES)

    class Meta:
        db_table = 'appointment'
        permissions = (
            ("view_appointment", "Can view the appointment"),
            ("remove_appointment", "Can remove an appointment"),
            ("modify_appointment", "Can modify an appointment"),
            ("findOne_appointment", "Can find an appointment"),
            ("findAllOfCondition_appointment", "Can find all appointments of condition"),
            ("cancel_appointment", "Can cancel the appointment ")
        )

    def __str__(self):
        return self.machine_id
