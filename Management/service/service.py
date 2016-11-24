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







Methods = {
    "GET": {
    },
    "POST": {
        "register":register,
    },
    "PUT":{
    }
}