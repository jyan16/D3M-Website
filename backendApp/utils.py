from .config import *


def check_type(task_type):
    if task_type not in TYPE_SET:
        raise ValueError('type %s not in list!' % task_type)
    return task_type


def check_metric(metric):
    if metric not in METRIC_SET:
        raise ValueError('metric %s not in list' % metric)
    return metric
