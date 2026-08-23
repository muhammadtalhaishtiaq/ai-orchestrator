# 03 - Feature Engineering

Master the art of transforming raw data into powerful features that drive model performance.

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/muhammadtalhaishtiaq/ai-orchestrator/blob/main/03-feature-engineering)

## 📋 Overview

Feature engineering is the process of transforming raw data into meaningful features that improve machine learning model performance. This section covers systematic techniques to extract, transform, and select features.

**Key Concepts:**
- Feature Selection - Choosing the most relevant features
- Feature Extraction - Creating new features from raw data
- Feature Transformation - Scaling, encoding, and normalizing
- Polynomial Features - Creating non-linear relationships
- Binning & Discretization - Converting continuous to categorical
- Datetime Features - Extracting temporal patterns
- Text Features - Processing and vectorizing text data

---

## 🎯 Learning Path

### Beginner → Intermediate → Advanced

**Beginner Phase (Notebooks 1-3):**
1. Start with **Feature Selection** to understand which features matter
2. Learn **Feature Extraction** to create new signals from existing data
3. Apply **Feature Transformation** to prepare data for models

**Intermediate Phase (Notebooks 4-6):**
4. Explore **Polynomial Features** for non-linear relationships
5. Master **Binning & Discretization** for categorical conversions
6. Extract **Datetime Features** from temporal data

**Advanced Phase (Notebook 7):**
7. Process **Text Features** from unstructured data

---

## 📚 Notebooks Summary

### 1. Feature Selection (01_feature_selection.ipynb)
**Goal:** Identify and select the most important features

**Key Techniques:**
- **Univariate Methods** (F-score): Fast statistical approach
- **Tree-Based Selection** (Random Forest): Captures non-linear importance
- **Recursive Feature Elimination** (RFE): Iterative feature removal
- **L1 Regularization** (Lasso): Automatic coefficient shrinkage

**Best For:**
- Reducing model complexity and training time
- Improving generalization (preventing overfitting)
- Understanding feature importance
- Handling high-dimensional data

**Key Insight:** Different methods reveal different aspects—combine multiple approaches for robust selection.

**Time Required:** 15-20 minutes

---

### 2. Feature Extraction (02_feature_extraction.ipynb)
**Goal:** Create new, more informative features from existing data

**Key Techniques:**
- **Ratio Features**: total_value / items_count
- **Interaction Features**: age × purchase_count
- **Power Features**: sqrt(x), log(x), x²
- **Domain Features**: RFM analysis (Recency, Frequency, Monetary)

**Best For:**
- Capturing business logic and domain knowledge
- Creating features that models can't automatically discover
- Improving model interpretability
- Building production feature pipelines

**Key Insight:** Domain expertise >>> raw features. Combine ratio, interaction, and domain knowledge.

**Time Required:** 20-25 minutes

---

### 3. Feature Transformation (03_feature_transformation.ipynb)
**Goal:** Prepare features for model consumption through scaling and encoding

**Key Techniques:**
- **Scaling Methods**:
  - StandardScaler: Gaussian normalization (μ=0, σ=1)
  - MinMaxScaler: Range normalization [0, 1]
  - RobustScaler: Outlier-resistant median/IQR
  
- **Categorical Encoding**:
  - One-Hot: For nominal features (employment type)
  - Label: For ordinal features (education level)
  - Target: Using mean target per category

- **Distribution Transforms**: Log, Box-Cox, Yeo-Johnson

**Best For:**
- Preparing data for distance-based models (KNN, K-Means)
- Correcting skewed distributions
- Handling categorical variables
- Creating sklearn pipelines

**Key Insight:** Different algorithms have different scaling requirements—LogisticRegression: ±35% difference, Tree Models: no effect.

**Time Required:** 20-25 minutes

---

### 4. Polynomial Features (04_polynomial_features.ipynb)
**Goal:** Create non-linear feature relationships for complex patterns

**Key Techniques:**
- **Degree Selection**: Find optimal polynomial degree (1-10)
- **Interaction Terms**: x₁ · x₂ combinations
- **Ridge Regularization**: Control overfitting with alpha tuning

