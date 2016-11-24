from django.conf.urls import url
from django.contrib import admin
from views import *
import rests

urlpatterns = [
    url(r'^list/(?P<fun>\S*)/$',rests.Cmdb.as_view(),name="Cmdb"),
   # usr(r'^')
]
