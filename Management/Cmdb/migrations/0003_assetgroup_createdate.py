# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Cmdb', '0002_asset_host_hostname'),
    ]

    operations = [
        migrations.AddField(
            model_name='assetgroup',
            name='createdate',
            field=models.DateTimeField(auto_now_add=True, verbose_name='\u6dfb\u52a0\u65f6\u95f4', null=True),
        ),
    ]
