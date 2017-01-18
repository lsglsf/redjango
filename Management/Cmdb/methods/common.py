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
import socket
#import tornado
import tornado.iostream
from tornado.iostream import StreamClosedError
import traceback
from collections import namedtuple
from ansible.parsing.dataloader import DataLoader
from ansible.vars import VariableManager
from ansible.inventory import Inventory
from ansible.playbook.play import Play
from ansible.executor.task_queue_manager import TaskQueueManager
from ansible.executor.playbook_executor import PlaybookExecutor
from tempfile import NamedTemporaryFile
from ansible.plugins.callback import CallbackBase
from Crypto.Cipher import AES
from binascii import b2a_hex, a2b_hex
import logging
Cmdb_log = logging.getLogger("Cmdb_log")





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

def response_t(result):
    if len(result) == 0:
        json_status = {"data": result, "code": 400}
        json_status = json.dumps(json_status)
    else:
        json_status = {"data": result, "code": 200}
        json_status = json.dumps(json_status)
    return json_status

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

class Connect_agen(object):
    def __init__(self,host,port,data):
        self.host=host
        self.port=port
        self.data=data
        self.EOF = b'\n'
        self.reutn_data=None
        self.stream=None

    def send_msg(self):
        try:
            self.sock_fd = socket.socket(socket.AF_INET, socket.SOCK_STREAM, 0)
            self.stream = tornado.iostream.IOStream(self.sock_fd)
            #self.stream.set_close_callback(self.on_close)
            self.stream.connect((self.host, self.port))
            self.stream.write(self.data+self.EOF)
            data=self.stream.read_until(self.EOF)
            print data
            return data
            self.stream.close()
        except:
            s = traceback.format_exc()
            print s
            ret={}
            ret['status']="error"
            ret['data']="The connection fails"
            return ret

    @gen.coroutine
    def send_message_new(self):
        print 'test'
        print self.host,self.port,self.data
        try:
            stream = yield TCPClient().connect(self.host, self.port)
            self.stream = stream
            print self.data
            print self.host,self.port
            yield stream.write((json.dumps(self.data) + b"\n").encode())
            reply = yield stream.read_until(b"\n")
            self.reutn_data=reply
            stream.close()
        except StreamClosedError:
            print 'error'
            s = traceback.format_exc()
            print s
            ret={}
            ret['status']='stop'
            ret['data']='连接客户端失败'
            self.reutn_data=ret
        except Exception as e:
            print e
            s = traceback.format_exc()
            print s
            ret={}
            ret['status']='stop'
            ret['data']='连接客户端失败'
            self.reutn_data=ret

    def run(self):
        print 'run'
        self.send_message_new()
        while True:
            if self.reutn_data != None:
                break
        return self.reutn_data


class ResultCallback(CallbackBase):
    def __init__(self):
        self.run_data=None
        super(CallbackBase,self).__init__()

    def v2_runner_on_failed(self, result, **kwargs):
        self.run_data=result._result

    def v2_runner_on_unreachable(self,result, **kwargs):
        self.run_data= result._result

    def v2_runner_on_no_hosts(self,result, **kwargs):
        self.run_data=result._result

    def v2_runner_on_ok(self, result, **kwargs):
        host = result._host
     #   print json.dumps({host.name: result._result}, indent=4)
        self.run_data=result._result

results_callback = ResultCallback()

