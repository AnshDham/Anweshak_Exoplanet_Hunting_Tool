import logging
from abc import ABC,abstractmethod
from typing import Any
import pandas as pd 
import numpy as np
import yaml
import os
from sklearn.pipeline import Pipeline
import lightgbm
from  xgboost import XGBClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import StackingClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC

import lightgbm 
from sklearn.preprocessing import StandardScaler
import sys
import mlflow
import mlflow.sklearn
import tensorflow as tf
from tensorflow.keras.callbacks import EarlyStopping

project_root = r"C:\Users\rk186\OneDrive\Desktop\NASA_challenge_2025"
config_path = os.path.join(project_root, "config.yaml")

with open(config_path, 'r') as file:
    config = yaml.safe_load(file)
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)
logging.basicConfig(level=logging.INFO,format="%(asctime)s -%(levelname)s - %(message)s")

class ModelBuilding(ABC):
    @abstractmethod
    def build_model(self,x_train:pd.DataFrame,y_train:pd.Series,
                    experiment_name:str=None)->Any:
        pass
    
class RandomForestModel_k2(ModelBuilding):
    def build_model(self,x_train:pd.DataFrame,y_train:pd.Series,
                    experiment_name:str=None)->Any:
        try:
            if experiment_name:
                mlflow.set_experiment(experiment_name)
            logging.info("Building Random Forest Classifier model")
            if not isinstance(x_train,pd.DataFrame) or not isinstance(y_train,pd.Series):
                logging.error("Invalid input types. x_train should be a DataFrame and y_train should be a Series.")
                raise ValueError("Invalid input types. x_train should be a DataFrame and y_train should be a Series.")
            if x_train.empty or y_train.empty:
                logging.error("Input data is empty.")
                raise ValueError("Input data is empty.")
            if not isinstance(y_train,pd.Series):
                logging.error("y_train should be a pandas Series.")
                raise ValueError("y_train should be a pandas Series.")
            mlflow.sklearn.autolog()
            with mlflow.start_run(run_name="lightbgm_k2"):
                pipeline = Pipeline([
                    ('scaler', StandardScaler()),
                #     ('classifier', RandomForestClassifier(n_estimators=config["model_params"]["random_forest"]["n_estimators"], 
                #                                         random_state=config["model_params"]["random_forest"]["random_state"], 
                #                                         class_weight=config["model_params"]["random_forest"]["class_weight"]))
                    ("classification",lightgbm.LGBMClassifier(class_weight="balanced"))
                ])
                pipeline.fit(x_train, y_train)
                logging.info("Model training completed")
                return pipeline
        except Exception as e:
            logging.error(f"Error occurred while building model: {e}")
            raise
