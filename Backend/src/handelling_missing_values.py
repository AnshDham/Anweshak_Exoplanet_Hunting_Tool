import pandas as pd
from abc import ABC,abstractmethod
import yaml
import os
import sys
project_root = r"C:\Users\rk186\OneDrive\Desktop\NASA_challenge_2025"
config_path = os.path.join(project_root, "config.yaml")
with open(config_path, 'r') as file:
    config = yaml.safe_load(file)
    
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)

import logging
logging.basicConfig(level=logging.INFO,format="%(asctime)s -%(levelname)s - %(message)s")

class Handler(ABC):
    @abstractmethod
    def handle(self,df:pd.DataFrame)->pd.DataFrame:
        pass

class DropingStrategy(Handler):
    def handle(self,df:pd.DataFrame)->pd.DataFrame:
        logging.info("Imputing missing values with mean for numerical columns and mode for categorical columns")
        for column in df.columns.to_list():
            missing_percentage=(df[column].isna().mean())*100
            if missing_percentage==0:
                continue
            if df[column].dtype == 'object':
                df[column].fillna(df[column].mode()[0],inplace=True)
            else:
                skew_val=df[column].skew()
                if missing_percentage > config["missing"]["percentage"]:
                    logging.info(f"Dropping column :{column} --> {missing_percentage:.1f}% missing")
                    df.drop(columns=[column],inplace=True)
                    continue
                if -1<skew_val<1:
                    df[column]=df[column].fillna(df[column].median())
                else:
                    df[column]=df[column].fillna(df[column].mean())
        return df
class HandellingDuplicates(Handler):
    def handle(self,df:pd.DataFrame)->pd.DataFrame:
        initial_shape=df.shape
        df=df.drop_duplicates()
        logging.info(f"Removed {initial_shape[0]-df.shape[0]} duplicate rows")
        return df
class Impute:
    @staticmethod
    def fill_na()->Handler:
        return DropingStrategy()
    @staticmethod
    def handle_duplicates()->Handler:
        return HandellingDuplicates()