class AnsibleTask(object):
    def __init__(self, targetHost,user,password_d):
        self.targetHost=targetHost
        Options = namedtuple(
                          'Options', [
                              'listtags', 'listtasks', 'listhosts', 'syntax', 'connection','module_path',
                              'forks', 'remote_user', 'private_key_file', 'ssh_common_args', 'ssh_extra_args',
                              'sftp_extra_args', 'scp_extra_args', 'become', 'become_method', 'become_user',
                              'verbosity', 'check'
                          ]
                       )

        # initialize needed objects
        self.variable_manager = VariableManager()
        self.options = Options(
                          listtags=False, listtasks=False, listhosts=False, syntax=False, connection='smart',
                          module_path='/usr/local/lib/python2.7/site-packages/ansible/modules/', forks=100,
                          remote_user=user, private_key_file=None, ssh_common_args=None, ssh_extra_args=None,
                          sftp_extra_args=None, scp_extra_args=None, become=False, become_method=None, become_user=user,
                          verbosity=None, check=False
                      )
        self.passwords = dict(sshpass=password_d,conn_pass=password_d)
        self.loader = DataLoader()
        # create inventory and pass to var manager
        self.hostsFile = NamedTemporaryFile(delete=False)
        for i in targetHost:
            self.hostsFile.write(i+'\n')
        self.hostsFile.close()
        self.inventory = Inventory(loader=self.loader, variable_manager=self.variable_manager, host_list=self.hostsFile.name)
        self.variable_manager.set_inventory(self.inventory)

    def ansiblePlay(self, module, args):
        play_source =  dict(
                name = "Ansible Play",
                hosts = 'all',
                gather_facts = 'no',
                tasks = [
                    dict(action=dict(module=module, args=args), register='shell_out'),
                ]
            )
        play = Play().load(play_source, variable_manager=self.variable_manager, loader=self.loader)

        # run it
        tqm = None
        tqm = TaskQueueManager(
                      inventory=self.inventory,
                      variable_manager=self.variable_manager,
                      loader=self.loader,
                      options=self.options,
                      passwords=self.passwords,
                      stdout_callback=results_callback,
                  )
        result = tqm.run(play)
        run_data=results_callback.run_data
        if tqm is not None:
            tqm.cleanup()
            os.remove(self.hostsFile.name)
            self.inventory.clear_pattern_cache()
        return run_data

    def run_playbook(self,filename):
        """
        run ansible palybook
        """
        return_data=0
        executor=None
        try:
            filenames = [filename]
            extra_vars = {}  # 额外的参数 sudoers.yml以及模板中的参数，它对应ansible-playbook test.yml --extra-vars "host='aa' name='cc' "
            # host_list_str = ','.join([item for item in host_list])
            # extra_vars['host_list'] = host_list_str
            # extra_vars['username'] = role_name
            # extra_vars['template_dir'] = template_file
            # extra_vars['command_list'] = temp_param.get('cmdList')
            # extra_vars['role_uuid'] = 'role-%s'%role_uuid
            self.variable_manager.extra_vars = extra_vars
            executor = PlaybookExecutor(
                playbooks=filenames, inventory=self.inventory, variable_manager=self.variable_manager,
                loader=self.loader,
                options=self.options, passwords=self.passwords,
            )
            executor._tqm._stdout_callback = results_callback
            executor.run()
            return_data=results_callback.run_data
            if executor is not None:
                executor.cleanup()
                os.remove(self.hostsFile.name)
                self.inventory.clear_pattern_cache()
            return return_data
        except Exception as e:
            # logger.error("run_playbook:%s"%e)
            Cmdb_log.error("playbook failure {0}{1}".format(filename,traceback.format_exc()))
            return return_data


class PyCrypt(object):
    def __init__(self, key):
        self.key = key
        self.mode = AES.MODE_CBC

    def encrypt(self, passwd=None, length=32):
        if not passwd:
            passwd = self.gen_rand_pass()

        cryptor = AES.new(self.key, self.mode, b'6122ca7d906ad5e1')
        try:
            count = len(passwd)
        except TypeError:
            #raise ServerError('Encrypt password error, TYpe error.')
            pass

        add = (length - (count % length))
        passwd += ('\0' * add)
        cipher_text = cryptor.encrypt(passwd)
        return b2a_hex(cipher_text)

    def decrypt(self, text):
        cryptor = AES.new(self.key, self.mode, b'6122ca7d906ad5e1')
        try:
            plain_text = cryptor.decrypt(a2b_hex(text))
        except TypeError:
            pass
            #raise ServerError('Decrypt password error, TYpe error.')
        return plain_text.rstrip('\0')
CRYPTOR = PyCrypt('*')