# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('service', '0002_register_alias_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='Taskqueue',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('task_name', models.CharField(max_length=50, verbose_name='\u4efb\u52a1\u540d\u79f0', blank=True)),
                ('task_id', models.CharField(unique=True, max_length=50, verbose_name='\u4efb\u52a1ID', blank=True)),
                ('add_date', models.DateTimeField(auto_now_add=True, verbose_name='\u6dfb\u52a0\u65f6\u95f4')),
                ('task_status', models.BooleanField(default=False, verbose_name='\u662f\u5426\u5b8c\u6210')),
                ('results_status', models.CharField(max_length=50, verbose_name='\u6267\u884c\u7ed3\u679c', blank=True)),
            ],
        ),
        migrations.AddField(
            model_name='register',
            name='serviceid',
            field=models.IntegerField(null=True, verbose_name='\u5173\u8054\u670d\u52a1', blank=True),
        ),
        migrations.AddField(
            model_name='taskqueue',
            name='Register_Task',
            field=models.ManyToManyField(to='service.Register', verbose_name='\u4efb\u52a1\u5173\u8054', blank=True),
        ),
    ]
