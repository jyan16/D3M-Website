from django.utils.dateparse import parse_datetime
from django.utils.timezone import is_aware, make_aware
import json
from .models import *
import numpy as np


def get_time(time_str):
    tmp = time_str.split()
    date = tmp[0].split('/')
    date.reverse()
    date = '-'.join(date)
    time = tmp[1].split(':')
    time = ':'.join(time)
    date_time = date + 'T' + time
    ret = parse_datetime(date_time)
    if not is_aware(ret):
        ret = make_aware(ret)
    return ret


def reformat(infile_dir, outfile_dir):
    with open(infile_dir, 'r') as in_file:
        data = json.load(in_file)
        with open(outfile_dir, 'w') as out_file:
            json.dump(data, out_file, indent=4)


def add_statistic(cache, time):
    for class_type, methods in cache.items():
        for method, score_list in methods.items():
            statistic = Statistic.objects.create(
                time=time,
                type=class_type,
                score_avg=score_list[0] / score_list[1],
                method=method,
            )
            statistic.save()


def create_statistic(row):
    statistic = Statistic.objects.create(
        time=get_time(row.name[2]),
        method=row.name[0],
        type=row.name[1],
        score_avg=row.Score
    )
    statistic.save()
    return statistic


def get_statistic(value_list):

    tmp = np.array(value_list)
    hist, bins = np.histogram(tmp, bins=10, density=True)
    data = list()
    for i in range(0, 10):
        data.append((np.average(bins[i: i + 2]), hist[i]))

    ret = {
        'mean': np.mean(tmp),
        'median': np.median(tmp),
        'standard_deviation': np.std(tmp),
        'data': data
    }
    return ret

