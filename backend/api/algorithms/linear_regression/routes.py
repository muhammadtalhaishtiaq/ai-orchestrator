"""
Linear Regression API Routes - Clean Implementation

Endpoints for CSV upload, validation, training, and predictions.
Code execution is handled by Google Colab for better performance and security.
"""

from fastapi import APIRouter, HTTPException
import numpy as np
import logging
import uuid
from typing import Dict, List, Any
from collections import Counter
from sklearn.preprocessing import LabelEncoder, OneHotEncoder

from .models import (
    DataPoint, TrainRequest, TrainResponse, PredictRequest, PredictResponse
)
from .service import LinearRegressionService

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Linear Regression"])

# In-memory storage for uploaded datasets (in production, use Redis or database)
_UPLOADED_DATASETS: Dict[str, Dict] = {}

# Max rows allowed for training (shared hosting constraint)
MAX_ROWS = 100
MIN_ROWS = 2


def _data_to_arrays(data: list) -> tuple:
    """Convert data points to numpy arrays."""
    X = np.array([[d.x] for d in data], dtype=np.float32)
    y = np.array([d.y for d in data], dtype=np.float32)
    return X, y


def _is_missing(value: str) -> bool:
    if value is None:
        return True
    v = value.strip().lower()
    return v in {"", "nan", "null", "none"}


def _is_numeric(value: str) -> bool:
    if _is_missing(value):
        return True
    try:
        float(value)
        return True
    except (ValueError, TypeError):
        return False


def _infer_column_type(values: List[str]) -> str:
    """Return 'numeric' if all non-missing values are numeric, else 'categorical'."""
    for v in values:
        if not _is_numeric(v):
            return "categorical"
    return "numeric"


def _impute_numeric(values: List[str]) -> List[float]:
    numeric = []
    has_missing = False
    for v in values:
        if _is_missing(v):
            numeric.append(np.nan)
            has_missing = True
        else:
            numeric.append(float(v))
    valid = [v for v in numeric if not np.isnan(v)]
    if not valid:
        raise HTTPException(status_code=400, detail="Selected numeric column has no valid values")
    if not has_missing:
        return [float(v) for v in numeric]
    mean_val = float(np.mean(valid))
    return [v if not np.isnan(v) else mean_val for v in numeric]


def _encode_categorical_label(values: List[str]) -> List[float]:
    cleaned = [v.strip() for v in values]
    non_missing = [v for v in cleaned if not _is_missing(v)]
    if not non_missing:
        raise HTTPException(status_code=400, detail="Selected categorical column has no valid values")
    if any(_is_missing(v) for v in cleaned):
        mode_val = Counter(non_missing).most_common(1)[0][0]
        filled = [mode_val if _is_missing(v) else v for v in cleaned]
    else:
        filled = cleaned
    encoder = LabelEncoder()
    encoded = encoder.fit_transform(filled)
    return [float(v) for v in encoded]


def _encode_categorical_onehot(values: List[str]) -> np.ndarray:
    cleaned = [v.strip() for v in values]
    non_missing = [v for v in cleaned if not _is_missing(v)]
    if not non_missing:
        raise HTTPException(status_code=400, detail="Selected categorical column has no valid values")
    if any(_is_missing(v) for v in cleaned):
        mode_val = Counter(non_missing).most_common(1)[0][0]
        filled = [mode_val if _is_missing(v) else v for v in cleaned]
    else:
        filled = cleaned
    encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
    encoded = encoder.fit_transform(np.array(filled).reshape(-1, 1))
    return encoded.astype(np.float32)


