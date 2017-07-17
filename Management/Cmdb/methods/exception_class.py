#coding:utf-8

class TokenException(Exception):
    def __init__(self,err='token timeout'):
        Exception.__init__(self,err)

