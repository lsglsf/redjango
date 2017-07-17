#coding:utf-8
import redis,json
from Management.settings import REDIS,AUTHKEYS
from service.views import  http_url_data
from common import sendhttp,CRYPTOR
from exception_class import TokenException

def operator_status(func):
    '''''get operatoration status
    '''
    def gen_status(*args, **kwargs):
        error, result = None, None
        try:
            result = func(*args, **kwargs)
        except Exception as e:
            error = str(e)
        return {'result': result, 'error': error}
    return gen_status


class RedisCache(object):
    def __init__(self):
        if not hasattr(RedisCache, 'pool'):
            RedisCache.create_pool()
        self._connection = redis.Redis(connection_pool=RedisCache.pool)

    @staticmethod
    def create_pool():
        RedisCache.pool = redis.ConnectionPool(
            host=REDIS['default']['HOST'],
            port=REDIS['default']['PORT'],
            db=REDIS['default']['DB'])

    @operator_status
    def set_data(self, key, value):
        '''''set data with (key, value)
        '''
        return self._connection.set(key, value)

    @operator_status
    def get_data(self, key):
        '''''get data by key
        '''
        return self._connection.get(key)

    @operator_status
    def del_data(self, key):
        '''''delete cache by key
        '''
        return self._connection.delete(key)

def Auth_token_get():
    '''
    token 认证
    :return:
    '''
    def fun_m(fun):
        def fun_p(request,*args, **kwargs):
            ret={}
            print args,kwargs
            print request,'11111'
            if  args:
                host=args[0]['t_host']
            else:
                if request.GET.get('ip',None) != None:
                    host=request.GET.get('ip',None)
                elif request.POST.get('ip',None) != None:
                    host=request.POST.get('ip',None)
                else:
                    host = json.loads(request.POST.get('data'))['host']
            redis_token = RedisCache().get_data(host)
#            print redis_token
            if redis_token['result'] != None and redis_token['error'] == None:
                try:
                    data_return = fun(request,token=redis_token['result'],*args,**kwargs)
                except Exception,e:
                    #print e
                    token_http = Token_get(host=host, url='TOKEN')['token']
                    if token_http:
                        RedisCache().set_data(host, token_http)
                        data_return = fun(request, token=token_http, *args, **kwargs)
                        ret = data_return
                    else:
                        ret['status'] = False
                        ret['data'] = 'authentication failure'

                ret = data_return
            elif redis_token['result'] == None and redis_token['error'] == None:
                token_http=Token_get(host=host,url='TOKEN')['token']
                if  token_http:
                    RedisCache().set_data(host,token_http)
                    data_return = fun(request, token=token_http, *args, **kwargs)
                    ret=data_return
                else:
                    ret['status'] = False
                    ret['data'] = 'authentication failure'
            else:
                ret['status'] = False
                ret['data'] = redis_token['error']
            return ret
        return fun_p
    return fun_m

def Token_get(host,url):
    token_url = http_url_data(IP=host, URL=url)
    data = {
        'AUTHKEYS': CRYPTOR.encrypt(AUTHKEYS)
    }
    return sendhttp(url=token_url, data=json.dumps(data))