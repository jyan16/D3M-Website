from backendApp.utils import *
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def reformat_json():
    for filename in os.listdir(os.path.join(BASE_DIR, 'benchmark/results')):
        infile_dir = os.path.join(BASE_DIR, 'benchmark/results', filename)
        outfile_dir = os.path.join(BASE_DIR, 'benchmark/output', filename)
        reformat(infile_dir, outfile_dir)


if __name__ == '__main__':
    reformat_json()