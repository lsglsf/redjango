#coding:utf-8
import json
import traceback
from models import Register
from Cmdb.models import Asset,AssetGroup
from Cmdb.methods.common import File_operation,path_replace
import os
import logging
from django.http import HttpResponse
from Cmdb.methods.common import Connect_agen as Connect_agent
from Cmdb.methods.common import AnsibleTask,CRYPTOR
import re


Cmdb_log = logging.getLogger("Cmdb_log")
def register(request):
    ret={}
 #   print request.POST
    try:
        inst=Register.objects.create(
           # name_type=request.POST.get('name'),
            service_name=request.POST.get('service_name'),
            service_restart=request.POST.get('service_restart'),
            path_config=request.POST.get('path_config'),
            path_root=request.POST.get('path_root'),
            path_project=request.POST.get('path_project'),
            desc=request.POST.get('desc',None),
            path_log=request.POST.get('log_path')
        )
        data_host=request.POST.get('targetData')
        if data_host:
            for i in json.loads(data_host):
                rela_asset_group = Register.objects.get(id=inst.id).Asset_service.add( Asset.objects.get(id=i))
        ret['status']=True
    except Exception as e:
     #   print e
        ret['status'] = e
    return  ret

def type_list(request):
    ret={}
    try:
        #list_data=list(set([i.name_type for i in Register.objects.all()]))
        #ret['data']=list_data
        list_data=[ i.name for i in AssetGroup.objects.all()]
      #  print list_data
        ret['data']=list_data
    except:
    #    print list_data
        pass
    return ret

def query_host(request):
    ret={}
   # print request.GET.get('name')
    assetgroup=AssetGroup.objects.get(name=request.GET.get('name')).asset_set.all()
    ret['data']=[]
    ret['host']=[]
    for host in assetgroup:
#        print i
   #     print host.register_set.all()
        for service in host.register_set.all():
            sys = {}
           # sys['name_type'] = service.name_type
            sys['id'] = service.id
            sys['service_name'] = service.service_name
            sys['service_restart'] = service.service_restart
            sys['path_config'] = service.path_config
            sys['path_root'] = service.path_root
            sys['path_project'] = service.path_project
            sys['desc'] = service.desc
            sys['host']= host.hostname
            sys['path_log']= service.path_log
            sys['ip'] = host.ip
            # sys['host']=map((lambda x:x.hostname),service.Asset_service.all())
            ret['data'].append(sys)
  #      ret['host'].append(host.hostname)
 #           ret['host'] = ret['host'] + sys['host']
   # print ret
    return ret
'''
    service_list=Register.objects.filter(name_type=request.GET.get('name'))
    for service in service_list:
        sys = {}
        sys['name_type']=service.name_type
        sys['service_name']=service.service_name
        sys['service_restart']=service.service_restart
        sys['path_config']=service.path_config
        sys['path_root']=service.path_root
        sys['path_project']=service.path_project
        sys['desc']=service.desc
        #sys['host']=map((lambda x:x.hostname),service.Asset_service.all())
        ret['data'].append(sys)
        ret['host']=ret['host']+sys['host']'''


def delete_server(request):
    ret={}
   # print request.POST.get('id',None)
    if request.POST.get('id',None) != None:
        Register.objects.get(id=request.POST.get('id')).delete()
        ret['status']=True
    return ret

def file_dir(request):
    ret={}
    #print json.loads(request.POST.get('path_list'))
 #   print request.POST
    per_host=request.POST.get('per_host')
    host=json.loads(request.POST.get('host'))
  #  print Asset.objects.get(hostname=per_host).register_set.all()
    per_host_d={}
    host_d={}
    for i in Asset.objects.get(hostname=per_host).register_set.all():
        #per_host_d['path_project']=os.path.abspath(i.path_project)
        per_host_d['path_project']=i.path_project

    #print host
    for i in host:
    #    print Asset.objects.get(hostname=i).register_set.all()
        for i in Asset.objects.get(hostname=i).register_set.all():
            #host_d['path_project']=os.path.abspath(i.path_project)
            host_d['path_project']=i.path_project
    path_project=path_replace(per_host_d['path_project'],host_d['path_project'],json.loads(request.POST.get('path_list')))
    #print json.loads(request.POST.get('path_list'))
    ret['data']=[]
    for i in path_project['s']:
        ssh1=File_operation(host='192.168.44.129',port=22,username='root',password='redhat')
        ssh=ssh1.connect()
        path_status=File_operation.file_status(ssh,i['path'])
        ssh.close()
        i['type']=path_status
        ret['data'].append(i)
   # for i in path_project['d']:

   # print ret
    return ret

def path_list(request):
    ret={}
  #  print request.POST.get('data')
    p_re=json.loads(request.POST.get('data'))
    file_path=''
    re_out=re.compile(r"log|jar|out")
    if len(re_out.findall(p_re['path'][-1])) !=0:
        for i in p_re['path']:
            file_path=os.path.join(file_path,i)
        Asset_o=Asset.objects.get(ip=p_re['ip'])
        _IP=[p_re['ip']+':{0}'.format(Asset_o.port)]
       # print Asset_o.username,Asset_o.password
        ansible_api=AnsibleTask(targetHost=_IP,user=Asset_o.username,password_d=CRYPTOR.decrypt(Asset_o.password))
        return_data=ansible_api.ansiblePlay(module='shell',args='cat {0}'.format(file_path))
      #  print file_path,return_data
        ret=return_data
    else:
        ret['msg']="读取文件失败"
  #  print 'dfsfsfsafdsaf'
    return ret

Methods = {
    "GET": {
        "type_list":type_list,
        "query":query_host,

    },
    "POST": {
        "register":register,
        "file_dir":file_dir,
        "delete_server":delete_server,
        "path_list":path_list,
    },
    "PUT":{
    },
    "DELETE":{
        "delete_server":delete_server,
    }
}