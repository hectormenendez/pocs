from os import path as Path
from yaml import load as Load
from yaml import BaseLoader

PATH = Path.dirname(Path.realpath(__file__ + "/../.."))
PATH_DATA = PATH + "/data"

CONF = Load(open(PATH + "/config.yaml", "r"), Loader=BaseLoader)
