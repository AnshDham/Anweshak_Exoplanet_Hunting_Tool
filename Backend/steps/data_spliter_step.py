import pandas as pd 
from src.data_splitter import DataSpliter,SimpleTrainTestSplit
from zenml import step
import logging
from typing import Tuple
import yaml
import os
import sys
project_root = r"C:\Users\rk186\OneDrive\Desktop\NASA_challenge_2025"
config_path = os.path.join(project_root, "config.yaml")

with open(config_path, 'r') as file:
    config = yaml.safe_load(file)
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)
logging.basicConfig(level=logging.INFO,format="%(asctime)s -%(levelname)s - %(message)s")

@step(enable_cache=False)
def split_data_step(df:pd.DataFrame,
                    target_column:str,
                    test_size:float=config["data_splitter"]["test_size"],
                    random_state:int=config["data_splitter"]["random_state"]
                    )-> Tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]:
    
    splitter =DataSpliter(SimpleTrainTestSplit(test_size=test_size,random_state=random_state))
    x_train,x_test,y_train,y_test =splitter.split(df=df,target_col=target_column)
    return x_train,x_test,y_train,y_test