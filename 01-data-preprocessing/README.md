# 01-data-preprocessing/

**6 notebooks • ~2 hours**

## Why This Section?

80% of data science is preprocessing. Raw data is messy, unbalanced, and in wrong format. This section teaches you to clean and prepare data so ML models actually work.

**Real example:** You collect customer data with missing ages, text categories like "Red/Blue", different scales (income: $50k vs age: 25), and 99% normal customers. Can't train a model on this! These notebooks fix it.

---

## Notebooks

### 1. Handling Missing Data
**Why:** Real data has gaps. NaN values break models.

**What you'll do:**
- Detect missing values
- Drop vs Fill strategies
- Mean/Median/Mode imputation
- KNN (smart filling)

**Example:**
```python
df.isnull().sum()  # Check missing
df['age'].fillna(df['age'].median(), inplace=True)  # Fill with median
```

Most common: **Median imputation** (robust to outliers)

---

### 2. Encoding Categorical Data
**Why:** ML models need numbers, not text. Can't multiply "Red" × 5!

**What you'll do:**
- Label Encoding (Small → 0, Medium → 1, Large → 2)
- One-Hot Encoding (Red → [1,0,0], Blue → [0,1,0])
- When to use which

**Example:**
```python
pd.get_dummies(df['color'])  # One-hot encode colors
```

**Rule:** One-Hot for no order (colors), Label for order (sizes)

---

### 3. Feature Scaling
**Why:** Features with different ranges (income: 100k, age: 25) make model focus on big numbers only.

**What you'll do:**
- Min-Max (squeeze to [0,1])
- Standardization (mean=0, std=1)
- Robust (handles outliers)

**Example:**
```python
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_train)  # Mean=0, Std=1
```

**Most common:** Standardization for linear models

---

### 4. Train-Test Split
**Why:** Testing on training data = cheating! Get fake 99% accuracy.

**What you'll do:**
- 80/20 split
- Stratified (for imbalanced data)
- Cross-validation (5-fold)

**Example:**
```python
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
```

**Golden rule:** Never touch test set during tuning!

---

### 5. Data Augmentation
**Why:** More data = better model. But data is expensive. Create synthetic variations!

**What you'll do:**
- Image: flip, rotate, zoom
- Tabular: SMOTE (synthetic samples)
- Noise injection

**Example:**
```python
from imblearn.over_sampling import SMOTE
smote = SMOTE()
X_resampled, y_resampled = smote.fit_resample(X, y)
# Creates 10× more samples!
```

**Most common:** SMOTE for imbalanced classification

---

### 6. Handling Imbalanced Data
**Why:** 99% normal, 1% fraud. Naive model predicts "normal" → 99% accuracy but catches ZERO fraud!

**What you'll do:**
- Class weights (easiest)
- SMOTE oversampling
- Undersampling
- Proper metrics (F1, Recall)

**Example:**
```python
from sklearn.linear_model import LogisticRegression
model = LogisticRegression(class_weight='balanced')  # Fixes imbalance!
model.fit(X_train, y_train)
```

**Most common:** `class_weight='balanced'` (try first!)

---

## Quick Reference

| Problem | Solution | Code |
|---------|----------|------|
| Missing values | Median fill | `df.fillna(df.median())` |
| Text categories | One-hot | `pd.get_dummies(df)` |
| Different scales | Standardize | `StandardScaler()` |
| Testing | 80/20 split | `train_test_split(test_size=0.2)` |
| Too little data | SMOTE | `SMOTE().fit_resample()` |
| Imbalanced | Class weights | `class_weight='balanced'` |

---

## Before You Start

**Prerequisites:**
- Python basics (00-foundations/python-essentials)
- Pandas basics (read CSV, filter data)

**What you'll need:**
```bash
pip install scikit-learn pandas numpy matplotlib seaborn imbalanced-learn
```

---

## After This Section

You'll know how to:
- ✅ Clean messy real-world data
- ✅ Convert text to numbers
- ✅ Scale features properly
- ✅ Split data correctly
- ✅ Handle imbalanced classes

**Next:** Build actual ML models! (Regression, Classification)