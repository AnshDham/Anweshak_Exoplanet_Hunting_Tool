import pandas as pd 
from src.preprocessing import PreprocessingFactory
from zenml import step
import logging
from typing import Dict, Any
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
logging.basicConfig(level=logging.INFO,format="%(asctime)s -%(levelname)s - %(message)s")

@step(enable_cache=False)
def preprocess_step(df:pd.DataFrame,
                    preprocess_config:Dict[str,Any],
                    )->pd.DataFrame:
    logging.info(f"Preprocessing config: {preprocess_config}")
    preprocessed_df=PreprocessingFactory().get_preprocessor(**preprocess_config).preprocess(df)
    return preprocessed_df