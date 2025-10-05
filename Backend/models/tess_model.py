import sys
import os
import yaml
project_root =  os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
config_path = os.path.join(project_root, "config.yaml")

with open(config_path, 'r') as file:
    config = yaml.safe_load(file)
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)

from zenml import pipeline
# from zenml.models import Model 
from steps.load_data_step import load_data_step
from steps.handelling_data_step import handelling_nan_and_duplicate_step
from steps.preprocess_step import preprocess_step
from steps.data_spliter_step import split_data_step
from steps.model_building_step import model_building_step
from steps.save_model_step import save_model_step

@pipeline(name="TESS_pipeline")
def TESS_pipeline():
    tess_data=load_data_step(r"C:\Users\rk186\OneDrive\Desktop\NASA_challenge_2025\data\TOI_2025.09.17_04.57.00.csv")
    tess_fll_nan=handelling_nan_and_duplicate_step(tess_data)
    remove_df=preprocess_step(tess_fll_nan,{"preprocess_type":"remove_columns",
                                          "columns_to_remove":config["tess_data"]["remove_columns"]})
    
    target_map=preprocess_step(remove_df,{"preprocess_type":"map_values",
                                          "column_name" :config["tess_data"]["target_column"],
                                          "mapping_dict":config["tess_data"]["target_map_values"]})
    
    x_train,x_test,y_train,y_test=split_data_step(target_map,config["tess_data"]["target_column"])
    tess_model=model_building_step("xgboost",x_train,y_train,"TESS_experiment")
    save_model=save_model_step(model=tess_model,model_name="TESS_model")
    return tess_model,save_model
#python pipelines/tess_pipeline.py