#encoding=utf8
from django.shortcuts import render_to_response
from django.http import HttpResponse
import json
from Management.settings import allow_ip
from Cmdb.models import Asset
import logging

connection = logging.getLogger("connection")


class UserSessionMiddleware(object):
    def process_request(self, request):
        if request.META.has_key('HTTP_X_FORWARDED_FOR'):
            ip = request.META['HTTP_X_FORWARDED_FOR']
        else:
            ip = request.META['REMOTE_ADDR']
        allow_status=[ i for i in allow_ip.split(',') if i == ip]
        try:
            Asset.objects.get(ip=ip)
            connection.info("{0}-{1}".format("客户端主机连接",ip))
        except:
            if allow_status:
                connection.info("{0}-{1}".format("连接成功",allow_status))
            else:
                connection.info("{0}-{1}".format("异常连接IP",ip))
                return HttpResponse('登录失败联系管理员')
