import logging
import pandas as pd 
import numpy as np
from typing import Any
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report
from abc import ABC,abstractmethod
import mlflow 
logging.basicConfig(level=logging.INFO,format="%(asctime)s -%(levelname)s - %(message)s")

class ModelEvaluation(ABC):
    @abstractmethod
    def evaluate(self,model:Any,type_:str,x_test:pd.DataFrame,y_test:pd.Series)->float:
        pass
class AccuracyEvaluator(ModelEvaluation):
    def evaluate(self,model:Any,type_:str,x_test:pd.DataFrame,y_test:pd.Series)->float:
        try:
            logging.info("Evaluating model using accuracy score")
            if not isinstance(x_test,pd.DataFrame) or not isinstance(y_test,pd.Series):
                logging.error("Invalid input types. x_test should be a DataFrame and y_test should be a Series.")
                raise ValueError("Invalid input types. x_test should be a DataFrame and y_test should be a Series.")
            if x_test.empty or y_test.empty:
                logging.error("Input data is empty.")
                raise ValueError("Input data is empty.")
            if not isinstance(y_test,pd.Series):
                logging.error("y_test should be a pandas Series.")
                raise ValueError("y_test should be a pandas Series.")
            predictions = model.predict(x_test)
            metrics = {
                "accuracy": accuracy_score(y_test, predictions),
                "precision_macro": precision_score(y_test, predictions, average='macro', zero_division=0),
                "recall_macro": recall_score(y_test, predictions, average='macro', zero_division=0),
                "f1_macro": f1_score(y_test, predictions, average='macro', zero_division=0),
                "precision_weighted": precision_score(y_test, predictions, average='weighted', zero_division=0),
                "recall_weighted": recall_score(y_test, predictions, average='weighted', zero_division=0),
                "f1_weighted": f1_score(y_test, predictions, average='weighted', zero_division=0)
            }
            for metric_name,matric_value in metrics.items():
                mlflow.log_metric(f"{type_}_{metric_name}",matric_value)
                report =classification_report(y_test,predictions,output_dict=True)
                mlflow.log_dict(report,f"{type_}_classification_report.json")
                logging.info(f"{type_} Evaluation Metrics: {metrics}")
                logging.info("Model evaluation completed")
            return metrics
        except Exception as e:
            logging.error(f"Error occurred during model evaluation: {e}")
            raise
class DeepAccuracy(ModelEvaluation):
    def evaluate(self, model:Any, type_:str, x_test:pd.DataFrame, y_test:pd.Series)->float:
        try:
            logging.info("Model evaluation started for deep learning (LSTM)")
            if isinstance(x_test,pd.DataFrame):
                x_test = np.array(x_test)
            if isinstance(y_test,pd.Series):
                y_test = np.array(y_test)
            x_test = x_test.reshape((x_test.shape[0], x_test.shape[1], 1))
            _,acc=model.evaluate(x_test,y_test,verbose=1)
            logging.info(f"Deep learning evaluation completed. Accuracy: {acc}")
            return acc
        except Exception as e:
            logging.error(f"Error occurred during model evaluation: {e}")
            raise
class ModelEvaluationFactory:
    @staticmethod
    def get_evaluator(evaluation_type:str="accuracy")->ModelEvaluation:
        if evaluation_type=="accuracy":
            return AccuracyEvaluator()
        if evaluation_type=="dl":
            return DeepAccuracy()
        else:
            logging.error("Unsupported evaluation type.")
            raise ValueError("Unsupported evaluation type.")