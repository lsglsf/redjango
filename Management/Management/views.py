from django.shortcuts import render_to_response,render
from django.http import HttpResponse
from settings import *
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
import  json
from Cmdb.methods.common import packageResponse
#from django.views.decorators.csrf import csrf_exempt
from django.contrib import auth

#def index(request):
    #print STATIC_ROOT,STATIC_URL
#    return render_to_response('index.html')

@ensure_csrf_cookie
def index(request):
    # save cur_space
    user = request.user
  #  user = json.dumps(user)
    print user
    response = render_to_response('index.html', {'user':user})
    return response


'''
@csrf_exempt
def login(request):
    ret={'user':'benet'}
    print request.POST
    if request.method == "POST":
        print 'sdfsa'
    return packageResponse(ret)
'''

@csrf_exempt
@ensure_csrf_cookie
def login(request):
    ret={}
    print request.POST
    if request.method == "POST":
        if request.POST.get('username') is not None and  request.POST.get('password'):
            user = auth.authenticate(username=request.POST.get('username'),password=request.POST.get('password'))
            if user is not None:
                 if user.is_active:
                     auth.login(request,user)
                     print request.user.username
                     ret['name']=request.user.username
        return packageResponse(ret)
    else:
        user=request.user.username
        response = render_to_response('index.html', {'name':user})
#        response.set_cookie("user","0FAC6FBASDS3213AX")
        return response


def logout(request):
     ret={'data':'logout'}
     return packageResponse(ret)
