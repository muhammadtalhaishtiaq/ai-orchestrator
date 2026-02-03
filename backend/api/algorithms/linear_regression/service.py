"""
Linear Regression Service - Clean ML Engineer Approach

Following the standard workflow from ML A-Z course:
0. Import libraries
1. Load dataset
2. Split train/test
3. Train model
4. Predict
5. Evaluate
6. Visualize
"""

import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)



class LinearRegressionService:
    """
    Simple Linear Regression Service.
    No unnecessary abstractions - just clean ML code.
    
    Standard form: y = slope * x + intercept
    """
    
    def __init__(self, test_size: float = 0.2, random_state: int = 42):
        """Initialize Linear Regression service."""
        self.test_size = test_size
        self.random_state = random_state
        self.model = LinearRegression()
        self.is_trained = False
    
    def train(self, X_train: np.ndarray, y_train: np.ndarray) -> Dict[str, Any]:
        """
        Train Linear Regression model.
        
        Args:
            X_train: Training features
            y_train: Training labels
            
        Returns:
            Dictionary with model equation and metrics
        """
        # Train the model
        self.model.fit(X_train, y_train)
        self.is_trained = True
        
        # Get coefficients and intercept
        coefficients = self.model.coef_.tolist() if hasattr(self.model.coef_, "tolist") else [float(self.model.coef_)]
        intercept = float(self.model.intercept_)
        is_multi_feature = len(coefficients) > 1
        slope = float(coefficients[0]) if coefficients else 0.0
        
        # Calculate training metrics
        y_pred = self.model.predict(X_train)
        r2 = float(r2_score(y_train, y_pred))
        
        if is_multi_feature:
            terms = " + ".join([f"{coef:.4f}*x{i+1}" for i, coef in enumerate(coefficients)])
            equation = f"y = {intercept:.4f} + {terms}"
        else:
            equation = f"y = {slope:.4f}x + {intercept:.4f}"

        return {
            'slope': slope,
            'intercept': intercept,
            'coefficients': [float(c) for c in coefficients],
            'is_multi_feature': is_multi_feature,
            'equation': equation,
            'r2': r2,
            'samples_trained': len(X_train),
        }
    
    def predict(self, X: np.ndarray) -> np.ndarray:
        """Make predictions on new data."""
        if not self.is_trained:
            raise ValueError("Model not trained. Call train() first.")
        return self.model.predict(X)
    
    def predict_single(self, x_value: float) -> float:
        """Predict for a single value."""
        X = np.array([[x_value]])
        return float(self.predict(X)[0])
    
    def evaluate(self, X_test: np.ndarray, y_test: np.ndarray) -> Dict[str, Any]:
        """
        Evaluate model on test data.
        
        Args:
            X_test: Testing features
            y_test: Testing labels
            
        Returns:
            Dictionary with evaluation metrics
        """
        y_pred = self.predict(X_test)
        
        # Calculate metrics
        r2 = float(r2_score(y_test, y_pred))
        mse = float(mean_squared_error(y_test, y_pred))
        rmse = float(np.sqrt(mse))
        mae = float(mean_absolute_error(y_test, y_pred))
        
        return {
            'r2': r2,
            'mse': mse,
            'rmse': rmse,
            'mae': mae,
            'samples_tested': len(X_test),
        }
    
    def get_visualization_data(self, X: np.ndarray, y: np.ndarray) -> Dict[str, Any]:
        """
        Get data needed for visualizations.
        
        Returns data for regression line, residuals, and actual vs predicted.
        """
        y_pred = self.predict(X)
        residuals = y - y_pred
        
        # Create regression line points (only for single feature)
        regression_line = None
        if X.ndim == 2 and X.shape[1] == 1:
            x_min, x_max = X.min(), X.max()
            x_line = np.linspace(x_min, x_max, 100).reshape(-1, 1)
            y_line = self.predict(x_line)
            regression_line = {
                'x': x_line.flatten().tolist(),
                'y': y_line.tolist(),
            }
        
        return {
            'actual': y.tolist(),
            'predicted': y_pred.tolist(),
            'residuals': residuals.tolist(),
            'x_values': X.flatten().tolist(),
            'regression_line': regression_line,
        }
