# -*- coding:utf-8 -*-
from django.db import models
from Cmdb.models import Asset

# Create your models here.

class Register(models.Model):
    name_type = models.CharField(max_length=80, unique=True,verbose_name=u'使用环境')
    service_name = models.CharField(max_length=50, blank=True, null=True,verbose_name=u'服务名称')
    service_start = models.CharField(max_length=100, blank=True, null=True,verbose_name=u'启动服务')
    service_stop = models.CharField(max_length=100, blank=True, null=True,verbose_name=u'停止服务')
    service_restart = models.CharField(max_length=100, blank=True, null=True,verbose_name=u'重启服务')
    path_config = models.CharField(max_length=150, blank=True, null=True,verbose_name=u'配置文件路径')
    path_root = models.CharField(max_length=150, blank=True, null=True,verbose_name=u'程序路径')
    path_project = models.CharField(max_length=150, blank=True, null=True, verbose_name=u'项目路径')
    desc=models.CharField(max_length=150,blank=True,null=True,verbose_name=u"描述")
    Asset_service = models.ManyToManyField(Asset, blank=True, verbose_name=u"主机")
    def __unicode__(self):
        return self.service_name