class stacking_model(ModelBuilding):
    def build_model(self,x_train:pd.DataFrame,y_train:pd.Series,experiment_name:str=None)->Any:
        try:
            if experiment_name:
                mlflow.set_experiment(experiment_name)
            logging.info("Building Stacking Classifier model")
            if not isinstance(x_train,pd.DataFrame) or not isinstance(y_train,pd.Series):
                logging.error("Invalid input types. x_train should be a DataFrame and y_train should be a Series.")
                raise ValueError("Invalid input types. x_train should be a DataFrame and y_train should be a Series.")
            if x_train.empty or y_train.empty:
                logging.error("Input data is empty.")
                raise ValueError("Input data is empty.")
            if not isinstance(y_train,pd.Series):
                logging.error("y_train should be a pandas Series.")
                raise ValueError("y_train should be a pandas Series.")
            mlflow.sklearn.autolog()
            with mlflow.start_run(run_name="Stacking_model"):
                estimators = [
                    ('lr', RandomForestClassifier(n_estimators=config["stacking_model"]["random_forest"]["n_estimators"], 
                                                random_state=config["stacking_model"]["random_forest"]["random_state"], 
                                                class_weight=config["stacking_model"]["random_forest"]["class_weight"],
                                                max_depth=config["stacking_model"]["random_forest"]["max_depth"],
                                                min_samples_split=config["stacking_model"]["random_forest"]["min_samples_split"],
                                                min_samples_leaf=config["stacking_model"]["random_forest"]["min_samples_leaf"],
                                                max_features=config["stacking_model"]["random_forest"]["max_features"])),
                    ('dt', DecisionTreeClassifier(random_state=config["stacking_model"]["decision_tree"]["random_state"],
                                                class_weight=config["stacking_model"]["decision_tree"]["class_weight"],
                                                max_depth=config["stacking_model"]["decision_tree"]["max_depth"],
                                                min_samples_split=config["stacking_model"]["decision_tree"]["min_samples_split"],
                                                min_samples_leaf=config["stacking_model"]["decision_tree"]["min_samples_leaf"],
                                                max_features=config["stacking_model"]["decision_tree"]["max_features"])),
                    ('lgbm', lightgbm.LGBMClassifier(class_weight=config["stacking_model"]["lightgbm"]["class_weight"],
                                                    learning_rate=config["stacking_model"]["lightgbm"]["learning_rate"],
                                                    random_state=config["stacking_model"]["lightgbm"]["random_state"],
                                                    n_estimators=config["stacking_model"]["lightgbm"]["n_estimators"],
                                                    max_depth=config["stacking_model"]["lightgbm"]["max_depth"],
                                                    min_child_samples=config["stacking_model"]["lightgbm"]["min_child_samples"],
                                                    subsample=config["stacking_model"]["lightgbm"]["subsample"],
                                                    colsample_bytree=config["stacking_model"]["lightgbm"]["colsample_bytree"],
                                                    reg_alpha=config["stacking_model"]["lightgbm"]["reg_alpha"],
                                                    reg_lambda=config["stacking_model"]["lightgbm"]["reg_lambda"]))
                ]
                clf = StackingClassifier(
                    estimators=estimators,
                    final_estimator=LogisticRegression(penalty=config["stacking_model"]["logistic_regression"]["penalty"],
                                                    C=config["stacking_model"]["logistic_regression"]["C"], 
                                                    class_weight=config["stacking_model"]["logistic_regression"]["class_weight"],
                                                    random_state=config["stacking_model"]["logistic_regression"]["random_state"],
                                                    max_iter=config["stacking_model"]["logistic_regression"]["max_iter"]),
                    cv=10,
                    passthrough=True,
                    n_jobs=-1
                    
                )
                pipeline = Pipeline([
                    ('scaler', StandardScaler()),
                    ('stacking_classifier', clf)
                ])
                pipeline.fit(x_train, y_train)
                logging.info("Model training completed")
                return pipeline
        except Exception as e:
            logging.error(f"Error occurred while building model: {e}")
            raise

class RandomForestModel_koi(ModelBuilding):
    def build_model(self,x_train:pd.DataFrame,y_train:pd.Series,experiment_name:str=None)->Any:
        try:
            if experiment_name:
                mlflow.set_experiment(experiment_name)
            logging.info("Building Random Forest Classifier model")
            if not isinstance(x_train,pd.DataFrame) or not isinstance(y_train,pd.Series):
                logging.error("Invalid input types. x_train should be a DataFrame and y_train should be a Series.")
                raise ValueError("Invalid input types. x_train should be a DataFrame and y_train should be a Series.")
            if x_train.empty or y_train.empty:
                logging.error("Input data is empty.")
                raise ValueError("Input data is empty.")
            if not isinstance(y_train,pd.Series):
                logging.error("y_train should be a pandas Series.")
                raise ValueError("y_train should be a pandas Series.")
            mlflow.sklearn.autolog()
            with mlflow.start_run(run_name="RandomForestModel_koi"):
                pipeline = Pipeline([
                    ('scaler', StandardScaler()),
                    ('classifier', RandomForestClassifier(n_estimators=config["stacking_model"]["random_forest"]["n_estimators"], 
                                                random_state=config["stacking_model"]["random_forest"]["random_state"], 
                                                class_weight=config["stacking_model"]["random_forest"]["class_weight"],
                                                max_depth=config["stacking_model"]["random_forest"]["max_depth"],
                                                min_samples_split=config["stacking_model"]["random_forest"]["min_samples_split"],
                                                min_samples_leaf=config["stacking_model"]["random_forest"]["min_samples_leaf"],
                                                max_features=config["stacking_model"]["random_forest"]["max_features"]))
                ])
                pipeline.fit(x_train, y_train)
                logging.info("Model training completed")
                return pipeline
        except Exception as e:
            logging.error(f"Error occurred while building model: {e}")
            raise
