"""Machine Learning Algorithms Package

Modular architecture for all ML algorithms.
Each algorithm follows the standard Udemy ML workflow:

0. Import libraries (scikit-learn, numpy, pandas, matplotlib)
1. Load dataset
2. Divide into features and labels
3. Preprocessing (null/NaN check, encoding, scaling)
4. Split train/test data (0.2 test, 0.8 training)
5. Model training
6. Evaluation and metrics
7. Prediction with visualizations

Structure:
- base.py: AbstractBaseClass for all algorithms
- linear_regression/: Implements Linear Regression with full workflow
- logistic_regression/: Logistic Regression (TODO)
- decision_tree/: Decision Tree (TODO)
- ... and 12 more algorithms

Each algorithm package contains:
- service.py: ML logic and workflow
- models.py: Pydantic request/response schemas
- routes.py: FastAPI endpoints
"""

from .base import BaseMLAlgorithm
from .linear_regression import router as lr_router

__all__ = ['BaseMLAlgorithm', 'lr_router']