@router.post("/linear-regression/validate-csv")
async def validate_csv(request: dict) -> dict:
    """
    Validate and parse uploaded CSV file.
    
    Checks:
    - Row count (max 100 for shared hosting)
    - Row count (max 100 for shared hosting)
    - Missing values
    - Column types (numeric/categorical)
    
    Returns:
    - row_count: Number of valid rows
    - columns: All column names
    - column_types: Dict of column name -> numeric/categorical
    - numeric_columns: List of columns inferred numeric (for defaults)
    - dataset_id: ID to retrieve this data for training
    """
    try:
        csv_content = request.get('csv_content', '')
        filename = request.get('filename', 'unknown.csv')
        
        if not csv_content:
            raise HTTPException(status_code=400, detail="Empty CSV file")
        
        # Parse CSV
        lines = csv_content.strip().split('\n')
        if len(lines) < 2:
            raise HTTPException(
                status_code=400,
                detail="CSV must have at least header + 1 data row"
            )
        
        # Extract headers
        headers = [h.strip() for h in lines[0].split(',')]
        
        if len(headers) < 2:
            raise HTTPException(
                status_code=400,
                detail="CSV must have at least 2 columns"
            )
        
        # Parse data and keep raw values
        column_data: Dict[str, List[str]] = {h: [] for h in headers}
        rows: List[List[str]] = []
        row_count = 0
        skipped_rows = 0
        
        for i in range(1, len(lines)):
            line = lines[i].strip()
            if not line:  # Skip empty lines
                continue
            
            values = [v.strip() for v in line.split(',')]

            if len(values) != len(headers):
                skipped_rows += 1
                continue

            rows.append(values)
            for col_idx, col_name in enumerate(headers):
                column_data[col_name].append(values[col_idx])
            row_count += 1
            if row_count > MAX_ROWS:
                raise HTTPException(
                    status_code=400,
                    detail=f"Too many rows ({row_count}). Maximum allowed: {MAX_ROWS} for fast processing on shared hosting"
                )
        
        # Check row count
        if row_count < MIN_ROWS:
            raise HTTPException(
                status_code=400,
                detail=f"Not enough valid data rows. Found {row_count}, need at least {MIN_ROWS}"
            )
        
        # Identify column types
        column_types: Dict[str, str] = {}
        numeric_columns: List[str] = []
        for col_name, values in column_data.items():
            col_type = _infer_column_type(values)
            column_types[col_name] = col_type
            if col_type == "numeric":
                numeric_columns.append(col_name)
        
        # Generate dataset ID and store
        dataset_id = str(uuid.uuid4())
        preview_rows = []
        for row in rows[:10]:
            preview_rows.append({headers[i]: row[i] for i in range(len(headers))})

        _UPLOADED_DATASETS[dataset_id] = {
            'filename': filename,
            'row_count': row_count,
            'skipped_rows': skipped_rows,
            'columns': headers,
            'column_types': column_types,
            'data': column_data,
            'preview_rows': preview_rows,
        }
        
        logger.info(
            f"CSV validated: {filename} - {row_count} rows, {len(numeric_columns)} numeric columns"
        )
        
        return {
            'success': True,
            'row_count': row_count,
            'skipped_rows': skipped_rows,
            'columns': headers,
            'column_types': column_types,
            'numeric_columns': numeric_columns,
            'preview_rows': preview_rows,
            'dataset_id': dataset_id,
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"CSV validation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error validating CSV: {str(e)}")