class deeplearninglstm(ModelBuilding):
    def build_model(self,x_train:pd.DataFrame,x_test:pd.DataFrame,
                    y_train:pd.Series,y_test:pd.Series,experiment_name : str =None)->Any:
        try:
            if experiment_name:
                mlflow.set_experiment(experiment_name)
            logging.info("Building LSTM model")
            
            if isinstance(x_train,pd.DataFrame):
                x_train = np.array(x_train)
            if x_test is not None and isinstance(x_test,pd.DataFrame):
                x_test =np.array(x_test)
            if isinstance(y_train,pd.Series):
                y_train = np.array(y_train)
            if y_test is not None and isinstance(y_test,pd.Series):
                y_test=np.array(y_test)
            x_train =x_train.reshape((x_train.shape[0], x_train.shape[1], 1))
            x_test = x_test.reshape((x_test.shape[0], x_test.shape[1], 1))
            
            mlflow.autolog()
            with mlflow.start_run(run_name="LSTM"):
                model=tf.keras.Sequential([
                    tf.keras.layers.LSTM(128,activation='tanh', return_sequences=True,input_shape=(x_train.shape[1],x_train.shape[2])),
                    tf.keras.layers.Dropout(0.2),
                    tf.keras.layers.LSTM(64,activation='tanh', return_sequences=False),
                    tf.keras.layers.Dense(32,activation="relu"),
                    tf.keras.layers.Dense(3,activation="softmax")
                ])
                early_stop = EarlyStopping(
                    monitor="val_loss",   
                    patience=config["deeplearning"]["patient"],           
                    restore_best_weights=True  
                )
                model.compile(optimizer="adam",loss="sparse_categorical_crossentropy",metrics=["accuracy"])
                model.fit(x_train,y_train,epochs=config["deeplearning"]["epoch"],validation_data=(x_test,y_test),callbacks=[early_stop])
                logging.info("LSTM model training completed")
                return model
        except Exception as e:
            logging.error(f"Error occurred while building LSTM model: {e}")
            raise
class xgboost(ModelBuilding):
    def build_model(self, x_train, y_train, experiment_name = None):
        try:
            if experiment_name:
                mlflow.set_experiment(experiment_name)
            logging.info("Building SVM model")
            if not isinstance(x_train,pd.DataFrame) or not isinstance(y_train,pd.Series):
                logging.error("Invalid input types. x_train should be a DataFrame and y_train should be a Series.")
                raise ValueError("Invalid input types. x_train should be a DataFrame and y_train should be a Series.")
            if x_train.empty or y_train.empty:
                logging.error("Input data is empty.")
                raise ValueError("Input data is empty.")
            if not isinstance(y_train,pd.Series):
                logging.error("y_train should be a pandas Series.")
                raise ValueError("y_train should be a pandas Series.")
            mlflow.sklearn.autolog()
            with mlflow.start_run(run_name="SVM_TESS"):
                pipeline = Pipeline([
                    ('scaler', StandardScaler()),
                    ('classifier',XGBClassifier(class_weight="balanced"))
                ])
                pipeline.fit(x_train, y_train)
                logging.info("Model training completed")
                return pipeline
        except Exception as e:
            logging.error(f"Error occurred while building model: {e}")
            raise
class ModelFactory:
    @staticmethod
    def get_model(model_type:str)->ModelBuilding:
        if model_type=="random_forest_k2":
            return RandomForestModel_k2()
        if model_type=="random_forest_koi":
            return RandomForestModel_koi()
        if model_type == "stacking_model":
            return stacking_model()
        if model_type=="lstm_model":
            return deeplearninglstm()
        if model_type =="xgboost":
            return xgboost()
        else:
            logging.error("Unsupported model type.")
            raise ValueError("Unsupported model type.")