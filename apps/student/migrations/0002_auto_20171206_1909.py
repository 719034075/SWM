# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-12-06 11:09
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='studentinformation',
            name='dormitory_building_number',
            field=models.IntegerField(blank=True, verbose_name='寝室楼号'),
        ),
    ]
