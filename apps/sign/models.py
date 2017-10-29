from django.db import models

# Create your models here.

class User(models.Model):
    account=models.CharField(max_length=30)
    password=models.CharField(max_length=50)
    salt=models.CharField(max_length=50)
    avatar=models.CharField(max_length=60)
    category=models.IntegerField()

class StuInfo(models.Model):
    student_number=models.CharField(max_length=30)
    name=models.CharField(max_length=30)
    gender=models.IntegerField()
    mobile_phone=models.CharField(max_length=15)
    dormitory_building_number=models.IntegerField()
    balance=models.DecimalField(max_digits=20,decimal_places=2)
    credit=models.IntegerField()
    integral=models.IntegerField()

class WashMachine(models.Model):
    machine_id=models.IntegerField()
    dormitory_building_number=models.IntegerField()
    state=models.IntegerField()

class MoneyTransaction(models.Model):
    trading_account=models.CharField(max_length=30)
    transaction_time=models.DateTimeField()
    trading_amount=models.DecimalField(max_digits=20,decimal_places=2)
    balance=models.DecimalField(max_digits=20,decimal_places=2)
    transaction_type=models.IntegerField()
    remarks=models.CharField(max_length=300)

class IntegralTransaction(models.Model):
    trading_account = models.CharField(max_length=30)
    transaction_time = models.DateTimeField()
    trading_integral = models.IntegerField()
    balance = models.IntegerField()
    transaction_type = models.IntegerField()
    remarks = models.CharField(max_length=300)

class Queue(models.Model):
    machine_id=models.IntegerField()
    account=models.CharField(max_length=30)
    start_time=models.DateTimeField()
    end_time=models.DateTimeField()

