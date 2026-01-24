# 🚀 Project Nebula - ML Engineering Learning Guide

> **Your journey from Software Engineer to ML Engineer, one module at a time.**

This document is your personal learning companion. Every time we build a module, we'll add what you learned here. By the end, you'll have a complete reference of ML engineering concepts you've mastered.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Phase 0: Foundation & Setup](#phase-0-foundation--setup)
   - [Lesson 1: Environment Configuration](#lesson-1-environment-configuration)
   - [Lesson 2: Pydantic & Data Validation](#lesson-2-pydantic--data-validation)
   - [Lesson 3: Database Connection (MongoDB)](#lesson-3-database-connection-mongodb)
   - [Lesson 4: Project Structure](#lesson-4-project-structure)
   - [Lesson 5: CI/CD & Deployment](#lesson-5-cicd--deployment)
3. [Phase 1: Authentication](#phase-1-authentication) *(Coming Soon)*
4. [Phase 2: Classification & Intent Router](#phase-2-classification--intent-router) *(Coming Soon)*
5. [ML Concepts Glossary](#ml-concepts-glossary)
6. [Commands Cheatsheet](#commands-cheatsheet)

---

## Project Overview

### What We're Building
**Project Nebula** - A Hybrid AI Orchestrator that demonstrates 25+ ML algorithms in a real application.

### Why This Project?
| What HRs See | What You Learn |
|--------------|----------------|
| "Built ML-powered AI orchestrator" | Actual ML implementation |
| "25+ algorithms in production" | When to use which algorithm |
| "Classification, Regression, NLP, Deep Learning" | Full ML pipeline |
| "FastAPI + MongoDB + React" | Production ML deployment |

### Tech Stack
```
Frontend:  Next.js 19 + React + TypeScript + Tailwind
Backend:   FastAPI + Python 3.11
Database:  MongoDB Atlas (cloud)
AI/ML:     scikit-learn, TensorFlow, OpenAI API
Hosting:   Render (backend) + Vercel (frontend)
```

---

## Phase 0: Foundation & Setup

**Status:** ✅ Complete  
**Date:** January 24, 2026

### What We Built
- Project structure
- Environment configuration
- MongoDB connection
- Health check endpoints

---

### Lesson 1: Environment Configuration

#### The Problem
You have secrets (API keys, passwords) that:
- ❌ Should NOT be in your code
- ❌ Should NOT be committed to GitHub
- ✅ Should be in environment variables

#### The Solution: `.env` Files

```
project_nebula/
├── .env              ← Secrets live here (git-ignored)
├── .gitignore        ← Lists .env so it's never committed
└── backend/
    └── config.py     ← Loads .env and provides settings
```

#### Your `.env` File
```env
# Database
MONGODB_URI='mongodb+srv://user:password@cluster.mongodb.net/dbname'

# AI
OPENAI_API_KEY='sk-proj-...'

# Security
JWT_SECRET='your-random-secret-key'

# Environment
ENVIRONMENT=development
```

#### Key Concept: Why Separate Config?

```
┌─────────────────────────────────────────────────────────────┐
│                    SAME CODE                                │
│                      main.py                                │
└─────────────────────────────────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │ .env.dev │    │.env.test │    │.env.prod │
    │          │    │          │    │          │
    │ DEBUG=1  │    │ DEBUG=1  │    │ DEBUG=0  │
    │ DB=local │    │ DB=test  │    │ DB=prod  │
    └──────────┘    └──────────┘    └──────────┘
    Development      Testing        Production
```

**Same code, different configs = Easy deployment!**

---

### Lesson 2: Pydantic & Data Validation

#### What is Pydantic?
A Python library that validates data automatically.

#### Why ML Engineers Need It
| Without Validation | With Pydantic |
|-------------------|---------------|
| Bad data → Bad predictions | Bad data → Clear error |
| Crashes in production | Catches errors early |
| Silent bugs | Explicit validation |

#### Example: API Request Validation

```python
# WITHOUT Pydantic (dangerous)
@app.post("/predict")
def predict(data):
    age = data["age"]         # What if missing? 💥
    income = data["income"]   # What if string? 💥
    return model.predict([[age, income]])

# WITH Pydantic (safe)
class PredictRequest(BaseModel):
    age: int                  # MUST be integer
    income: float             # MUST be number

@app.post("/predict")
def predict(data: PredictRequest):  # Auto-validated!
    return model.predict([[data.age, data.income]])
```

#### Pydantic Settings (for config)

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # REQUIRED - No default, must be in .env
    mongodb_uri: str
    openai_api_key: str
    
    # OPTIONAL - Has default value
    debug: bool = True
    environment: str = "development"
```

#### Key Concept: Type Hints

```python
# Python type hints tell Pydantic what to expect
name: str           # Must be text
age: int            # Must be whole number
price: float        # Must be decimal number
is_active: bool     # Must be True/False
tags: List[str]     # Must be list of strings
```

---

### Lesson 3: Database Connection (MongoDB)

#### Why MongoDB for ML Projects?

| Feature | Why It Matters for ML |
|---------|----------------------|
| Schema-flexible | ML data structures change often |
| JSON-native | Easy to store model metadata |
| Scalable | Handles large datasets |
| Cloud-hosted (Atlas) | No server management |

#### Connection Pattern (Async)

```python
from motor.motor_asyncio import AsyncIOMotorClient

# Motor = Async MongoDB driver for Python
# Async = Non-blocking = Fast for web apps

async def connect():
    client = AsyncIOMotorClient(uri)
    db = client["nebula"]
    await client.admin.command('ping')  # Test connection
    return db
```

#### Why Async?

```
SYNCHRONOUS (blocking):
Request 1: [====WAIT FOR DB====]
Request 2:                      [====WAIT FOR DB====]
Request 3:                                           [====]
Total time: ████████████████████████████████████████

ASYNCHRONOUS (non-blocking):
Request 1: [====]
Request 2: [====]
Request 3: [====]
Total time: ████
```

#### Key Files

| File | Purpose |
|------|---------|
| `database/mongodb.py` | Connection logic |
| `database/models.py` | Data shapes (User, Chat, etc.) |
| `database/__init__.py` | Exports for easy imports |

#### MongoDB Atlas IP Whitelist

```
For Development:  Add 0.0.0.0/0 (allow all IPs)
For Production:   Add only your server's IP
```

---

### Lesson 5: CI/CD & Deployment

#### What is CI/CD?

```
CI = Continuous Integration → Auto-test code when pushed
CD = Continuous Deployment  → Auto-deploy when tests pass
```

#### Our CI/CD Pipeline Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         YOUR WORKFLOW                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  1. LOCAL DEVELOPMENT                                           │
│     • Write code                                                │
│     • Test locally (uvicorn, npm run dev)                       │
│     • Happy with changes? → git push                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. GITHUB ACTIONS (Automatic)                                  │
│     • Detects push to main branch                               │
│     • Runs tests (pytest)                                       │
│     • Runs linting (flake8)                                     │
│     • Builds application                                        │
│     • If all pass → triggers deploy                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. RENDER (Automatic)                                          │
│     • Receives deploy webhook                                   │
│     • Pulls latest code                                         │
│     • Installs dependencies                                     │
│     • Starts application                                        │
│     • Your app is LIVE! 🚀                                      │
└─────────────────────────────────────────────────────────────────┘
```

#### Monorepo Deployment (Multiple Folders, One Repo)

Our project structure:
```
project_nebula/           ← ONE GitHub repo
├── backend/              ← Deploys as Render Service 1 (Python)
├── ai-engine/            ← NOT separate! Imported by backend
├── web-client/           ← Deploys as Render Service 2 (Node.js)
└── ML =_ A-Z/            ← NOT deployed (learning materials)
```

How `ai-engine/` works:
```python
# backend/main.py
import sys
sys.path.append('..')  # Add parent directory
from ai_engine.classification import IntentClassifier  # Now we can import!
```

#### Key CI/CD Files

| File | Purpose |
|------|---------|
| `.github/workflows/backend-ci.yml` | Tests & deploys backend when changed |
| `.github/workflows/frontend-ci.yml` | Tests & deploys frontend when changed |
| `render.yaml` | Tells Render how to deploy both services |
| `.gitignore` | Prevents secrets from being committed |

#### Path-Based Triggers

```yaml
# Only runs when backend files change
on:
  push:
    paths:
      - 'backend/**'
      - 'ai-engine/**'
```

This means:
- Change `backend/main.py` → Backend CI runs ✅
- Change `web-client/page.tsx` → Frontend CI runs ✅
- Change `README.md` → Nothing runs (not in paths)

#### GitHub Secrets (Required)

Go to: GitHub Repo → Settings → Secrets → Actions

| Secret Name | Value | Used By |
|-------------|-------|---------|
| `MONGODB_URI` | Your MongoDB connection string | Backend CI |
| `OPENAI_API_KEY` | Your OpenAI API key | Backend CI |
| `JWT_SECRET` | Random secret string | Backend CI |
| `RENDER_DEPLOY_HOOK_BACKEND` | From Render dashboard | Deploy trigger |
| `RENDER_DEPLOY_HOOK_FRONTEND` | From Render dashboard | Deploy trigger |

#### Why CI/CD Matters for ML Engineers

| Without CI/CD | With CI/CD |
|---------------|------------|
| "Works on my machine" | Works everywhere |
| Manual testing | Auto testing |
| Forget to test → bugs in prod | Can't deploy without tests |
| Manual deploy = errors | Consistent deploys |

#### Setting Up Render (Do This Once)

1. Go to [render.com](https://render.com)
2. Connect your GitHub account
3. Click "New" → "Blueprint"
4. Select your repo
5. Render reads `render.yaml` and creates both services
6. Add environment variables in Render dashboard
7. Get deploy hooks: Service → Settings → Deploy Hook → Copy URL

---

### Lesson 4: Project Structure

#### Why Structure Matters

```
❌ BAD (everything in one file):
main.py (2000 lines) → Hard to find anything!

✅ GOOD (organized by responsibility):
backend/
├── main.py           → App entry point (small)
├── config.py         → Configuration
├── database/         → Database stuff
├── auth/             → Authentication stuff
└── api/              → API endpoints
```

#### Our Structure

```
project_nebula/
├── .env                    # Secrets (git-ignored!)
├── .gitignore             # What to ignore in git
├── LEARNING_GUIDE.md      # This file!
│
├── backend/               # Python API
│   ├── main.py           # FastAPI app
│   ├── config.py         # Settings
│   ├── requirements.txt  # Dependencies
│   ├── database/         # MongoDB connection & models
│   └── venv/             # Virtual environment
│
├── ai-engine/            # ML modules (coming soon!)
│   ├── preprocessing/    # Data cleaning
│   ├── classification/   # Intent detection
│   ├── regression/       # Predictions
│   └── ...
│
└── web-client/           # Next.js frontend
    ├── app/              # Pages
    └── components/       # UI components
```

---

### Key Concepts from Phase 0

| Concept | What It Means | Why It Matters |
|---------|---------------|----------------|
| **Environment Variables** | Config stored outside code | Security + Flexibility |
| **Pydantic** | Data validation library | Catches bad data early |
| **Type Hints** | `name: str` | Self-documenting code |
| **Async/Await** | Non-blocking code | Better performance |
| **Motor** | Async MongoDB driver | Fast database access |
| **Fail Fast** | Crash early on bad config | Find bugs before production |
| **LRU Cache** | Store results for reuse | Speed optimization |
| **CI/CD** | Auto test & deploy | Consistent, reliable releases |
| **Monorepo** | Multiple projects in one repo | Easier management |
| **GitHub Actions** | Automated workflows | Test on every push |

---

## Phase 1: Authentication

**Status:** 🔄 In Progress  
**Date:** January 24, 2026

*(Will be filled after we build it)*

---

## Phase 2: Classification & Intent Router

**Status:** ⬜ Not Started

### What We'll Learn
- How classification algorithms work
- Training a model on text data
- Saving/loading models (`.pkl` files)
- Using ML in production APIs

*(Will be filled after we build it)*

---

## ML Concepts Glossary

| Term | Definition | Example in Our Project |
|------|------------|----------------------|
| **Classification** | Predicting a category | User message → Intent (data_analysis, coding_help) |
| **Regression** | Predicting a number | Historical data → Future revenue |
| **Clustering** | Grouping similar items | Users → Segments (power user, casual) |
| **NLP** | Processing human language | "Analyze sales" → tokens → features |
| **Training** | Teaching model from data | Feed examples, model learns patterns |
| **Inference** | Using trained model | New message → Model → Prediction |
| **Feature** | Input variable to model | Word count, sentiment score |
| **Label** | Output we're predicting | Intent category |
| **Overfitting** | Model memorizes, doesn't generalize | 99% train accuracy, 60% test |

---

## Commands Cheatsheet

### Backend

```powershell
# Navigate to backend
cd d:\personal\project_nabula\backend

# Activate virtual environment
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
python -m uvicorn main:app --reload --port 8000

# Test health endpoint
curl http://localhost:8000/api/health
```

### MongoDB

```
# Connection string format
mongodb+srv://USER:PASSWORD@cluster.mongodb.net/DATABASE

# Special characters in password must be encoded:
@ → %40
: → %3A
/ → %2F
```

### Git

```powershell
# Check status
git status

# Add all files
git add .

# Commit
git commit -m "message"

# Push
git push origin main
```

---

## Progress Tracker

| Phase | Module | Status | Date |
|-------|--------|--------|------|
| 0 | Environment Setup | ✅ Done | Jan 24, 2026 |
| 0 | MongoDB Connection | ✅ Done | Jan 24, 2026 |
| 0 | Config Management | ✅ Done | Jan 24, 2026 |
| 0 | CI/CD Pipeline | ✅ Done | Jan 24, 2026 |
| 0 | Render Deployment Config | ✅ Done | Jan 24, 2026 |
| 1 | User Registration | ⬜ Pending | - |
| 1 | User Login (JWT) | ⬜ Pending | - |
| 1 | Chat Storage | ⬜ Pending | - |
| 2 | Intent Classification | ⬜ Pending | - |
| 2 | Query Router | ⬜ Pending | - |
| 3 | Regression Models | ⬜ Pending | - |
| 4 | NLP & Sentiment | ⬜ Pending | - |
| 5 | Clustering | ⬜ Pending | - |
| 6 | Association Rules | ⬜ Pending | - |
| 7 | Reinforcement Learning | ⬜ Pending | - |
| 8 | Deep Learning | ⬜ Pending | - |
| 9 | Dimensionality Reduction | ⬜ Pending | - |
| 10 | Model Selection | ⬜ Pending | - |

---

## Notes & Questions

*Add your notes and questions here as you learn:*

- 

---

> **Remember:** The goal isn't just to build this project. It's to **understand** every piece so you can build your own ML systems confidently.

**Next up: Authentication Module! 🔐**
