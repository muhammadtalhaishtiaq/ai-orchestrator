# AI Orchestrator

Your complete A-Z guide to machine learning and AI. From linear regression to building AI agents — everything in runnable Jupyter notebooks.

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/)

---

## How to Use This Repo

Every notebook is self-contained. Just click the "Open in Colab" badge at the top of any notebook and run it. No setup needed.

If you want to run locally:
```bash
git clone https://github.com/muhammadtalhaishtiaq/project-nabula.git
cd project-nabula
pip install -r requirements.txt
jupyter notebook
```

---

## 12-Week Learning Path

I've organized everything into a weekly schedule. If you spend ~5-7 hours per week, you can go from zero to job-ready in 12 weeks.

| Week | Topics | Folders |
|------|--------|---------|
| **Week 0** | Python refresher, NumPy, Pandas basics | `00-foundations/` |
| **Week 1** | Data cleaning, handling missing values, encoding | `01-data-preprocessing/` |
| **Week 2** | EDA, statistics, visualization with matplotlib/seaborn | `02-exploratory-data-analysis/` |
| **Week 3** | Feature engineering, selection, scaling | `03-feature-engineering/` |
| **Week 4** | Linear, polynomial, tree-based regression | `04-regression/` |
| **Week 5** | Logistic regression, SVM, KNN, Naive Bayes | `05-classification/` |
| **Week 6** | K-Means, hierarchical, DBSCAN + model evaluation | `06-clustering/`, `08-model-evaluation/` |
| **Week 7** | PCA, t-SNE, ensemble methods | `07-dimensionality-reduction/`, `09-ensemble-methods/` |
| **Week 8** | Neural network fundamentals, CNNs | `10-neural-networks/` |
| **Week 9** | RNNs, attention, transformers | `10-neural-networks/rnn/`, `11-attention-transformers/` |
| **Week 10** | NLP basics, text processing, embeddings | `12-natural-language-processing/` |
| **Week 11** | LLMs, RAG, AI agents | `14-large-language-models/`, `15-retrieval-augmented-generation/`, `16-ai-agents/` |
| **Week 12** | MLOps, deployment, capstone project | `18-mlops/`, `20-cloud-deployment/`, `22-end-to-end-projects/` |

> **Tip**: Don't skip Week 0-3. Most ML bugs come from bad data, not bad models.

---

## What's Inside

```
00-foundations/              → Python, NumPy, Pandas, Math refresher
01-data-preprocessing/       → Cleaning, encoding, scaling
02-exploratory-data-analysis/→ Stats, visualization, insights
03-feature-engineering/      → Creating and selecting features
04-regression/               → Linear, polynomial, SVR, trees
05-classification/           → Logistic, SVM, KNN, Naive Bayes, trees
06-clustering/               → K-Means, hierarchical, DBSCAN
07-dimensionality-reduction/ → PCA, t-SNE, LDA
08-model-evaluation/         → Metrics, cross-validation, tuning
09-ensemble-methods/         → Bagging, boosting, stacking
10-neural-networks/          → ANNs, CNNs, RNNs, architectures
11-attention-transformers/   → Self-attention, BERT, GPT concepts
12-natural-language-processing/ → Text processing, embeddings, sentiment
13-computer-vision/          → Image classification, object detection
14-large-language-models/    → Fine-tuning, prompting, local LLMs
15-retrieval-augmented-generation/ → Vector DBs, RAG pipelines
16-ai-agents/                → Tool use, chains, autonomous agents
17-reinforcement-learning/   → Q-learning, policy gradients, DQN
18-mlops/                    → Experiment tracking, versioning
19-data-engineering/         → Pipelines, ETL, streaming
20-cloud-deployment/         → AWS/GCP/Azure, Docker, APIs
21-production-best-practices/→ Monitoring, testing, security
22-end-to-end-projects/      → Full projects from data to deployment
```

---

## Notebook Format

Every notebook follows the same structure so you know what to expect:

1. **What you'll learn** — quick overview (2 min read)
2. **The concept** — theory without the fluff
3. **Setup** — imports and data loading
4. **Implementation** — the actual code, step by step
5. **Results** — interpret what we got
6. **Visualization** — see it working
7. **Your turn** — exercises to try

Each notebook takes ~15-20 minutes to complete.

---

## Progress Tracker

Use this to track what you've finished:

- [ ] Week 0: Foundations
- [ ] Week 1: Data Preprocessing
- [ ] Week 2: EDA
- [ ] Week 3: Feature Engineering
- [ ] Week 4: Regression
- [ ] Week 5: Classification
- [ ] Week 6: Clustering & Evaluation
- [ ] Week 7: Dimensionality Reduction & Ensembles
- [ ] Week 8: Neural Networks
- [ ] Week 9: RNNs & Transformers
- [ ] Week 10: NLP
- [ ] Week 11: LLMs, RAG & Agents
- [ ] Week 12: MLOps & Capstone

---

## Contributing

Found a bug? Have a better explanation? PRs are welcome.

Just keep the same notebook format and make sure everything runs in Colab without errors.

---

## Why I Made This

I was tired of scattered tutorials, YouTube videos that skip the hard parts, and courses that cost $500 to tell you what's in the sklearn docs.

This is everything I wish existed when I started learning ML. Free, practical, and actually complete.

---

## License

MIT — do whatever you want with it.
