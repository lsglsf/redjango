# coding:utf-8
from django.http import HttpResponse
import json
from Cmdb.models import AssetGroup
import paramiko
import copy

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



class File_operation(object):

    def __init__(self,host,port,username,password):
        self.host=host
        self.port=port
        self.username=username
        self.password=password


    def connect(self):
        ssh=paramiko.Transport((self.host,self.port))
        ssh.connect(username=self.username,password=self.password)
        sftp=paramiko.SFTPClient.from_transport(ssh)
        return sftp

    @classmethod
    def file_status(self,ssh,df):
        ret = ''
        try:
            status=ssh.stat(df)
            str_status=str(status)[0]
            if str_status == 'd':
                ret = 'd'
            elif str_status == '-':
                ret = 'f'
            else:
                ret = 'w'
        except:
            ret = 'e'
        finally:
            return ret

    def file_put(self,ssh,source,target):
        pass



def path_replace(sourc,output,file_list):

    print sourc,output
    ret={}
    file_s = copy.deepcopy(file_list)
    for i in file_s:
        if sourc in i['path']:
            pass
        else:
            i['type']='e'
    for i in file_list:
        if sourc in i['path']:
            i['path']=i['path'].replace(sourc,output)
        else:
            i['type']='e'
    ret['s']=file_s
    ret['d']=file_list
    print ret,'file_list'
    return ret