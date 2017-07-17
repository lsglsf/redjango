#coding:utf-8
import json
import traceback
from models import Register,Taskqueue
from Cmdb.models import Asset,AssetGroup
from Cmdb.methods.common import send_mail,Mongodb_Operate,Zabbix_api,test_ssh
import os
import logging
from django.http import HttpResponse
from Management.settings import ZABBIX_TOKEN
from Cmdb.methods.common import AnsibleTask,CRYPTOR,task_state,Task_query,sendhttp
import re,time,datetime
import hashlib
from Automation.models import Automation_Hostdetails
from Management.settings import MONGODB
from django.db.models import  Q
from celeryproj import tasks
from Cmdb.methods.redis_connect import Auth_token_get
from Cmdb.methods.exception_class import TokenException
from views import http_url_data



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
            path_log=request.POST.get('log_path'),
            serviceid=request.POST.get('service_id'),
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
        path_log=request.POST.get('log_path'),
        serviceid=request.POST.get('service_id'),
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
            sys['service_id']= service.serviceid
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


def path_list(request):
    ret={}
  #  print request.POST.get('data')
    p_re=json.loads(request.POST.get('data'))
    file_path=''
    re_out=re.compile(r"log|jar|out")
    #print p_re
    if len(re_out.findall(p_re['path'][-1]))==0:
        for i in p_re['path']:
            file_path=os.path.join(file_path,i)
        #print file_path
        Asset_o=Asset.objects.get(ip=p_re['ip'])
        _IP=[p_re['ip']+':{0}'.format(Asset_o.port)]
        #print _IP,Asset_o.username,CRYPTOR.decrypt(Asset_o.password)
       # print Asset_o.username,Asset_o.password
        ansible_api=AnsibleTask(targetHost=_IP,user=Asset_o.username,password_d=CRYPTOR.decrypt(Asset_o.password))
        return_data=ansible_api.ansiblePlay(module='shell',args='cat {0}'.format(file_path))
        #print return_data
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
        form_data=str(Zabbix_api.time_date(time_type="days",interval=1))
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

def connect(request):
    ret={}
  #  print request.POST
    data= json.loads(request.POST.get('data'))
  #  print type(data.get('ip')),int(data.get('port')),data.get('username'),data.get('password')
    ret=test_ssh(host=str(data.get('ip')),port=int(data.get('port')),user=data.get('username'),password=data.get('password'))
    return ret

def tasklist(request):
    ret={}
    ret['data']=[]
    service_id = request.GET.get('id',None)
    if service_id != None:
        try:
            if Register.objects.get(id=service_id).id >= 0:
                try:
                    for i in  Taskqueue.objects.filter(Register_Task__id=service_id).order_by('-add_date'):
                        if i.task_status == False:
                            sys={}
                            sys=task_state(i.task_id,sys)
                            print sys,'1111111'
                            sys['id'] = i.id
                            sys['task_id'] = i.task_id
                           # sys['status'] = task_state(i.task_id)
                            #sys['results_status'] = True
                            sys['date'] = i.add_date.strftime('%Y-%m-%d %H:%M:%S')
                            sys['task_name'] = i.task_name
                            ret['data'].append(sys)
                        else:
                            sys={}
                            sys['id'] = i.id
                            sys['task_id'] = i.task_id
                            sys['date'] = i.add_date.strftime('%Y-%m-%d %H:%M:%S')
                            sys['task_name'] = i.task_name
                            sys['results_status']=i.results_status
                            sys['task_status']="True"
                            ret['data'].append(sys)
                except:
                    ret['status']=0
                    ret['msg']="发布任务查询失败"
                    #print traceback.format_exc()
                    Cmdb_log.error("发布任务查询失败-{0}".format(traceback.format_exc()))
            #for i in Taskqueue.objects.filter(register__id=service_id):
            #    print i.id
        except:
            ret['status']=0
            ret['msg']="服务查询失败"
            Cmdb_log.error("服务查询失败-{0}".format(traceback.format_exc()))
    return ret

def taskdetail(request):
    task_id = request.GET.get('id', None)
    task_delete_id = request.GET.get('delete_id',None)
   # print 'task_id:',task_id,'taks-date:',task_delete_id
    ret = {}
    if task_id:
        task_data=Task_query(task_id=task_id)
        if task_data.successful():
            try:
                ret['status'] = True
                ret['msg'] = task_data.get(timeout=5)
            except:
                ret['status'] = False
                ret['pf'] = 'error'
                ret['msg'] = '获取值异常'
        else:
            try:
                ret['status'] = False
                ret['msg'] = task_data.get(timeout=5)
            except:
                ret['status'] = False
                ret['pf'] = 'error'
                ret['msg'] = '获取值异常'
        return ret
    if task_delete_id:
        try:
            Taskqueue.objects.filter(task_id=task_delete_id).delete()
            ret['status'] = True
            ret['msg'] = '删除成功'
        except:
            ret['status'] = False
            ret['msg'] = '删除失败'
        return ret
    return ret

def task_status(request):
    task_id = request.GET.get('id', None)
    ret={}
    if task_id:
        task_data = Task_query(task_id=task_id)
        ret['status']=task_data.ready()
    return ret

