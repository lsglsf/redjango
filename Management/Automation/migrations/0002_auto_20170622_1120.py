# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Automation', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='automation_hostdetails',
            name='agent',
            field=models.IntegerField(null=True, verbose_name='\u5ba2\u6237\u7aef\u72b6\u6001', blank=True),
        ),
        migrations.AlterField(
            model_name='automation_hostdetails',
            name='architecture',
            field=models.CharField(max_length=30, null=True, verbose_name='\u67b6\u6784', blank=True),
        ),
        migrations.AlterField(
            model_name='automation_hostdetails',
            name='description',
            field=models.CharField(max_length=50, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='automation_hostdetails',
            name='distribution',
            field=models.CharField(max_length=30, null=True, verbose_name='\u7cfb\u7edf', blank=True),
        ),
        migrations.AlterField(
            model_name='automation_hostdetails',
            name='distributionmajorversion',
            field=models.CharField(max_length=20, null=True, verbose_name='\u4e3b\u7248\u672c', blank=True),
        ),
        migrations.AlterField(
            model_name='automation_hostdetails',
            name='distributionrelease',
            field=models.CharField(max_length=20, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='automation_hostdetails',
            name='distributionversion',
            field=models.CharField(max_length=20, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='automation_hostdetails',
            name='dns',
            field=models.CharField(max_length=100, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='automation_hostdetails',
            name='domain',
            field=models.CharField(max_length=50, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='automation_hostdetails',
            name='family',
            field=models.CharField(max_length=50, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='automation_hostdetails',
            name='fqdn',
            field=models.CharField(max_length=50, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='automation_hostdetails',
            name='hostname',
            field=models.CharField(max_length=50, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='automation_hostdetails',
            name='kernel',
            field=models.CharField(max_length=50, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='automation_hostdetails',
            name='lang',
            field=models.CharField(max_length=30, null=True, verbose_name='\u8bed\u8a00', blank=True),
        ),
        migrations.AlterField(
            model_name='automation_hostdetails',
            name='machine',
            field=models.CharField(max_length=50, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='automation_hostdetails',
            name='processor',
            field=models.CharField(max_length=50, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='automation_hostdetails',
            name='processorcores',
            field=models.CharField(max_length=50, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='automation_hostdetails',
            name='processorcount',
            field=models.CharField(max_length=50, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='automation_hostdetails',
            name='system',
            field=models.CharField(max_length=50, null=True, blank=True),
        ),
    ]
