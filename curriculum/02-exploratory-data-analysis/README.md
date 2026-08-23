# Exploratory Data Analysis (EDA)

**Complete guide to understanding your data before modeling**

## 📚 Overview

Exploratory Data Analysis (EDA) is the **critical first step** in any data science project. This section teaches you systematic approaches to understanding data structure, discovering patterns, detecting anomalies, and generating insights.

**Why EDA Matters:**
- ❌ Skip EDA = Garbage in, garbage out
- ✅ Good EDA saves hours of modeling time
- 💡 Reveals feature engineering opportunities
- 🔍 Catches data quality issues early

---

## 📖 Contents

### [01. EDA Workflow](01_eda_workflow.ipynb)
**The systematic approach to exploring datasets**

**You'll learn:**
- Complete EDA process (load → inspect → clean → analyze → document)
- When and how to apply different EDA techniques
- Real estate dataset walkthrough
- EDA checklist and best practices

**Key concepts:** Initial inspection, data quality checks, univariate/bivariate/multivariate analysis

---

### [02. Univariate Analysis](02_univariate_analysis.ipynb)
**Analyzing one variable at a time**

**You'll learn:**
- Central tendency measures (mean, median, mode)
- Distribution shape (skewness, kurtosis, normality tests)
- Visualization techniques (histograms, box plots, KDE, violin plots)
- Outlier detection (IQR, Z-score methods)
- Missing value patterns

**Key concepts:** Summary statistics, distribution analysis, Q-Q plots

---

### [03. Bivariate Analysis](03_bivariate_analysis.ipynb)
**Exploring relationships between two variables**

**You'll learn:**
- Numerical vs Numerical: Scatter plots, correlation, trend lines
- Categorical vs Numerical: Box plots, violin plots, grouped statistics
- Categorical vs Categorical: Cross-tabulation, stacked bars, chi-square tests
- Statistical significance testing
- **Critical:** Correlation ≠ Causation!

**Key concepts:** Relationships, associations, statistical tests, spurious correlation

---

### [04. Correlation Analysis](04_correlation_analysis.ipynb)
**Deep dive into correlation techniques**

**You'll learn:**
- **Pearson correlation**: Linear relationships
- **Spearman correlation**: Monotonic relationships (non-linear)
- **Kendall's Tau**: Ordinal data
- Correlation matrices and heatmaps
- Multicollinearity detection (VIF)
- Anscombe's Quartet (why visualization matters!)

**Key concepts:** Correlation types, multicollinearity, feature importance, heatmaps

---

### [05. Outlier Detection](05_outlier_detection.ipynb)
**Systematic approaches to finding anomalies**

**You'll learn:**
- **Univariate methods:** IQR, Z-score, Modified Z-score
- **Multivariate methods:** Mahalanobis distance, Isolation Forest, Local Outlier Factor
- When to remove vs keep outliers
- Treatment methods: removal, capping (winsorization), transformation
- Outlier decision tree

**Key concepts:** Point outliers, contextual outliers, robust statistics, anomaly detection

---

### [06. Automated EDA Tools](06_automated_eda_tools.ipynb)
**Leverage libraries to speed up exploration**

**You'll learn:**
- **YData Profiling** (pandas-profiling): Most comprehensive
- **Sweetviz**: Beautiful visuals, dataset comparisons
- **D-Tale**: Interactive exploration
- **AutoViz**: Quick visualizations
- **DataPrep**: Fast, GPU-accelerated
- When to use automated vs manual EDA

**Key concepts:** Automation, tool comparison, limitations, workflow integration

---

## 🎯 EDA Quick Decision Tree

```
New dataset?
    ↓
1️⃣ Run automated EDA (Sweetviz/YData) → Get overview (5 min)
    ↓
2️⃣ Manual univariate analysis → Understand each variable (15 min)
    ↓
3️⃣ Bivariate analysis → Find relationships with target (20 min)
    ↓
4️⃣ Correlation matrix → Detect multicollinearity (10 min)
    ↓
5️⃣ Outlier detection → Identify anomalies (15 min)
    ↓
6️⃣ Document insights → List findings and next steps (10 min)
    ↓
✅ Ready for preprocessing and feature engineering!
```

**Total time:** ~75 minutes for thorough EDA

---

## 🔧 Essential Tools & Libraries

```python
# Core
import pandas as pd
import numpy as np

# Visualization
import matplotlib.pyplot as plt
import seaborn as sns

# Statistics
from scipy import stats

# Automated EDA
from ydata_profiling import ProfileReport  # Comprehensive reports
import sweetviz as sv                       # Beautiful comparisons
import dtale                                # Interactive exploration

# Outlier detection
from sklearn.ensemble import IsolationForest
from sklearn.neighbors import LocalOutlierFactor
```

---

## 📊 EDA Checklist

### Initial Inspection ✅
- [ ] Shape (rows × columns)
- [ ] Data types of each column
- [ ] First/last few rows
- [ ] Memory usage

### Data Quality ✅
- [ ] Missing values (count & percentage)
- [ ] Duplicate rows
- [ ] Data type mismatches
- [ ] Invalid values (negatives where impossible, etc.)

### Univariate Analysis ✅
- [ ] Summary statistics (mean, median, std, quartiles)
- [ ] Distribution plots (histograms, box plots)
- [ ] Skewness and kurtosis
- [ ] Unique value counts (for categorical)

### Bivariate Analysis ✅
- [ ] Correlation with target variable
- [ ] Scatter plots for key relationships
- [ ] Box plots for categorical vs numerical
- [ ] Cross-tabulation for categorical pairs

