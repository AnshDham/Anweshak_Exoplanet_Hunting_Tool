import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.koi_model import koi_pipeline

koi_pipeline()