# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Cmdb', '0002_asset_host_hostname'),
    ]

    operations = [
        migrations.CreateModel(
            name='Automation_d',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(unique=True, max_length=80, verbose_name='\u540d\u79f0')),
                ('adddate', models.DateTimeField(auto_now_add=True, verbose_name='\u6dfb\u52a0\u65f6\u95f4')),
                ('update', models.CharField(unique=True, max_length=80, verbose_name='\u4fee\u6539\u65f6\u95f4')),
                ('automtion_asst', models.ManyToManyField(to='Cmdb.Asset', verbose_name='\u5b89\u88c5\u8bb0\u5f55', blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Automation_Hostdetails',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('architecture', models.CharField(unique=True, max_length=30, verbose_name='\u67b6\u6784')),
                ('lang', models.CharField(unique=True, max_length=30, verbose_name='\u8bed\u8a00')),
                ('distribution', models.CharField(unique=True, max_length=30, verbose_name='\u7cfb\u7edf')),
                ('distributionmajorversion', models.CharField(unique=True, max_length=20, verbose_name='\u4e3b\u7248\u672c')),
                ('distributionrelease', models.CharField(unique=True, max_length=20)),
                ('distributionversion', models.CharField(unique=True, max_length=20)),
                ('dns', models.CharField(unique=True, max_length=100)),
                ('domain', models.CharField(unique=True, max_length=50)),
                ('fqdn', models.CharField(unique=True, max_length=50)),
                ('hostname', models.CharField(unique=True, max_length=50)),
                ('kernel', models.CharField(unique=True, max_length=50)),
                ('description', models.CharField(unique=True, max_length=50)),
                ('family', models.CharField(unique=True, max_length=50)),
                ('processor', models.CharField(unique=True, max_length=50)),
                ('processorcores', models.CharField(unique=True, max_length=50)),
                ('processorcount', models.CharField(unique=True, max_length=50)),
                ('machine', models.CharField(unique=True, max_length=50)),
                ('system', models.CharField(unique=True, max_length=50)),
                ('asset_one', models.OneToOneField(verbose_name='\u5b89\u88c5\u8bb0\u5f55', blank=True, to='Cmdb.Asset')),
            ],
        ),
    ]
