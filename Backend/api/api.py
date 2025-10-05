from fastapi import FastAPI,UploadFile,Form,File
from pydantic import BaseModel
import pandas as pd 
import numpy as np
import joblib
import os
import io
import sys
import logging
from typing import Dict,Any,List
from tensorflow.keras.models import load_model
logging.basicConfig(level=logging.INFO,format="%(asctime)s -%(levelname)s - %(message)s")
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(PROJECT_ROOT)
import yaml
from src.handelling_missing_values import Impute
from src.preprocessing import PreprocessingFactory
from fastapi.middleware.cors import CORSMiddleware
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
config_path = os.path.join(project_root, "config.yaml")
model_dir=os.path.join(project_root, 'models')
with open(config_path, 'r') as file:
    config = yaml.safe_load(file)
app=FastAPI(terms_of_service="Exoplanet Prediction Api",
            description="API with NASA, KOI, and TESS models",
            version="1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
required_columns = {
    "k2": [
        'sy_snum', 'sy_pnum', 'soltype', 'pl_orbper',
       'pl_orbpererr1', 'pl_orbpererr2', 'pl_orbperlim', 'pl_rade',
       'pl_radeerr1', 'pl_radeerr2', 'pl_radelim', 'pl_radj', 'pl_radjerr1',
       'pl_radjerr2', 'pl_radjlim', 'ttv_flag', 'st_teff', 'st_tefferr1',
       'st_tefferr2', 'st_rad', 'st_raderr1', 'st_raderr2', 'ra', 'dec',
       'sy_dist', 'sy_disterr1', 'sy_disterr2', 'sy_vmag', 'sy_kmag',
       'sy_kmagerr1', 'sy_kmagerr2', 'sy_gaiamag', 'sy_gaiamagerr1',
       'sy_gaiamagerr2'
    ],
    "koi": [
        'koi_pdisposition', 'koi_score', 'koi_fpflag_ss',
       'koi_fpflag_co', 'koi_fpflag_ec', 'koi_period', 'koi_period_err1',
       'koi_period_err2', 'koi_time0bk', 'koi_time0bk_err1',
       'koi_time0bk_err2', 'koi_impact', 'koi_duration',
       'koi_duration_err1', 'koi_duration_err2', 'koi_depth', 'koi_depth_err1',
       'koi_depth_err2', 'koi_prad', 'koi_prad_err1', 'koi_prad_err2',
       'koi_teq', 'koi_insol', 'koi_insol_err1', 'koi_insol_err2',
       'koi_model_snr', 'koi_tce_plnt_num', 'koi_tce_delivname', 'koi_steff',
       'koi_steff_err1', 'koi_steff_err2', 'koi_slogg', 'koi_slogg_err1',
       'koi_slogg_err2', 'koi_srad', 'koi_srad_err1', 'koi_srad_err2', 'ra',
       'dec', 'koi_kepmag'
    ],
    "tess": [
       'ra', 'dec', 'st_pmra', 'st_pmraerr1', 'st_pmraerr2',
       'st_pmdec', 'st_pmdecerr1', 'st_pmdecerr2', 'pl_tranmid',
       'pl_tranmiderr1', 'pl_tranmiderr2', 'pl_orbper', 'pl_orbpererr1',
       'pl_orbpererr2', 'pl_trandurh', 'pl_trandurherr1', 'pl_trandurherr2',
       'pl_trandep', 'pl_trandeperr1', 'pl_trandeperr2', 'pl_rade',
       'pl_radeerr1', 'pl_radeerr2', 'pl_insol', 'pl_eqt', 'st_tmag',
       'st_tmagerr1', 'st_tmagerr2', 'st_dist', 'st_disterr1', 'st_disterr2',
       'st_teff', 'st_tefferr1', 'st_tefferr2', 'st_logg', 'st_loggerr1',
       'st_loggerr2', 'st_rad', 'st_raderr1', 'st_raderr2'
    ]
}

#k2_model=load_model(r"C:\Users\rk186\OneDrive\Desktop\NASA_challenge_2025\models\k2_model.h5")
# koi_model=load_model(r"C:\Users\rk186\OneDrive\Desktop\NASA_challenge_2025\models\KOI_model.h5")
# k2_model=joblib.load(r"C:\Users\rk186\OneDrive\Desktop\NASA_challenge_2025\models\k2_model.joblib")
# tess_model=joblib.load(r"C:\Users\rk186\OneDrive\Desktop\NASA_challenge_2025\models\TESS_model.joblib")
koi_model = load_model(os.path.join(model_dir,'KOI_model.h5'))
k2_model = joblib.load(os.path.join(model_dir, 'k2_model.joblib'))
tess_model = joblib.load(os.path.join(model_dir, 'TESS_model.joblib'))
models={
    "k2":k2_model,
    "koi":koi_model,
    "tess":tess_model
}
class ManualEntry(BaseModel):
    data_type:str
    features:dict

@app.get("/")
def main():
    return {"message":"your api is running"}

@app.post("/predict/manual")
def predict_manual(entry:ManualEntry):
    data_type = entry.data_type.lower()
    if data_type not in models:
        return {"error": "Invalid data type. Choose from: k2, koi, tess"}
    
    df=pd.DataFrame([entry.features])
    model=models[data_type]
    if data_type == "k2":
        k2_fill_nan=Impute().fill_na().handle(df=df)
        k2_remove_dup=Impute().handle_duplicates().handle(k2_fill_nan)
        # k2_remove_col=PreprocessingFactory().get_preprocessor("remove_columns",columns_to_remove=config["k2_data"]["remove_col"]).preprocess(k2_remove_dup)
        k2_label=PreprocessingFactory().get_preprocessor("label_encoding").preprocess(k2_remove_dup)
        test=np.array(k2_label)
        prediction=model.predict(test)
        result_k2 = [
        "Non-Planet Candidate" if prediction[0] == 0 
        else "Confirmed Exoplanet" if prediction[0] == 1 
        else "Planet candidate" 
        ]

        return {
            "Prediction":result_k2
        }
    if data_type =="koi":
        koi_fill_nan=Impute().fill_na().handle(df=df)
        koi_remove_dup=Impute().handle_duplicates().handle(koi_fill_nan)
        # koi_remove_col=PreprocessingFactory().get_preprocessor("remove_columns",columns_to_remove=config["koi_data"]["remove_columns"]).preprocess(koi_remove_dup)
        koi_map_col1=PreprocessingFactory().get_preprocessor("map_values",column_name=config["koi_data"]["pdistribution"],mapping_dict=config["koi_data"]["pdis_map"]).preprocess(koi_remove_dup)
        koi_map_col2=PreprocessingFactory().get_preprocessor("map_values",column_name=config["koi_data"]["koi_tce_delivname"],mapping_dict=config["koi_data"]["koi_tce_delivname_map"]).preprocess(koi_map_col1)
        sample = np.array(koi_map_col2)
        x_input = sample.reshape((sample.shape[0], sample.shape[1], 1))
        predict_koi=model.predict(x_input)
        prediction_koi=np.argmax(predict_koi,axis=1)
        result_koi = [
        "Non-Planet Candidate" if prediction_koi[0] == 0 
        else "Confirmed Exoplanet" if prediction_koi[0] == 1 
        else "Planet candidate" 
        ]

        return {
            "Prediction":result_koi
        }
    elif data_type =="tess":
        tess_fill_nan=Impute().fill_na().handle(df=df)
        tess_remove_dup=Impute().handle_duplicates().handle(tess_fill_nan)
        tess_process=PreprocessingFactory().get_preprocessor("remove_columns",columns_to_remove=config["tess_data"]["remove_columns"]).preprocess(tess_remove_dup)
        predict_tess=model.predict(tess_process)
        result_tess = ["Non-Planet Candidate" if predict_tess[0] == 0 
        else "Confirmed Exoplanet" if predict_tess[0] == 1 
        else "Planet candidate" 
        ]
        return {
            "Prediction":result_tess
        }
    
@app.post("/predict/csv/")
async def predict_csv(data_type:str=Form(...),
                file:UploadFile=File(...)):
    print("data-type:",data_type)
    data_type=data_type.lower()
    if data_type not in models:
        return {"error": "Invalid data type. Choose from: k2, koi, tess"}
    contents=await file.read()
    # s=contents.decode("utf-8")
    df=pd.read_csv(io.BytesIO(contents))

    data= df[required_columns[data_type]]
    model=models[data_type]
    if data_type == "k2":
        df_k2_col_name=df[['pl_name','hostname']]
        k2_fill_nan=Impute().fill_na().handle(df=data)
        k2_remove_dup=Impute().handle_duplicates().handle(k2_fill_nan)
        k2_remove_col=PreprocessingFactory().get_preprocessor("remove_columns",columns_to_remove=config["k2_data"]["remove_col"]).preprocess(k2_remove_dup)
        k2_label=PreprocessingFactory().get_preprocessor("label_encoding").preprocess(k2_remove_col)
        x_test=np.array(k2_label)
        prediction=model.predict(x_test)
        result_k2 = [
        "Non-Planet Candidate" if pred == 0 
        else "Confirmed Exoplanet" if pred == 1 
        else " Planet candidate" 
        for pred in prediction.tolist()
        ]
        return {
            "Planet Name":df_k2_col_name["pl_name"].tolist(),
            "Host Name":df_k2_col_name["hostname"].tolist(),
            "Prediction":result_k2
        }
    if data_type =="koi":
        df_koi_col_name=df[["kepid",'kepoi_name']]
        koi_fill_nan=Impute().fill_na().handle(df=data)
        koi_remove_dup=Impute().handle_duplicates().handle(koi_fill_nan)
        koi_remove_col=PreprocessingFactory().get_preprocessor("remove_columns",columns_to_remove=config["koi_data"]["remove_columns"]).preprocess(koi_remove_dup)
        koi_map_col1=PreprocessingFactory().get_preprocessor("map_values",column_name=config["koi_data"]["pdistribution"],mapping_dict=config["koi_data"]["pdis_map"]).preprocess(koi_remove_col)
        koi_map_col2=PreprocessingFactory().get_preprocessor("map_values",column_name=config["koi_data"]["koi_tce_delivname"],mapping_dict=config["koi_data"]["koi_tce_delivname_map"]).preprocess(koi_map_col1)
        koi_map_col2=koi_fill_nan=Impute().fill_na().handle(df=koi_map_col2)
        x_test=np.array(koi_map_col2)
        x_test =x_test.reshape((x_test.shape[0], x_test.shape[1], 1))
        prediction=model.predict(x_test)
        prediction_koi=np.argmax(prediction,axis=1)
        result_koi = [
        "Non-Planet Candidate" if pred == 0 
        else "Confirmed Exoplanet" if pred == 1 
        else "Planet candidate" 
        for pred in prediction_koi.tolist()
        ]
        return {
            "Kepler Identification or KepID":df_koi_col_name["kepid"].tolist(),
            "KOI Name":df_koi_col_name["kepoi_name"].tolist(),
            "Prediction":result_koi
            }
    elif data_type =="tess":
        df_tess_col_name=df[["toi","toipfx","tid","ctoi_alias"]]
        tess_fill_nan=Impute().fill_na().handle(df=data)
        tess_remove_dup=Impute().handle_duplicates().handle(tess_fill_nan)
        tess_process=PreprocessingFactory().get_preprocessor("remove_columns",columns_to_remove=config["tess_data"]["remove_columns"]).preprocess(tess_remove_dup)
        tess_process=np.array(tess_process)
        predict_tess=model.predict(tess_process)
        result_tess = [
        "Non-Planet Candidate" if pred == 0 
        else "Confirmed Exoplanet" if pred == 1 
        else "Planet candidate" 
        for pred in predict_tess.tolist()
        ]
        return {
            "TESS Object of Interest":df_tess_col_name["toi"].tolist(),
            "TESS Object of Interest Prefix": df_tess_col_name["toipfx"].tolist(),
            "TESS Input Catalog ID":df_tess_col_name["tid"].tolist(),
            "Community TESS Object of Interest Alias":df_tess_col_name["ctoi_alias"].tolist(),
            "Prediction":result_tess
        }

