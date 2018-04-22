from django.utils.dateparse import parse_datetime
from django.utils.timezone import is_aware, make_aware
import json


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


def get_field(data, fields, index):
    for field in fields:
        if field in data.keys():
            return data[field][index]

    return None


def reformat(infile_dir, outfile_dir):
    with open(infile_dir, 'r') as in_file:
        data = json.load(in_file)
        with open(outfile_dir, 'w') as out_file:
            json.dump(data, out_file, indent=4)
