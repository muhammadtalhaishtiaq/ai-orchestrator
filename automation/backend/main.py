from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, github, notebooks, dashboard
from app.api import pipeline_runner
from app.api import pipelines as pipelines_api
from app.api import projects as projects_api
from app.api import settings as settings_api
from app.api import analytics as analytics_api
from app.config import settings
from app.services.scheduler_service import get_scheduler
import logging

logging.basicConfig(level=logging.INFO)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Startup ───────────────────────────────────────────────────────────────
    get_scheduler()

    # Restore all active scheduled pipelines from DB.
    # APScheduler is in-memory only — jobs are lost on every restart without this.
    try:
        from app.database import supabase_admin
        from app.services.scheduler_service import register_pipeline_job
        result = supabase_admin.table("pipelines") \
            .select("id, user_id, trigger_type, trigger_config, is_active") \
            .eq("is_active", True) \
            .in_("trigger_type", ["cron", "scheduled"]) \
            .execute()
        restored = 0
        for pl in (result.data or []):
            try:
                ok = register_pipeline_job(
                    pl["id"], pl["user_id"],
                    pl["trigger_type"], pl.get("trigger_config") or {}
                )
                if ok:
                    restored += 1
            except Exception as e:
                logging.getLogger(__name__).warning(
                    f"Could not restore schedule for pipeline {pl['id']}: {e}"
                )
        logging.getLogger(__name__).info(
            f"Scheduler startup: restored {restored} scheduled pipeline job(s)"
        )
    except Exception as e:
        logging.getLogger(__name__).error(f"Failed to restore scheduled jobs on startup: {e}")

    yield

    # ── Shutdown ──────────────────────────────────────────────────────────────
    from app.services.scheduler_service import scheduler
    if scheduler.running:
        scheduler.shutdown(wait=False)

app = FastAPI(
    title="AI Orchestrator API",
    description="ML Content Automation Platform - Backend API",
    version="2.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(github.router, prefix="/api/v1")
app.include_router(notebooks.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")
app.include_router(pipeline_runner.router, prefix="/api/v1")
app.include_router(pipelines_api.router, prefix="/api/v1")
app.include_router(projects_api.router, prefix="/api/v1")
app.include_router(settings_api.router, prefix="/api/v1")
app.include_router(analytics_api.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "AI Orchestrator API v2.0", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy", "version": "2.0.0"}
