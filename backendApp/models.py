from djongo import models
from django.utils import timezone


class DataSet(models.Model):
    name = models.CharField(max_length=100, default='')
    most_recent_time = models.DateField(default=timezone.now())
    type = models.CharField(max_length=20)
    metric = models.CharField(max_length=30)

    def __str__(self):
        return self.name


class Result(models.Model):
    time = models.DateTimeField()

    RS_Score = models.FloatField()
    HB_Score = models.FloatField()
    BO_Score = models.FloatField()
    AP_Score = models.FloatField()
    Baseline_Score = models.FloatField()

    RS_Duration = models.IntegerField()
    HB_Duration = models.IntegerField()
    BO_Duration = models.IntegerField()
    AP_Duration = models.IntegerField()

    dataset = models.ForeignKey(DataSet, on_delete=models.CASCADE)





