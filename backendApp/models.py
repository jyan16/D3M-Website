from djongo import models
from django.utils import timezone


class DataSet(models.Model):
    name = models.CharField(max_length=100, default='')
    most_recent_time = models.DateField(default=timezone.now())
    type = models.CharField(max_length=20)
    metric = models.CharField(max_length=40)

    def __str__(self):
        return self.name


class Result(models.Model):
    time = models.DateTimeField()

    Our_Score = models.FloatField()
    Our_Duration = models.IntegerField()
    Baseline_Score = models.FloatField()
    AutoSklearn_Score = models.FloatField()
    AutoSklearn_Duration = models.IntegerField()

    dataset = models.ForeignKey(DataSet, on_delete=models.CASCADE)

    def __str__(self):
        return self.dataset.__str__()





