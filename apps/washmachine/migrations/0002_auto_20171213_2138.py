# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-12-13 13:38
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('washmachine', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='washmachine',
            options={'permissions': (('view_washmachine', 'Can view the washmachine'), ('remove_washmachine', 'Can remove a washmachine'), ('modify_washmachine', 'Can modify a washmachine'), ('findOne_washmachine', 'Can find a washmachine'), ('findAllOfCondition_washmachine', 'Can find all washmachines of condition'), ('view_washmachineForm', 'Can view the washmachine form'))},
        ),
    ]
