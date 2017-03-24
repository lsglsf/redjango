# -*- coding:utf-8 -*-
from django.db import models
from Cmdb.models import Asset

# Create your models here.
class Automation_d(models.Model):
    name = models.CharField(max_length=80, unique=True,verbose_name=u"名称")
    adddate = models.DateTimeField(auto_now_add=True,verbose_name=u"添加时间")
    update=models.CharField(max_length=80,unique=True,verbose_name=u"修改时间")
    automtion_asst = models.ManyToManyField(Asset, blank=True, verbose_name=u"安装记录")
    def __unicode__(self):
        return self.name

class Automation_Hostdetails(models.Model):
    architecture = models.CharField(max_length=30,blank=True, null=True,verbose_name=u"架构")
    lang = models.CharField(max_length=30, blank=True, null=True,verbose_name=u"语言")
    distribution = models.CharField(max_length=30,blank=True, null=True,verbose_name=u"系统")
    distributionmajorversion = models.CharField(max_length=20,blank=True, null=True,verbose_name=u"主版本")
    distributionrelease = models.CharField(max_length=20,blank=True, null=True,)
    distributionversion = models.CharField(max_length=20,blank=True, null=True,)
    dns=models.CharField(max_length=100,blank=True, null=True,)
    domain = models.CharField(max_length=50,blank=True, null=True,)
    fqdn = models.CharField(max_length=50,blank=True, null=True,)
    hostname = models.CharField(max_length=50,blank=True, null=True,)
    kernel = models.CharField(max_length=50,blank=True, null=True,)
    description = models.CharField(max_length=50,blank=True, null=True,)
    family =  models.CharField(max_length=50,blank=True, null=True,)
    processor = models.CharField(max_length=50,blank=True, null=True,)
    processorcores = models.CharField(max_length=50,blank=True, null=True,)
    processorcount = models.CharField(max_length=50,blank=True, null=True,)
    machine = models.CharField(max_length=50,blank=True, null=True,)
    system =  models.CharField(max_length=50,blank=True, null=True,)
    asset_one = models.OneToOneField(Asset, blank=True, verbose_name=u"安装记录")