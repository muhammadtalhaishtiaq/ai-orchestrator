"""
Multiple Linear Regression API Routes

Endpoints for CSV upload, validation, training, and predictions with multiple features.
"""

from fastapi import APIRouter, HTTPException
import numpy as np
import logging
import uuid
from typing import Dict, List
from collections import Counter
from sklearn.preprocessing import OneHotEncoder
from sklearn.model_selection import train_test_split

from .models import (
    TrainRequest, TrainResponse, PredictRequest, PredictResponse, CSVValidationResponse
)
from .service import MultipleLinearRegressionService

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Multiple Linear Regression"])

# In-memory storage for uploaded datasets
_UPLOADED_DATASETS: Dict[str, Dict] = {}

# Max rows allowed for training (shared hosting constraint)
MAX_ROWS = 100
MIN_ROWS = 2


def _is_missing(value: str) -> bool:
    """Check if value is missing/null."""
    if value is None:
        return True
    v = value.strip().lower()
    return v in {"", "nan", "null", "none"}


def _is_numeric(value: str) -> bool:
    """Check if value can be converted to float."""
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
    """
    Impute missing numeric values with column mean.
    Only applies imputation if missing values exist.
    """
    numeric = []
    has_missing = False
    
    for v in values:
        if _is_missing(v):
            numeric.append(np.nan)
            has_missing = True
        else:
            numeric.append(float(v))
    
    # Validate we have at least some valid values
    valid = [v for v in numeric if not np.isnan(v)]
    if not valid:
        raise HTTPException(status_code=400, detail="Selected numeric column has no valid values")
    
    # If no missing values, return as-is
    if not has_missing:
        return [float(v) for v in numeric]
    
    # Apply mean imputation
    mean_val = float(np.mean(valid))
    return [v if not np.isnan(v) else mean_val for v in numeric]


def _encode_categorical_onehot(values: List[str]) -> np.ndarray:
    """
    Encode categorical column using OneHotEncoder.
    Imputes missing values with mode before encoding.
    """
    cleaned = [v.strip() for v in values]
    non_missing = [v for v in cleaned if not _is_missing(v)]
    
    if not non_missing:
        raise HTTPException(status_code=400, detail="Selected categorical column has no valid values")
    
    # Impute missing with mode if needed
    if any(_is_missing(v) for v in cleaned):
        mode_val = Counter(non_missing).most_common(1)[0][0]
        filled = [mode_val if _is_missing(v) else v for v in cleaned]
    else:
        filled = cleaned
    
    # OneHotEncode
    encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
    encoded = encoder.fit_transform(np.array(filled).reshape(-1, 1))
    
    return encoded.astype(np.float32)


