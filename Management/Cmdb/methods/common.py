# coding:utf-8
from django.http import HttpResponse
import json
from Cmdb.models import AssetGroup

def packageResponse(result):
    if len(result) == 0:
        json_status = {"data": result, "code": 400}
        json_status = json.dumps(json_status)
    else:
        json_status = {"data": result, "code": 200}
        json_status = json.dumps(json_status)
    response = HttpResponse(content_type='application/json')
    response.write(json_status)
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "POST,GET,PUT, DELETE"
    return response

class Mysql_op(object):
    def __init__(self,Table,type=None,*args,**kwargs):
        self.Table = Table
        self.args = args
        self.kwargs = kwargs
        self.type = type
        pass

    def data_insert(self,*args,**kwargs):
        print self.Table
        print self.kwargs
        print self.args
        print kwargs
        print args[1],args[0]
        self.Table.objects.create(name='aa',comment='bb')
        pass

    def data_select(self,**kwargs):
        print kwargs
        print self.Table.objects.all()


