# Product Requirements Document (PRD)
## AI Orchestrator — ML Content Automation Platform
**Version:** 1.0
**Date:** 2026-03-14
**Owner:** Muhammad Talha
**Repo:** https://github.com/muhammadtalhaishtiaq/ai-orchestrator
**Status:** Draft — Pending Approval

---

## 1. TL;DR
AI Orchestrator is a centralized, self-hosted web platform that automates daily ML content creation and distribution. It connects to GitHub (two-way sync), generates and tests Jupyter notebooks using configurable LLMs, creates infographics via Google NotebookLM, renders AI-powered videos via Python/FFmpeg, and posts to social media — all driven by fully customizable, form-based pipelines with scheduled or manual triggers.

---

## 2. Problem Statement
Managing a large ML educational repository (22 folders, ~277 notebooks) while consistently producing daily social media content (posts, infographics, videos) is manually intensive, error-prone, and unsustainable. There is no centralized system to track content progress, automate generation, and distribute across channels in a coordinated way.

---

## 3. Goals & Success Criteria

| Goal | KPI |
|---|---|
| Automate daily content pipeline | >=1 pipeline executes successfully per day |
| Reduce manual content effort | <15 min/day human intervention |
| Full repo visibility | 100% of notebooks tracked with status |
| Social media consistency | Posts published on schedule >=95% of the time |
| Zero hardcoded scenarios | All pipelines configurable via UI |

---

## 4. Target Users
- **Primary**: Muhammad Talha (sole owner, ML educator, content creator)
- **Future**: Other ML educators/content creators (multi-user extensibility considered in architecture)

---

## 5. Core Features

### F1 — Authentication & Security
- Secure registration, login, password management
- bcrypt/argon2 password hashing
- AES-256 encrypted API key storage in Supabase
- Auto-logout after 30 min idle
- Account lockout after 3 failed login attempts

### F2 — GitHub Integration (Two-Way Sync)
- Connect via GitHub access token
- Fetch full repo structure with notebook metadata
- Webhook/polling for detecting external pushes (within 5 min)
- Platform-to-GitHub push with meaningful commit messages
- Sync conflict detection and resolution

### F3 — Repository Intelligence & Content Tracker
- Tag each notebook: pending, generated, published, skipped, missing
- Ordered content queue per folder
- Next-in-line notebook highlighting
- Missing notebook detection with generation prompt

### F4 — Pipeline Builder (Structured UI Forms)
- Form-based pipeline creation: name, trigger, source, action steps, output
- Available steps: generate_notebook, test_notebook, attach_outputs, push_to_github, generate_infographic, generate_social_post, generate_video, post_to_social
- Pipeline saved as named, reusable config in Supabase
- Clone, enable/disable, delete pipelines
- Per-step LLM provider and model assignment

### F5 — Scheduler (Fully Configurable)
- Trigger types: manual, scheduled (time picker), cron expression, webhook
- Real-time job execution logs in dashboard
- Failure alerts via dashboard (and optional email)

### F6 — Multi-LLM Provider Management
- Supported: OpenAI, Anthropic, Google Gemini, AIML API, Kimi, Ollama (local)
- Encrypted API key storage per provider
- Automatic fallback to secondary provider on failure
- Token usage and cost tracking per pipeline run (via LiteLLM)

### F7 — Notebook Generation & Testing Pipeline
- LLM generates full Jupyter notebook from topic context
- All cells executed via nbconvert with outputs attached
- Auto-fix loop on cell errors (max 3 retries)
- Metadata logged to Supabase

### F8 — Infographic Generation (Google NotebookLM)
- NotebookLM API called with notebook content
- Generated infographic embedded at top of notebook
- Stored in Supabase storage with notebook reference

### F9 — Social Media Post Generation & Publishing
- Platform-specific LLM copy: X (<=280 chars thread), Instagram (caption + hashtags)
- Optional manual review/edit before publishing
- Publish via X API v2 and Instagram Graph API
- Post confirmation and URL logged to Supabase

### F10 — Video Generation (Python/FFmpeg AI Renderer)
- Python scene generator from notebook content (Pillow, MoviePy)
- FFmpeg renderer (configurable resolution/format)
- Pluggable provider abstraction for future Runway/HeyGen swap
- Video posted to configured social channel

### F11 — Supabase Persistence & Dashboard
- All pipeline run logs stored (success + failure)
- Dashboard: active pipelines, today's runs, content queue, recent posts, storage
- Filterable by date, pipeline, status, notebook

---

## 6. Non-Functional Requirements

| Category | Requirement |
|---|---|
| Security | AES-256 key encryption, OWASP Top 10 compliance |
| Performance | Real-time log updates <2s latency |
| Scalability | Multi-user extensible architecture |
| Reliability | Failed steps retry with exponential backoff (max 3x) |
| Compliance | GDPR-compliant data handling |

---

## 7. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (React) |
| Backend | FastAPI (Python) |
| Database | Supabase (PostgreSQL + Storage + Auth) |
| Scheduler | APScheduler / Celery + Redis |
| Notebook Execution | nbconvert + nbformat |
| Video Rendering | Python (Pillow, MoviePy) + FFmpeg |
| GitHub Sync | PyGithub + Webhooks |
| Social APIs | Twitter API v2, Instagram Graph API |
| LLM Abstraction | LiteLLM |

---

## 8. Out of Scope (v1.0)
- Multi-user / team collaboration
- Mobile app
- Paid video generation models (Runway, HeyGen)
- LinkedIn / TikTok / YouTube posting

---

## 9. Risks

| Risk | Mitigation |
|---|---|
| NotebookLM API limits | Fallback to LLM-generated infographic |
| Instagram API restrictions | Early API setup and testing |
| Notebook execution failures | Auto-fix loop with max retry cap |
| GitHub rate limits | Cache repo state + conditional requests |

---

## 10. Roadmap

| Phase | Scope | Sprint |
|---|---|---|
| MVP | Auth + GitHub + Repo Tracker + Pipeline + Scheduler + Supabase | 1-2 |
| v1.1 | Notebook generation + testing + push | 3 |
| v1.2 | Infographic + Social posts | 4 |
| v1.3 | Video generation (FFmpeg) | 5 |
| v1.4 | Multi-LLM management + cost tracking | 5 |

---

*Version: 1.0 | Status: Awaiting Owner Approval*
