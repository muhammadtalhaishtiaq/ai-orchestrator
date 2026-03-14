import json
import os
import base64
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, Query, BackgroundTasks
from app.api.deps import get_current_user
from app.database import supabase_admin
from app.services.github_service import get_github_token
from typing import Optional
from github import Github, GithubException
import nbformat
from nbformat.v4 import new_notebook, new_markdown_cell, new_code_cell
from app.services.notebook_generator import build_cells as _build_notebook_cells, build_notebook_file

router = APIRouter(prefix="/notebooks", tags=["Notebooks"])

VALID_STATUSES = ["pending", "generated", "published", "skipped", "missing"]

# In-memory store for generated notebook content (keyed by notebook_id)
# Avoids needing a new DB column; cleared on server restart (acceptable since
# user must push before restarting anyway)
_generated_cache: dict = {}

# Load notebook generation config
_CONFIG_PATH = os.path.join(os.path.dirname(__file__), "../config/notebook_config.json")
with open(_CONFIG_PATH) as f:
    NOTEBOOK_CONFIG = json.load(f)


# ---------------------------------------------------------------------------
# Queue and stats
# ---------------------------------------------------------------------------

@router.get("/queue")
async def get_content_queue(
    folder: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user)
):
    """Return all notebooks grouped by folder. Includes missing placeholders."""
    query = (
        supabase_admin.table("notebooks")
        .select("*")
        .eq("user_id", current_user["id"])
        .order("folder_order", desc=False)
        .order("notebook_order", desc=False)
    )
    if folder:
        query = query.eq("folder", folder)
    if status:
        query = query.eq("status", status)

    result = query.execute()
    notebooks = result.data or []

    # First non-missing, non-skipped notebook is "next in line"
    next_in_line = None
    for nb in notebooks:
        if nb["status"] in ("pending", "missing"):
            next_in_line = nb["id"]
            break

    folders: dict = {}
    for nb in notebooks:
        fn = nb["folder"]
        if fn not in folders:
            folders[fn] = {
                "name": fn,
                "order": nb["folder_order"],
                "notebooks": [],
                "stats": {"pending": 0, "generated": 0, "published": 0, "skipped": 0, "missing": 0},
            }
        folders[fn]["notebooks"].append({**nb, "is_next": nb["id"] == next_in_line})
        s = nb["status"] if nb["status"] in folders[fn]["stats"] else "pending"
        folders[fn]["stats"][s] += 1

    sorted_folders = sorted(folders.values(), key=lambda x: x["order"])

    return {
        "folders": sorted_folders,
        "total": len(notebooks),
        "next_in_line_id": next_in_line,
        "stats": {
            "pending":   sum(1 for n in notebooks if n["status"] == "pending"),
            "generated": sum(1 for n in notebooks if n["status"] == "generated"),
            "published": sum(1 for n in notebooks if n["status"] == "published"),
            "skipped":   sum(1 for n in notebooks if n["status"] == "skipped"),
            "missing":   sum(1 for n in notebooks if n["status"] == "missing"),
        },
    }


@router.patch("/{notebook_id}/status")
async def update_notebook_status(
    notebook_id: str,
    status: str,
    current_user: dict = Depends(get_current_user)
):
    if status not in VALID_STATUSES:
        raise HTTPException(400, f"Invalid status. Must be one of: {VALID_STATUSES}")

    result = (
        supabase_admin.table("notebooks")
        .update({"status": status})
        .eq("id", notebook_id)
        .eq("user_id", current_user["id"])
        .execute()
    )
    if not result.data:
        raise HTTPException(404, "Notebook not found")
    return {"message": "Status updated", "notebook": result.data[0]}


@router.get("/next")
async def get_next_notebook(current_user: dict = Depends(get_current_user)):
    result = (
        supabase_admin.table("notebooks")
        .select("*")
        .eq("user_id", current_user["id"])
        .eq("status", "pending")
        .order("folder_order", desc=False)
        .order("notebook_order", desc=False)
        .limit(1)
        .execute()
    )
    if not result.data:
        return {"next_notebook": None, "message": "No pending notebooks in queue"}
    return {"next_notebook": result.data[0]}


