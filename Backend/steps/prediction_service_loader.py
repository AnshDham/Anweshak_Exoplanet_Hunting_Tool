# steps/prediction_service_loader.py
from zenml import step
from zenml.integrations.mlflow.model_deployers import MLFlowModelDeployer
from zenml.integrations.mlflow.services import MLFlowDeploymentService
from typing import Dict

@step(enable_cache=False)
def prediction_service_loader(
    pipeline_name: str, 
    step_name: str,
    model_type: str = "k2"
) -> MLFlowDeploymentService:
    """
    Load the appropriate prediction service based on model type
    """
    # Modify pipeline name based on model type
    model_specific_pipeline_name = f"{pipeline_name}_{model_type}"
    
    model_deployer = MLFlowModelDeployer.get_active_model_deployer()
    
    existing_services = model_deployer.find_model_server(
        pipeline_name=model_specific_pipeline_name,
        pipeline_step_name=step_name,
        model_name=model_type
    )
    
    if not existing_services:
        raise RuntimeError(
            f"No MLflow prediction deployment found for {model_type} model. "
            f"Pipeline: {model_specific_pipeline_name}, Step: {step_name}"
        )
    
    return existing_services[0]