@router.post("/linear-regression/train", response_model=TrainResponse)
async def train_linear_regression(request: TrainRequest) -> TrainResponse:
    """
    Train a Linear Regression model.
    
    Args:
        request: Training data with (x, y) pairs
        
    Returns:
        Model equation, metrics, and visualization data
    """
    try:
        X = None
        y = None
        data_points: List[DataPoint] = []

        if request.dataset_id:
            dataset = _UPLOADED_DATASETS.get(request.dataset_id)
            if not dataset:
                raise HTTPException(status_code=404, detail="Uploaded dataset not found")

            if not request.feature_column or not request.target_column:
                raise HTTPException(status_code=400, detail="Feature and target columns are required")

            if request.feature_column not in dataset['columns']:
                raise HTTPException(status_code=400, detail="Invalid feature column")
            if request.target_column not in dataset['columns']:
                raise HTTPException(status_code=400, detail="Invalid target column")

            # Log column selection
            logger.info(
                f"Training Linear Regression: {request.feature_column} vs {request.target_column} "
                f"(dataset: {dataset.get('filename', 'uploaded')})"
            )

            feature_values = dataset['data'][request.feature_column]
            target_values = dataset['data'][request.target_column]

            feature_type = dataset['column_types'].get(request.feature_column)
            target_type = dataset['column_types'].get(request.target_column)

            # Preprocess feature
            if feature_type == "numeric":
                X_values = _impute_numeric(feature_values)
                X = np.array([[v] for v in X_values], dtype=np.float32)
                x_for_chart = X_values
            else:
                X = _encode_categorical_onehot(feature_values)
                x_for_chart = _encode_categorical_label(feature_values)

            # Preprocess target (must be numeric for linear regression)
            if target_type != "numeric":
                raise HTTPException(
                    status_code=400,
                    detail="Target column must be numeric for Linear Regression",
                )
            y_values = _impute_numeric(target_values)
            y = np.array(y_values, dtype=np.float32)
            data_points = [DataPoint(x=x_for_chart[i], y=y_values[i]) for i in range(len(y_values))]
        else:
            if not request.data or len(request.data) < 2:
                raise HTTPException(status_code=400, detail="Need at least 2 data points")

            # Log column selection if provided
            if request.feature_column and request.target_column:
                logger.info(
                    f"Training Linear Regression: {request.feature_column} vs {request.target_column} "
                    f"(dataset: {request.dataset_name or 'sample'})"
                )

            # Convert to numpy arrays
            X, y = _data_to_arrays(request.data)
            data_points = request.data

        if X is None or y is None:
            raise HTTPException(status_code=400, detail="Training data not available")
        
        # Split data
        split_idx = int(len(X) * 0.8)
        X_train, X_test = X[:split_idx], X[split_idx:]
        y_train, y_test = y[:split_idx], y[split_idx:]
        
        # Initialize and train service
        service = LinearRegressionService()
        train_result = service.train(X_train, y_train)
        eval_result = service.evaluate(X_test, y_test)
        viz_data = service.get_visualization_data(X, y)
        
        # Build response
        return TrainResponse(
            slope=train_result['slope'],
            intercept=train_result['intercept'],
            equation=train_result['equation'],
            r2_train=train_result['r2'],
            r2_test=eval_result['r2'],
            mse=eval_result['mse'],
            rmse=eval_result['rmse'],
            mae=eval_result['mae'],
            samples_trained=train_result['samples_trained'],
            samples_tested=eval_result['samples_tested'],
            data_points=data_points,
            visualization_data=viz_data,
            coefficients=train_result.get('coefficients', []),
            is_multi_feature=train_result.get('is_multi_feature', False),
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Training error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Training failed: {str(e)}")


@router.post("/linear-regression/predict", response_model=PredictResponse)
async def predict_with_equation(request: PredictRequest) -> PredictResponse:
    """
    Predict using a linear equation (y = slope*x + intercept).
    
    Args:
        request: Features and model coefficients
        
    Returns:
        Predicted value
    """
    try:
        x = request.x
        slope = request.slope
        intercept = request.intercept
        
        y_pred = slope * x + intercept
        
        return PredictResponse(
            x=x,
            y_pred=y_pred,
            equation=f"y = {slope:.4f} * {x} + {intercept:.4f}",
        )
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")


@router.get("/linear-regression/sample-data/{dataset_name}")
async def get_sample_data(dataset_name: str) -> dict:
    """
    Get sample datasets for learning.
    
    Available:
    - house_price: Square Feet vs House Price
    - student_scores: Study Hours vs Exam Score
    """
    datasets = {
        "house_price": {
            "name": "House Price Prediction",
            "description": "Square Feet vs House Price",
            "columns": ["Square Feet", "Price"],
            "data": [
                {"x": 1000, "y": 150000}, {"x": 1200, "y": 175000},
                {"x": 1500, "y": 225000}, {"x": 1800, "y": 270000},
                {"x": 2000, "y": 300000}, {"x": 2200, "y": 330000},
                {"x": 2500, "y": 375000}, {"x": 2800, "y": 420000},
                {"x": 3000, "y": 450000}, {"x": 3200, "y": 480000},
                {"x": 1100, "y": 160000}, {"x": 1300, "y": 195000},
                {"x": 1600, "y": 240000}, {"x": 1900, "y": 285000},
                {"x": 2100, "y": 315000}, {"x": 2300, "y": 345000},
                {"x": 2600, "y": 390000}, {"x": 2900, "y": 435000},
                {"x": 3100, "y": 465000}, {"x": 3300, "y": 495000},
                {"x": 950, "y": 140000}, {"x": 1150, "y": 170000},
                {"x": 1450, "y": 215000}, {"x": 1750, "y": 260000},
                {"x": 1950, "y": 290000}, {"x": 2150, "y": 325000},
                {"x": 2450, "y": 365000}, {"x": 2750, "y": 410000},
                {"x": 2950, "y": 440000}, {"x": 3150, "y": 470000},
                {"x": 1050, "y": 155000}, {"x": 1250, "y": 185000},
                {"x": 1550, "y": 235000}, {"x": 1850, "y": 280000},
                {"x": 2050, "y": 310000}, {"x": 2250, "y": 340000},
                {"x": 2550, "y": 380000}, {"x": 2850, "y": 425000},
                {"x": 3050, "y": 455000}, {"x": 3275, "y": 488000},
            ]
        },
        "student_scores": {
            "name": "Student Exam Scores",
            "description": "Study Hours vs Exam Score",
            "columns": ["Study Hours", "Exam Score"],
            "data": [
                {"x": 2, "y": 45}, {"x": 3, "y": 52},
                {"x": 4, "y": 58}, {"x": 5, "y": 65},
                {"x": 6, "y": 72}, {"x": 7, "y": 78},
                {"x": 8, "y": 82}, {"x": 9, "y": 88},
                {"x": 10, "y": 92}, {"x": 1, "y": 35},
                {"x": 2.5, "y": 48}, {"x": 3.5, "y": 55},
                {"x": 4.5, "y": 62}, {"x": 5.5, "y": 68},
                {"x": 6.5, "y": 75}, {"x": 7.5, "y": 80},
                {"x": 8.5, "y": 85}, {"x": 9.5, "y": 90},
            ]
        }
    }
    
    if dataset_name not in datasets:
        raise HTTPException(
            status_code=400,
            detail=f"Dataset '{dataset_name}' not found"
        )
    
    return datasets[dataset_name]
