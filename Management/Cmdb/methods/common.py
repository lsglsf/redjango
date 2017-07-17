# coding:utf-8
from django.http import HttpResponse
from Cmdb.models import AssetGroup
import paramiko
import copy
import os,ConfigParser
import json
import re
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
import smtplib
from email.mime.text import MIMEText
import pymongo
import urllib2
from Management.settings import ZABBIX,ZABBIX_TOKEN
import datetime,time
from Management.settings import ANSABLE_CNF
import pika,uuid
import time
from celery.result import AsyncResult
from service.models import Taskqueue

ZABBIX_TOKEN=None
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
    def __init__(self, targetHost,user,password_d,ansible_cfg=None):
        self.targetHost=targetHost
        Options = namedtuple(
                          'Options', [
                              'listtags', 'listtasks', 'listhosts', 'syntax', 'connection','module_path',
                              'forks', 'remote_user', 'private_key_file', 'ssh_common_args', 'ssh_extra_args',
                              'sftp_extra_args', 'scp_extra_args', 'become', 'become_method', 'become_user',
                              'verbosity', 'check','host_key_checking','ask_pass'
                          ]
                       )

        # initialize needed objects
        if ansible_cfg == None:
            os.environ["ANSIBLE_CONFIG"] = ANSABLE_CNF
        else:
            os.environ["ANSIBLE_CONFIG"] = ansible_cfg
        self.variable_manager = VariableManager()
        self.options = Options(
                          listtags=False, listtasks=False, listhosts=False, syntax=False, connection='smart',
                          module_path='/usr/local/lib/python2.7/site-packages/ansible/modules/', forks=100,
                          remote_user=user, private_key_file=None, ssh_common_args=None, ssh_extra_args=None,
                          sftp_extra_args=None, scp_extra_args=None, become=False, become_method=None, become_user=user,
                          verbosity=None, check=False,host_key_checking=False,ask_pass = False
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
CRYPTOR = PyCrypt('test')



def Mongdb_error():
    def fun_m(fun):
        def fun_p( self,*args, **kwargs):
            data = fun(self,*args,**kwargs)
            return data
        return fun_p
    return fun_m


class Mongodb_Operate(object):
    """
    monogdb 操作
    """

    def __init__(self,host,port,username=None,password=None):
        self.host=host
        self.port=port
        self.username=username
        self.password=password
        self.connet_m=self.connet()

    @Mongdb_error()
    def insert_one(self,db,table,data):
        dbs=self.connet_m[db]
        try:
            dbs[table].insert_one(data)
            return 1
        except:
            Cmdb_log.error(traceback.format_exc())
            return 0

    @Mongdb_error()
    def read(self,db,table,arg=None):
        ret=[]
        if arg == None:
            dbs=self.connet_m[db]
           # find_data = dbs[table].find({})
            for i in dbs[table].find({}):
                ret.append(i)
        else:
            Cmdb_log.info("{0}-{1}-{2}".format(db,table,arg))
            dbs=self.connet_m[db]
            for i in dbs[table].find(arg):
                ret.append(i)
        return ret

    @Mongdb_error()
    def connect_object(self,db,table):
        ret=None
        ret=self.connet_m[db][table]
        return ret


    def connet(self):
        connet_m = None
        if self.username == None:
            connet_m=pymongo.MongoClient(self.host,self.port)
        else:
            connet_m=pymongo.MongoClient(self.host,self.port,self.username,self.password)
        return connet_m

    @Mongdb_error()
    def update(self,**kwargs):
        db=kwargs.get('db',None)
        table=kwargs.get('table',None)
        if kwargs.get('source',None) != None:
            dbs=self.connet_m[db]
            dbs[table].update_one(kwargs.get('source',None),{"$set":kwargs.get('target',None)})
            return 1
        else:
            Cmdb_log.error('source None')
            return 0

    @Mongdb_error()
    def delnete(self,**kwargs):
        db=kwargs.get('db',None)
        table=kwargs.get('table',None)
        dbs = self.connet_m[db]
        dbs[table].delete_one(kwargs.get('data',None))
        return 1
        #db.my_collection.delete_one({'id': 1})
        #pass

    def close(self):
        self.connet_m.close()




def send_mail(to_list, subject, content):
    mail_host = 'smtp.sina.com'
    mail_user = 'test_btbh'
    mail_pass = 'test123456'
    mail_postfix = 'sina.com'

    me = mail_user + "<" + mail_user + "@" + mail_postfix + ">"
    msg = MIMEText(content, _subtype='plain', _charset='utf-8')
    msg['Subject'] = subject
    msg['From'] = me
    msg['to'] = to_list
    try:
        s = smtplib.SMTP()
        s.connect(mail_host)
        s.login(mail_user, mail_pass)
        s.sendmail(me, to_list, msg.as_string())
        s.close()
        return True
    except Exception, e:
        print str(e)
        return False

def sendhttp(url,data,timeout=5):
    header = {"Content-Type": "application/json"}
    try:
        request = urllib2.Request(url, data)
        for key in header:
            request.add_header(key, header[key])
        try:
            result = urllib2.urlopen(request,timeout = timeout)
            result_t=json.loads(result.read())
        except:
            result_e = traceback.format_exc()
            Cmdb_log.error(result_e)
            result_t = 0
        else:
            result.close()
        return result_t
    except:
        s = traceback.format_exc()
        Cmdb_log.error('execute func %s failure : %s' % (sendhttp, s))




class Zabbix_api(object):
    def __init__(self):
        pass

    @classmethod
    def send_json(cls,method):
        ret={"user":'{"jsonrpc": "2.0","method": "%s","params": {"user": "%s","password": "%s"},"id": 1}',
             "host":'{"jsonrpc": "2.0","method": "%s","params": {"output": ["hostid","name"]},"auth": "%s","id": 1}',
             "item":'{"jsonrpc": "2.0","method": "%s","params": {"output": "itemids","hostids": "%s","search": {"key_": "%s"},"sortfield": "name"},"auth": "%s","id": 1}',
             "history":'{"jsonrpc": "2.0","method": "%s","params": {"history": 3,"itemids": ["%s"],"output":"extend","time_from":"%s","time_till":"%s"},"auth": "%s","id": 1}'
             }
        return ret[method]

    @classmethod
    def time_date(cls,time_type,interval):
        data={
            'minutes': (datetime.datetime.now() - datetime.timedelta(minutes=interval)).strftime("%Y-%m-%d %H:%M:%S"),
            'hours': (datetime.datetime.now() - datetime.timedelta(hours=interval)).strftime("%Y-%m-%d %H:%M:%S"),
             'days': (datetime.datetime.now() - datetime.timedelta(days=interval)).strftime("%Y-%m-%d %H:%M:%S")
         }
        return int(str(time.mktime(time.strptime(data[time_type], "%Y-%m-%d %H:%M:%S"))).split('.')[0])

    @classmethod
    def get_token(cls):
        global ZABBIX_TOKEN
        send_data=cls.send_json(method="user") % ("user.login",ZABBIX['default']['USER'],ZABBIX['default']['PASSWORD'])
        return_data=sendhttp(ZABBIX['default']['URL'],send_data)
        print  return_data
        if return_data != 0:
            ZABBIX_TOKEN = return_data['result']
            print ZABBIX_TOKEN
            return 0
        return 1


    @classmethod
    def hostids(cls,host):
        global ZABBIX_TOKEN
        sys=[]
        patt = r".*%s.*" % host
        patt1 = re.compile(patt)
        send_data=cls.send_json(method="host") % ("host.get",ZABBIX_TOKEN)
        return_data=sendhttp(ZABBIX['default']['URL'],send_data)
        if return_data != 0:
            rets_t=return_data['result']
            for i_key in rets_t:
                if len(re.findall(patt1,i_key['name'])) > 0:
                    sys.append(i_key)
        return sys

    @classmethod
    def itemids(cls,item_key,host_list):
        global ZABBIX_TOKEN
        for host_o in host_list:
            print host_o
            send_data=cls.send_json(method="item") % ("item.get",host_o['hostid'],item_key,ZABBIX_TOKEN)
            return_data = sendhttp(ZABBIX['default']['URL'], send_data)
            if return_data != 0:
                rets_t=return_data['result'][0]['itemid']
                host_o['itemid']=rets_t
        return host_list



    @classmethod
    def history_data(cls,host_list):
        global ZABBIX_TOKEN
        ret={}
        ret['date'] = []
        ret['graph']={}
        ret['graph']['data']={}
        time_from=str(cls.time_date(time_type="minutes",interval=60))
        #time_till=str(time.time()).split('.')[0]
        #time_till=int(str(time.mktime(time.strptime(datetime.datetime.now(), "%Y-%m-%d %H:%M:%S"))).split('.')[0])
        #print datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        time_till = str(time.mktime(time.strptime(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), "%Y-%m-%d %H:%M:%S"))).split('.')[0]
        for host_item in host_list:
            #print host_item,host_item['itemid']
            #print type(host_item)
            send_data = cls.send_json(method="history") % ("history.get",host_item['itemid'], time_from, time_till,ZABBIX_TOKEN)
            return_data=sendhttp(ZABBIX['default']['URL'], send_data)
            if return_data != 0:
              #  print return_data['result']
                ret['graph']['data'][host_item['name']]=return_data['result']
                ret['graph']['type']='nginx.connections.active'
                for lock_data in return_data['result']:
                  #  print lock_data
                    if len(ret['date']) == 0:
                        print time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(float(lock_data['clock'])))
                        ret['date'].append(lock_data['clock'])
        return ret


    @classmethod
    def token_data(cls):
        global ZABBIX_TOKEN
        return ZABBIX_TOKEN


