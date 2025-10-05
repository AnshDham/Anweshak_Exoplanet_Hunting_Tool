import pandas as pd 
from src.handelling_missing_values import Impute
from zenml import step
import logging
import sys
import os
import yaml
project_root = r"C:\Users\rk186\OneDrive\Desktop\NASA_challenge_2025"
config_path = os.path.join(project_root, "config.yaml")

with open(config_path, 'r') as file:
    config = yaml.safe_load(file)
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)
logging.basicConfig(level=logging.INFO,format="%(asctime)s -%(levelname)s - %(message)s")

@step(enable_cache=False)
def handelling_nan_and_duplicate_step(df:pd.DataFrame)->pd.DataFrame:
    try:
        if not isinstance(df,pd.DataFrame):
            raise ImportError("Your data isnot pandas dataframe")
        fill_nan=Impute().fill_na().handle(df)
        handle_dup=Impute().handle_duplicates().handle(fill_nan)
        return handle_dup
    except FileNotFoundError:
            logging.error(f"Data not found.")
            raise