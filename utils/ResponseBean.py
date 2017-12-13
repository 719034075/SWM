#!usr/bin/python
# -*- coding:utf-8 _*-

class ResponseBean:
    '''
    这是一个通用的返回bean
    '''

    def get_success_instance(self):
        self.success = True
        self.message = ''
        return self

    def get_fail_instance(self):
        self.success = False
        self.message = ''
        return self
