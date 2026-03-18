# 04 - Regression

Master regression from simple linear models to modern boosted ensembles.

**Notebooks**: 8  
**Time**: ~2.5 hours

---

## Overview

| Notebook | Focus | When to Use |
|----------|-------|------------|
| 01 Linear | Single feature, straight line | Quick baseline, interpretability |
| 02 Multiple Linear | Multiple features, linear fit | Baseline with many inputs |
| 03 Polynomial | Curved relationships | Non-linear patterns (degree 2-3) |
| 04 SVR | Robust to noise | Small or noisy datasets |
| 05 Decision Tree | Step functions, interpretable | Non-linear, rules needed |
| 06 Random Forest | Bagging ensemble | Strong generalization |
| 07 Gradient Boosting | Sequential trees | Higher accuracy with tuning |
| 08 XGBoost | Optimized boosting | High performance on tabular data |

---

## Decision Guide

```
Is the relationship linear?
├─ YES: Linear or Multiple Linear
└─ NO: Is it curved and smooth?
       ├─ YES: Polynomial
       └─ NO: Is the data noisy?
              ├─ YES: SVR
              └─ NO: Do you need interpretability?
                     ├─ YES: Decision Tree
                     └─ NO: Random Forest or Gradient Boosting
```

---

## Key Metrics

- R2: overall fit quality
- MAE: average absolute error
- RMSE: penalizes large errors

---

## Notebook Highlights

### 01_linear_regression.ipynb
- One feature, closed form solution
- Residual analysis
- MAE, RMSE, R2 evaluation

### 02_multiple_linear_regression.ipynb
- Multiple features
- Coefficient interpretation
- Correlation checks for multicollinearity

### 03_polynomial_regression.ipynb
- Non-linear relationships
- Degree selection strategy
- Overfitting risk analysis

### 04_support_vector_regression.ipynb
- Epsilon tube intuition
- Kernel choice (linear vs RBF)
- Robustness to noise

### 05_decision_tree_regression.ipynb
- Stepwise predictions
- Feature importance
- Depth control for overfitting

### 06_random_forest_regression.ipynb
- Bagging ensemble
- Strong baseline for tabular data
- Feature importance from forest

### 07_gradient_boosting_regression.ipynb
- Sequential trees that correct errors
- Tuning learning_rate and n_estimators
- Improved accuracy on non-linear data

### 08_xgboost_regression.ipynb
- Optimized boosting with regularization
- Handles complex patterns
- Feature importance and fast training

---

## Tips

- Scale features for Linear, Polynomial, and SVR
- Tree-based models do not need scaling
- Use train-test split before feature engineering
- Prefer ensembles for non-linear, high-variance data

---

## Next Steps

After regression, move to:
- 05-classification
- 06-clustering
- 08-model-evaluation

---

**Difficulty**: Intermediate  
**Prerequisites**: data preprocessing and EDA