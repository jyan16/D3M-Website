from django.test import TestCase, Client
from .test_utils import *
import json


# Create your tests here.
class ModelTestCase(TestCase):
    def setUp(self):
        set_up()

    def test_object_saved(self):
        # records save test
        records = Record.objects.filter(method='baseline').order_by('score')
        self.assertEqual(records.first().score, 0.13)
        self.assertEqual(records.count(), 2)

        # result query test
        results = DataSet.objects.get(name='num1').result_set.all()
        self.assertEqual(results.count(), 1)


class RequestTestCase(TestCase):
    def setUp(self):
        set_up()

    def test_get_all_request(self):
        c = Client()
        response = c.get('/all/')
        response = json.loads(response.content)
        self.assertEqual(response['ok'], True)
        self.assertEqual(len(response['data']), 1)
        self.assertEqual(response['statistic']['classification'][0]['baseline'], 0.13)



