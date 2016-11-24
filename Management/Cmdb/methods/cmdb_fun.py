#coding:utf-8
import json
import logging
import traceback
import time
import md5
from django.shortcuts import render, get_object_or_404, render_to_response
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.template import loader, Context, RequestContext
from django.http import Http404
from rest_framework.views import APIView
from Cmdb.models import AssetGroup,Asset,ASSET_ENV,ASSET_STATUS,ASSET_TYPE
import logging

Cmdb_log = logging.getLogger("Cmdb_log")

dict_key={
    'group_all':['id','name','comment']
}

def group_all(group_id=''):
    ret={}
    groupdata = AssetGroup.objects.all()
    ret['data'] = []
    for gdata in groupdata:
        sys={}
        sys['id']=gdata.id
        sys['name']=gdata.name
        sys['comment']=gdata.comment
        ret['data'].append(sys)
    return ret['data']

def assert_all(group_id=''):
    ret={}
    assertdata = Asset.objects.all()
    ret['data'] = []
    for i in assertdata:
        sys={}
        sys['id']=i.id
        sys['label']=i.ip
        sys['description']=i.hostname
        ret['data'].append(sys)
    return ret['data']

def assert_host(group_id):
    ret = {}
    group_name=AssetGroup.objects.get(id=group_id)
    ret['tdata']=[]
    for i in group_name.asset_set.all():
        sys={}
        sys['id']=i.id
        sys['label']=i.ip
        sys['description']=i.hostname
        ret['tdata'].append(sys)
    ret['sdata']=assert_all(group_id)
    for data in ret['tdata']:
        try:
            ret['sdata'].index(data)
            ret['sdata'].remove(data)
        except:
            s=traceback.format_exc()
            Cmdb_log.error('{0}-{1}'.format('assert_host 数据查找失败',s))
    return ret


def group_get(request):
    '''
    资产组查询操作
    :param request:
    :return:
    '''
    ret={}
    group_id=request.GET.get('id')
    ret['data']=globals()[request.GET.get('name')](group_id)
    return ret

def group_create(request):
    ret={}
    name=request.POST.get('name')
    comment=request.POST.get('desc')
    data_host=request.POST.get('targetData')
    print name,comment,data_host
    try:
        insert_o=AssetGroup.objects.create(name=name,comment=comment)
        if data_host:
            for i in json.loads(data_host):
                rela_asset_group = Asset.objects.get(id=i['id']).group.add( AssetGroup.objects.get(id=insert_o.id))
        ret['status'] = True
    except Exception as e:
        ret['status'] = e[1]
        s = traceback.format_exc()
        Cmdb_log.error('{0}'.format(s))
    return ret

def group_update(request):
    ret={}
    group_name=AssetGroup.objects.get(id=request.POST.get('id'))
    ret['tdata']=[]
    ddata=json.loads(request.POST.get('newarray'))
    sdata=[]
    delete_d=[]
    for i in group_name.asset_set.all():
        sdata.append(i.id)
    for data in sdata:
        try:
            ddata.index(data)
            ddata.remove(data)
        except:
            delete_d.append(data)
    try:
        AssetGroup.objects.filter(id=request.POST.get('id')).update(name=request.POST.get('name'),comment=request.POST.get('desc'))
        if len(ddata)>0:
            for ddata_id in ddata:
                Asset.objects.get(id=ddata_id).group.add(AssetGroup.objects.get(id=request.POST.get('id')))
        if delete_d:
            for delete_id in delete_d:
                Asset.objects.get(id=delete_id).group.remove(AssetGroup.objects.get(id=request.POST.get('id')))
        ret['status'] = True
    except Exception as e:
        print e
        try:
            ret['status'] = e[1]
        except:
            ret['status'] = e
        s = traceback.format_exc()
        Cmdb_log.error('{0}'.format(s))
    return ret

def group_post(request):
    '''
    资产组创建修改
    :param request:
    :return:
    '''
    ret=globals()[request.POST.get('type')](request)
    return ret


def group_delete(request):
    """
    删除资产组
    :param request:
    :return:
    """
    ret={}
    delete_id=request.POST.get('delete_id')
    try:
        for host_id in json.loads(delete_id):
            delete_host=AssetGroup.objects.get(id=host_id).delete()
        ret['status']=True
    except Exception as e:
        print e
        ret['status']=e[1]
        s=traceback.format_exc()
        Cmdb_log.error('{0}-{1}'.format('删除失败',s))
    return ret


