#coding:utf-8
import json
import traceback
from models import Register
from Cmdb.models import Asset,AssetGroup
from Cmdb.methods.common import File_operation,path_replace,send_mail,Mongodb_Operate,Zabbix_api
import os
import logging
from django.http import HttpResponse
from Management.settings import ZABBIX_TOKEN
from Cmdb.methods.common import AnsibleTask,CRYPTOR
import re,time,datetime
import hashlib
from Automation.models import Automation_Hostdetails
from Management.settings import MONGODB



Cmdb_log = logging.getLogger("Cmdb_log")
def register(request):
    ret={}
 #   print request.POST
    try:
        inst=Register.objects.create(
           # name_type=request.POST.get('name'),
            service_name=request.POST.get('service_name'),
            service_restart=request.POST.get('service_restart'),
            alias_name=request.POST.get('alias_name'),
            path_config=request.POST.get('path_config'),
            path_root=request.POST.get('path_root'),
            path_project=request.POST.get('path_project'),
            desc=request.POST.get('desc',None),
            path_log=request.POST.get('log_path')
        )
        data_host=request.POST.get('targetData')
        '''
        #使用id添加关联
        if data_host:
            for i in json.loads(data_host):
                rela_asset_group = Register.objects.get(id=inst.id).Asset_service.add( Asset.objects.get(id=i))
       '''
        if data_host:
            for i in json.loads(data_host):
                rela_asset_group = Register.objects.get(id=inst.id).Asset_service.add( Asset.objects.get(hostname=i))
        ret['status']=True
    except Exception as e:
     #   print e
        ret['status'] = e
    return  ret

def register_p(request):
    ret={}
    ret['status']={}
    print request.POST
    register_id=request.POST.get('id')
    update_r=Register.objects.filter(id=register_id).update(
        service_name=request.POST.get('service_name'),
        service_restart=request.POST.get('service_restart'),
        alias_name=request.POST.get('alias_name'),
        path_config=request.POST.get('path_config'),
        path_root=request.POST.get('path_root'),
        path_project=request.POST.get('path_project'),
        desc=request.POST.get('desc', None),
        path_log=request.POST.get('log_path')
    )
    host_name=request.POST.get("targetData")
    host_list=[ i.hostname for i in Register.objects.get(id=register_id).Asset_service.all()]
    print host_name,host_list
    delnete_t=[]
    if host_name:
        if len(json.loads(host_name)) == 0:
            if host_list:
                register_object=Register.objects.get(id=register_id)
                for delete_name in host_list:
                    register_object.Asset_service.remove(Asset.objects.get(hostname=delete_name))
        else:
            host_name_l=json.loads(host_name)
            for data in host_list:
                try:
                    host_name_l.index(data)
                    host_name_l.remove(data)
                except:
                    delnete_t.append(data)
            try:
                if len(host_name_l) > 0:
                    for host in host_name_l:
                        Register.objects.get(id=register_id).Asset_service.add(Asset.objects.get(hostname=host))
                if delnete_t:
                    register_object = Register.objects.get(id=register_id)

                    for delete_name in delnete_t:
                        print host_list
                        print delnete_t
                        print delnete_t,"tes111111"
                        print delete_name
                        register_object.Asset_service.remove(Asset.objects.get(hostname=delete_name))
            except:
                s=traceback.format_exc()
                Cmdb_log.error("{0}-{1}".format("修改主机失败",s))
                ret['status'] = "修改异常"
                return ret
    ret['status'] = True

    '''
    if template_id:
        if len(json.loads(template_id)) == 0:
            if group_list:
                template_data = Asset.objects.get(id=asset_id)
                for delete_id in template_list:
                    template_data.register_set.remove(Register.objects.get(id=delete_id))
        else:
            template_id = json.loads(template_id)
            for data in template_list:
                try:
                    template_id.index(data)
                    template_id.remove(data)
                except:
                    delnete_t.append(data)
            try:
                if len(template_id) > 0:
                    for template in template_id:
                        Asset.objects.get(id=asset_id).register_set.add(Register.objects.get(id=template))
                if delnete_t:
                    asset_data = Asset.objects.get(id=asset_id)
                    for delete_id in delnete_t:
                        asset_data.register_set.remove(Register.objects.get(id=delete_id))
            except Exception as e:
                s = traceback.format_exc()
                Cmdb_log.error("{0}-{1}".format("asset 修改模版失败", s))
    '''
    return ret


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
    if request.GET.get('name') == None:
        assetgroup=Register.objects.all()
        ret['data']=[]
        for service in assetgroup:
            sys = {}
            sys['host_ip']={}
            # sys['name_type'] = service.name_type
            sys['id'] = service.id
            sys['service_name'] = service.service_name
            sys['service_restart'] = service.service_restart
            sys['alias_name'] = service.alias_name
            sys['path_config'] = service.path_config
            sys['path_root'] = service.path_root
            sys['path_project'] = service.path_project
            sys['desc'] = service.desc
            sys['host'] = [ i.hostname for i in service.Asset_service.all() ]
            sys['path_log'] = service.path_log
            sys['ip'] = [i.ip for i in service.Asset_service.all()]
            for i in service.Asset_service.all():
                sys['host_ip'][i.ip]=i.hostname
            # sys['host']=map((lambda x:x.hostname),service.Asset_service.all())
            ret['data'].append(sys)
    else:
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
    if len(re_out.findall(p_re['path'][-1]))==0:
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