class FibonacciRpcClient(object):
    def __init__(self,host,username,password,httpwrite):
        credentials = pika.PlainCredentials(username, password)
        self.connection = pika.BlockingConnection(pika.ConnectionParameters(host=host,credentials=credentials))
        self.channel = self.connection.channel()
        self.httpwrite = httpwrite

        result = self.channel.queue_declare(exclusive=True)
        self.callback_queue = result.method.queue

        self.channel.basic_consume(self.on_response, no_ack=True,queue=self.callback_queue)

    def on_response(self, ch, method, props, body):
        if self.corr_id == props.correlation_id:
            body=json.loads(body)
            if body['pf'] == "read":
                self.response = body
            elif body['pf'] == "write":
                self.response = body
            elif body['pf'] == "backup_error":
                self.response = body
            self.httpwrite.write_message(body)

    def call(self, message,routing_key):
        self.response = None
        self.corr_id = str(uuid.uuid4())
        message=json.dumps(message)
        self.channel.basic_publish(exchange='',
                                   routing_key=routing_key,
                                   properties=pika.BasicProperties(
                                         reply_to = self.callback_queue,
                                         correlation_id = self.corr_id,
                                         ),
                                   body=message)
        while self.response is None:
           # print 'test'
            ret={}
            ret['status'] = True
            ret['pf'] = 'status'
            ret['msg'] = '.'
            time.sleep(1)
            self.connection.process_data_events()
            self.httpwrite.write_message(ret)
        #return int(self.response)
        return self.response

