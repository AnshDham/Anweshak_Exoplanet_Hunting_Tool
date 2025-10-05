import pandas as pd 
import logging
import numpy as np
from sklearn.model_selection import train_test_split
from abc import ABC, abstractmethod

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

class DataSplitterStrategy(ABC):
    @abstractmethod
    def split_data(self, df: pd.DataFrame, target_col: str):
        pass

class SimpleTrainTestSplit(DataSplitterStrategy):
    def __init__(self, test_size: float = 0.2, random_state: int = 42):
        self.test_size = test_size
        self.random_state = random_state

    def split_data(self, df: pd.DataFrame, target_col: str):
        logging.info("Performing simple Train-Test-Split.")
        # Strip spaces from column names
        df.columns = df.columns.str.strip()

        # Check target column
        if target_col not in df.columns:
            logging.error(f"Target column '{target_col}' not found in DataFrame columns: {df.columns.tolist()}")
            raise KeyError(f"Target column '{target_col}' not found.")

        x = df.drop(columns=[target_col],axis=1)
        y = df[target_col]
        x_train, x_test, y_train, y_test = train_test_split(
            x, y, test_size=self.test_size, random_state=self.random_state
        )

        logging.info("Train-Test-Split completed.")
        return x_train, x_test, y_train, y_test

class DataSpliter:
    def __init__(self, strategy: DataSplitterStrategy):
        self.strategy = strategy

    def split(self, df: pd.DataFrame, target_col: str):
        logging.info("Splitting data..")
        return self.strategy.split_data(df, target_col)