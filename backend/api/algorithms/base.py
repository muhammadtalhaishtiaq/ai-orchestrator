"""
Base class for all ML algorithms.
Ensures consistent structure and workflow across all algorithms.

Standard ML Workflow:
0. Import libraries
1. Load dataset
2. Divide into features and labels
3. Preprocessing (null/NaN check, encoding, scaling if needed)
4. Split train/test data (0.2 test, 0.8 training)
5. Model training
6. Evaluation and metrics
7. Prediction with visualizations
"""

from abc import ABC, abstractmethod
from typing import Tuple, Dict, Any
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
import logging

logger = logging.getLogger(__name__)


class BaseMLAlgorithm(ABC):
    """
    Abstract base class for all machine learning algorithms.
    All algorithms must implement the standard workflow.
    """
    
    def __init__(self, test_size: float = 0.2, random_state: int = 42):
        """
        Initialize algorithm with common parameters.
        
        Args:
            test_size: Proportion of data to use for testing (default 0.2)
            random_state: Random seed for reproducibility
        """
        self.test_size = test_size
        self.random_state = random_state
        self.model = None
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.feature_names = None
        self.preprocessing_info = {}
    
    # ============================================
    # STEP 1: LOAD DATASET
    # ============================================
    def load_data(self, data: list) -> Tuple[np.ndarray, np.ndarray]:
        """
        Convert raw data points to numpy arrays.
        
        Args:
            data: List of data points with 'x' and 'y' keys
            
        Returns:
            Tuple of (X, y) arrays
        """
        X = np.array([d['x'] for d in data]).reshape(-1, 1)
        y = np.array([d['y'] for d in data])
        return X, y
    
    # ============================================
    # STEP 2: PREPROCESS
    # ============================================
    def check_data_quality(self, X: np.ndarray, y: np.ndarray) -> Dict[str, Any]:
        """
        Check for nulls, NaN, and other data quality issues.
        
        Args:
            X: Feature array
            y: Label array
            
        Returns:
            Dictionary with quality metrics
        """
        quality = {
            'X_shape': X.shape,
            'y_shape': y.shape,
            'X_nulls': int(np.isnan(X).sum()),
            'y_nulls': int(np.isnan(y).sum()),
            'X_min': float(np.nanmin(X)),
            'X_max': float(np.nanmax(X)),
            'y_min': float(np.nanmin(y)),
            'y_max': float(np.nanmax(y)),
        }
        return quality
    
    def handle_missing_values(self, X: np.ndarray, y: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        """
        Handle null and NaN values.
        """
        # Remove rows with NaN in X or y
        valid_mask = ~(np.isnan(X).any(axis=1) | np.isnan(y))
        X = X[valid_mask]
        y = y[valid_mask]
        return X, y
    
    def feature_scaling(self, X_train: np.ndarray, X_test: np.ndarray) -> Tuple[np.ndarray, np.ndarray]:
        """
        Standardize features (mean=0, std=1).
        Fit on training data, apply to test data.
        
        Args:
            X_train: Training features
            X_test: Testing features
            
        Returns:
            Tuple of (scaled_X_train, scaled_X_test)
        """
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        self.preprocessing_info['scaling'] = {
            'mean': float(self.scaler.mean_[0]) if len(self.scaler.mean_) == 1 else self.scaler.mean_.tolist(),
            'std': float(self.scaler.scale_[0]) if len(self.scaler.scale_) == 1 else self.scaler.scale_.tolist(),
        }
        
        return X_train_scaled, X_test_scaled
    
    @abstractmethod
    def preprocess(self, X: np.ndarray, y: np.ndarray, fit: bool = True) -> Tuple[np.ndarray, np.ndarray]:
        """
        Preprocess data (null handling, encoding, scaling, etc).
        Subclasses should implement algorithm-specific preprocessing.
        
        Args:
            X: Feature array
            y: Label array
            fit: Whether to fit scalers/encoders or just transform
            
        Returns:
            Tuple of (preprocessed_X, preprocessed_y)
        """
        pass
    
    # ============================================
    # STEP 3: SPLIT DATA
    # ============================================
    def split_data(self, X: np.ndarray, y: np.ndarray) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
        """
        Split data into train (0.8) and test (0.2) sets.
        
        Args:
            X: Feature array
            y: Label array
            
        Returns:
            Tuple of (X_train, X_test, y_train, y_test)
        """
        X_train, X_test, y_train, y_test = train_test_split(
            X, y,
            test_size=self.test_size,
            random_state=self.random_state
        )
        
        self.preprocessing_info['split'] = {
            'train_size': len(X_train),
            'test_size': len(X_test),
            'total_size': len(X),
            'test_percentage': self.test_size,
        }
        
        return X_train, X_test, y_train, y_test
    
    # ============================================
    # STEP 4: TRAIN MODEL (Abstract - Implement in subclass)
    # ============================================
    @abstractmethod
    def train(self, X_train: np.ndarray, y_train: np.ndarray) -> Dict[str, Any]:
        """
        Train the model on training data.
        Subclasses must implement the specific algorithm training.
        
        Args:
            X_train: Training features
            y_train: Training labels
            
        Returns:
            Dictionary with training results
        """
        pass
    
    # ============================================
    # STEP 5: EVALUATE
    # ============================================
    @abstractmethod
    def evaluate(self, X_test: np.ndarray, y_test: np.ndarray) -> Dict[str, Any]:
        """
        Evaluate model on test data.
        Subclasses implement algorithm-specific metrics.
        
        Args:
            X_test: Testing features
            y_test: Testing labels
            
        Returns:
            Dictionary with evaluation metrics
        """
        pass
    
    # ============================================
    # STEP 6: PREDICT
    # ============================================
    @abstractmethod
    def predict(self, X: np.ndarray) -> np.ndarray:
        """
        Make predictions on new data.
        
        Args:
            X: Feature array
            
        Returns:
            Predictions
        """
        pass
    
    # ============================================
    # STEP 7: FULL PIPELINE
    # ============================================
    async def train_full_pipeline(self, data: list) -> Dict[str, Any]:
        """
        Complete ML workflow from raw data to trained model.
        
        Steps:
        1. Load data
        2. Preprocess (null/NaN check, encoding, scaling)
        3. Split train/test
        4. Train model
        5. Evaluate
        
        Args:
            data: Raw data points
            
        Returns:
            Dictionary with full training results
        """
        try:
            # Step 1: Load
            logger.info("Step 1: Loading data...")
            X, y = self.load_data(data)
            quality = self.check_data_quality(X, y)
            logger.info(f"Data quality: {quality}")
            
            # Step 2: Preprocess
            logger.info("Step 2: Preprocessing data...")
            X, y = self.handle_missing_values(X, y)
            X, y = self.preprocess(X, y, fit=True)
            
            # Step 3: Split
            logger.info("Step 3: Splitting data...")
            X_train, X_test, y_train, y_test = self.split_data(X, y)
            
            # Step 4: Train
            logger.info("Step 4: Training model...")
            train_results = self.train(X_train, y_train)
            
            # Step 5: Evaluate
            logger.info("Step 5: Evaluating model...")
            eval_results = self.evaluate(X_test, y_test)
            
            # Combine results
            full_results = {
                'data_quality': quality,
                'preprocessing': self.preprocessing_info,
                'training': train_results,
                'evaluation': eval_results,
            }
            
            logger.info("Training pipeline completed successfully!")
            return full_results
            
        except Exception as e:
            logger.error(f"Pipeline error: {str(e)}")
            raise
