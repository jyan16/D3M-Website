from backendApp.utils import *
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def reformat_json():
    for filename in os.listdir(os.path.join(BASE_DIR, 'benchmark/results')):
        infile_dir = os.path.join(BASE_DIR, 'benchmark/results', filename)
        outfile_dir = os.path.join(BASE_DIR, 'benchmark/output', filename)
        reformat(infile_dir, outfile_dir)


def test_get_time():
    print(get_time('3/10/2018  5:46:33 PM'))


if __name__ == '__main__':
    test_get_time()