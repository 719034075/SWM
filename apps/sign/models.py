from django.db import models

# Create your models here.

class User(models.Model):
    CATEGORY_CHOICES=(
        ('A','Admin'),
        ('U','User'),
        ('R','Repair')
    )

    account=models.CharField('账号',max_length=30)
    password=models.CharField('密码',max_length=50)
    salt=models.CharField('加盐',max_length=50)
    avatar=models.CharField('头像',max_length=60)
    category=models.CharField('用户类型',max_length=1,choices=CATEGORY_CHOICES)

class StuInfo(models.Model):
    GENDER_CHOICES=(
        ('M','Male'),
        ('F','emale')
    )

    student_number=models.CharField('学号',max_length=30)
    name=models.CharField('姓名',max_length=30)
    gender=models.CharField('性别',max_length=1,choices=GENDER_CHOICES)
    mobile_phone=models.CharField('手机号码',max_length=15)
    dormitory_building_number=models.IntegerField('寝室楼号')
    balance=models.DecimalField('余额',max_digits=20,decimal_places=2,default=0.00)
    credit=models.IntegerField('信用分',default=100)
    integral=models.IntegerField('积分',default=0)

class WashMachine(models.Model):
    STATE_CHOICES=(
        ('F','Free'),
        ('W','Work'),
        ('B',' Breakdown'),
        ('D','Dirty')
    )
    machine_id=models.IntegerField('洗衣机编号')
    dormitory_building_number=models.IntegerField('寝室楼号')
    state=models.CharField('运行状态',max_length=1,choices=STATE_CHOICES)

class MoneyTransaction(models.Model):
    TRANSACTION_TYPE_CHOICES=(
        ('R','Recharge'),
        ('P','Pay'),
        ('B','Back')
    )

    trading_account=models.CharField('交易用户',max_length=30)
    transaction_time=models.DateTimeField('交易时间',auto_now_add=True)
    trading_amount=models.DecimalField('交易金额',max_digits=20,decimal_places=2)
    balance=models.DecimalField('交易余额',max_digits=20,decimal_places=2)
    transaction_type=models.CharField('交易类型',max_length=1,choices=TRANSACTION_TYPE_CHOICES)
    remarks=models.CharField('备注',max_length=300)

class IntegralTransaction(models.Model):
    TRANSACTION_TYPE_CHOICES = (
        ('R', 'Recharge'),
        ('P', 'Pay'),
        ('B', 'Back')
    )

    trading_account = models.CharField('交易用户',max_length=30)
    transaction_time = models.DateTimeField('交易时间',auto_now_add=True)
    trading_integral = models.IntegerField('交易积分')
    balance = models.IntegerField('积分余额')
    transaction_type = models.CharField('交易类型',max_length=1,choices=TRANSACTION_TYPE_CHOICES)
    remarks = models.CharField('备注',max_length=300)

class Queue(models.Model):
    machine_id=models.IntegerField('洗衣机编号')
    account=models.CharField('账号',max_length=30)
    start_time=models.DateTimeField('起始时间',auto_now_add=True)
    end_time=models.DateTimeField('结束时间',auto_now_add=True)

