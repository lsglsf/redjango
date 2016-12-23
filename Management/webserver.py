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
from tornado.options import options, define
import os,ConfigParser
import json
from tornado.ioloop import IOLoop
import tornado.iostream
import socket


define('port', type=int, default=8080)
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Management.settings")

class Application(tornado.web.Application):
    def __init__(self,callback):
        handlers = [
#            (r"/", MainHandler),
#            (r"/auth/login", AuthLoginHandler),
#            (r"/auth/logout", AuthLogoutHandler),
            [('.*', tornado.web.FallbackHandler, dict(fallback=callback))]
        ]
        '''
        settings = dict(
            cookie_secret="__TODO:_GENERATE_YOUR_OWN_RANDOM_VALUE_HERE__",
            login_url="/auth/login",
            template_path=os.path.join(os.path.dirname(__file__), "templates"),
            static_path=os.path.join(os.path.dirname(__file__), "static"),
            xsrf_cookies=True,
            facebook_api_key=options.facebook_api_key,
            facebook_secret=options.facebook_secret,
            ui_modules={"Post": PostModule},
            debug=True,
            autoescape=None,
        )
        '''
        #settings=dict()
        tornado.web.Application.__init__(self, handlers)


class Connect_agent(object):

    stream_w=dict()

    def __init__(self,host,port,object_w,_id):
        self.host=host
        self.port=port
        self.object_w=object_w
        self.data=''
        #self.io_loop = io_loop
        self.stream=None
        self._id=_id
        self.EOF=b'\n'

    @gen.coroutine
    def callback_fun(self,data):
        print data
        yield self.stream.write(data+'\n')
        reply=yield self.stream.read_until(b'\n')
        self.object_w.write_message(reply)

    @gen.coroutine
    def send_message2(self):
        print self.host,self.port
        stream = yield TCPClient().connect(self.host, self.port)
        self.stream = stream
        if self.data['fun'] == "fun_file":
            yield stream.write((json.dumps(self.data) + "\n").encode())
            print self.data,'data'
            reply = yield stream.read_until(b"\n")
            print reply,'adsfs'
            self.object_w.write_message(reply)
        elif self.data['fun'] == "file_write":
            yield stream.write((json.dumps(self.data) + "\n").encode())
            while True:
                reply = yield stream.read_until(b"\n")
                self.object_w.write_message(reply)
                if json.loads(reply)['pf'] == 'write':
                    self.object_w.close()
                    break
        stream.close()
  #      del stream

#    @classmethod
    @property
    def test(cls):
        return cls.stream

    def start(self,data):
        self.data=data
        print 'sdfsa',data
        self.send_message2()

    def destroy(self):
        self.object_w.close()


class ChatSocketHandler(tornado.websocket.WebSocketHandler):
    waiters_d=dict()
    def get_client(self):
        return self.waiters_d.get(self._id(), None)

    def put_client(self):
        connect = Connect_agent('192.168.44.130','9888',self,self._id())
        print connect
        self.waiters_d[self._id()] = connect

    def remove_client(self):
        bridge = self.get_client()
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
        client_data=json.loads(message)
        print client_data['pf']
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

def main():
    parse_command_line()
    django.setup()
    wsgi_app=tornado.wsgi.WSGIContainer(
        django.core.handlers.wsgi.WSGIHandler()
    )

    settings = dict(
        debug=True
    )

    tornado_app=tornado.web.Application(
        [
            (r"/v1/sync_file/", ChatSocketHandler),
            ('.*',tornado.web.FallbackHandler,dict(fallback=wsgi_app))
        ],**settings
    )

    server = tornado.httpserver.HTTPServer(tornado_app)
    server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()

main()