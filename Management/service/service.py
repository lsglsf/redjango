import json
import traceback
from models import Register
from Cmdb.models import Asset

import logging

Cmdb_log = logging.getLogger("Cmdb_log")
def register(request):
    ret={}
    print request.POST
    try:
        inst=Register.objects.create(
            name_type=request.POST.get('name'),
            service_name=request.POST.get('service_name'),
            service_restart=request.POST.get('service_restart'),
            path_config=request.POST.get('path_config'),
            path_root=request.POST.get('path_root'),
            path_project=request.POST.get('path_project'),
            desc=request.POST.get('desc',None),
        )
        data_host=request.POST.get('targetData')
        if data_host:
            for i in json.loads(data_host):
                rela_asset_group = Register.objects.get(id=inst.id).Asset_service.add( Asset.objects.get(id=i['id']))
        ret['status']=True
    except:
        pass
    return  ret

def type_list(request):
    ret={}
    list_data=list(set([i.name_type for i in Register.objects.all()]))
    ret['data']=list_data
    print list_data
    return ret

def query_host(request):
    ret={}
    print request.GET.get('name')
    service_list=Register.objects.filter(name_type=request.GET.get('name'))
    ret['data']=[]
    for service in service_list:
        sys = {}
        sys['name_type']=service.name_type
        sys['service_name']=service.service_name
        sys['service_restart']=service.service_restart
        sys['path_config']=service.path_config
        sys['path_root']=service.path_root
        sys['path_project']=service.path_project
        sys['desc']=service.desc
        sys['host']=map((lambda x:x.hostname),service.Asset_service.all())
        ret['data'].append(sys)
    return ret


Methods = {
    "GET": {
        "type_list":type_list,
        "query":query_host
    },
    "POST": {
        "register":register,
    },
    "PUT":{
    }
}