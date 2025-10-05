import pandas as pd 
from src.load_data import DataLoaderFactory
from zenml import step
import sys
import os
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)
@step(enable_cache=False)
def load_data_step(file_path:str)->pd.DataFrame:
    file_type=".csv"
    dataset =DataLoaderFactory().get_loader(file_type=file_type).load(file_path=file_path)
    return dataset