import pandas as pd 
from src.model_building import ModelFactory
from zenml import step
import logging
import sys
import os
from typing import Any
project_root = r"C:\Users\rk186\OneDrive\Desktop\NASA_challenge_2025"
config_path = os.path.join(project_root, "config.yaml")

project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)
logging.basicConfig(level=logging.INFO,format="%(asctime)s -%(levelname)s - %(message)s")

@step(enable_cache=False)
def model_building_step(model_type:str=None,
                        x_train:pd.DataFrame=None,
                        y_train:pd.Series=None,
                        experiment_name:str=None)->Any:
    model=ModelFactory().get_model(model_type=model_type).build_model(x_train=x_train,y_train=y_train,experiment_name=experiment_name)
    return model
    
@step(enable_cache=False)
def lstm_model_building_step(model_type:str,
                             x_train:pd.DataFrame,
                             x_test:pd.DataFrame,
                             y_train:pd.Series,
                             y_test:pd.Series,
                             experiment_name:str)->Any:
    model=ModelFactory().get_model(model_type=model_type).build_model(x_train=x_train,x_test=x_test,y_train=y_train,y_test=y_test,experiment_name=experiment_name)
    return model