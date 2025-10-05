import sys
import os
import yaml
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
config_path = os.path.join(project_root, "config.yaml")

with open(config_path, 'r') as file:
    config = yaml.safe_load(file)
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)

from zenml import pipeline
from steps.load_data_step import load_data_step
from steps.handelling_data_step import handelling_nan_and_duplicate_step
from steps.preprocess_step import preprocess_step
from steps.data_spliter_step import split_data_step
from steps.model_building_step import lstm_model_building_step,model_building_step
from steps.save_model_step import dl_save_model_step,save_model_step
from steps.model_evaluation_step import model_evaluation_step
@pipeline(name="k2_pipeline")
def k2_pipeline():
    k2_data=load_data_step(r"C:\Users\rk186\OneDrive\Desktop\NASA_challenge_2025\data\k2pandc_2025.09.17_04.48.32.csv")
    k2_fll_nan=handelling_nan_and_duplicate_step(k2_data)
    remove_df=preprocess_step(k2_fll_nan,{"preprocess_type":"remove_columns",
                                          "columns_to_remove":config["k2_data"]["remove_col"]})
    
    target_map=preprocess_step(remove_df,{"preprocess_type":"map_values",
                                          "column_name" :config["k2_data"]["target_col"],
                                          "mapping_dict":config["k2_data"]["map_values"]})
    
    label_cat=preprocess_step(target_map,{"preprocess_type":"label_encoding"})
    x_train,x_test,y_train,y_test=split_data_step(label_cat,config["k2_data"]["target_col"])
    k2_model=model_building_step("random_forest_k2",x_train,y_train,"k2_experiment")
    save_model=save_model_step(model=k2_model,model_name="k2_model")
    evaluation =model_evaluation_step("accuracy",type_="test",model=k2_model,x_test=x_test,y_test=y_test)
    return k2_model,save_model,evaluation
