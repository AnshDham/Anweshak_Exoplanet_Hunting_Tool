# steps/predictor.py
import numpy as np 
import pandas as pd 
import json
from zenml import step
from zenml.integrations.mlflow.services import MLFlowDeploymentService
from typing import Tuple

@step(enable_cache=False)
def predictor(
    service: MLFlowDeploymentService, 
    input_data: str,
    expected_columns: list
) -> Tuple[np.ndarray, np.ndarray]:
    """
    Make predictions using the deployed service
    Returns predictions and probabilities
    """
    service.start(timeout=10)
    
    # Parse JSON data
    data = json.loads(input_data)
    data.pop("columns", None)
    data.pop("index", None)
    
    # Create DataFrame with expected columns
    df = pd.DataFrame(data["data"], columns=expected_columns)
    
    # Convert to format expected by MLflow
    json_list = json.loads(json.dumps(list(df.T.to_dict().values())))
    data_array = np.array(json_list)
    
    # Make prediction
    prediction = service.predict(data_array)
    
    # Extract predictions and probabilities
    if isinstance(prediction, dict) and 'predictions' in prediction:
        # Handle dictionary response with probabilities
        predictions = np.array([pred['prediction'] for pred in prediction['predictions']])
        probabilities = np.array([pred.get('probabilities', []) for pred in prediction['predictions']])
    elif isinstance(prediction, (list, np.ndarray)):
        # Handle array response
        predictions = np.array(prediction)
        probabilities = np.array([])  # Empty if no probabilities returned
    else:
        predictions = np.array([prediction])
        probabilities = np.array([])
    
    return predictions, probabilities