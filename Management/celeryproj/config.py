#!/usr/bin/env python2.7
# -*- coding:utf-8 -*-

BROKER_URL = 'amqp://192.168.2.224:5672//'
CELERY_RESULT_BACKEND = 'redis://127.0.0.1:6379/1'
CELERY_CREATE_MISSING_QUEUES = True
CELERY_TIMEZONE='Asia/Shanghai'

CELERY_TASK_RESULT_EXPIRES = 2592000

#CELERY_TASK_SERIALIZER = 'json'
#CELERY_RESULT_SERIALIZER = 'json'
#CELERY_ACCEPT_CONTENT= ['json']
#CELERY_TIMEZONE = 'Europe/Oslo'
#CELERY_ENABLE_UTC = True

# /opt/python2.7/bin/python2.7 /opt/python2.7/bin/celery -A celeryproj worker -B -l info -f log/celery.log