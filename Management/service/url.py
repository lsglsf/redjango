from django.conf.urls import url
from django.contrib import admin
from views import *
import rests

urlpatterns = [
    url(r'^list/(?P<fun>\S*)/$',rests.Service.as_view(),name="service"),
]