class FibonacciRpc_celery(object):
    def __init__(self, host, username, password):
        credentials = pika.PlainCredentials(username, password)
        self.connection = pika.BlockingConnection(pika.ConnectionParameters(host=host, credentials=credentials))
        self.channel = self.connection.channel()
        self.ret=[]

        result = self.channel.queue_declare(exclusive=True)
        self.callback_queue = result.method.queue

        self.channel.basic_consume(self.on_response, no_ack=True, queue=self.callback_queue)

    def on_response(self, ch, method, props, body):

        if self.corr_id == props.correlation_id:
            body = json.loads(body)
            if body['pf'] == "read":
                self.ret.append(body)
                self.response = self.ret
            elif body['pf'] == "write":
                self.ret.append(body)
                self.response = self.ret
            elif body['pf'] == "backup_error":
                self.ret.append(body)
                self.response = self.ret
            else:
                self.ret.append(body)


    def call(self, message, routing_key):
        self.response = None
        self.corr_id = str(uuid.uuid4())
        message = json.dumps(message)
        self.channel.basic_publish(exchange='',
                                   routing_key=routing_key,
                                   properties=pika.BasicProperties(
                                       reply_to=self.callback_queue,
                                       correlation_id=self.corr_id,
                                   ),
                                   body=message)
        while self.response is None:
            self.connection.process_data_events()
        # return int(self.response)
        return self.response
