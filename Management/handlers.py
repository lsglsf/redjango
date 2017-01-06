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
import logging
import uuid
import tornado.escape
from tornado import gen
from tornado.tcpclient import TCPClient
from tornado.iostream import StreamClosedError
from tornado.options import options, define
import os,ConfigParser
import json
from tornado.ioloop import IOLoop
import tornado.iostream
import socket
#from Cmdb.models import Asset
import hashlib
dict_w={}

class Base_websockt(tornado.websocket.WebSocketHandler):
    pass

class Connect_agent(object):
    global dict_w

    def __init__(self,host,port,object_w):
        self.host=host
        self.port=port
        self.object_w=object_w
        self.data=''
        self.stream=''
        self.status=True
        self.hash_hash=''

    @gen.coroutine
    def callback_fun(self, data):
        print data
        yield self.stream.write(data + '\n')
        reply = yield self.stream.read_until(b'\n')
        self.object_w.write_message(reply)

    @gen.coroutine
    def send_message_new(self):
        try:
            stream = yield TCPClient().connect(self.host, self.port)
            self.stream = stream
            print self.data
            print self.host,self.port
            yield stream.write((json.dumps(self.data) + b"\n").encode())
            i1=0
            while self.status:
                i1+=1
                print '1111'
                reply = yield stream.read_until(b"\n")
                #reply=stream.read_until(b"\n")
                print type(json.loads(reply))
                print json.loads(reply)
                if type(json.loads(reply)) == dict:
                    reply = json.loads(reply)
                    reply['count'] = i1
                    reply = json.dumps(reply)
                    if json.loads(reply)['status'] == 'stop':
                        break
             #   self.object_w.write_message(reply)
             #   if json.loads(reply)['pf'] == 'write':
             #       self.object_w.close()
            #        break
                print dict_w[self.hash_hash]
                for i in dict_w[self.hash_hash]['stream']:
                    i.write_message(reply)
            print 'test'
            stream.close()
        except StreamClosedError:
            ret={}
            ret['status']='stop'
            ret['data']='连接客户端失败'
            for i in dict_w[self.hash_hash]['stream']:
                i.write_message(ret)
                i.close()
        except Exception as e:
            ret={}
            ret['status']='stop'
            ret['data']='连接客户端失败'
            for i in dict_w[self.hash_hash]['stream']:
                i.write_message(ret)
                i.close()

    def start(self, data):

        self.data = data
        print 'sdfsa', data
        self.send_message2()

    def hash_id(self,data):
        return hashlib.md5(data).hexdigest()

    def run(self,data):
        print 'run'
        self.data=data
  #      host = data['host']
        print data
        hashd_data='{1}-{0}'.format(self.host,data['path'])
        self.hash_hash=self.hash_id(hashd_data)
        if self.variable(self.hash_hash):
            print data
            print dict_w
            self.send_message_new()

    def variable(self,host):
        print host
        print dict_w
        id(self.object_w)
        ret=''
        if dict_w.get(host):
            dict_w[host]['stream'].append(self.object_w)
            ret=False
        else:
            dict_w[host]={}
            dict_w[host]['stream']=[self.object_w]
            ret=True
        return ret

    def connect(self):
        return TCPClient().connect(self.host, self.port)

    @gen.coroutine
    def destroy(self):
      #  host=self.data['host']
        print 'remove'
        print dict_w,'222'
        if self.remove_variable(self.hash_hash):
            print 'test11111111111111111'
            data={'path':self.data['path'],'fun':'service_execute','app':'stop'}
            yield self.stream.write((json.dumps(data) + b"\n").encode())
            self.status = False
        print dict_w,'111'

    def remove_variable(self,host):
        print host
        ret=''
        if len(dict_w[host]['stream']) == 1:
            print '1'
            dict_w.pop(host)
            print dict_w
            ret = True
        else:
            print '2'
            dict_w[host]['stream'].remove(self.object_w)
            print dict_w
            ret = False
        return ret





class Webservice_execute(tornado.websocket.WebSocketHandler):
    waiters_d = dict()
    def get_client(self):
        return self.waiters_d.get(self._id(), None)

    def put_client(self):
       # connect = Connect_agent('192.168.44.130', '9888',self)
        self.waiters_d[self._id()] = None

    def remove_client(self):
        bridge = self.get_client()
        if bridge:
            bridge.destroy()
            del self.waiters_d[self._id()]
            print self.waiters_d

    def check_origin(self, origin):
        return True

    def _id(self):
        return id(self)

    def get_compression_options(self):
        # Non-None enables compression with default options.
        return {}

    def open(self):
        self.put_client()

    def on_close(self):
        self.remove_client()

    @staticmethod
    def _is_init_data(data):
        return data['pf'] == 'init'

    @staticmethod
    def _check_init_param(data):
        return True

    def on_message(self, message):
        print self.waiters_d
        print self._id()
        # websocket_id=self._id()
        # webid_d=self.waiters_d.get(websocket_id,None)
        print message
        bridge = self.get_client()
        client_data = json.loads(message)
        if bridge == None:
            print 'None1'
            connect = Connect_agent(client_data['ip'], '9888',self)
            self.waiters_d[self._id()] = connect
            client_data['fun']='service_execute'
            connect.run(client_data)
        else:
        #client_data['path']="/var/log/messages"
            print 'None2'
            client_data['fun']='service_execute'
            bridge.run(client_data)
'''
        if self._is_init_data(client_data):
            print 'test'
            if self._check_init_param(client_data['data']):
                print 'aaaaa'
                #     bridge.connect_message(client_data['data'])
                bridge.start(client_data)
                #     self.io_loop.start()
                logging.info('connection established from: %s' % self._id())
            else:
                self.remove_client()
                logging.warning('init param invalid: %s' % client_data.data)
        else:
            if bridge:
                bridge.callback_fun(client_data)
'''