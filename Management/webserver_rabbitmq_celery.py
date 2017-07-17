#coding:utf-8
import os
import sys
import django.core.handlers.wsgi
import tornado.httpserver
import tornado.ioloop
import tornado.web
import tornado.wsgi
from tornado.options import options, define, parse_command_line
import tornado.websocket
from tornado.iostream import StreamClosedError
import uuid
import tornado.escape
from tornado.options import options, define
import os,ConfigParser
import json
from tornado.ioloop import IOLoop
import tornado.iostream
import socket
#print os.path.dirname(os.path.abspath(__file__))
#sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Management.settings")
from handlers import Webservice_execute,PathlistHandler,auth_ip,WSHandler
from Management.settings import allow_ip,RABBITMQ
import logging
from Cmdb.methods.common import FibonacciRpcClient,RabbitMQAPI,sendhttp
from Cmdb.models import Asset
from service.models import Taskqueue
from IOLoop_ioloop import IOLoop
import traceback
from celeryproj import tasks


Cmdb_log = logging.getLogger("Cmdb_log")

define('port', type=int, default=8080)


class Application(tornado.web.Application):
    def __init__(self):
        wsgi_app = tornado.wsgi.WSGIContainer(
            django.core.handlers.wsgi.WSGIHandler()
        )
        handlers = [
            (r"/v1/sync_file/", ChatSocketHandler),
            (r"/v1/service_execute/", Webservice_execute),
            (r"/v1/path_list/", PathlistHandler),
            (r"/v1/sshsocket/", WSHandler),
            ('.*', tornado.web.FallbackHandler, dict(fallback=wsgi_app))
        ]

        settings = dict(
          #  cookie_secret="__TODO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__",
           # login_url="/auth/login",
            template_path=os.path.join(os.path.dirname(__file__), "templates"),
            static_path=os.path.join(os.path.dirname(__file__), "static"),
         #   xsrf_cookies=True,
         #   facebook_api_key=options.facebook_api_key,
         #   facebook_secret=options.facebook_secret,
         #   ui_modules={"Post": PostModule},
            debug=True,
         #   autoescape=None,
        )
        #settings=dict()
        super(Application, self).__init__(handlers, **settings)

class ChatSocketHandler(tornado.websocket.WebSocketHandler):
    waiters_d=dict()
    def get_client(self):
        return self.waiters_d.get(self._id(), None)

    def put_client(self):
        self.waiters_d[self._id()] = None

    def remove_client(self):
        bridge = self.get_client()
        if self.waiters_d[bridge] is not None:
            print bridge
            print self.waiters_d[bridge]
            if self.waiters_d[bridge].response is not None:
                self.waiters_d[bridge].response = "close"
        if bridge:
#            bridge.destroy()
            del self.waiters_d[self._id()]

    def check_origin(self, origin):
        return True

    def _id(self):
        return id(self)

    def get_compression_options(self):
        # Non-None enables compression with default options.
        return {}

   # @auth_ip()
    def open(self):
        self.put_client()


    def on_close(self):
        print 'test'
        self.remove_client()

    def on_message(self, message):
       # print self.waiters_d
        #print self._id()
        print message
        Cmdb_log.info("{0}-{1}".format("文件同步",message))
        print self.get_cookie('user')
        if self.get_cookie('user') == None:
            bridge = self.get_client()
            client_data=json.loads(message)
            if client_data['fun']=='fun_file':
                for i in client_data['t_host']:
                    try:
                        host_hostip=Asset.objects.get(id=Asset.objects.get(ip=i).host_hostname)
                        client_data['s_host']={}
                        client_data['s_host']['ip'] = host_hostip.ip
                        client_data['s_host']['username'] = host_hostip.username
                        client_data['s_host']['password'] = host_hostip.password
                        client_data['s_host']['port'] = host_hostip.port
                        for path_i in client_data['data']:
                           # print path_i['path'].strip()
                            path_i['path']=path_i['path'].strip()
                        print client_data
                        try:
                            app_name = client_data['app']
                            app_id = client_data['id']
                            host_path = Asset.objects.get(ip=host_hostip).register_set.get(service_name=app_name).path_project
                            t_host_path = Asset.objects.get(ip=i).register_set.get(id=app_id).path_project
                            client_data['s_host']['path'] = host_path
                            client_data['t_hosts']={}
                            client_data['t_hosts']['path']=t_host_path
                            client_data['t_hosts']['ip'] = i
                            rabbitmq_object=RabbitMQAPI(user_name=RABBITMQ['default']['USER'],password=RABBITMQ['default']['PASSWORD'],host_name=RABBITMQ['default']['HOST'])
                            rabbitmq_status=rabbitmq_object.call_api(path='consumers',IP=i,queue=Asset.objects.get(ip=i).hostname)
                            if rabbitmq_status:
                            #print client_data
                                test = FibonacciRpcClient(host=RABBITMQ['default']['HOST'],username=RABBITMQ['default']['USER'],password=RABBITMQ['default']['PASSWORD'], httpwrite=self)
                                test1 = test.call(message=client_data,routing_key=Asset.objects.get(ip=i).hostname)
                                #print test1
                                self.write_message(test1)
                            else:
                                ret = {}
                                ret['status'] = False
                                ret['data'] = "队列异常请查看日志"
                                self.write_message(ret)
                        except:
                            ret = {}
                            ret['status'] = False
                            ret['data'] = "预发布项目不存在-{0}".format(i)
                            self.write_message(ret)
                            Cmdb_log.error('{0}'.format(traceback.format_exc()))

                    except:
                        ret = {}
                        ret['status'] = False
                        ret['data'] = "预发布节点不存在-{0}".format(i)
                        self.write_message(ret)
                        Cmdb_log.error('{0}'.format(traceback.format_exc()))
            else:
                #print client_data
                ret={}
                app_id = client_data['id']
                host_hostip = Asset.objects.get(ip=client_data['s_host'])
                client_data['s_host'] = {}
                client_data['s_host']['ip'] = host_hostip.ip
                client_data['s_host']['username'] = host_hostip.username
                client_data['s_host']['password'] = host_hostip.password
                client_data['s_host']['port'] = host_hostip.port
                t_host = client_data['t_host']
                client_data['t_host'] = {}
                client_data['t_host']['ip'] = t_host
                # client_data['t_host']['path'] = Asset.objects.get(ip=t_host).register_set.get(id=app_id).path_project
                client_data['t_host']['path'] = Asset.objects.get(ip=t_host).register_set.get(id=app_id).path_project
                aa=tasks.rabbit_release.delay(client_data,t_host)
                ret['id']=aa.id
                ret['pf']='write'
                try:
                    create_task=Taskqueue.objects.create(task_name=aa,
                                             task_id=aa
                                             )
                    Taskqueue.objects.get(id=create_task.id).Register_Task.add(Asset.objects.get(ip=t_host).register_set.get(id=app_id))
                    ret['status'] = True
                except:
                    ret['status'] = False
                    ret['msg'] = '任务数据库更新失败'
                    print traceback.format_exc()
               # print '1111'
             #   print ret
                self.write_message(ret)
                self.close()
        else:
            self.close()

def _future_done(fu):
    fu.result()

def main():
    options.parse_config_file("webssh.conf")
    parse_command_line()
    django.setup()
    server = tornado.httpserver.HTTPServer(Application())
    server.listen(options.port)
    IOLoop.instance().start()
    tornado.ioloop.IOLoop.instance().start()

main()