#fibonacci_rpc = FibonacciRpcClient()
#
#print(" [x] Requesting fib(30)")
#response = fibonacci_rpc.call(30)
#print(" [.] Got %r" % response)

def test_ssh(host,port,user,password):
    ret={}
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(hostname=host, port=port, username=user, password=password, timeout=5,allow_agent=False,look_for_keys=False)
        stdin, stdout, stderr = ssh.exec_command("/sbin/ifconfig", timeout=5)
        _IP = [host + ':{0}'.format(port)]
        ansible_api=AnsibleTask(targetHost=_IP,user=user,password_d=password)
        return_data=ansible_api.ansiblePlay(module='shell',args='echo 0')
        try:
            if return_data['stdout_lines'][0] != "0":
                Cmdb_log.error("ssh 连接测试-{0}".format(return_data))
        except Exception,e:
            ret['status'] = False
            ret['msg'] = 'ansible 连接异常'
            Cmdb_log.error("ssh 连接测试-{0}".format(return_data))
            return ret
        #print stdout.readlines()
        ssh.close()
        ret['status'] = True
        ret['msg'] ='连接成功'
    except Exception,e:
        ret['status'] = False
        ret['msg'] = '{0}'.format(e)
        Cmdb_log.error("ssh 连接测试-{0}".format(traceback.format_exc()))
    return ret


class RabbitMQAPI(object):
    '''Class for RabbitMQ Management API'''

    def __init__(self, user_name='guest', password='guest', host_name='',
                 protocol='http', port=15672):
        self.user_name = user_name
        self.password = password
        self.host_name = host_name or "127.0.0.1"
        self.protocol = protocol
        self.port = port

    def call_api(self, path,IP,queue,):
        '''
           All URIs will server only resource of type application/json,and will require HTTP basic authentication. The default username and password is guest/guest.  /%sf is encoded for the default virtual host '/'
        '''
        ret = False
        try:
            url = '{0}://{1}:{2}/api/{3}'.format(self.protocol, self.host_name, self.port, path)
            password_mgr = urllib2.HTTPPasswordMgrWithDefaultRealm()
            password_mgr.add_password(None, url, self.user_name, self.password)
            handler = urllib2.HTTPBasicAuthHandler(password_mgr)
            Cmdb_log.debug('Issue a rabbit API call to get data on ' + path)
            opener = urllib2.build_opener(handler)
            urllib2.install_opener(opener)
            pagehandle = urllib2.urlopen(url,timeout=3)
            pagehandle_load=json.loads(pagehandle.read())
            for i in pagehandle_load:
                if i['queue']['name'] == queue and i['channel_details']['peer_host'] == IP:
                    ret = True
                    Cmdb_log.info("rabbitmq  状态检测-{0}-{1}ok".format(IP, queue))
                    return ret
                else:
                    Cmdb_log.warning("rabbitmq 状态检测异常-{0}-{1}".format(IP,queue))
            return ret
        except:
            s=traceback.format_exc()
            Cmdb_log.error("rabbitmq  状态检测 - {0}".format(s))
            return ret


def task_state(task_id,sys):
    task_object = AsyncResult(task_id)
    if task_object.ready() == True:
        Taskqueue.objects.filter(task_id=task_id).update(task_status=True)
        Taskqueue.objects.filter(task_id=task_id).update(results_status=task_object.status)
        sys['task_status']="True"
        sys['results_status'] = task_object.status
    else:
        sys['task_status']="False"
        sys['results_status'] = task_object.status
    return sys


class Task_query(object):

    def __init__(self,task_id):
        self.task_id=task_id
        self.task_object = AsyncResult(self.task_id)

   # @classmethod
    def successful(self):
        return self.task_object.successful()

    def get(self,timeout=5):
        return self.task_object.get(timeout=timeout)

    def ready(self):
        return self.task_object.ready()



