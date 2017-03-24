#encoding=utf8
from django.shortcuts import render_to_response
from django.http import HttpResponse
import json
from Management.settings import allow_ip
from Cmdb.models import Asset


class UserSessionMiddleware(object):
    def process_request(self, request):
        if request.META.has_key('HTTP_X_FORWARDED_FOR'):
            ip = request.META['HTTP_X_FORWARDED_FOR']
        else:
            ip = request.META['REMOTE_ADDR']
        allow_status=[ i for i in allow_ip.split(',') if i == ip]
        try:
            Asset.objects.get(ip=ip)
            pass
        except:
            if allow_status:
                pass
            else:
                return HttpResponse('登录失败联系管理员')
