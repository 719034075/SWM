from django.db import models


# Create your models here.

class WashMachine(models.Model):
    STATE_CHOICES = (
        ('F', 'Free'),
        ('W', 'Work'),
        ('B', ' Breakdown'),
        ('D', 'Dirty')
    )
    machine_id = models.CharField('洗衣机编号', max_length=10)
    dormitory_building_number = models.IntegerField('寝室楼号')
    state = models.CharField('运行状态', max_length=1, choices=STATE_CHOICES)

    class Meta:
        db_table = 'washmachine'
        permissions = (
            ("view_washmachine", "Can view the washmachine"),
            ("remove_washmachine", "Can remove a washmachine"),
            ("modify_washmachine", "Can modify a washmachine"),
            ("findOne_washmachine", "Can find a washmachine"),
            ("findAllOfCondition_washmachine", "Can find all washmachines of condition"),
            ("view_washmachineForm", "Can view the washmachine form")
        )

    def __str__(self):
        return self.machine_id
