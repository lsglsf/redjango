#coding:utf-8
import json
import traceback
from Cmdb.models import Asset,AssetGroup
from Cmdb.methods.common import File_operation,path_replace
import os
import logging
from django.http import HttpResponse
from Cmdb.methods.common import AnsibleTask,CRYPTOR
import re



def Models_list():
    ret={}
    return ret



Methods = {
    "GET": {
        "models_list":Models_list,
    },
    "POST": {
    },
    "PUT":{
    },
    "DELETE":{
    }
}