**Best For:**
- Data with curved, non-linear relationships
- Capturing interaction effects
- Reducing prediction bias from linear assumptions
- Engineering for linear models (Linear/Logistic Regression)

**Key Insight:** Degree 1 underfits, Degree 3-4 often optimal, Degree 9+ overfits—use cross-validation to decide.

**Time Required:** 15-20 minutes

---

### 5. Binning & Discretization (05_binning_discretization.ipynb)
**Goal:** Convert continuous variables to categorical bins

**Key Techniques:**
- **Equal-Width**: Fixed interval ranges (pd.cut)
- **Equal-Frequency**: Same sample count per bin (pd.qcut)
- **Domain-Specific**: Custom bins based on business logic

**Best For:**
- Creating interpretable categorical features
- Capturing non-linear relationships
- Reducing noise from continuous variables
- Creating age groups, income brackets, score levels

**Key Insight:** Choose method based on distribution—equal-width for uniform, equal-frequency for non-uniform.

**Time Required:** 15-20 minutes

---

### 6. Datetime Features (06_datetime_features.ipynb)
**Goal:** Extract temporal patterns and seasonal signals

**Key Techniques:**
- **Components**: year, month, day, quarter, week, day_of_week
- **Patterns**: is_weekend, is_month_end, is_quarter_end
- **Seasonal**: season (Winter/Spring/Summer/Fall)
- **Cyclical Encoding**: sin/cos for circular relationships
- **Lagged Features**: Previous day/week purchases
- **Rolling Statistics**: Moving averages and std dev

**Best For:**
- Time series and temporal data
- Capturing seasonal patterns
- Predicting behavior by day/month/season
- Creating business hour vs non-business hour features

**Critical:** Use sin/cos encoding to preserve Dec 31 ≈ Jan 1 circular relationship.

**Time Required:** 20-25 minutes

---

### 7. Text Features (07_text_features.ipynb)
**Goal:** Extract signals from unstructured text data

**Key Techniques:**
- **Statistical**: Length, punctuation, case, stop word ratio
- **Frequency**: Bag-of-Words, Term Frequency
- **TF-IDF**: Term Frequency-Inverse Document Frequency
- **Sentiment**: Positive/negative word counts
- **Advanced**: Word embeddings, BERT (covered later)

**Best For:**
- Text classification and sentiment analysis
- Processing reviews, comments, customer feedback
- Combining text with tabular features
- Feature importance for interpretability

**Key Insight:** Start with simple features (length, sentiment)—advanced embeddings often overkill for many tasks.

**Time Required:** 20-25 minutes

---

## 🤔 Feature Selection Decision Framework

**Which technique to use?**

```
START: Do I want to reduce features or create new ones?

├─ REDUCE FEATURES (Feature Selection)
│  ├─ Need speed? → Try Univariate (F-score)
│  ├─ Want non-linearity? → Tree-Based (Random Forest)
│  ├─ Have time? → Recursive Feature Elimination
│  └─ Model-aware? → L1 Regularization (Lasso)
│
├─ CREATE FEATURES (Feature Extraction)
│  ├─ Domain knowledge available? → Create ratios + interactions
│  ├─ Time-based data? → Extract datetime features
│  ├─ Text data? → Vectorize + sentiment
│  └─ Complex patterns? → Polynomial features
│
├─ PREPARE FEATURES (Transformation)
│  ├─ Distance-based model? → Scale (StandardScaler)
│  ├─ Tree-based model? → No scaling needed
│  ├─ Categorical data? → Encode (One-Hot/Label)
│  └─ Skewed distribution? → Log/Box-Cox transform
│
└─ DISCRETIZE DATA (Binning)
   ├─ Business context? → Domain-specific bins
   ├─ Exploratory phase? → Equal-frequency quartiles
   └─ Preserve order? → Ordinal binning
```

---

## 📊 Workflow Example

**Typical Feature Engineering Pipeline:**

