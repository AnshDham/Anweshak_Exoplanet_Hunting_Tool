import pandas as pd
from abc import ABC,abstractmethod
from sklearn.preprocessing import LabelEncoder
import logging
logging.basicConfig(level=logging.INFO,format="%(asctime)s -%(levelname)s - %(message)s")

class Preprocessing(ABC):
    @abstractmethod
    def preprocess(self,df:pd.DataFrame)->pd.DataFrame:
        pass

class RemoveColumns(Preprocessing):
    def __init__(self,columns_to_remove:list):
        self.columns_to_remove=columns_to_remove
    def preprocess(self,df:pd.DataFrame,)->pd.DataFrame:
        logging.info(f"Removing columns: {self.columns_to_remove}")
        df=df.drop(columns=self.columns_to_remove,errors='ignore')
        logging.info(f"Columns removed successfully")
        return df
class MappingValues(Preprocessing):
    def __init__(self,column_name:str,mapping_dict:dict):
        self.column_name=column_name
        self.mapping_dict=mapping_dict
    def preprocess(self,df:pd.DataFrame)->pd.DataFrame:
        logging.info(f"Mapping values in column: {self.column_name}")
        if self.column_name in df.columns:
            df[self.column_name]=df[self.column_name].map(self.mapping_dict).astype(int)
        logging.info(f"Values mapped successfully")
        return df
class LabelEncoding(Preprocessing):
    def preprocess(self,df:pd.DataFrame)->pd.DataFrame:
        logging.info("Applying Label Encoding to categorical columns")
        categorical_cols=df.select_dtypes(include='object').columns.to_list()
        for col in categorical_cols:
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col])
        logging.info("Label Encoding applied successfully")
        return df
class PreprocessingFactory:
    @staticmethod
    def get_preprocessor(preprocess_type: str, **kwargs) -> Preprocessing:
        if preprocess_type == "remove_columns":
            return RemoveColumns(kwargs.get("columns_to_remove", []))
        elif preprocess_type == "map_values":
            return MappingValues(kwargs.get("column_name"), kwargs.get("mapping_dict", {}))
        elif preprocess_type == "label_encoding":
            return LabelEncoding()
        else:
            logging.error("Unsupported preprocessing type.")
            raise ValueError("Unsupported preprocessing type.")
