# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('service', '0003_auto_20170622_1120'),
    ]

    operations = [
        migrations.AlterField(
            model_name='register',
            name='alias_name',
            field=models.CharField(max_length=50, null=True, verbose_name='\u522b\u540d', blank=True),
        ),
    ]
