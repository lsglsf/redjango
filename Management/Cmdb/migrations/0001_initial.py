# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Asset',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('ip', models.CharField(max_length=32, null=True, verbose_name='\u4e3b\u673aIP', blank=True)),
                ('other_ip', models.CharField(max_length=255, null=True, verbose_name='\u5176\u4ed6IP', blank=True)),
                ('hostname', models.CharField(unique=True, max_length=128, verbose_name='\u4e3b\u673a\u540d')),
                ('port', models.IntegerField(null=True, verbose_name='\u7aef\u53e3\u53f7', blank=True)),
                ('username', models.CharField(max_length=16, null=True, verbose_name='\u7ba1\u7406\u7528\u6237\u540d', blank=True)),
                ('password', models.CharField(max_length=256, null=True, verbose_name='\u5bc6\u7801', blank=True)),
                ('use_default_auth', models.BooleanField(default=True, verbose_name='\u4f7f\u7528\u9ed8\u8ba4\u7ba1\u7406\u8d26\u53f7')),
                ('mac', models.CharField(max_length=20, null=True, verbose_name='MAC\u5730\u5740', blank=True)),
                ('remote_ip', models.CharField(max_length=16, null=True, verbose_name='\u8fdc\u63a7\u5361IP', blank=True)),
                ('brand', models.CharField(max_length=64, null=True, verbose_name='\u786c\u4ef6\u5382\u5546\u578b\u53f7', blank=True)),
                ('cpu', models.CharField(max_length=64, null=True, verbose_name='CPU', blank=True)),
                ('memory', models.CharField(max_length=128, null=True, verbose_name='\u5185\u5b58', blank=True)),
                ('disk', models.CharField(max_length=1024, null=True, verbose_name='\u786c\u76d8', blank=True)),
                ('system_type', models.CharField(max_length=32, null=True, verbose_name='\u7cfb\u7edf\u7c7b\u578b', blank=True)),
                ('system_version', models.CharField(max_length=8, null=True, verbose_name='\u7cfb\u7edf\u7248\u672c\u53f7', blank=True)),
                ('system_arch', models.CharField(max_length=16, null=True, verbose_name='\u7cfb\u7edf\u5e73\u53f0', blank=True)),
                ('cabinet', models.CharField(max_length=32, null=True, verbose_name='\u673a\u67dc\u53f7', blank=True)),
                ('position', models.IntegerField(null=True, verbose_name='\u673a\u5668\u4f4d\u7f6e', blank=True)),
                ('number', models.CharField(max_length=32, null=True, verbose_name='\u8d44\u4ea7\u7f16\u53f7', blank=True)),
                ('status', models.IntegerField(default=1, null=True, verbose_name='\u673a\u5668\u72b6\u6001', blank=True, choices=[(1, '\u5df2\u4f7f\u7528'), (2, '\u672a\u4f7f\u7528'), (3, '\u62a5\u5e9f')])),
                ('asset_type', models.IntegerField(blank=True, null=True, verbose_name='\u4e3b\u673a\u7c7b\u578b', choices=[(1, '\u7269\u7406\u673a'), (2, '\u865a\u62df\u673a'), (3, '\u4ea4\u6362\u673a'), (4, '\u8def\u7531\u5668'), (5, '\u9632\u706b\u5899'), (6, 'Docker'), (7, '\u5176\u4ed6')])),
                ('env', models.IntegerField(blank=True, null=True, verbose_name='\u8fd0\u884c\u73af\u5883', choices=[(1, '\u751f\u4ea7\u73af\u5883'), (2, '\u6d4b\u8bd5\u73af\u5883')])),
                ('sn', models.CharField(max_length=128, null=True, verbose_name='SN\u7f16\u53f7', blank=True)),
                ('date_added', models.DateTimeField(auto_now=True, null=True)),
                ('is_active', models.BooleanField(default=True, verbose_name='\u662f\u5426\u6fc0\u6d3b')),
                ('comment', models.CharField(max_length=128, null=True, verbose_name='\u5907\u6ce8', blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='AssetGroup',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(unique=True, max_length=80)),
                ('comment', models.CharField(max_length=160, null=True, blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='AssetRecord',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('username', models.CharField(max_length=30, null=True)),
                ('alert_time', models.DateTimeField(auto_now_add=True)),
                ('content', models.TextField(null=True, blank=True)),
                ('comment', models.TextField(null=True, blank=True)),
                ('asset', models.ForeignKey(to='Cmdb.Asset')),
            ],
        ),
        migrations.CreateModel(
            name='IDC',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=32, verbose_name='\u673a\u623f\u540d\u79f0')),
                ('bandwidth', models.CharField(default=b'', max_length=32, null=True, verbose_name='\u673a\u623f\u5e26\u5bbd', blank=True)),
                ('linkman', models.CharField(default=b'', max_length=16, null=True, verbose_name='\u8054\u7cfb\u4eba', blank=True)),
                ('phone', models.CharField(default=b'', max_length=32, null=True, verbose_name='\u8054\u7cfb\u7535\u8bdd', blank=True)),
                ('address', models.CharField(default=b'', max_length=128, null=True, verbose_name='\u673a\u623f\u5730\u5740', blank=True)),
                ('network', models.TextField(default=b'', null=True, verbose_name='IP\u5730\u5740\u6bb5', blank=True)),
                ('date_added', models.DateField(auto_now=True, null=True)),
                ('operator', models.CharField(default=b'', max_length=32, null=True, verbose_name='\u8fd0\u8425\u5546', blank=True)),
                ('comment', models.CharField(default=b'', max_length=128, null=True, verbose_name='\u5907\u6ce8', blank=True)),
            ],
            options={
                'verbose_name': 'IDC\u673a\u623f',
                'verbose_name_plural': 'IDC\u673a\u623f',
            },
        ),
        migrations.AddField(
            model_name='asset',
            name='group',
            field=models.ManyToManyField(to='Cmdb.AssetGroup', verbose_name='\u6240\u5c5e\u4e3b\u673a\u7ec4', blank=True),
        ),
        migrations.AddField(
            model_name='asset',
            name='idc',
            field=models.ForeignKey(on_delete=django.db.models.deletion.SET_NULL, verbose_name='\u673a\u623f', blank=True, to='Cmdb.IDC', null=True),
        ),
    ]
