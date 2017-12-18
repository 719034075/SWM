from django.db import models


# Create your models here.

class Repairment(models.Model):
    STATE_CHOICES = (
        ('R', '报修中'),
        ('W', '待清洗'),
        ('E', '已完成'),
        ('C', '已取消'),
    )
    machine_id = models.CharField('洗衣机编号', max_length=10)
    repair_account = models.CharField('提交异常账号', max_length=30)
    repair_time = models.DateTimeField('提交异常时间', auto_now_add=True)
    complete_account = models.CharField('处理异常账号', max_length=30, null=True)
    complete_time = models.DateTimeField('处理异常时间', null=True)
    remarks = models.CharField('备注', max_length=300, null=True)
    state = models.CharField('处理异常状态', max_length=1, choices=STATE_CHOICES)

    class Meta:
        db_table = 'repairment'
        permissions = (
            ("view_repairment", "Can view the repairment"),
            ("findOne_repairment", "Can find a repairment"),
            ("findAllOfCondition_repairment", "Can find all repairments of condition"),
            ("view_repairmentForm", "Can view the repairment form"),
            ("complete_repairment", "Can be sure that complete the repairment"),
            ("cancel_repairment", "Can cancel the repairment")
        )

    def __str__(self):
        return self.machine_id
