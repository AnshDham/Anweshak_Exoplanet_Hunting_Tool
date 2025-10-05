import sys
import os
import logging
from zenml import step
from typing import Any
import joblib
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
logging.basicConfig(level=logging.INFO,format="%(asctime)s -%(levelname)s - %(message)s")

@step(enable_cache=False)
def save_model_step(model:Any,
                    model_name:str)->str:
    os.makedirs("models",exist_ok=True)
    file_path=os.path.join("models",f"{model_name}.joblib")
    joblib.dump(model,file_path)
    logging.info(f"{model_name} model saved")
    return file_path
@step(enable_cache=False)
def dl_save_model_step(model:Any,model_name:str)->str:
    os.makedirs("models",exist_ok=True)
    file_path = os.path.join("models",f"{model_name}.h5")
    model.save(file_path)
    logging.info(f"Deep learning model '{model_name}' saved at: {file_path}")
    return file_path