def mail(request):
    ret={'a':'b'}
    print 'sdddddddddd'
  #  print dir(request)
    #data=json.loads(request.data)
    data=request.data
    print type(data)
   # send_mail('lsglsf@163.com','io',content=json.dumps(data['data']))
    #print data['data']

  #  print request.META
  #  print request.POST,'POST'
   # print request.GET,'GET'
    return ret

def system_info(request):
    ret={}
    print request.GET
    host_id = request.GET.get('id',None)
    ret['host_info']={}
    sys_dict=ret['host_info']
    if host_id == None:
        return ret
    else:
        host_ip=Asset.objects.get(id=host_id).ip
        sys=['system_disk','process_cpu_men','process_io','system_men']
        mongoclss=Mongodb_Operate(host=MONGODB['default']['HOST'],port=MONGODB['default']['PORT'])
        for i in sys:
            try:
                db = mongoclss.connet_m[i]
                table = db[str(hashlib.md5(host_ip).hexdigest())]
                table_len = table.count()
                for one_data in table.find().skip(table_len - 1):
                    id_data=one_data['id']
                    ret[i]=one_data[id_data]
            except:
                s=traceback.format_exc()
                Cmdb_log.error(s)
                ret[i]={}
        mongoclss.close()
        try:
            authomtion_data=Asset.objects.get(id=host_id).automation_hostdetails
            sys_dict['architecture']=authomtion_data.architecture
            sys_dict['lang']=authomtion_data.lang
            sys_dict['distribution']=authomtion_data.distribution
            sys_dict['distributionmajorversion']=authomtion_data.distributionmajorversion
            sys_dict['distributionrelease']=authomtion_data.distributionrelease
            sys_dict['distributionversion']=authomtion_data.distributionversion
            sys_dict['dns']=authomtion_data.dns
            sys_dict['domain']=authomtion_data.domain
            sys_dict['fqdn']=authomtion_data.fqdn
            sys_dict['hostname']=authomtion_data.hostname
            sys_dict['kernel']=authomtion_data.kernel
            sys_dict['description']=authomtion_data.description
            sys_dict['family'] = authomtion_data.family
            sys_dict['processor'] =authomtion_data.processor.split(',')[-1]
            sys_dict['processorcores'] = authomtion_data.processorcores
            sys_dict['processorcount'] = authomtion_data.processorcount
            sys_dict['machine'] = authomtion_data.machine
            sys_dict['system'] = authomtion_data.system
        except:
            s = traceback.format_exc()
            Cmdb_log.error(s)
    return ret
   # print Zabbix_api.token_data()
    #        print ret
   # ansible_api=AnsibleTask(targetHost=['192.168.2.230'],user="root",password_d="redhat")
  #  print ansible_api.ansiblePlay(module='setup',args='')
    #db=mongoclss.connet_m['system_disk']
    #table=db[str(hashlib.md5('192.168.44.130').hexdigest())]
    #table_len=table.count()
    #for i in  table.find().skip(table_len-1):
    ##    print i
    #    print i['id']
   # print mongoclss.read('system_disk',str(hashlib.md5('192.168.44.130').hexdigest()))

