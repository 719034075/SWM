from django.db import models


# Create your models here.

class Money(models.Model):
    TRANSACTION_TYPE_CHOICES = (
        ('R', '充值'),
        ('P', '支付'),
        ('B', '返现')
    )

    trading_account = models.CharField('交易用户', max_length=30)
    transaction_time = models.DateTimeField('交易时间', auto_now_add=True)
    trading_amount = models.DecimalField('交易金额', max_digits=20, decimal_places=2)
    balance = models.DecimalField('交易余额', max_digits=20, decimal_places=2)
    transaction_type = models.CharField('交易类型', max_length=1, choices=TRANSACTION_TYPE_CHOICES)

    class Meta:
        db_table = 'money'
        permissions = (
            ("view_money", "Can view the money"),
            ("remove_money", "Can remove a money"),
            ("modify_money", "Can modify a money"),
            ("findOne_money", "Can find a money"),
            ("findAllOfCondition_money", "Can find all money of condition"),
            ("view_rechargeForm", "Can view the recharge form"),
            ("recharge_money", "Can recharge money"),
        )

    def __str__(self):
        return self.trading_account
