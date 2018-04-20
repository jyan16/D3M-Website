from django.utils.dateparse import parse_datetime


def get_time(file_dir):
    tmp = file_dir.split('/')[-1]
    tmp = tmp.split('.')[:3]
    return parse_datetime(':'.join(tmp))


def get_field(data, fields, index):
    for field in fields:
        if field in data.keys():
            return data[field][index]

    return None
