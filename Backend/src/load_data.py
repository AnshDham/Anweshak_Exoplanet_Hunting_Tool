import pandas as pd
from abc import ABC,abstractmethod
import logging
logging.basicConfig(level=logging.INFO,format="%(asctime)s -%(levelname)s - %(message)s")

class Load_data(ABC):
    @abstractmethod
    def load(self,file_path:str)->pd.DataFrame:
        pass

class DataLoader(Load_data):
    def load(self, file_path:str):
        try:
            if not file_path.endswith(".csv"):
                logging.error("The provided file is not csv file.")
                raise ValueError("File format not supported. Please provide a CSV file.")
            logging.info(f"Loading data from {file_path}")
            data = pd.read_csv(file_path,comment="#")
            return data
        except FileNotFoundError:
            logging.error(f"File not found: {file_path}")
            raise
class DataLoaderFactory:
    @staticmethod
    def get_loader(file_type:str) -> Load_data:
        if file_type.endswith(".csv"):
            return DataLoader()
        else:
            logging.error("Unsupported file type. Only CSV files are supported.")
            raise ValueError("Unsupported file type. Only CSV files are supported.")                       