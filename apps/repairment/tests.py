import datetime
import time
from django.test import TestCase

# Create your tests here.

now = datetime.datetime.now()
print(now)
now_stamp = time.mktime(now.timetuple())
print(now_stamp)
