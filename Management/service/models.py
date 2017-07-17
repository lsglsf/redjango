# -*- coding:utf-8 -*-
from django.db import models
from Cmdb.models import Asset

# Create your models here.

class Register(models.Model):
    service_name = models.CharField(max_length=50, blank=True, null=True,verbose_name=u'服务名称')
    alias_name = models.CharField(max_length=50,blank=True,null=True,verbose_name=u'别名')
    service_start = models.CharField(max_length=100, blank=True, null=True,verbose_name=u'启动服务')
    service_stop = models.CharField(max_length=100, blank=True, null=True,verbose_name=u'停止服务')
    service_restart = models.CharField(max_length=100, blank=True, null=True,verbose_name=u'重启服务')
    path_config = models.CharField(max_length=150, blank=True, null=True,verbose_name=u'配置文件路径')
    path_root = models.CharField(max_length=150, blank=True, null=True,verbose_name=u'程序路径')
    path_project = models.CharField(max_length=150, blank=True, null=True, verbose_name=u'项目路径')
    path_log = models.CharField(max_length=150, blank=True, null=True, verbose_name=u'日志路径')
    desc=models.CharField(max_length=150,blank=True,null=True,verbose_name=u"描述")
    serviceid = models.IntegerField(blank=True, null=True, verbose_name=u"关联服务")
    Asset_service = models.ManyToManyField(Asset, blank=True, verbose_name=u"主机")
    def __unicode__(self):
        return self.service_name

class Taskqueue(models.Model):
    task_name = models.CharField(max_length=50, blank=True,null=False,verbose_name=u'任务名称')
    task_id = models.CharField(max_length=50, blank=True, unique=True,null=False,verbose_name=u'任务ID')
    add_date = models.DateTimeField(auto_now_add=True,verbose_name=u"添加时间")
    task_status= models.BooleanField(default=False, verbose_name=u"是否完成")
    results_status= models.CharField(max_length=50, blank=True,null=False, verbose_name=u"执行结果")
    Register_Task = models.ManyToManyField(Register, blank=True, verbose_name=u"任务关联")