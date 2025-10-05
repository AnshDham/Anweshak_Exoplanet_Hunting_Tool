import pandas as pd 
import joblib
import numpy as np
import logging
from typing import Dict,List,Union,Tuple
import os
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ModelManager:
    def __init__(self,models_config:Dict):
        self.models={}
        self.config=models_config
        self.load_all_models()