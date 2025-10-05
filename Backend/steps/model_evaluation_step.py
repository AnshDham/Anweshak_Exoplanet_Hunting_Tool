import pandas as pd 
from src.model_evaluation import ModelEvaluationFactory
from zenml import step
import logging
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sklearn.base import BaseEstimator
logging.basicConfig(level=logging.INFO,format="%(asctime)s -%(levelname)s - %(message)s")

@step(enable_cache=False)
def model_evaluation_step(evaluation_type:str ="accuracy",
                          model:BaseEstimator=None,
                          type_:str=None,
                          x_test:pd.DataFrame=None,
                          y_test:pd.Series=None)->dict:
    evaluation = ModelEvaluationFactory().get_evaluator(evaluation_type=evaluation_type)
    result=evaluation.evaluate(model=model,type_=type_,x_test=x_test,y_test=y_test)
    return result
    