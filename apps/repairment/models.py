from django.db import models


# Create your models here.

class Repairment(models.Model):
    STATE_CHOICES = (
        ('R', '报修中'),
        ('E', '已完成'),
        ('C', '已取消'),
    )
    machine_id = models.CharField('洗衣机编号', max_length=10)
    repair_account = models.CharField('报修账号', max_length=30)
    repair_time = models.DateTimeField('报修时间', auto_now_add=True)
    complete_account = models.CharField('维修账号', max_length=30, null=True)
    complete_time = models.DateTimeField('维修时间', null=True)
    remarks = models.CharField('备注', max_length=300, null=True)
    state = models.CharField('报修状态', max_length=1, choices=STATE_CHOICES)

    class Meta:
        db_table = 'repairment'
        permissions = (
            ("view_repairment", "Can view the repairment"),
            ("remove_repairment", "Can remove a repairment"),
            ("modify_repairment", "Can modify a repairment"),
            ("findOne_repairment", "Can find a repairment"),
            ("findAllOfCondition_repairment", "Can find all repairments of condition"),
            ("view_repairmentForm", "Can view the repairment form"),
            ("complete_repairment", "Can be sure that complete the repairment")
        )

    def __str__(self):
        return self.machine_id
