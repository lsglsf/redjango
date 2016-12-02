# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Cmdb', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Register',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name_type', models.CharField(max_length=80, verbose_name='\u4f7f\u7528\u73af\u5883')),
                ('service_name', models.CharField(max_length=50, unique=True, null=True, verbose_name='\u670d\u52a1\u540d\u79f0')),
                ('service_start', models.CharField(max_length=100, null=True, verbose_name='\u542f\u52a8\u670d\u52a1', blank=True)),
                ('service_stop', models.CharField(max_length=100, null=True, verbose_name='\u505c\u6b62\u670d\u52a1', blank=True)),
                ('service_restart', models.CharField(max_length=100, null=True, verbose_name='\u91cd\u542f\u670d\u52a1', blank=True)),
                ('path_config', models.CharField(max_length=150, null=True, verbose_name='\u914d\u7f6e\u6587\u4ef6\u8def\u5f84', blank=True)),
                ('path_root', models.CharField(max_length=150, null=True, verbose_name='\u7a0b\u5e8f\u8def\u5f84', blank=True)),
                ('path_project', models.CharField(max_length=150, null=True, verbose_name='\u9879\u76ee\u8def\u5f84', blank=True)),
                ('desc', models.CharField(max_length=150, null=True, verbose_name='\u63cf\u8ff0', blank=True)),
                ('Asset_service', models.ManyToManyField(to='Cmdb.Asset', verbose_name='\u4e3b\u673a', blank=True)),
            ],
        ),
    ]
