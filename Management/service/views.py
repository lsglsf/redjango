from django.shortcuts import render

# Create your views here.


HTTP_RPC_URL={
    'TOKEN':'/v1/auth',
    'BACKUP':'/v1/file/backup/',
    'SYNC':'/v1/file/sync/',
    'CHECK':'/v1/file/check/',
    'CONFIG':'/v1/file/config/',
}

HTTP_RPC_PORT=9888

def http_url_data(IP,URL):
    url = "http://{0}:{1}{2}".format(IP,HTTP_RPC_PORT,HTTP_RPC_URL[URL])
    return url