@router.post("/multiple-linear-regression/validate-csv", response_model=CSVValidationResponse)
async def validate_csv(request: dict) -> CSVValidationResponse:
    """
    Validate and parse uploaded CSV file for multiple linear regression.
    
    Returns column information and stores dataset for training.
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
        
        if len(headers) < 3:  # Need at least 2 features + 1 target
            raise HTTPException(
                status_code=400,
                detail="CSV must have at least 3 columns (2 features + 1 target)"
            )
        
        # Parse data rows
        column_data: Dict[str, List[str]] = {h: [] for h in headers}
        row_count = 0
        
        for i in range(1, len(lines)):
            line = lines[i].strip()
            if not line:
                continue
            
            values = [v.strip() for v in line.split(',')]
            
            if len(values) != len(headers):
                continue
            
            for col_idx, col_name in enumerate(headers):
                column_data[col_name].append(values[col_idx])
            
            row_count += 1
            
            if row_count > MAX_ROWS:
                raise HTTPException(
                    status_code=400,
                    detail=f"Too many rows ({row_count}). Maximum allowed: {MAX_ROWS}"
                )
        
        if row_count < MIN_ROWS:
            raise HTTPException(
                status_code=400,
                detail=f"Not enough valid rows. Found {row_count}, need at least {MIN_ROWS}"
            )
        
        # Identify column types
        column_types: Dict[str, str] = {}
        numeric_columns: List[str] = []
        categorical_columns: List[str] = []
        
        for col_name, values in column_data.items():
            col_type = _infer_column_type(values)
            column_types[col_name] = col_type
            
            if col_type == "numeric":
                numeric_columns.append(col_name)
            else:
                categorical_columns.append(col_name)
        
        # Generate dataset ID and store
        dataset_id = str(uuid.uuid4())
        
        # Build sample data preview
        sample_data = []
        for i in range(min(5, row_count)):
            row_dict = {col: column_data[col][i] for col in headers}
            sample_data.append(row_dict)
        
        # Store dataset
        _UPLOADED_DATASETS[dataset_id] = {
            "filename": filename,
            "columns": headers,
            "column_data": column_data,
            "column_types": column_types,
            "row_count": row_count
        }
        
        logger.info(f"CSV validated: {filename}, {row_count} rows, {len(headers)} columns, ID: {dataset_id}")
        
        return CSVValidationResponse(
            dataset_id=dataset_id,
            columns=headers,
            numeric_columns=numeric_columns,
            categorical_columns=categorical_columns,
            row_count=row_count,
            sample_data=sample_data
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"CSV validation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to validate CSV: {str(e)}")


@router.post("/multiple-linear-regression/train", response_model=TrainResponse)
async def train_model(request: TrainRequest) -> TrainResponse:
    """
    Train Multiple Linear Regression model with selected features.
    
    Applies preprocessing:
    - Numeric features: mean imputation if missing values exist
    - Categorical features: mode imputation + OneHotEncoding
    - Target: must be numeric, mean imputation if needed
    """
    try:
        # Retrieve dataset
        if request.dataset_id not in _UPLOADED_DATASETS:
            raise HTTPException(status_code=404, detail="Dataset not found. Please upload CSV first.")
        
        dataset = _UPLOADED_DATASETS[request.dataset_id]
        column_data = dataset["column_data"]
        column_types = dataset["column_types"]
        
        # Validate feature columns
        if len(request.feature_columns) < 1:
            raise HTTPException(status_code=400, detail="Must select at least 1 feature column")
        
        for col in request.feature_columns:
            if col not in column_data:
                raise HTTPException(status_code=400, detail=f"Feature column '{col}' not found")
        
        # Validate target column
        if request.target_column not in column_data:
            raise HTTPException(status_code=400, detail=f"Target column '{request.target_column}' not found")
        
        # Validate target is numeric
        if column_types[request.target_column] != "numeric":
            raise HTTPException(
                status_code=400,
                detail=f"Target column must be numeric, got {column_types[request.target_column]}"
            )
        
        # Build feature matrix X
        X_parts = []
        processed_feature_names = []
        
        for col in request.feature_columns:
            col_values = column_data[col]
            col_type = column_types[col]
            
            if col_type == "numeric":
                # Numeric: impute with mean if needed
                processed = _impute_numeric(col_values)
                X_parts.append(np.array(processed).reshape(-1, 1))
                processed_feature_names.append(col)
                
            else:
                # Categorical: OneHotEncode
                encoded = _encode_categorical_onehot(col_values)
                X_parts.append(encoded)
                
                # Generate feature names for each one-hot column
                n_categories = encoded.shape[1]
                for i in range(n_categories):
                    processed_feature_names.append(f"{col}_{i}")
        
        # Concatenate all feature columns
        X = np.hstack(X_parts).astype(np.float32)
        
        # Build target vector y
        y_values = column_data[request.target_column]
        y = np.array(_impute_numeric(y_values), dtype=np.float32)
        
        # Train/test split
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Train model
        service = MultipleLinearRegressionService()
        train_result = service.train(X_train, y_train, processed_feature_names)
        test_metrics = service.evaluate(X_test, y_test)
        
        # Combine results
        response = TrainResponse(
            coefficients=train_result["coefficients"],
            intercept=train_result["intercept"],
            feature_names=train_result["feature_names"],
            equation=train_result["equation"],
            r2_train=train_result["r2_train"],
            r2_test=test_metrics["r2_test"],
            adjusted_r2=test_metrics["adjusted_r2"],
            mse=test_metrics["mse"],
            rmse=test_metrics["rmse"],
            mae=test_metrics["mae"],
            samples_trained=len(X_train),
            samples_tested=test_metrics["samples_tested"],
            n_features=train_result["n_features"]
        )
        
        logger.info(f"MLR trained: R² = {response.r2_test:.4f}, Adjusted R² = {response.adjusted_r2:.4f}")
        
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Training error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Training failed: {str(e)}")


@router.post("/multiple-linear-regression/predict", response_model=PredictResponse)
async def predict(request: PredictRequest) -> PredictResponse:
    """
    Make a prediction using trained model coefficients.
    
    Prediction: y = intercept + sum(coef_i * x_i)
    """
    try:
        if len(request.features) != len(request.coefficients):
            raise HTTPException(
                status_code=400,
                detail=f"Feature count mismatch. Got {len(request.features)} features, expected {len(request.coefficients)}"
            )
        
        # Calculate prediction
        y_pred = request.intercept + sum(
            coef * feat for coef, feat in zip(request.coefficients, request.features)
        )
        
        # Build equation for display
        equation_parts = [f"{request.intercept:.2f}"]
        for coef, feat in zip(request.coefficients, request.features):
            sign = "+" if coef >= 0 else ""
            equation_parts.append(f"{sign}{coef:.2f}*{feat:.2f}")
        
        equation = " ".join(equation_parts) + f" = {y_pred:.2f}"
        
        return PredictResponse(
            features=request.features,
            y_pred=y_pred,
            equation=equation
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
