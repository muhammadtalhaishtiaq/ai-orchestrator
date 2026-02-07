"""
Pydantic models for Multiple Linear Regression API.
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional


class TrainRequest(BaseModel):
    """Request to train a Multiple Linear Regression model."""
    dataset_id: str = Field(..., description="Uploaded CSV dataset id")
    feature_columns: List[str] = Field(..., description="Names of feature columns")
    target_column: str = Field(..., description="Name of target column")


class TrainResponse(BaseModel):
    """Response after training a Multiple Linear Regression model."""
    coefficients: List[float]
    intercept: float
    feature_names: List[str]
    equation: str
    r2_train: float
    r2_test: float
    mse: float
    rmse: float
    mae: float
    adjusted_r2: float
    samples_trained: int
    samples_tested: int
    n_features: int


class PredictRequest(BaseModel):
    """Request to make a prediction using model coefficients."""
    features: List[float] = Field(..., description="Feature values in same order as training")
    coefficients: List[float] = Field(..., description="Model coefficients")
    intercept: float = Field(..., description="Model intercept")


class PredictResponse(BaseModel):
    """Response for a prediction."""
    features: List[float]
    y_pred: float
    equation: str


class CSVValidationResponse(BaseModel):
    """Response after validating uploaded CSV."""
    dataset_id: str
    columns: List[str]
    numeric_columns: List[str]
    categorical_columns: List[str]
    row_count: int
    sample_data: List[Dict[str, Any]]