def assetpost(request):
    ret={}
    try:
        #assetgroup=AssetGroup.objects.get(id=request.POST.get('group'))
        print request.POST
        ip=request.POST.get('ip')
        insert_asset=Asset.objects.create(ip=ip,
                                          other_ip=request.POST.get('other_ip'),
                                          hostname=request.POST.get('name'),
                                          port=request.POST.get('port'),
                                          #group=AssetGroup.objects.filter(name=request.POST.get('group')),
                                          system_type=request.POST.get('sys_name'),
                                          system_version=request.POST.get('sys_version'),
                                          status=request.POST.get('host_status'),
                                          asset_type=request.POST.get('host_type'),
                                          env=request.POST.get('run_env'),
                                          comment=request.POST.get('desc'),
                                          username=request.POST.get('username'),
                                          password=request.POST.get('password'),
                                          )
        insert_asset.save()
        if json.loads(request.POST.get('group')):
            for group_id in json.loads(request.POST.get('group')):
                rela_asset_group=Asset.objects.get(id=insert_asset.id).group.add(AssetGroup.objects.get(id=group_id))
        ret['status'] = True
    except Exception as e:
        ret['status'] = e[1]
        s=traceback.format_exc()
        Cmdb_log.error('{0}-{1}'.format('asset插入数据',s))
    return ret

def asset_update(request):
    ret={}
    try:
        group_id = request.POST.get('group_id',None)
        Asset.objects.filter(id=request.POST.get('id')).update(
            ip=request.POST.get('ip'),
            other_ip=request.POST.get('other_ip'),
            hostname=request.POST.get('name'),
            port=request.POST.get('port'),
            # group=AssetGroup.objects.filter(name=request.POST.get('group')),
            username=request.POST.get('username'),
            password=request.POST.get('password'),
            system_type=request.POST.get('sys_name'),
            system_version=request.POST.get('sys_version'),
            status=request.POST.get('host_status'),
            asset_type=request.POST.get('host_type'),
            env=request.POST.get('run_env'),
            comment=request.POST.get('desc',None)
        )
        asset_id=request.POST.get('id')
        group_list=[ i.id for i in Asset.objects.get(id=asset_id).group.all()]
        delnete_d=[]
        if group_id:
            if len(json.loads(group_id)) == 0:
                if group_list:
                    asset_data = Asset.objects.get(id=asset_id)
                    for delete_id in group_list:
                        asset_data.group.remove(AssetGroup.objects.get(id=delete_id))
            else:
                group_id=json.loads(group_id)
                for data in group_list:
                    try:
                        group_id.index(data)
                        group_id.remove(data)
                    except:
                        delnete_d.append(data)
                try:
                    if len(group_id) > 0:
                        for ddata_id in group_id:
                            Asset.objects.get(id=asset_id).group.add(AssetGroup.objects.get(id=ddata_id))
                            AssetGroup.objects.filter(id=asset_id)
                    if delnete_d:
                        asset_data=Asset.objects.get(id=asset_id)
                        for delete_id in delnete_d:
                            asset_data.group.remove(AssetGroup.objects.get(id=delete_id))
                except Exception as e:
                    s = traceback.format_exc()
                    Cmdb_log.error('{0}-{1}'.format('asset数据修改', s))
        ret['status']=True
    except:
        s = traceback.format_exc()
        Cmdb_log.error('{0}-{1}'.format('asset数据修改', s))
        ret['status']="数据异常"
    return ret

def assetget(request):
    ret={}
    #print Asset.status.denominator()
 #   print dict(list(ASSET_ENV))
 #   print dict(list(ASSET_TYPE))
 #   print dict(list(ASSET_STATUS))
    assetdata = Asset.objects.all()
    ret['data'] = []
    for gasset in assetdata:
        sys={}
        sys['id']=gasset.id
        sys['hostname']=gasset.hostname
        sys['port']=gasset.port
        sys['ip']=gasset.ip
        sys['group']=map((lambda x:x.name),gasset.group.all())
        sys['group_id'] = map((lambda x: x.id), gasset.group.all())
        sys['system']=gasset.system_type+'-'+gasset.system_version
        sys['sys_name'] = gasset.system_type
        sys['sys_version'] = gasset.system_version
        sys['asset_type']=dict(list(ASSET_TYPE))[gasset.asset_type]
        sys['status']=dict(list(ASSET_STATUS))[gasset.status]
        sys['env']=dict(list(ASSET_ENV))[gasset.env]
        sys['other_ip']=gasset.other_ip
        sys['system_version_id']=gasset.system_version
        sys['host_status_id']=gasset.status
        sys['run_env_id'] =gasset.env
        sys['host_type_id']=gasset.asset_type
        sys['desc']=gasset.comment
        ret['data'].append(sys)
    return ret


def asset_delete(request):
    """
    删除主机
    :param request:
    :return:
    """
    ret={}
    delete_id=request.POST.get('delete_id')
    try:
        for host_id in json.loads(delete_id):
            delete_host=Asset.objects.get(id=host_id).delete()
        ret['status']=True
    except Exception as e:
        print e
        ret['status']=e[1]
        s=traceback.format_exc()
        Cmdb_log.error('{0}-{1}'.format('删除失败',s))
    return ret
    pass


Methods = {
    "GET": {
        "groupget": group_get,
        "assetget": assetget,
    },
    "POST": {
        "grouppost":group_post,
        "assetpost":assetpost,
        "groupdelete":group_delete,
        "assetdelete":asset_delete,
        "assetupdate":asset_update,
    },
    "PUT":{
    }
}