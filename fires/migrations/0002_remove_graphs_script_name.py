# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-11-05 01:01
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('fires', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='graphs',
            name='script_name',
        ),
    ]
