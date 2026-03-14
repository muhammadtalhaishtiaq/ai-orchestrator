# AI Orchestrator — Automation Platform

ML Content Automation Platform for daily notebook generation, social media posting, and content distribution.

## Structure

```
automation/
├── frontend/    # Next.js 14 (App Router) — http://localhost:3000
└── backend/     # FastAPI (Python) — http://localhost:8000
```

## Quick Start

### Backend
```bash
cd automation/backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd automation/frontend
npm install
npm run dev
```

### Supabase Schema
Run `automation/backend/supabase/schema.sql` in your Supabase SQL Editor.

## Sprint Progress
- [x] Sprint 1 — Auth + GitHub Sync + Repo Tracker + Supabase Foundation
- [ ] Sprint 2 — Pipeline Builder + Scheduler + Dashboard
- [ ] Sprint 3 — Notebook Generation & Testing
- [ ] Sprint 4 — Infographic + Social Media
- [ ] Sprint 5 — Video Generation + Multi-LLM