### Multivariate Analysis ✅
- [ ] Correlation matrix
- [ ] Multicollinearity check (VIF > 10)
- [ ] Interaction effects

### Outliers ✅
- [ ] Visual detection (box plots, scatter plots)
- [ ] Statistical detection (IQR, Z-score)
- [ ] Decision: remove, cap, transform, or keep?

### Documentation ✅
- [ ] Key insights list
- [ ] Data quality issues
- [ ] Recommended preprocessing steps
- [ ] Feature engineering ideas

---

## 💡 Common EDA Patterns & Solutions

### Pattern 1: High Missing Values
**Problem:** Column has >30% missing data

**Solutions:**
1. Drop column (if not important)
2. Impute with median/mode/model prediction
3. Create "missing indicator" feature
4. MCAR vs MAR vs MNAR analysis

---

### Pattern 2: Highly Skewed Distribution
**Problem:** Feature has extreme skewness (|skew| > 1)

**Solutions:**
1. Log transformation: `np.log1p(x)`
2. Square root: `np.sqrt(x)`
3. Box-Cox transformation
4. Use tree-based models (naturally robust)

---

### Pattern 3: Multicollinearity
**Problem:** Features correlated with each other (r > 0.8)

**Solutions:**
1. Remove one of the correlated features
2. Combine via PCA
3. Use regularization (Ridge, Lasso)
4. Keep if using tree-based models

---

### Pattern 4: Outliers
**Problem:** Extreme values distorting statistics

**Solutions:**
1. **If error:** Remove or fix
2. **If valid:** Keep and use robust methods
3. **Winsorization:** Cap at 1st/99th percentile
4. **Transformation:** Log/sqrt to reduce impact

---

### Pattern 5: Imbalanced Target
**Problem:** Classification target has 90:10 split

**Solutions:**
1. Collect more minority class data
2. SMOTE (synthetic oversampling)
3. Class weights in model
4. Stratified sampling

---

## 🎓 Learning Path

**Beginner** (Week 1):
1. Start with 01_eda_workflow.ipynb (understand the process)
2. Practice on Titanic dataset
3. Focus on visualization and interpretation

**Intermediate** (Week 2-3):
1. Master all correlation types (Pearson, Spearman, Kendall)
2. Learn outlier detection methods
3. Compare automated EDA tools

**Advanced** (Week 4+):
1. Multivariate outlier detection
2. Feature interaction exploration
3. Build custom EDA pipelines

---

## 📈 Real-World Examples

### E-commerce: Customer Churn
**Key EDA Findings:**
- Tenure < 6 months → 60% churn rate
- Premium members → 10% churn rate
- Last purchase >90 days → 45% churn rate

**Action:** Focus retention on new customers, promote premium

---

### Healthcare: Patient Readmission
**Key EDA Findings:**
- Age >65 → 2x readmission rate
- 3+ previous admissions → 3x rate
- Missing medication compliance → 1.5x rate

**Action:** Special monitoring for elderly, multi-admission patients

---

### Finance: Fraud Detection
**Key EDA Findings:**
- Transactions 2-4 AM → 12x fraud rate
- Distance >500km from home → 8x rate
- New merchant + high amount → 15x rate

**Action:** Flag unusual time/location/merchant combinations

---

## 🚀 Next Steps

After completing this EDA section:

1. **✅ Move to Feature Engineering** (03-feature-engineering/)
   - Transform insights into features
   - Create interaction terms
   - Handle categorical encoding

2. **✅ Practice on Real Datasets**
   - Kaggle competitions
   - UCI ML Repository
   - Your own projects

3. **✅ Build EDA Templates**
   - Save your common EDA code
   - Create reusable functions
   - Automate repetitive tasks

---

## 📚 Additional Resources

**Books:**
- "Python for Data Analysis" by Wes McKinney
- "Storytelling with Data" by Cole Nussbaumer Knaflic

**Online:**
- [Kaggle EDA Notebooks](https://www.kaggle.com/code?searchQuery=EDA)
- [Towards Data Science - EDA](https://towardsdatascience.com/tagged/exploratory-data-analysis)

**Tools Documentation:**
- [YData Profiling](https://docs.profiling.ydata.ai/)
- [Sweetviz](https://github.com/fbdesignpro/sweetviz)
- [D-Tale](https://github.com/man-group/dtale)

---

## ⚠️ Common Mistakes to Avoid

1. **❌ Skipping EDA entirely** → Always do at least 30 minutes
2. **❌ Only using automated tools** → Manual exploration builds intuition
3. **❌ Removing outliers without investigation** → Might be valuable signals
4. **❌ Assuming correlation = causation** → Always verify with domain knowledge
5. **❌ Not documenting findings** → You'll forget insights later
6. **❌ EDA without purpose** → Focus on questions relevant to your goal

---

## 🎯 Success Criteria

You've mastered EDA when you can:

✅ Generate insights from any dataset in <2 hours  
✅ Identify data quality issues automatically  
✅ Recommend appropriate preprocessing steps  
✅ Explain feature importance to non-technical stakeholders  
✅ Detect multicollinearity and outliers  
✅ Choose the right visualization for any variable type  
✅ Write clear, actionable insights from patterns  

---

**Ready to explore your data?** Start with [01_eda_workflow.ipynb](01_eda_workflow.ipynb)! 🚀

---

*Part of the AI Orchestrator ML Education Series*  
*Previous: [01-data-preprocessing/](../01-data-preprocessing/) | Next: [03-feature-engineering/](../03-feature-engineering/)*
