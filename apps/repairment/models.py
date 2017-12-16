from django.db import models


# Create your models here.

class Repairment(models.Model):
    STATE_CHOICES = (
        ('R', '报修中'),
        ('E', '已完成'),
        ('C', '已取消'),
    )
    machine_id = models.IntegerField('洗衣机编号')
    account = models.CharField('报修账号', max_length=30)
    remarks = models.CharField('备注', max_length=300)
    state = models.CharField('报修状态', max_length=1, choices=STATE_CHOICES)

    class Meta:
        db_table = 'repairment'

    def __str__(self):
        return self.machine_id
