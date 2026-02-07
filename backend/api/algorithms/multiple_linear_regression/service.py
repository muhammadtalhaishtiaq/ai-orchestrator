"""
Multiple Linear Regression Service - Clean ML Engineer Approach

Extends simple linear regression to handle multiple independent variables.
Standard form: y = b0 + b1*x1 + b2*x2 + ... + bn*xn

Following the standard workflow:
1. Load dataset (with multiple features)
2. Split train/test
3. Train model
4. Predict
5. Evaluate (including adjusted R²)
6. Interpret coefficients
"""

import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error
from typing import Dict, Any, List
import logging

logger = logging.getLogger(__name__)


class MultipleLinearRegressionService:
    """
    Multiple Linear Regression Service.
    Handles multiple independent variables (features).
    
    Standard form: y = intercept + coef1*x1 + coef2*x2 + ... + coefn*xn
    """
    
    def __init__(self, test_size: float = 0.2, random_state: int = 42):
        """Initialize Multiple Linear Regression service."""
        self.test_size = test_size
        self.random_state = random_state
        self.model = LinearRegression()
        self.is_trained = False
    
    def train(self, X_train: np.ndarray, y_train: np.ndarray, feature_names: List[str]) -> Dict[str, Any]:
        """
        Train Multiple Linear Regression model.
        
        Args:
            X_train: Training features (n_samples, n_features)
            y_train: Training labels
            feature_names: Names of features for equation display
            
        Returns:
            Dictionary with model coefficients and metrics
        """
        # Train the model
        self.model.fit(X_train, y_train)
        self.is_trained = True
        
        # Get coefficients
        coefficients = self.model.coef_.tolist()
        intercept = float(self.model.intercept_)
        
        # Build equation string
        equation = self._build_equation(coefficients, intercept, feature_names)
        
        # Training metrics
        y_train_pred = self.model.predict(X_train)
        r2_train = r2_score(y_train, y_train_pred)
        
        logger.info(f"MLR trained: R² = {r2_train:.4f}, features = {len(feature_names)}")
        
        return {
            "coefficients": coefficients,
            "intercept": intercept,
            "equation": equation,
            "r2_train": r2_train,
            "feature_names": feature_names,
            "n_features": len(feature_names)
        }
    
    def evaluate(self, X_test: np.ndarray, y_test: np.ndarray) -> Dict[str, float]:
        """
        Evaluate model on test data.
        
        Args:
            X_test: Test features
            y_test: Test labels
            
        Returns:
            Dictionary with test metrics including adjusted R²
        """
        if not self.is_trained:
            raise ValueError("Model not trained yet")
        
        # Predictions
        y_pred = self.model.predict(X_test)
        
        # Metrics
        r2_test = r2_score(y_test, y_pred)
        mse = mean_squared_error(y_test, y_pred)
        rmse = np.sqrt(mse)
        mae = mean_absolute_error(y_test, y_pred)
        
        # Adjusted R² = 1 - [(1-R²) * (n-1) / (n-p-1)]
        # where n = number of samples, p = number of predictors
        n = len(y_test)
        p = X_test.shape[1]
        adjusted_r2 = 1 - ((1 - r2_test) * (n - 1) / (n - p - 1))
        
        return {
            "r2_test": r2_test,
            "adjusted_r2": adjusted_r2,
            "mse": mse,
            "rmse": rmse,
            "mae": mae,
            "samples_tested": n
        }
    
    def predict(self, X: np.ndarray) -> np.ndarray:
        """
        Make predictions.
        
        Args:
            X: Feature values (n_samples, n_features)
            
        Returns:
            Predicted values
        """
        if not self.is_trained:
            raise ValueError("Model not trained yet")
        
        return self.model.predict(X)
    
    def _build_equation(self, coefficients: List[float], intercept: float, feature_names: List[str]) -> str:
        """
        Build human-readable equation string.
        
        Example: y = 5000 + 150.5*Bedrooms - 200.3*Age + 50.2*Distance
        """
        equation = f"y = {intercept:.2f}"
        
        for coef, name in zip(coefficients, feature_names):
            sign = "+" if coef >= 0 else ""
            equation += f" {sign} {coef:.2f}*{name}"
        
        return equation
    
    def get_feature_importance(self) -> Dict[str, float]:
        """
        Get absolute coefficient values as a proxy for feature importance.
        Note: This assumes features are on similar scales.
        """
        if not self.is_trained:
            raise ValueError("Model not trained yet")
        
        return {
            "coefficients": self.model.coef_.tolist(),
            "intercept": float(self.model.intercept_)
        }
