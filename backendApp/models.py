from djongo import models
from django import forms
from django.utils import timezone


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

    class Meta:
        ordering = ['-time']


class ResultForm(forms.ModelForm):
    class Meta:
        model = Result
        fields = (
            'time',
            'RS_Score',
            'HB_Score',
            'BO_Score',
            'AP_Score',
            'Baseline_Score',
            'RS_Duration',
            'HB_Duration',
            'BO_Duration',
            'AP_Duration',
        )


class DataSet(models.Model):
    name = models.CharField(max_length=100, default='')
    most_recent_time = models.DateField(default=timezone.now())
    type = models.CharField(max_length=20)
    metric = models.CharField(max_length=30)
    train_results = models.ArrayReferenceField(
        to=Result,
        on_delete=models.CASCADE,
    )

    def __str__(self):
        return self.name


