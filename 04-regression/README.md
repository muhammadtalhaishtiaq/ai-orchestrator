# 02 - Regression

Master different regression techniques from linear to ensemble models.

**Notebooks**: 6  
**Time**: ~2 hours

---

## Overview

| Notebook | Focus | When to Use |
|----------|-------|------------|
| 01 Simple Linear | Single feature, straight line | Quick baseline, interpretability needed |
| 02 Multiple Linear | Multiple features, linear fit | Baseline with many inputs |
| 03 Polynomial | Curved relationships | Non-linear patterns (degree 2-3) |
| 04 SVR | Robust with outliers | Noise-tolerant fitting |
| 05 Decision Tree | Step functions, interpretable | Non-linear, need feature importance |
| 06 Random Forest | Ensemble, low overfitting | Best out-of-box performance |

---

## Decision Tree

Choose your regression model:

```
Is the relationship linear?
├─ YES: Use Linear (Multiple if features > 1)
└─ NO: Is it curved?
       ├─ YES: Polynomial (degree ≈ 2-3)
       └─ NO: Is data noisy?
              ├─ YES: SVR (robust tube tolerance)
              └─ NO: Non-linear multi-level?
                     ├─ YES: Decision Tree (interpretable)
                     └─ NO: Try Random Forest (safest bet)
```

---

## Quick Reference

### Performance Ranking
1. **Best Generalization**: Random Forest (ensemble + bagging)
2. **Best for Outliers**: SVR (epsilon tube)
3. **Most Interpretable**: Decision Tree (see the rules)
4. **Best for Non-Linear**: Polynomial or Decision Tree
5. **Baseline**: Linear/Multiple (fast, simple)

### Key Metrics
- **R² Score**: [0, 1] where 1 = perfect fit
- **RMSE**: Root Mean Squared Error (same units as target)
- **MAE**: Mean Absolute Error (robust to outliers)

### Hyperparameters to Tune
- **Polynomial**: degree (2-3 usually)
- **SVR**: C (regulatory), epsilon (tube width), kernel
- **Decision Tree**: max_depth (5-15), min_samples_leaf
- **Random Forest**: n_estimators (100-200), max_depth

---

## Common Patterns

### Overfitting Detection
```python
if train_r2 >> test_r2:
    # Model overfit to training data
    # Solution: Reduce complexity (depth, degree, C)
```

### Scaling
- **Linear/SVR**: REQUIRED (StandardScaler)
- **Tree-based**: Not needed (scale-invariant)
- **Polynomial**: Use before transform

### Prediction Stability
- **Linear/Poly**: Smooth predictions
- **Trees**: Step-function predictions
- **Forest**: Smoother than single tree

---

## Real-World Examples

### House Price Prediction
```
Data: Size, Bedrooms, Age, Location
├─ Simple: Multiple Linear (R² ≈ 0.75)
├─ Better: Random Forest (R² ≈ 0.88)
└─ Best: Forest + feature engineering
```

### Stock Price Prediction
```
Data: Historical prices, volume, indicators
├─ Noisy: Use SVR (robust)
├─ Time-series: Need lagged features
└─ Risk: Trees fail for extrapolation
```

### Salary Prediction
```
Data: Experience, education, skills
├─ Pattern: Non-linear growth curve
├─ Solution: Polynomial or Tree
└─ Interpretability: Decision Tree wins
```

---

## Notebook Highlights

### 01_simple_linear_regression.ipynb
- Equation y = mx + b
- R² and RMSE metrics
- Residual analysis (normality check)
- Train-test evaluation

### 02_multiple_linear_regression.ipynb
- Multiple features: y = β₀ + β₁x₁ + β₂x₂ + ...
- Multicollinearity detection (correlation > 0.7)
- Feature importance (standardized coefficients)
- Actual vs predicted visualization

### 03_polynomial_regression.ipynb
- Non-linear fits (degree 2-3 optimal)
- Feature engineering (x² from x)
- Overfitting risk (train vs test gap)
- Degree selection strategy

### 04_support_vector_regression.ipynb
- Epsilon tube concept (tolerance)
- Robust to outliers
- Hyperparameters: C, epsilon, kernel
- Linear vs RBF kernels

### 05_decision_tree_regression.ipynb
- Step function predictions
- Tree visualization (see rules)
- Feature importance
- Depth tuning (prevent overfitting)

### 06_random_forest_regression.ipynb
- Bagging: Bootstrap + aggregating
- Ensemble power (100+ trees)
- OOB error (free cross-validation)
- Feature importance from forest

---

## Tips & Tricks

✅ **DO:**
- Scale before Linear/Polynomial/SVR
- Check R² on test set (not train)
- Visualize residuals for Linear
- Use OOB score for tuning
- Start simple, add complexity

❌ **DON'T:**
- Evaluate on training data only
- Use high polynomial degrees (overfitting)
- Forget to tune hyperparameters
- Ignore feature scaling for SVM
- Expect trees to extrapolate

---

## Next Steps

After mastering regression:
- Try **Classification** (03)
- Add **Feature Engineering** (manipulation)
- Learn **Model Selection** (validation strategies)
- Explore **Ensemble Methods** (boosting)

---

## Challenge

**Build a Price Predictor:**
1. Load housing dataset (size, rooms, age, location)
2. Train 3+ models (Linear, Poly, Forest)
3. Compare test R²
4. Identify top features
5. Make predictions on new data
6. Explain why Forest wins

---

**Difficulty**: ⭐⭐ (Intermediate)  
**Prerequisites**: 01-data-preprocessing complete  
**Time to Master**: 2-3 days with practice