# 🎯 Foundations

Learn the basics before doing machine learning.

**Time**: ~20 hours | **Difficulty**: Beginner

---

## Why This Section?

Most people jump straight to ML models. That's a mistake. You need:
- **Python skills** to write code
- **Math** to understand what models actually do
- **Statistics** to know if results are real or just noise

Without these? You'll copy-paste code without understanding why it works (or doesn't).

---

## What's Inside

### **python-essentials/** (4 notebooks)

**Why?** Python + NumPy + Pandas = 90% of data science work.

**Example:** You'll load a CSV file with millions of rows:
```python
df = pd.read_csv('sales.csv')  # Load data
df.groupby('region')['sales'].mean()  # Average sales by region
df.plot()  # Visualize it
```
This 3-line code is what data scientists do daily. You need to master this.

**Notebooks:**
1. `01_python_basics.ipynb` - Lists, dicts, functions, classes
2. `02_numpy_fundamentals.ipynb` - Arrays, matrix operations (50x faster than Python)
3. `03_pandas_mastery.ipynb` - Load, filter, group, merge data
4. `04_matplotlib_seaborn.ipynb` - Create plots to understand data

---

### **math-for-ml/** (4 notebooks)

**Why?** ML models are just math. Neural networks? Matrix multiplication. That's it.

**Example:** A neural network forward pass:
```python
# Input: [1, 2, 3]
# Weights: [[0.1, 0.2], [0.3, 0.4], [0.5, 0.6]]
# Output = Input × Weights
output = np.dot(input, weights)  # This IS a neural network layer!
```

When your model doesn't train? You need to understand gradients. When it overfits? You need optimization theory.

**Notebooks:**
1. `01_linear_algebra.ipynb` - Matrices, vectors, eigenvalues (neural nets = stacked matrices)
2. `02_calculus_gradients.ipynb` - Derivatives, chain rule (how models learn via gradient descent)
3. `03_probability_statistics.ipynb` - Bayes theorem, distributions (reasoning under uncertainty)
4. `04_optimization.ipynb` - Learning rates, momentum (why training fails/succeeds)

---

### **statistics/** (4 notebooks)

**Why?** You build a model that's "95% accurate". Great! Or is it? If your data is 95% one class, a dummy model is also 95% accurate. Statistics helps you ask the right questions.

**Example:** A/B testing a new website feature:
```python
# Did the new button increase clicks?
group_a = [12, 15, 14, 13, 16]  # Control
group_b = [18, 20, 19, 21, 17]  # New button

t_stat, p_value = stats.ttest_ind(group_a, group_b)
if p_value < 0.05:
    print("Yes! Real improvement, not luck")
```

Every business decision needs this kind of validation.

**Notebooks:**
1. `01_descriptive_statistics.ipynb` - Mean, median, outliers (describe your data first)
2. `02_inferential_statistics.ipynb` - Confidence intervals (estimate from samples)
3. `03_hypothesis_testing.ipynb` - p-values, t-tests (is this result real?)
4. `04_distributions.ipynb` - Normal, Poisson, Binomial (recognize data patterns)

---

## How to Learn

1. Open a notebook in Colab
2. Run each cell
3. Change values, see what happens
4. Do the exercises at the end
5. Apply to your own data

**Time:** 20-30 hours if you do it right.

---

## What You'll Gain

After this section:
- ✅ You can load, clean, analyze any dataset
- ✅ You understand what ML models actually do (not magic!)
- ✅ You can debug why models don't work
- ✅ You speak the language: "gradient descent", "p-value", "overfitting"

**Without this?** You'll struggle in every future section.

---

## Next Steps

After Foundations → **01-data-preprocessing/** (handle missing data, scaling, etc)

**Ready? Start with `python-essentials/01_python_basics.ipynb` 🚀**
