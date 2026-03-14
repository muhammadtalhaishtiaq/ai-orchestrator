# AI Orchestrator (PROJ-001)

**Description:** Centralized, self-hosted web platform that automates daily ML content creation and distribution.
**Status:** Not Started
**Owner:** Muhammad Talha
**Repo:** https://github.com/muhammadtalhaishtiaq/ai-orchestrator
**Last Updated:** 2026-03-14

---

## User Stories

### US-001: Secure Registration, Login & Password Management
**Priority:** High | **Status:** To Do

#### Tasks
| Task ID | Title | Status |
|---------|-------|--------|
| TASK-0011 | Registration & Login UI | To Do |
| TASK-0012 | Password hashing | To Do |
| TASK-0013 | Session management | To Do |
| TASK-0014 | API key encryption | To Do |
| TASK-0015 | Login lockout | To Do |

---

### US-002: GitHub Two-Way Sync
**Priority:** High | **Status:** To Do

#### Tasks
| Task ID | Title | Status |
|---------|-------|--------|
| TASK-0021 | GitHub token connection | To Do |
| TASK-0022 | Repo structure fetch | To Do |
| TASK-0023 | Webhook/polling sync | To Do |
| TASK-0024 | Platform-to-GitHub push | To Do |
| TASK-0025 | Conflict resolution | To Do |

---

### US-003: Repository Intelligence & Content Tracker
**Priority:** High | **Status:** To Do

#### Tasks
| Task ID | Title | Status |
|---------|-------|--------|
| TASK-0031 | Notebook status tagging | To Do |
| TASK-0032 | Content queue view | To Do |
| TASK-0033 | Next-in-line highlight | To Do |
| TASK-0034 | Missing notebook detection | To Do |

---

### US-004: Pipeline Builder
**Priority:** High | **Status:** To Do

#### Tasks
| Task ID | Title | Status |
|---------|-------|--------|
| TASK-0041 | Pipeline builder UI | To Do |
| TASK-0042 | Pipeline CRUD | To Do |
| TASK-0043 | Action steps configuration | To Do |

---

### US-005: Configurable Scheduler
**Priority:** High | **Status:** To Do

#### Tasks
| Task ID | Title | Status |
|---------|-------|--------|
| TASK-0051 | Scheduler engine | To Do |
| TASK-0052 | Trigger UI | To Do |
| TASK-0053 | Real-time job logs | To Do |
| TASK-0054 | Failure notifications | To Do |

---

### US-006: Multi-LLM Provider Management
**Priority:** Medium | **Status:** To Do

#### Tasks
| Task ID | Title | Status |
|---------|-------|--------|
| TASK-0061 | LLM provider settings UI | To Do |
| TASK-0062 | LiteLLM integration | To Do |
| TASK-0063 | Fallback provider logic | To Do |
| TASK-0064 | Usage & cost tracking | To Do |

---

### US-007: Notebook Generation & Testing Pipeline
**Priority:** High | **Status:** To Do

#### Tasks
| Task ID | Title | Status |
|---------|-------|--------|
| TASK-0071 | LLM notebook generation | To Do |
| TASK-0072 | Notebook execution & testing | To Do |
| TASK-0073 | Auto-fix loop | To Do |
| TASK-0074 | Notebook metadata logging | To Do |

---

### US-008: Infographic Generation (Google NotebookLM)
**Priority:** Medium | **Status:** To Do

#### Tasks
| Task ID | Title | Status |
|---------|-------|--------|
| TASK-0081 | NotebookLM API integration | To Do |
| TASK-0082 | Embed infographic in notebook | To Do |
| TASK-0083 | Infographic storage | To Do |

---

### US-009: Social Media Post Generation & Publishing
**Priority:** Medium | **Status:** To Do

#### Tasks
| Task ID | Title | Status |
|---------|-------|--------|
| TASK-0091 | Social post LLM generation | To Do |
| TASK-0092 | Manual review toggle | To Do |
| TASK-0093 | X (Twitter) API integration | To Do |
| TASK-0094 | Instagram Graph API integration | To Do |
| TASK-0095 | Post logging | To Do |

---

### US-010: Video Generation (Python/FFmpeg)
**Priority:** Medium | **Status:** To Do

#### Tasks
| Task ID | Title | Status |
|---------|-------|--------|
| TASK-0101 | Python scene generator | To Do |
| TASK-0102 | FFmpeg renderer | To Do |
| TASK-0103 | Video storage | To Do |
| TASK-0104 | Pluggable video provider | To Do |
| TASK-0105 | Video social posting | To Do |

---

### US-011: Supabase Persistence & Dashboard
**Priority:** High | **Status:** To Do

#### Tasks
| Task ID | Title | Status |
|---------|-------|--------|
| TASK-0111 | Supabase schema setup | To Do |
| TASK-0112 | Pipeline run logging | To Do |
| TASK-0113 | Dashboard UI | To Do |
| TASK-0114 | Filterable query interface | To Do |

---

## Sprint Plan

| Sprint | Goal | User Stories |
|--------|------|--------------|
| Sprint 1 | Auth + GitHub + Repo Tracker + Supabase Foundation | US-001, US-002, US-003, US-011 (TASK-0111) |
| Sprint 2 | Pipeline Builder + Scheduler + Dashboard | US-004, US-005, US-011 (TASK-0112-0114) |
| Sprint 3 | Notebook Generation & Testing | US-007 |
| Sprint 4 | Infographic + Social Media | US-008, US-009 |
| Sprint 5 | Video Generation + Multi-LLM | US-010, US-006 |
