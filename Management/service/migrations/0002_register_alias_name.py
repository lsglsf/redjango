# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('service', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='register',
            name='alias_name',
            field=models.CharField(max_length=50, unique=True, null=True, verbose_name='\u522b\u540d', blank=True),
        ),
    ]