@Auth_token_get()
def filecheck(request,*args,**kwargs):
    ret={}
    if request.method == 'POST':
        print request.POST
        print kwargs,args
        data=json.loads(request.POST.get('data'))
        path=data.get('path',None)
        host=data.get('host',None)
        service_id=data.get('serviceid',None)
        if path !=None and host != None and service_id != None:
            print path, host,
            data['path'] = path
            data['s_host']={}
            data['t_host']={}
            host_release=Asset.objects.get(id=Asset.objects.get(ip=host).host_hostname)
            data['s_host']['username']=host_release.username
            data['s_host']['password']=host_release.password
            data['s_host']['ip']=host_release.ip
            data['s_host']['port']=host_release.port
            service_host_id=[ i.id for i in Register.objects.filter(Asset_service=host_release) if i.id == Register.objects.get(id=service_id).serviceid  ]
            if  service_host_id:
                data['s_host']['path']=Register.objects.get(id=Register.objects.get(id=service_id).serviceid).path_project
            data['t_host']['path']=Register.objects.get(id=service_id).path_project
            data['t_host']['ip']=host
            senddata = {
                'token':kwargs['token'],
                'data': data}
            check_url = http_url_data(IP=host, URL='CHECK')
            request_http=sendhttp(url=check_url, data=json.dumps(senddata))
            print request_http
            if request_http['status'] == False and request_http.get('msg',None) == "Token":
               # raise TokenException()
                assert request_http['status'], "token timeout"

            ret['status']=True
            ret['data']=request_http
    return ret


def filesync(request):
    ret={}
    if request.method == 'POST':
        data = json.loads(request.POST.get('data'))
        print data['s_host']
        print data
        source_host=Asset.objects.get(ip=data['s_host'])
        data['s_host']={}
        data['s_host']['username'] = source_host.username
        data['s_host']['password'] = source_host.password
        data['s_host']['ip'] = source_host.ip
        data['s_host']['port'] = source_host.port
        http_task = tasks.Http_send_rpc.delay(data)
        try:
            create_task = Taskqueue.objects.create(task_name=http_task,
                                                   task_id=http_task
                                                   )

            #Taskqueue.objects.get(id=create_task.id).Register_Task.add(Asset.objects.get(ip=source_host.ip).register_set.get(id=data['serviceid']))
            Taskqueue.objects.get(id=create_task.id).Register_Task.add(Register.objects.get(id=data['serviceid']))
            ret['status'] = True
            ret['id'] = http_task.id
        except:
            ret['status'] = False
            ret['msg'] = '任务数据库更新失败'
            print traceback.format_exc()
      #  print http_task
    return ret


def serverlist(request):
    ret={}
    assetgroup = Register.objects.all()
    ret['data'] = []
    for service in assetgroup:
        sys = {}
        sys['id'] = service.id
        sys['name'] = str(service.service_name)+'-'+str(service.alias_name)
        ret['data'].append(sys)
    return ret

@Auth_token_get()
def serverconf(request,*args,**kwargs):
    ret={}
    host_o= request.GET.get('ip',None)
    print request.GET
    path=request.GET.get('configpath',None)
    if host_o and path:
        senddata = {
            'token': kwargs['token'],
            'path': path}
        check_url = http_url_data(IP=host_o, URL='CONFIG')
        request_http = sendhttp(url=check_url, data=json.dumps(senddata))

        if request_http.get('status',None) == False and request_http.get('msg', None) == "Token":
            # raise TokenException()
            assert request_http['status'], "token timeout"
        ret = request_http
    return ret

def serverrestart(request):
    ret={}
    #  print request.POST.get('data')
    data = json.loads(request.POST.get('data'))
    # print p_re
    print len(data)
    if data:
        cmd=Register.objects.get(id=data['id']).service_restart
        # print file_path
        Asset_o = Asset.objects.get(ip=data['host'])
        _IP = [data['host'] + ':{0}'.format(Asset_o.port)]
        # print _IP,Asset_o.username,CRYPTOR.decrypt(Asset_o.password)
        # print Asset_o.username,Asset_o.password
        ansible_api = AnsibleTask(targetHost=_IP, user=Asset_o.username, password_d=CRYPTOR.decrypt(Asset_o.password))
        return_data = ansible_api.ansiblePlay(module='shell', args='{0}'.format(cmd))
        # print return_data
        #  print file_path,return_data
        ret = return_data
    else:
        ret['msg'] = "输入值异常"
        #  print 'dfsfsfsafdsaf'
    return ret


def selectquery(request):
    ret={}
    print request.GET
    group_id=request.GET.get('group',None)
    print group_id
    print AssetGroup.objects.get(id=group_id).name
    print Asset.objects.filter(group__id=group_id)
    ret['data']=[]
    check_list=[]
    for i in Asset.objects.filter(group__id=group_id):
        print i.register_set.all()
        for service in i.register_set.all():
            if service.id in check_list:
                continue
            check_list.append(service.id)
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
            sys['service_id']= service.serviceid
           # sys['host'] = [ i.hostname for i in service.Asset_service.all() ]
            sys['path_log'] = service.path_log
          #  sys['ip'] = [i.ip for i in service.Asset_service.all()]
            for i in service.Asset_service.all():
                sys['host_ip'][i.ip]=i.hostname
            # sys['host']=map((lambda x:x.hostname),service.Asset_service.all())
            ret['data'].append(sys)
   # ret['data']= list(set(ret['data']))
            # sys['host']=map((lambda x:x.hostname),service.Asset_service.all())

    return ret


Methods = {
    "GET": {
        "type_list":type_list,
        "query":query_host,
        "list_system":system_info,
        "Home":Home,
        "Home_number":Home_number,
        "graph":system_graph,
        "connect": connect,
        "tasklist": tasklist,
        "taskdetail": taskdetail,
        'taskstatus':task_status,
        'serverlist':serverlist,
        'serverconf':serverconf,
        'selectquery':selectquery,
      #  "mail": mail,
    },
    "POST": {
        "register":register,
        "delete_server":delete_server,
        "path_list":path_list,
        "mail": mail,
        "register_p":register_p,
        "connect": connect,
        "filecheck":filecheck,
        "filesync":filesync,
        "serverrestart":serverrestart,
    },
    "PUT":{
    },
    "DELETE":{
        "delete_server":delete_server,
    }
}