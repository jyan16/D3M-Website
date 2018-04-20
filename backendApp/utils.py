from django.utils.dateparse import parse_datetime
import json


def get_time(file_dir):
    tmp = file_dir.split('/')[-1]
    tmp = tmp.split('.')[:3]
    return parse_datetime(':'.join(tmp))


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
