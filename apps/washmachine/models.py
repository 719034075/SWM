from django.db import models


# Create your models here.

class WashMachine(models.Model):
    STATE_CHOICES = (
        ('F', '空闲'),
        ('W', '工作中'),
        ('B', ' 故障'),
        ('D', '待清洗'),
        ('A', '预约中')
    )
    machine_id = models.CharField('洗衣机编号', max_length=10)
    dormitory_building_number = models.IntegerField('寝室楼号')
    account = models.CharField('使用账号', max_length=30, null=True)
    start_time = models.DateTimeField('工作起始时间', null=True)
    end_time = models.DateTimeField('工作结束时间', null=True)
    state = models.CharField('运行状态', max_length=1, choices=STATE_CHOICES)

    class Meta:
        db_table = 'washmachine'
        permissions = (
            ("view_washmachine", "Can view the washmachine"),
            ("remove_washmachine", "Can remove a washmachine"),
            ("modify_washmachine", "Can modify a washmachine"),
            ("findOne_washmachine", "Can find a washmachine"),
            ("findAllOfCondition_washmachine", "Can find all washmachines of condition"),
            ("view_washmachineForm", "Can view the washmachine form"),
            ("use_washmachine", "Can use the washmachine")

        )

    def __str__(self):
        return self.machine_id
