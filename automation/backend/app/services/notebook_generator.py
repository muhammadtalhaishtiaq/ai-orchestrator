"""
Notebook generation service.
Tries LLM-based generation first; falls back to hardcoded template.
Used by both the /notebooks/{id}/regenerate endpoint and the pipeline runner.
"""
import json
import os
import logging
import nbformat
from nbformat.v4 import new_notebook, new_markdown_cell, new_code_cell
from typing import Optional

logger = logging.getLogger(__name__)

_CONFIG_PATH = os.path.join(os.path.dirname(__file__), "../config/notebook_config.json")
with open(_CONFIG_PATH) as f:
    NOTEBOOK_CONFIG = json.load(f)


def build_cells(
    notebook_name: str,
    folder: str,
    path: str,
    llm_provider: Optional[str] = None,
    llm_model: Optional[str] = None,
    llm_api_key: Optional[str] = None,
) -> list:
    """
    Build notebook cells.
    If llm_provider + llm_api_key are provided, calls the LLM service.
    Falls back to hardcoded template on any LLM error.

    Returns a list of {'cell_type': 'markdown'|'code', 'source': str} dicts.
    """
    # ── Try LLM generation ────────────────────────────────────────────────────
    if llm_provider and llm_api_key:
        try:
            from app.services.llm_service import generate_notebook_cells
            cfg = NOTEBOOK_CONFIG
            difficulty_map = cfg.get("folder_difficulty_map", {})
            difficulty = difficulty_map.get(folder, "intermediate")
            cells = generate_notebook_cells(
                topic=notebook_name,
                folder=folder,
                difficulty=difficulty,
                provider=llm_provider,
                model=llm_model,
                api_key=llm_api_key,
            )
            logger.info(f"LLM generated {len(cells)} cells for '{notebook_name}'")
            return cells
        except Exception as e:
            logger.warning(f"LLM generation failed for '{notebook_name}': {e}. Falling back to template.")

    # ── Hardcoded template fallback ───────────────────────────────────────────
    logger.info(f"Using template for '{notebook_name}' (no LLM config)")
    return _template_cells(notebook_name, folder, path)


