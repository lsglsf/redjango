# -*- coding:utf-8 -*-
from django.shortcuts import render, get_object_or_404, render_to_response
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.template import loader, Context, RequestContext
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework import renderers
from rest_framework.decorators import api_view
from rest_framework.reverse import reverse
from rest_framework import generics
from django.conf import settings
import json
from methods.cmdb_fun import Methods
from methods.common import packageResponse

class Automation(APIView):
    def get(self,request,fun,format=None):
        ret = Methods.get('GET').get(fun)(request)
        return packageResponse(ret)

    def post(self,request,fun,format=None):
        ret = Methods.get('POST').get(fun)(request)
        return packageResponse(ret)

    def put(self,request,fun,format=None):
        method = request.POST.get('method')
        ret = Methods.get('PUT').get(fun)(request)
        return packageResponse(ret)




