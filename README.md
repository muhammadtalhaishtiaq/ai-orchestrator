# Inference

Runnable notebooks for the **Inference** YouTube channel — plus a full A-to-Z machine
learning curriculum in the same format.

Every notebook opens in Google Colab with one click. Nothing to install, nothing to
configure, no local Python needed.

---

## Two things live here

```
videos/       one folder per video — the notebook that ships in the description
curriculum/   a topic-by-topic ML course, 00-foundations through 22-end-to-end-projects
```

**`videos/`** is the active half. Each video on the channel ships with a notebook that
reproduces exactly what the video demonstrates — the same data, the same numbers, the same
output. Folders are numbered in the channel's own order, so `videos/001-…` is the first video.

**`curriculum/`** is the reference half: the underlying topics, ordered as a learning path
rather than a publishing order. Start there if you want the subject rather than one video.

---

## Running a notebook

Click the **Open in Colab** badge at the top of any notebook. That's the whole setup.

To run locally instead:

```bash
git clone https://github.com/muhammadtalhaishtiaq/inference.git
cd inference
pip install -r requirements.txt
jupyter notebook
```

Any notebook can also be opened in Colab directly from its path:

```
https://colab.research.google.com/github/muhammadtalhaishtiaq/inference/blob/main/<path>
```

---

## The curriculum

| Folder | Topic |
|---|---|
| `00-foundations` | Python, NumPy, pandas, the maths you actually need |
| `01-data-preprocessing` | Cleaning, missing values, encoding, scaling |
| `02-exploratory-data-analysis` | Univariate, bivariate, correlation, EDA workflow |
| `03-feature-engineering` | Creating, selecting and transforming features |
| `04-regression` | Linear, polynomial, regularised, evaluation |
| `05-classification` | Logistic regression, trees, SVM, metrics |
| `06-clustering` | k-means, hierarchical, DBSCAN |
| `07-dimensionality-reduction` | PCA, t-SNE, UMAP |
| `08-model-evaluation` | Cross-validation, tuning, leakage |
| `09-ensemble-methods` | Bagging, boosting, stacking |
| `10-neural-networks` | From a single neuron to backprop |
| `11-attention-transformers` | Attention, positional encoding, the block |
| `12-natural-language-processing` | Tokenisation, embeddings, classification |
| `13-computer-vision` | CNNs, augmentation, transfer learning |
| `14-large-language-models` | Prompting, fine-tuning, evaluation |
| `15-retrieval-augmented-generation` | Chunking, embedding, retrieval, grounding |
| `16-ai-agents` | Tools, planning, loops |
| `17-reinforcement-learning` | Rewards, policies, Q-learning |
| `18-mlops` | Tracking, registries, reproducibility |
| `19-data-engineering` | Pipelines, storage, formats |
| `20-cloud-deployment` | Serving models, containers |
| `21-production-best-practices` | Monitoring, drift, cost |
| `22-end-to-end-projects` | Full builds from data to deployment |

Not every folder is filled in yet. The curriculum is written as videos are made.

---

## Notes

- Notebooks under `videos/` are generated alongside each video and are checked to run top to
  bottom before being published here.
- Notebooks under `curriculum/` predate that pipeline. Most run; some are drafts.
- `datasets/` holds small sample data used by the notebooks. Anything large is downloaded by
  the notebook itself.
- `docs/` and `automation/` are project scaffolding, not teaching material.