@router.get("/stats")
async def get_notebook_stats(current_user: dict = Depends(get_current_user)):
    result = (
        supabase_admin.table("notebooks")
        .select("status")
        .eq("user_id", current_user["id"])
        .execute()
    )
    notebooks = result.data or []
    stats = {"pending": 0, "generated": 0, "published": 0, "skipped": 0, "missing": 0, "total": len(notebooks)}
    for nb in notebooks:
        s = nb["status"]
        if s in stats:
            stats[s] += 1
    return stats


# ---------------------------------------------------------------------------
# Regenerate — generate notebook cells following notebook_config.json rules
# ---------------------------------------------------------------------------

def _build_notebook_cells(notebook_name: str, folder: str, path: str) -> list:
    """
    Build notebook cells for a given topic following the config structure.
    Returns a list of dicts {cell_type, source} for the preview API.
    Uses nbformat internally to produce the full .ipynb content.
    """
    cfg = NOTEBOOK_CONFIG
    difficulty_map = cfg["folder_difficulty_map"]
    difficulty = difficulty_map.get(folder, "intermediate")
    diff_cfg = cfg["difficulty_levels"][difficulty]
    colab_url = cfg["colab_badge_format"].replace("{path}", path)

    topic = notebook_name  # e.g. "Handling Missing Values"

    cells = []

    # Header cell with Colab badge
    cells.append({
        "cell_type": "markdown",
        "source": f"# {topic}\n\n{colab_url}\n\n---"
    })

    # Section 1 — What are we building
    cells.append({
        "cell_type": "markdown",
        "source": (
            f"## 🎯 What are we building today?\n\n"
            f"In this notebook, we'll learn about **{topic}** — one of the key ideas in machine learning. "
            f"By the end, you'll understand what it is, why it matters, and how to use it in your own projects."
        )
    })

    # Section 2 — The idea in plain English
    cells.append({
        "cell_type": "markdown",
        "source": (
            f"## 💡 The idea (plain English)\n\n"
            f"Think of **{topic}** like this: imagine you're a chef and your ingredients are your data. "
            f"Before you start cooking (training a model), you need to make sure your ingredients are clean, "
            f"complete, and in the right format. That's exactly what this concept helps you do.\n\n"
            f"**Why does this matter?** Because messy data = bad predictions. "
            f"Even the fanciest model won't work well if the data going in is broken.\n\n"
            f"> **Difficulty level:** {difficulty.capitalize()} | **Estimated time:** 15–20 minutes"
        )
    })

    # Section 3 — Setup
    cells.append({
        "cell_type": "markdown",
        "source": "## ⚙️ Setup\n\nLet's import what we need. Don't worry — we'll explain each library as we use it."
    })
    cells.append({
        "cell_type": "code",
        "source": (
            "import numpy as np          # for numerical operations\n"
            "import pandas as pd         # for working with tables (DataFrames)\n"
            "import matplotlib.pyplot as plt  # for creating charts\n"
            "import seaborn as sns        # for prettier charts\n"
            "from sklearn.model_selection import train_test_split  # to split data\n\n"
            "# Make our charts look nice\n"
            "plt.style.use('seaborn-v0_8-whitegrid')\n"
            "print('✅ Setup complete!')"
        )
    })

    # Section 4 — Step by step implementation
    cells.append({
        "cell_type": "markdown",
        "source": f"## 🔨 Let's code it step by step\n\n### Step 1 — Load some sample data\n\nWe'll use a simple, realistic dataset so you can see exactly what's happening."
    })
    cells.append({
        "cell_type": "code",
        "source": (
            "# Create a small sample dataset\n"
            "# (In real projects you'd load this from a CSV or database)\n"
            "data = {\n"
            "    'age': [25, 30, 35, None, 45, 50, 28, None, 40, 33],\n"
            "    'salary': [50000, 60000, None, 80000, 90000, 100000, 55000, 75000, None, 65000],\n"
            "    'experience': [2, 5, 8, 12, 15, 20, 3, 10, 14, 7],\n"
            "    'hired': [0, 1, 1, 1, 1, 1, 0, 1, 1, 1]\n"
            "}\n\n"
            "df = pd.DataFrame(data)\n"
            "print(f'Dataset shape: {df.shape}')\n"
            "df.head()"
        )
    })

    cells.append({
        "cell_type": "markdown",
        "source": f"### Step 2 — Apply {topic}\n\nHere's where the magic happens. We'll walk through this line by line."
    })
    cells.append({
        "cell_type": "code",
        "source": (
            f"# Check what we're working with before making any changes\n"
            f"print('Before processing:')\n"
            f"print(df.describe())\n"
            f"print('\\nMissing values:')\n"
            f"print(df.isnull().sum())"
        )
    })

    # Section 5 — Results
    cells.append({
        "cell_type": "markdown",
        "source": "## 📊 What did we get?\n\nLet's look at the results and understand what each number is telling us."
    })
    cells.append({
        "cell_type": "code",
        "source": (
            "# Fill missing values with the column median (more robust than mean)\n"
            "df_clean = df.fillna(df.median(numeric_only=True))\n\n"
            "print('After processing:')\n"
            "print(df_clean.describe())\n"
            "print('\\nMissing values remaining:', df_clean.isnull().sum().sum())\n"
            "print('\\n✅ Data is now clean and ready for modeling!')"
        )
    })

    # Section 6 — Visualization
    cells.append({
        "cell_type": "markdown",
        "source": "## 📈 Let's see it\n\nA picture is worth a thousand numbers. Let's visualize what changed."
    })
    cells.append({
        "cell_type": "code",
        "source": (
            "fig, axes = plt.subplots(1, 2, figsize=(12, 5))\n\n"
            "# Before: show missing values\n"
            "axes[0].bar(df.columns, df.isnull().sum(), color='#ef4444')\n"
            "axes[0].set_title('Missing Values — Before', fontsize=14, fontweight='bold')\n"
            "axes[0].set_xlabel('Column')\n"
            "axes[0].set_ylabel('Number of Missing Values')\n\n"
            "# After: distribution of salary\n"
            "axes[1].hist(df_clean['salary'], bins=8, color='#22c55e', edgecolor='white')\n"
            "axes[1].set_title('Salary Distribution — After Cleaning', fontsize=14, fontweight='bold')\n"
            "axes[1].set_xlabel('Salary ($)')\n"
            "axes[1].set_ylabel('Count')\n\n"
            "plt.tight_layout()\n"
            "plt.show()\n"
            "print('Chart shows: left = where data was missing, right = clean data distribution')"
        )
    })

    # Section 7 — Summary
    cells.append({
        "cell_type": "markdown",
        "source": (
            f"## ✅ Quick recap\n\n"
            f"Here's what we covered in this notebook:\n\n"
            f"- 📌 **What is {topic}** — a core step in preparing data for ML models\n"
            f"- 🔍 **Why it matters** — bad data in = bad predictions out\n"
            f"- 🛠️ **How to apply it** — using pandas and sklearn in just a few lines\n"
            f"- 📊 **How to check** — always visualize before and after\n"
            f"- ⏭️ **What's next** — try this on a real dataset from Kaggle!"
        )
    })

    # Section 8 — Exercises
    cells.append({
        "cell_type": "markdown",
        "source": "## 🏋️ Try it yourself\n\nDon't just read — practice! Complete these 3 exercises:"
    })
    cells.append({
        "cell_type": "code",
        "source": (
            f"# Exercise 1: What is the percentage of missing values in each column?\n"
            f"# Hint: use df.isnull().mean() * 100\n"
            f"# YOUR CODE HERE:\n\n\n"
            f"# Exercise 2: Instead of filling with median, try filling with the mean.\n"
            f"# Hint: use df.fillna(df.mean(numeric_only=True))\n"
            f"# YOUR CODE HERE:\n\n\n"
            f"# Exercise 3: Drop any row that has more than 1 missing value.\n"
            f"# Hint: use df.dropna(thresh=len(df.columns)-1)\n"
            f"# YOUR CODE HERE:\n"
        )
    })

    return cells


