from django.db import models
from django.utils import timezone


class DataSet(models.Model):
    name = models.CharField(max_length=100, default='')
    most_recent_time = models.DateField()
    type = models.CharField(max_length=20)
    metric = models.CharField(max_length=40)

    def __str__(self):
        return self.name


class Result(models.Model):
    time = models.DateTimeField()
    dataset = models.ForeignKey(DataSet, on_delete=models.CASCADE)

    def __str__(self):
        return self.dataset.__str__()


class Record(models.Model):
    method = models.CharField(max_length=50, null=False)
    score = models.FloatField(null=True)
    result = models.ForeignKey(Result, on_delete=models.CASCADE)

    def __str__(self):
        return self.method

