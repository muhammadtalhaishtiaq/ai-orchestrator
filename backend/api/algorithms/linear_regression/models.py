"""
Pydantic models for Linear Regression API.
Simple, focused request/response schemas.
"""

from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional


class DataPoint(BaseModel):
    """Single (x, y) data point."""
    x: float
    y: float


class TrainRequest(BaseModel):
    """Request to train a Linear Regression model."""
    data: Optional[List[DataPoint]] = Field(None, description="Inline data points")
    dataset_id: Optional[str] = Field(None, description="Uploaded CSV dataset id")
    feature_column: Optional[str] = Field(None, description="Name of feature column")
    target_column: Optional[str] = Field(None, description="Name of target column")
    dataset_name: Optional[str] = Field(None, description="Name of dataset or CSV file")


class PredictRequest(BaseModel):
    """Request to make a prediction using model coefficients."""
    x: float = Field(..., description="Feature value")
    slope: float = Field(..., description="Model slope")
    intercept: float = Field(..., description="Model intercept")


class TrainResponse(BaseModel):
    """Response after training a Linear Regression model."""
    slope: float
    intercept: float
    equation: str
    r2_train: float
    r2_test: float
    mse: float
    rmse: float
    mae: float
    samples_trained: int
    samples_tested: int
    data_points: List[DataPoint]
    visualization_data: Dict[str, Any]
    coefficients: List[float]
    is_multi_feature: bool


class PredictResponse(BaseModel):
    """Response for a prediction."""
    x: float
    y_pred: float
    equation: str