def _template_cells(notebook_name: str, folder: str, path: str) -> list:
    """Original hardcoded template — used as fallback when LLM is not configured."""
    cfg = NOTEBOOK_CONFIG
    difficulty_map = cfg["folder_difficulty_map"]
    difficulty = difficulty_map.get(folder, "intermediate")
    colab_url = cfg["colab_badge_format"].replace("{path}", path)
    topic = notebook_name

    cells = []

    # ── Header ───────────────────────────────────────────────────────────────
    cells.append({
        "cell_type": "markdown",
        "source": f"# {topic}\n\n{colab_url}\n\n---"
    })

    # ── Section 1: Hook ───────────────────────────────────────────────────────
    cells.append({
        "cell_type": "markdown",
        "source": (
            f"## 🎯 What are we learning today?\n\n"
            f"In this notebook we'll tackle **{topic}** — "
            f"one of the most practical skills in machine learning.\n\n"
            f"By the end you'll know exactly what it is, why it matters, "
            f"and how to do it yourself."
        )
    })

    # ── Section 2: Plain-English concept ─────────────────────────────────────
    cells.append({
        "cell_type": "markdown",
        "source": (
            f"## 💡 The idea — in plain English\n\n"
            f"Imagine you're a chef preparing a dish. Before you start cooking, "
            f"you check your ingredients: are they fresh? Are any missing? "
            f"Are they in the right form?\n\n"
            f"**{topic}** is exactly that — preparing your data "
            f"so the model can actually learn from it.\n\n"
            f"> **Difficulty:** {difficulty.capitalize()}  "
            f"| **Time:** ~15 minutes\n\n"
            f"Let's dig in."
        )
    })

    # ── Section 3: Setup ──────────────────────────────────────────────────────
    cells.append({
        "cell_type": "markdown",
        "source": "## ⚙️ Setup\n\nJust three libraries — nothing fancy."
    })
    cells.append({
        "cell_type": "code",
        "source": (
            "import numpy as np          # numbers and arrays\n"
            "import pandas as pd         # tables (DataFrames)\n"
            "import matplotlib.pyplot as plt  # charts\n"
            "import seaborn as sns        # nicer charts\n\n"
            "plt.style.use('seaborn-v0_8-whitegrid')\n"
            "print('✅ Setup done!')"
        )
    })

    # ── Section 4: Load data ──────────────────────────────────────────────────
    cells.append({
        "cell_type": "markdown",
        "source": (
            "## 📦 Step 1 — Load the data\n\n"
            "We'll use a small, realistic dataset so you can see exactly what's happening. "
            "Think of this as a hiring dataset — age, salary, experience, hired or not."
        )
    })
    cells.append({
        "cell_type": "code",
        "source": (
            "# Sample dataset — realistic but small enough to understand completely\n"
            "data = {\n"
            "    'age':        [25, 30, 35, None, 45, 50, 28, None, 40, 33],\n"
            "    'salary':     [50000, 60000, None, 80000, 90000, 100000, 55000, 75000, None, 65000],\n"
            "    'experience': [2, 5, 8, 12, 15, 20, 3, 10, 14, 7],\n"
            "    'hired':      [0, 1, 1, 1, 1, 1, 0, 1, 1, 1]\n"
            "}\n\n"
            "df = pd.DataFrame(data)\n"
            "print(f'Dataset shape: {df.shape}')\n"
            "print('\\nFirst 5 rows:')\n"
            "df.head()"
        )
    })

    # ── Section 5: Apply the concept ─────────────────────────────────────────
    cells.append({
        "cell_type": "markdown",
        "source": (
            f"## 🔨 Step 2 — Apply {topic}\n\n"
            "Let's look at what we're working with before making changes."
        )
    })
    cells.append({
        "cell_type": "code",
        "source": (
            "# Always inspect first — never change data blindly\n"
            "print('Missing values per column:')\n"
            "print(df.isnull().sum())\n\n"
            "print('\\nData types:')\n"
            "print(df.dtypes)\n\n"
            "print('\\nBasic stats:')\n"
            "df.describe()"
        )
    })

    cells.append({
        "cell_type": "markdown",
        "source": "### Step 3 — Fix it"
    })
    cells.append({
        "cell_type": "code",
        "source": (
            "# Fill missing numerical values with the median\n"
            "# (median is better than mean when you have outliers)\n"
            "df_clean = df.fillna(df.median(numeric_only=True))\n\n"
            "print('After cleaning:')\n"
            "print('Missing values:', df_clean.isnull().sum().sum())\n"
            "df_clean.head()"
        )
    })

    # ── Section 6: Results ────────────────────────────────────────────────────
    cells.append({
        "cell_type": "markdown",
        "source": (
            "## 📊 What did we get?\n\n"
            "Let's check the before vs after."
        )
    })
    cells.append({
        "cell_type": "code",
        "source": (
            "print('BEFORE — missing values:')\n"
            "print(df.isnull().sum())\n\n"
            "print('\\nAFTER — missing values:')\n"
            "print(df_clean.isnull().sum())\n\n"
            "print('\\n✅ Data is clean and ready for a model!')"
        )
    })

    # ── Section 7: Visualization ──────────────────────────────────────────────
    cells.append({
        "cell_type": "markdown",
        "source": "## 📈 Let's see it\n\nVisuals make it click faster than words."
    })
    cells.append({
        "cell_type": "code",
        "source": (
            "fig, axes = plt.subplots(1, 2, figsize=(12, 4))\n\n"
            "# Left chart: where data was missing\n"
            "missing_counts = df.isnull().sum()\n"
            "axes[0].bar(missing_counts.index, missing_counts.values, color='#ef4444', alpha=0.8)\n"
            "axes[0].set_title('Missing Values — Before Cleaning', fontsize=13, fontweight='bold')\n"
            "axes[0].set_xlabel('Column')\n"
            "axes[0].set_ylabel('Missing Count')\n\n"
            "# Right chart: salary distribution after cleaning\n"
            "axes[1].hist(df_clean['salary'], bins=8, color='#22c55e', edgecolor='white', alpha=0.9)\n"
            "axes[1].set_title('Salary Distribution — After Cleaning', fontsize=13, fontweight='bold')\n"
            "axes[1].set_xlabel('Salary ($)')\n"
            "axes[1].set_ylabel('Count')\n\n"
            "plt.tight_layout()\n"
            "plt.show()"
        )
    })

    # ── Section 8: Summary ────────────────────────────────────────────────────
    cells.append({
        "cell_type": "markdown",
        "source": (
            f"## ✅ Quick recap\n\n"
            f"Here's what we just did:\n\n"
            f"- 🧠 **What**: {topic} — preparing data so ML models can learn properly\n"
            f"- 🔍 **Why**: Messy data → bad predictions, no matter how good your model is\n"
            f"- 🛠️ **How**: Use pandas to inspect, clean, and verify your data\n"
            f"- 📊 **Check**: Always visualize before and after\n"
            f"- ⏭️ **Next step**: Try this on a real Kaggle dataset!"
        )
    })

    # ── Section 9: Exercises ──────────────────────────────────────────────────
    cells.append({
        "cell_type": "markdown",
        "source": "## 🏋️ Your turn — 3 quick exercises"
    })
    cells.append({
        "cell_type": "code",
        "source": (
            "# Exercise 1: What percentage of values are missing in each column?\n"
            "# Hint: df.isnull().mean() * 100\n"
            "# --- YOUR CODE HERE ---\n\n\n"
            "# Exercise 2: Instead of median, try filling with the MEAN. Does it change much?\n"
            "# Hint: df.fillna(df.mean(numeric_only=True))\n"
            "# --- YOUR CODE HERE ---\n\n\n"
            "# Exercise 3: Drop ALL rows that have ANY missing values. How many rows remain?\n"
            "# Hint: df.dropna()\n"
            "# --- YOUR CODE HERE ---\n"
        )
    })

    return cells


def build_notebook_file(cells: list) -> str:
    """Convert cells list to a full .ipynb JSON string."""
    nb = new_notebook()
    nb_cells = []
    for c in cells:
        if c["cell_type"] == "markdown":
            nb_cells.append(new_markdown_cell(c["source"]))
        else:
            nb_cells.append(new_code_cell(c["source"]))
    nb.cells = nb_cells
    nb.metadata["kernelspec"] = {
        "display_name": "Python 3",
        "language": "python",
        "name": "python3"
    }
    return nbformat.writes(nb)
