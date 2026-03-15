"""
LLM Service — real AI notebook generation.

Supports: OpenAI, Anthropic, Gemini, AIML API, Kimi
Uses requests (no extra SDK deps) for all providers.

Returns a list of cells: [{"cell_type": "markdown"|"code", "source": str}]
Falls back to template generation on any error.
"""

import json
import re
import logging
import requests
from typing import Optional

logger = logging.getLogger(__name__)

# ── Model defaults per provider ───────────────────────────────────────────────

DEFAULT_MODELS = {
    "openai":    "gpt-4o-mini",
    "anthropic": "claude-3-5-haiku-20241022",
    "gemini":    "gemini-1.5-flash",
    "aiml-api":  "gpt-4o-mini",
    "kimi":      "kimi-k2-turbo-preview",
}

# ── System prompt ─────────────────────────────────────────────────────────────

SYSTEM_PROMPT = """\
You are an expert ML educator who writes Jupyter notebooks for a data science course.
You write clear, practical, beginner-friendly content with working Python code.
Always return ONLY valid JSON — no markdown fences, no extra text, nothing else.
"""

# ── User prompt template ──────────────────────────────────────────────────────

def _build_prompt(topic: str, folder: str, difficulty: str) -> str:
    return f"""Create a complete Jupyter notebook for the topic: **{topic}**
Folder/module: {folder}
Difficulty: {difficulty}

Return ONLY this JSON structure (no markdown, no explanation, just the JSON):
{{
  "cells": [
    {{"cell_type": "markdown", "source": "# {topic}\\n\\n---"}},
    {{"cell_type": "markdown", "source": "## What are we learning?\\n\\n<2-3 sentences specific to {topic}>"}},
    {{"cell_type": "markdown", "source": "## The idea in plain English\\n\\n<concrete analogy + explanation specific to {topic}>"}},
    {{"cell_type": "markdown", "source": "## Setup"}},
    {{"cell_type": "code", "source": "<real imports for {topic} — numpy, pandas, sklearn, etc>\\nprint('Setup done!')"}},
    {{"cell_type": "markdown", "source": "## Step 1 — Load data"}},
    {{"cell_type": "code", "source": "<real working Python code with a relevant toy dataset for {topic}>"}},
    {{"cell_type": "markdown", "source": "## Step 2 — Apply {topic}"}},
    {{"cell_type": "code", "source": "<working code that demonstrates {topic} — NOT generic, specific to the concept>"}},
    {{"cell_type": "markdown", "source": "## Step 3 — Visualise"}},
    {{"cell_type": "code", "source": "<matplotlib/seaborn plot showing the result of {topic}>"}},
    {{"cell_type": "markdown", "source": "## Results & interpretation"}},
    {{"cell_type": "code", "source": "<print key metrics or results with explanatory comments>"}},
    {{"cell_type": "markdown", "source": "## Summary\\n\\n<3-5 bullet points recapping what was learned about {topic}>"}},
    {{"cell_type": "markdown", "source": "## Exercises\\n\\n1. <Exercise 1 specific to {topic}>\\n2. <Exercise 2>\\n3. <Exercise 3>"}},
    {{"cell_type": "code", "source": "# Your code here"}}
  ]
}}

Rules:
- Every code cell must contain REAL, EXECUTABLE Python code (not pseudocode)
- Use numpy, pandas, matplotlib, seaborn, sklearn as needed (all are available)
- Content must be SPECIFIC to {topic}, not generic
- No placeholder text like <insert here> in the final output
- At least 6 code cells with substantive code
"""


# ── Provider callers ──────────────────────────────────────────────────────────

def _call_openai_compatible(
    base_url: str,
    api_key: str,
    model: str,
    prompt: str,
    extra_headers: Optional[dict] = None,
) -> str:
    """Shared caller for OpenAI-compatible APIs (OpenAI, AIML, Kimi)."""
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        **(extra_headers or {}),
    }
    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user",   "content": prompt},
        ],
        "temperature": 0.4,
        "max_tokens": 4096,
    }
    resp = requests.post(base_url, headers=headers, json=payload, timeout=90)
    if not resp.ok:
        logger.error(f"LLM call failed — URL: {resp.url} | status: {resp.status_code} | body: {resp.text[:400]}")
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"]


def _call_anthropic(api_key: str, model: str, prompt: str) -> str:
    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model,
        "max_tokens": 4096,
        "system": SYSTEM_PROMPT,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.4,
    }
    resp = requests.post(
        "https://api.anthropic.com/v1/messages",
        headers=headers, json=payload, timeout=90
    )
    resp.raise_for_status()
    return resp.json()["content"][0]["text"]


def _call_gemini(api_key: str, model: str, prompt: str) -> str:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    payload = {
        "system_instruction": {"parts": [{"text": SYSTEM_PROMPT}]},
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.4, "maxOutputTokens": 4096},
    }
    resp = requests.post(url, json=payload, timeout=90)
    resp.raise_for_status()
    return resp.json()["candidates"][0]["content"]["parts"][0]["text"]


# ── JSON parser ───────────────────────────────────────────────────────────────

def _parse_cells(raw: str) -> list:
    """Extract JSON cells array from LLM response."""
    # Strip markdown fences if the model wrapped it anyway
    raw = re.sub(r"^```(?:json)?\s*", "", raw.strip())
    raw = re.sub(r"\s*```$", "", raw.strip())

    data = json.loads(raw)
    cells = data.get("cells", [])

    # Validate basic structure
    valid = []
    for c in cells:
        ct = c.get("cell_type", "code")
        src = c.get("source", "")
        if ct in ("markdown", "code") and isinstance(src, str) and src.strip():
            valid.append({"cell_type": ct, "source": src})

    if len(valid) < 4:
        raise ValueError(f"Too few valid cells returned: {len(valid)}")

    return valid


# ── Public API ────────────────────────────────────────────────────────────────

def generate_notebook_cells(
    topic: str,
    folder: str,
    difficulty: str,
    provider: str,
    model: Optional[str],
    api_key: str,
) -> list:
    """
    Call the specified LLM provider and return a list of notebook cells.
    Raises on failure — caller should catch and fall back to template.
    """
    provider = provider.lower().strip()
    model = model or DEFAULT_MODELS.get(provider, "gpt-4o-mini")
    prompt = _build_prompt(topic, folder, difficulty)

    if provider == "openai":
        raw = _call_openai_compatible(
            "https://api.openai.com/v1/chat/completions",
            api_key, model, prompt
        )
    elif provider == "anthropic":
        raw = _call_anthropic(api_key, model, prompt)
    elif provider == "gemini":
        raw = _call_gemini(api_key, model, prompt)
    elif provider == "aiml-api":
        raw = _call_openai_compatible(
            "https://api.aimlapi.com/v1/chat/completions",
            api_key, model, prompt
        )
    elif provider == "kimi":
        raw = _call_openai_compatible(
            "https://api.moonshot.ai/v1/chat/completions",
            api_key, model, prompt
        )
    else:
        raise ValueError(f"Unsupported provider: {provider}")

    cells = _parse_cells(raw)
    logger.info(f"LLM generated {len(cells)} cells for '{topic}' via {provider}/{model}")
    return cells
