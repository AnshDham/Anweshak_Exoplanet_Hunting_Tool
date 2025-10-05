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
from steps.model_building_step import lstm_model_building_step,model_building_step
from steps.save_model_step import dl_save_model_step,save_model_step
@pipeline(name="kepler(koi)_pipeline")
def koi_pipeline():
    koi_data=load_data_step(r"C:\Users\rk186\OneDrive\Desktop\NASA_challenge_2025\data\cumulative_2025.09.17_04.54.35.csv")
    koi_fll_nan=handelling_nan_and_duplicate_step(koi_data)
    remove_df=preprocess_step(koi_fll_nan,{"preprocess_type":"remove_columns",
                                          "columns_to_remove":config["koi_data"]["remove_columns"]})
    
    target_map=preprocess_step(remove_df,{"preprocess_type":"map_values",
                                          "column_name" :config["koi_data"]["target_column"],
                                          "mapping_dict":config["koi_data"]["target_map_values"]})
    
    target_map=preprocess_step(target_map,{"preprocess_type":"map_values",
                                          "column_name" :config["koi_data"]["pdistribution"],
                                          "mapping_dict":config["koi_data"]["pdis_map"]})
    
    target_map=preprocess_step(target_map,{"preprocess_type":"map_values",
                                          "column_name" :config["koi_data"]["koi_tce_delivname"],
                                          "mapping_dict":config["koi_data"]["koi_tce_delivname_map"]})
    x_train,x_test,y_train,y_test=split_data_step(target_map,config["koi_data"]["target_column"])
    koi_model=lstm_model_building_step("lstm_model",x_train,x_test,y_train,y_test,"Kepler(koi)_experiment")
    save_model=dl_save_model_step(model=koi_model,model_name="KOI_model")
    return koi_model,save_model
