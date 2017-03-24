# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Cmdb', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='asset',
            name='host_hostname',
            field=models.IntegerField(null=True, verbose_name='\u9884\u53d1\u5e03\u8282\u70b9', blank=True),
        ),
    ]
