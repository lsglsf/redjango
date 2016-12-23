# coding:utf-8
from django.http import HttpResponse
from Cmdb.models import AssetGroup
import paramiko
import copy
from tornado.ioloop import IOLoop
from tornado import gen
from tornado.tcpclient import TCPClient
from tornado.options import options, define
import os,ConfigParser
import json

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

class Connect_agent(object):

    def __init__(self):
        pass

    def send_message(self):
        stream = yield TCPClient().connect(options.host, options.port)
        data = options.message
        yield stream.write((data + b"\n").encode())
        while True:
            reply = yield stream.read_until(b"\n")
            c = json.loads(reply)
            if c['status']:
                # print(c['s'])
                if c['pf'] == 'read':
                  #  read_date = read(c)
                    read_date=True
                    if read_date:
                        c['fun'] = 'file_write'
                        data = json.dumps(c)
                        yield stream.write((data + b"\n").encode())
                    else:
                        break
                elif c['pf'] == 'write':
                   # write(c)
                    break
                elif c['pf'] == 'backup':
                    try:
                        print('\033[0;32m %s s:%s t:%s\033[0m ' % (c['data'], c['s'], c['d']))
                    except KeyError:
                        print ('\033[0;32m %s \033[0m ' % (c['data']))
            else:
                print (c)
                break

        def start(self):
            options.parse_command_line()
            IOLoop.current().run_sync(self.send_message)
