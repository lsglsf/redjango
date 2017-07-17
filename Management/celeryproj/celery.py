#!/usr/bin/env python2.7
# -*- coding:utf-8 -*-

from __future__ import absolute_import
from celery import Celery
from celery.schedules import crontab

app = Celery('celeryproj', include=['celeryproj.tasks'])
app.config_from_object('celeryproj.config')
'''
app.conf.beat_schedule = {
    # Executes every Monday morning at 7:30 a.m.
    'add-every-monday-morning': {
        'task': 'celeryproj.tasks.system_data',
        'schedule': crontab(hour=0, minute=30),
        'args':(),
    },
}
'''
'''
app.conf.beat_schedule = {
    # Executes every Monday morning at 7:30 a.m.
    'add-every-monday-morning': {
        'task': 'celeryproj.tasks.test',
        'schedule': crontab(),
        'args':(5,6),
    },
}
'''

if __name__ == '__main__':
    app.start()