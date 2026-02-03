from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import numpy as np
from io import StringIO
import csv
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# ============================================
# PYDANTIC MODELS
# ============================================

class DataPoint(BaseModel):
    x: float
    y: float

class TrainRequest(BaseModel):
    data: List[DataPoint]

class TrainResponse(BaseModel):
    slope: float
    intercept: float
    r_squared: float
    data_points: List[DataPoint]
    equation: str

class PredictRequest(BaseModel):
    slope: float
    intercept: float
    x_value: float

class PredictResponse(BaseModel):
    predicted_value: float
    equation: str

class SampleDataResponse(BaseModel):
    name: str
    description: str
    columns: List[str]
    data: List[DataPoint]

# ============================================
# HELPER FUNCTIONS
# ============================================

def calculate_linear_regression(data: List[DataPoint]) -> Dict[str, Any]:
    """Calculate linear regression coefficients and R² score"""
    if len(data) < 2:
        raise ValueError("Need at least 2 data points")
    
    x_values = np.array([p.x for p in data])
    y_values = np.array([p.y for p in data])
    
    n = len(data)
    sum_x = np.sum(x_values)
    sum_y = np.sum(y_values)
    sum_xy = np.sum(x_values * y_values)
    sum_x2 = np.sum(x_values ** 2)
    
    # Calculate slope and intercept
    slope = (n * sum_xy - sum_x * sum_y) / (n * sum_x2 - sum_x ** 2)
    intercept = (sum_y - slope * sum_x) / n
    
    # Calculate R² score
    y_mean = sum_y / n
    ss_total = np.sum((y_values - y_mean) ** 2)
    y_pred = slope * x_values + intercept
    ss_res = np.sum((y_values - y_pred) ** 2)
    r_squared = 1 - (ss_res / ss_total) if ss_total != 0 else 0
    
    return {
        "slope": float(slope),
        "intercept": float(intercept),
        "r_squared": float(r_squared),
    }

# ============================================
# SAMPLE DATASETS
# ============================================

SAMPLE_DATASETS = {
    "house_price": {
        "name": "House Price Prediction",
        "description": "Square Feet vs House Price (50 samples)",
        "columns": ["Square Feet", "Price"],
        "data": [
            DataPoint(x=1000, y=150000), DataPoint(x=1200, y=175000),
            DataPoint(x=1500, y=225000), DataPoint(x=1800, y=270000),
            DataPoint(x=2000, y=300000), DataPoint(x=2200, y=330000),
            DataPoint(x=2500, y=375000), DataPoint(x=2800, y=420000),
            DataPoint(x=3000, y=450000), DataPoint(x=3200, y=480000),
            DataPoint(x=1100, y=160000), DataPoint(x=1300, y=195000),
            DataPoint(x=1600, y=240000), DataPoint(x=1900, y=285000),
            DataPoint(x=2100, y=315000), DataPoint(x=2300, y=345000),
            DataPoint(x=2600, y=390000), DataPoint(x=2900, y=435000),
            DataPoint(x=3100, y=465000), DataPoint(x=3300, y=495000),
            DataPoint(x=950, y=140000), DataPoint(x=1150, y=170000),
            DataPoint(x=1450, y=215000), DataPoint(x=1750, y=260000),
            DataPoint(x=1950, y=290000), DataPoint(x=2150, y=325000),
            DataPoint(x=2450, y=365000), DataPoint(x=2750, y=410000),
            DataPoint(x=2950, y=440000), DataPoint(x=3150, y=470000),
            DataPoint(x=1050, y=155000), DataPoint(x=1250, y=185000),
            DataPoint(x=1550, y=235000), DataPoint(x=1850, y=280000),
            DataPoint(x=2050, y=310000), DataPoint(x=2250, y=340000),
            DataPoint(x=2550, y=380000), DataPoint(x=2850, y=425000),
            DataPoint(x=3050, y=455000), DataPoint(x=3275, y=488000),
        ]
    },
    "student_scores": {
        "name": "Student Scores",
        "description": "Study Hours vs Exam Score (18 samples)",
        "columns": ["Study Hours", "Exam Score"],
        "data": [
            DataPoint(x=2, y=45), DataPoint(x=3, y=52),
            DataPoint(x=4, y=58), DataPoint(x=5, y=65),
            DataPoint(x=6, y=72), DataPoint(x=7, y=78),
            DataPoint(x=8, y=82), DataPoint(x=9, y=88),
            DataPoint(x=10, y=92), DataPoint(x=1, y=35),
            DataPoint(x=2.5, y=48), DataPoint(x=3.5, y=55),
            DataPoint(x=4.5, y=62), DataPoint(x=5.5, y=68),
            DataPoint(x=6.5, y=75), DataPoint(x=7.5, y=80),
            DataPoint(x=8.5, y=85), DataPoint(x=9.5, y=90),
        ]
    }
}

# ============================================
# ENDPOINTS
# ============================================

@router.get("/algorithms/linear-regression/sample-data/{dataset_id}", response_model=SampleDataResponse)
async def get_sample_data(dataset_id: str):
    """Get sample dataset for testing"""
    if dataset_id not in SAMPLE_DATASETS:
        raise HTTPException(status_code=400, detail=f"Dataset '{dataset_id}' not found")
    
    dataset = SAMPLE_DATASETS[dataset_id]
    return SampleDataResponse(
        name=dataset["name"],
        description=dataset["description"],
        columns=dataset["columns"],
        data=dataset["data"]
    )

@router.post("/algorithms/linear-regression/train", response_model=TrainResponse)
async def train_linear_regression(request: TrainRequest):
    """Train a linear regression model"""
    try:
        if len(request.data) < 2:
            raise HTTPException(status_code=400, detail="Need at least 2 data points")
        
        result = calculate_linear_regression(request.data)
        
        equation = f"y = {result['slope']:.2f}x + {result['intercept']:.2f}"
        
        return TrainResponse(
            slope=result["slope"],
            intercept=result["intercept"],
            r_squared=result["r_squared"],
            data_points=request.data,
            equation=equation
        )
    except Exception as e:
        logger.error(f"Training error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/algorithms/linear-regression/predict", response_model=PredictResponse)
async def predict_linear_regression(request: PredictRequest):
    """Make a prediction using trained model"""
    try:
        predicted_value = request.slope * request.x_value + request.intercept
        equation = f"y = {request.slope:.2f}x + {request.intercept:.2f}"
        
        return PredictResponse(
            predicted_value=predicted_value,
            equation=equation
        )
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/algorithms/linear-regression/train-csv")
async def train_linear_regression_from_csv(
    file: UploadFile = File(...),
    x_column: str = Form(...),
    y_column: str = Form(...)
):
    """Train linear regression from uploaded CSV"""
    try:
        contents = await file.read()
        text_stream = StringIO(contents.decode())
        reader = csv.DictReader(text_stream)
        
        data = []
        for row in reader:
            try:
                x = float(row[x_column])
                y = float(row[y_column])
                data.append(DataPoint(x=x, y=y))
            except (ValueError, KeyError) as e:
                logger.warning(f"Skipping row due to invalid data: {e}")
                continue
        
        if len(data) < 2:
            raise HTTPException(status_code=400, detail="Need at least 2 valid data points")
        
        result = calculate_linear_regression(data)
        equation = f"y = {result['slope']:.2f}x + {result['intercept']:.2f}"
        
        return {
            "slope": result["slope"],
            "intercept": result["intercept"],
            "r_squared": result["r_squared"],
            "data_points": data,
            "equation": equation,
            "rows_processed": len(data)
        }
    except Exception as e:
        logger.error(f"CSV training error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