@router.post("/{notebook_id}/regenerate")
async def regenerate_notebook(
    notebook_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Generate notebook content following notebook_config.json rules.
    Returns preview cells + full nbformat JSON.
    Does NOT push to GitHub — user must explicitly call /push-github.
    """
    # Fetch notebook record
    result = (
        supabase_admin.table("notebooks")
        .select("*")
        .eq("id", notebook_id)
        .eq("user_id", current_user["id"])
        .execute()
    )
    if not result.data:
        raise HTTPException(404, "Notebook not found")

    nb_record = result.data[0]
    cells_data = _build_notebook_cells(
        notebook_name=nb_record["name"],
        folder=nb_record["folder"],
        path=nb_record["path"],
    )

    # Build full .ipynb using the shared generator service
    nb_json = build_notebook_file(cells_data)

    # Cache content in memory for later push
    _generated_cache[notebook_id] = nb_json

    # Update status in DB
    supabase_admin.table("notebooks").update({
        "status": "generated",
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }).eq("id", notebook_id).execute()

    return {
        "notebook_id": notebook_id,
        "name": nb_record["name"],
        "path": nb_record["path"],
        "difficulty": NOTEBOOK_CONFIG["folder_difficulty_map"].get(nb_record["folder"], "intermediate"),
        "cells": cells_data,         # preview cells
        "notebook_json": nb_json,    # full .ipynb content
        "total_cells": len(cells_data),
        "config_version": NOTEBOOK_CONFIG["meta"]["version"],
    }


# ---------------------------------------------------------------------------
# Push generated notebook to GitHub
# ---------------------------------------------------------------------------

@router.post("/{notebook_id}/push-github")
async def push_notebook_to_github(
    notebook_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Push a previously generated notebook to the connected GitHub repo."""
    # Get notebook record (must be in generated state)
    result = (
        supabase_admin.table("notebooks")
        .select("*")
        .eq("id", notebook_id)
        .eq("user_id", current_user["id"])
        .execute()
    )
    if not result.data:
        raise HTTPException(404, "Notebook not found")

    nb_record = result.data[0]
    if nb_record["status"] != "generated":
        raise HTTPException(400, "Notebook must be generated first before pushing to GitHub")

    notebook_json = _generated_cache.get(notebook_id)
    if not notebook_json:
        raise HTTPException(400, "Generated content not found in cache. Please regenerate first (content is cleared on server restart).")

    # Get GitHub token
    token = await get_github_token(current_user["id"])
    if not token:
        raise HTTPException(400, "No GitHub token connected")

    # Get connected repo
    conn_result = (
        supabase_admin.table("github_connections")
        .select("connected_repo")
        .eq("user_id", current_user["id"])
        .eq("is_active", True)
        .execute()
    )
    if not conn_result.data or not conn_result.data[0].get("connected_repo"):
        raise HTTPException(400, "No GitHub repo connected")

    repo_full_name = conn_result.data[0]["connected_repo"]

    try:
        g = Github(token)
        repo = g.get_repo(repo_full_name)
        path = nb_record["path"]
        commit_msg = f"feat: add {nb_record['name']} notebook"

        try:
            # File already exists — update it
            existing = repo.get_contents(path)
            repo.update_file(
                path=path,
                message=commit_msg,
                content=notebook_json,
                sha=existing.sha,
            )
            action = "updated"
        except GithubException:
            # File doesn't exist — create it
            repo.create_file(
                path=path,
                message=commit_msg,
                content=notebook_json,
            )
            action = "created"

        # Update status to published in DB
        supabase_admin.table("notebooks").update({
            "status": "published",
            "html_url": f"https://github.com/{repo_full_name}/blob/main/{path}",
        }).eq("id", notebook_id).execute()

        # Auto-advance: promote next missing notebook in same folder to pending
        next_nb = (
            supabase_admin.table("notebooks")
            .select("id, name")
            .eq("user_id", current_user["id"])
            .eq("folder", nb_record["folder"])
            .eq("status", "missing")
            .gt("notebook_order", nb_record["notebook_order"])
            .order("folder_order", desc=False)
            .order("notebook_order", desc=False)
            .limit(1)
            .execute()
        )
        advanced_next = None
        if next_nb.data:
            supabase_admin.table("notebooks").update({"status": "pending"})                .eq("id", next_nb.data[0]["id"]).execute()
            advanced_next = next_nb.data[0]

        return {
            "message": f"Notebook {action} on GitHub",
            "path": path,
            "repo": repo_full_name,
            "github_url": f"https://github.com/{repo_full_name}/blob/main/{path}",
            "action": action,
            "next_up": advanced_next,
        }

    except GithubException as e:
        raise HTTPException(500, f"GitHub push failed: {str(e)}")


# ---------------------------------------------------------------------------
# GitHub Sync — scan repo and update DB status for all notebooks
# ---------------------------------------------------------------------------

@router.post("/sync")
async def sync_from_github(
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user)
):
    """
    Scan GitHub repo and update each notebook's status in the DB.
    - File exists on GitHub → status = 'generated' (if currently missing/pending)
    - File does not exist   → status stays as-is, but we flag it
    Returns a sync summary immediately; DB updates happen in background.
    """
    token = await get_github_token(current_user["id"])
    if not token:
        raise HTTPException(400, "No GitHub token connected")

    conn_result = (
        supabase_admin.table("github_connections")
        .select("connected_repo")
        .eq("user_id", current_user["id"])
        .eq("is_active", True)
        .execute()
    )
    if not conn_result.data or not conn_result.data[0].get("connected_repo"):
        raise HTTPException(400, "No GitHub repo connected")

    repo_full_name = conn_result.data[0]["connected_repo"]

    # Get all notebooks for this user
    nb_result = (
        supabase_admin.table("notebooks")
        .select("id, path, status")
        .eq("user_id", current_user["id"])
        .execute()
    )
    all_notebooks = nb_result.data or []

    try:
        g = Github(token)
        repo = g.get_repo(repo_full_name)

        # Fetch all .ipynb file paths from GitHub (recursive tree walk)
        tree = repo.get_git_tree(sha="HEAD", recursive=True)
        github_paths = {
            item.path for item in tree.tree
            if item.path.endswith(".ipynb")
        }
    except GithubException as e:
        raise HTTPException(500, f"GitHub scan failed: {str(e)}")

    # Determine status updates
    updates = {"found_on_github": [], "not_on_github": [], "already_published": []}
    bulk_updates = []

    for nb in all_notebooks:
        if nb["path"] in github_paths:
            if nb["status"] == "published":
                updates["already_published"].append(nb["path"])
            else:
                updates["found_on_github"].append(nb["path"])
                bulk_updates.append({"id": nb["id"], "new_status": "generated"})
        else:
            updates["not_on_github"].append(nb["path"])
            if nb["status"] not in ("missing", "skipped", "pending"):
                bulk_updates.append({"id": nb["id"], "new_status": "missing"})

    # Apply DB updates in background
    async def _apply_updates():
        for upd in bulk_updates:
            supabase_admin.table("notebooks").update({
                "status": upd["new_status"],
            }).eq("id", upd["id"]).execute()

    background_tasks.add_task(_apply_updates)

    return {
        "message": "Sync started — database is being updated",
        "repo": repo_full_name,
        "synced_at": datetime.now(timezone.utc).isoformat(),
        "summary": {
            "total_notebooks": len(all_notebooks),
            "found_on_github": len(updates["found_on_github"]),
            "not_on_github": len(updates["not_on_github"]),
            "already_published": len(updates["already_published"]),
            "db_updates_queued": len(bulk_updates),
        },
        "github_file_count": len(github_paths),
    }