```python
# 1. Load raw data
X, y = load_data()

# 2. Extract domain features (Feature Extraction)
X['avg_purchase'] = X['total_value'] / X['num_purchases']
X['rfm_score'] = calculate_rfm(X)

# 3. Select important features (Feature Selection)
selector = SelectKBest(f_classif, k=15)
X_selected = selector.fit_transform(X, y)

# 4. Encode categorical variables (Feature Transformation)
encoder = OneHotEncoder(sparse=False)
X_encoded = encoder.fit_transform(X[categorical_cols])

# 5. Scale numerical features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X[numerical_cols])

# 6. Combine and train
X_final = np.hstack([X_scaled, X_encoded, X_polynomial])
model.fit(X_final, y)
```

---

## ✨ Common Patterns

### Pattern 1: Ratio Features for Business Data
```python
# Instead of: ['order_value', 'num_items']
# Create: 
df['avg_item_price'] = df['order_value'] / df['num_items']
df['value_per_day'] = df['total_value'] / df['days_customer']
```

### Pattern 2: Time-Based Features
```python
# Instead of: Raw timestamp
# Create:
df['days_since_signup'] = (today - df['signup_date']).dt.days
df['is_weekend'] = df['date'].dt.dayofweek >= 5
df['season'] = df['date'].dt.month.map({12:0, 1:0, 2:1, ...})
```

### Pattern 3: Interaction Features
```python
# Capture co-occurrence effects
df['age_income_interaction'] = df['age'] * df['income']
df['experience_level'] = df['years_employed'] / (df['age_at_hire'] + 1)
```

### Pattern 4: Sentiment/Lexicon Features
```python
# Domain-specific word counts
positive_words = {'good', 'excellent', 'amazing', 'love'}
df['sentiment_score'] = df['text'].apply(
    lambda x: sum(1 for word in x.lower().split() if word in positive_words)
)
```

---

## 🎓 Best Practices

**DO:**
✅ Start with domain expertise, not algorithms
✅ Create features based on business logic
✅ Combine multiple feature engineering techniques
✅ Document feature creation (why, not just how)
✅ Version control your feature definitions
✅ Monitor feature correlations and collinearity
✅ Validate features on holdout test data

**DON'T:**
❌ Over-engineer features without validation
❌ Leak information from test set during feature creation
❌ Create correlated features (VIF > 10)
❌ Ignore missing values in feature creation
❌ Scale before splitting train/test (data leakage)
❌ Forget to apply same transformations to test data

---

## 🔗 Next Steps

**After completing feature engineering:**
1. ✅ Move to **04-regression/** for prediction tasks
2. ✅ Progress to **05-classification/** for categorical targets
3. ✅ Apply to **06-clustering/** for unsupervised learning
4. ✅ Revisit features during model evaluation

**Feature optimization cycle:**
```
Raw Data → Extract → Transform → Select → Model Training
                ↑_______________________________↓
                    Evaluate & Iterate
```

---

## 📈 Performance Impact Summary

| Technique | Complexity | Impact | Best For |
|-----------|-----------|--------|----------|
| Feature Selection | Low | -20% features, +5% accuracy | Large datasets, simple models |
| Feature Extraction | High | +30% accuracy | Domain-rich data |
| Scaling | Very Low | +35% accuracy | Distance-based models |
| Polynomial | Medium | +25% accuracy | Non-linear patterns |
| Binning | Low | +10% interpretability | Business applications |
| Text Features | Medium | +40% accuracy | NLP tasks |

---

## 💡 Troubleshooting

**Problem:** Models not improving despite feature engineering
- **Solution:** Check for data leakage, validate feature importance

**Problem:** Too many features = slow training
- **Solution:** Use feature selection + dimensionality reduction

**Problem:** Categorical encoding creates too many columns
- **Solution:** Use max_categories, target encoding, or hashing

**Problem:** Scaled features break model interpretability
- **Solution:** Use unscaled features for tree models, scale only for linear models

---

## 📚 Resources

- [Feature Engineering Wikipedia](https://en.wikipedia.org/wiki/Feature_engineering)
- [scikit-learn Preprocessing](https://scikit-learn.org/stable/modules/preprocessing.html)
- [Hands-On Machine Learning Book - Feature Engineering](https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/)

---

**Total Time to Complete All Notebooks:** ~2-2.5 hours

**Difficulty:** Beginner → Intermediate

**Prerequisites:** Basic Python, pandas, scikit-learn fundamentals

---

*Last Updated: 2024*
*Status: Complete (7/7 notebooks)*
