import sys
import os


sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.k2_model import k2_pipeline

k2_pipeline()
