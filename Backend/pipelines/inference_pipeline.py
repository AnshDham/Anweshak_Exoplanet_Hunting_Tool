# pipelines/inference_pipeline.py
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models.k2_model import k2_pipeline
from models.koi_model import koi_pipeline
from models.tess_model import TESS_pipeline
from zenml import pipeline
from steps.dynamic_importer import dynamic_importer
from steps.predictor import predictor
from steps.prediction_service_loader import prediction_service_loader
from zenml.integrations.mlflow.steps import mlflow_model_deployer_step

@pipeline
def continuous_deployment_pipeline_k2():
    """K2 model deployment pipeline"""
    trained_model,_,_ = k2_pipeline()  
    mlflow_model_deployer_step(
        workers=3, 
        deploy_decision=True, 
        model=trained_model,
        model_name="k2"
    )

@pipeline
def continuous_deployment_pipeline_koi():
    """KOI model deployment pipeline"""
    trained_model,_,_ = koi_pipeline()  # You need to define this
    mlflow_model_deployer_step(
        workers=3, 
        deploy_decision=True, 
        model=trained_model,
        model_name="koi"
    )

@pipeline
def continuous_deployment_pipeline_tess():
    """TESS model deployment pipeline"""
    trained_model,_,_ = TESS_pipeline()  # You need to define this
    mlflow_model_deployer_step(
        workers=3, 
        deploy_decision=True, 
        model=trained_model,
        model_name="tess"
    )

@pipeline(enable_cache=False)
def inference_pipeline(model_type: str = "k2"):
    """
    Main inference pipeline that handles all three model types
    """
    # Import data for the specific model type
    batch_data, expected_columns = dynamic_importer(model_type=model_type)
    
    # Load the appropriate model deployment service
    model_deployment_service = prediction_service_loader(
        pipeline_name="continuous_deployment_pipeline",
        step_name="mlflow_model_deployer_step",
        model_type=model_type
    )
    
    # Make predictions
    predictions, probabilities = predictor(
        service=model_deployment_service,
        input_data=batch_data,
        expected_columns=expected_columns
    )
    
    return predictions, probabilities

if __name__ == "__main__":
    # Deploy all models
    continuous_deployment_pipeline_k2()
    continuous_deployment_pipeline_koi() 
    continuous_deployment_pipeline_tess()
    
    # Run inference for each model type
    for model_type in ["k2", "koi", "tess"]:
        print(f"Running inference for {model_type} model...")
        predictions, probabilities = inference_pipeline(model_type=model_type)
        print(f"{model_type.upper()} Predictions:", predictions)
        print(f"{model_type.upper()} Probabilities:", probabilities)
        
#python pipelines/inference_pipeline.py