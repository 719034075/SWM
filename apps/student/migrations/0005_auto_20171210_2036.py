# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-12-10 12:36
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('student', '0004_auto_20171210_1343'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='studentinformation',
            options={'permissions': (('view_student_dashboard', 'Can view the  student dashboard'), ('edit_student_information', 'Can edit the student information'))},
        ),
    ]