def system_graph(request):
    ret={}
    monodb={
        'io':'process_io',
        'cpu_men':"process_cpu_men",
    }
    type=monodb.get(request.GET.get('type'),None)
    pid=request.GET.get('pid',None)
    host_id=request.GET.get('id')
   # print type
   # print pid
    host_ip = Asset.objects.get(id=host_id).ip
    #print host_ip
    if type:
        mongoclss = Mongodb_Operate(host=MONGODB['default']['HOST'],port=MONGODB['default']['PORT'])
        form_data=str(Zabbix_api.time_date(time_type="hours",interval=1))
        time_till = str(time.mktime(time.strptime(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), "%Y-%m-%d %H:%M:%S"))).split('.')[0]
       # print form_data,time_till
        arg={"id":{"$gte":form_data, "$lte":time_till}}
        mongod_data=mongoclss.read(db=type,table=str(hashlib.md5(host_ip).hexdigest()),arg=arg)
        if request.GET.get('type') == 'io':
            ret['write'] = {}
            ret['read'] = {}
            for one_data in mongod_data:
                id_data = one_data['id']
              #  print one_data[id_data][pid]
                ret['write'][id_data]= one_data[id_data][pid]['write']
                ret['read'][id_data] = one_data[id_data][pid]['read']
        elif request.GET.get('type') == 'cpu_men':
            ret['cpu'] = {}
            ret['memory'] = {}
            #print mongod_data
            for one_data in mongod_data:
                id_data = one_data['id']
              #  print one_data[id_data][pid]
                ret['cpu'][id_data] = one_data[id_data][pid]['cpu_percent']
                ret['memory'][id_data] = one_data[id_data][pid]['memory_percent']
            #pass
        mongoclss.close()
    #print request.GET
    return ret

def Home(request):
    ret = {}
    ret['host']=[]
    group_list=AssetGroup.objects.all()
    for i in group_list:
        sys={}
        sys['name'] = i.name
        sys['value'] =  i.asset_set.all().count()
        ret['host'].append(sys)
    ZABBIX_TOKEN=Zabbix_api.get_token()
    #print ZABBIX_TOKEN
    host_list=Zabbix_api.hostids(host='nginx')
    items_list=Zabbix_api.itemids(item_key='nginx.connections.active',host_list=host_list)
    ret_t= Zabbix_api.history_data(items_list)
    ret['zabbix'] = ret_t
    return ret

def  Home_number(request):
    ret = {}
    host_count=Asset.objects.all().count()
    app_count=Register.objects.all().count()
    ret['host_count']=host_count
    ret['app_count']=app_count
    return ret


Methods = {
    "GET": {
        "type_list":type_list,
        "query":query_host,
        "list_system":system_info,
        "Home":Home,
        "Home_number":Home_number,
        "graph":system_graph
      #  "mail": mail,
    },
    "POST": {
        "register":register,
        "file_dir":file_dir,
        "delete_server":delete_server,
        "path_list":path_list,
        "mail": mail,
        "register_p":register_p,
    },
    "PUT":{
    },
    "DELETE":{
        "delete_server":delete_server,
    }
}