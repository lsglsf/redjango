#!/usr/bin/env python2.7
# -*- coding:utf-8 -*-
from __future__ import absolute_import
from celeryproj.celery import app
from service.views import http_url_data

import traceback
import os,json
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Management.settings")
from Cmdb.models import Asset
from Cmdb.methods.common import Mongodb_Operate,Zabbix_api,RabbitMQAPI,FibonacciRpc_celery,sendhttp
from Management.settings import MONGODB,BASE_DIR,RABBITMQ
LOG_BASE_LOG=os.path.join(BASE_DIR,"log","celery.log")
from celery.utils.log import get_task_logger,LoggingProxy
from Cmdb.methods.redis_connect import Auth_token_get
from Cmdb.methods.exception_class import TokenException

logger = get_task_logger(__name__)


@app.task
def add(x, y):
    return x + y

@app.task
def system_data():
    del_data=str(Zabbix_api.time_date(time_type='days',interval=1))
    import time
    print time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(float(del_data)))
    sys = ['system_disk', 'process_cpu_men', 'process_io', 'system_men']
    mongo = Mongodb_Operate(host=MONGODB['default']['HOST'],port=MONGODB['default']['PORT'])
    #connect=mongo.connet()
    try:
        for i in sys:
            try:
                db=mongo.connet_m[i]
                for table_i in db.collection_names():
                    table=db[table_i]
                    arg={"id":{"$lte":del_data}}
                    delete_data=table.remove(arg)
            except:
                logger.error("mongodb delete - {0}".format(traceback.format_exc()))
              #    print delete_data
        logger.info("mongodb delete - {0}".format(delete_data))
        return 0
    except:
        logger.error("mongodb delete - {0}".format(traceback.format_exc()))
        return 1


@app.task(bind=True)
def test1(self,x,y):
    logger.info('tesxxtt')
    logger.debug('ssss')
    return x+y

@app.task(bind=True)
def rabbit_release(self,client_data,t_host):
    """
     list directory
    :param client_data:
    :return:
    """
    rabbitmq_object = RabbitMQAPI(user_name=RABBITMQ['default']['USER'],
                                  password=RABBITMQ['default']['PASSWORD'],
                                  host_name=RABBITMQ['default']['HOST'])
    rabbitmq_status = rabbitmq_object.call_api(path='consumers', IP=t_host,
                                               queue=Asset.objects.get(ip=t_host).hostname)
    if rabbitmq_status:
        test = FibonacciRpc_celery(host=RABBITMQ['default']['HOST'], username=RABBITMQ['default']['USER'],
                                  password=RABBITMQ['default']['PASSWORD'],)
        test1 = test.call(message=client_data, routing_key=Asset.objects.get(ip=t_host).hostname)
        return test1
    else:
        ret = {}
        ret['status'] = False
        ret['data'] = "队列异常请查看日志"
        return ret



@app.task(bind=True)
@Auth_token_get()
def Http_send_rpc(self,data,*args,**kwargs):
    '''
    :param self:
    :param data:
    :return:
    '''
    print data
    print kwargs
    ret=[]
    if data['backup'] == True:
        backup_url = http_url_data(IP=data['t_host'],URL='BACKUP')
        backup_data={'token':kwargs['token'],'data':data['t_host_path']}
        backup_return = sendhttp(url=backup_url,data=json.dumps(backup_data),timeout=600)
        if backup_return['status'] == False and backup_return.get('msg',None) == "Token":
            raise TokenException()
        data['backup'] == False
        ret.append(backup_return)
        print backup_return
        if  backup_return['status']:
            sync_url = http_url_data(IP=data['t_host'],URL='SYNC')
            sync_data={'token':kwargs['token'],'data':data}
            sysnc_return=sendhttp(url=sync_url,data=json.dumps(sync_data),timeout=600)
            if sysnc_return['status'] == False and sysnc_return.get('msg',None) == "Token":
                raise TokenException()
#            return sysnc_return
        ret.append(sysnc_return)
    else:
        sync_url = http_url_data(IP=data['t_host'], URL='SYNC')
        sync_data = {
            'token': kwargs['token'],
            'data': data}
        sysnc_return = sendhttp(url=sync_url, data=json.dumps(sync_data), timeout=600)
        if sysnc_return['status'] == False and sysnc_return.get('msg', None) == "Token":
            raise TokenException()
        ret.append(sysnc_return)

    return ret
