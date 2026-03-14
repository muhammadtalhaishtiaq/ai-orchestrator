from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, github, notebooks, dashboard
from app.api import pipeline_runner
from app.api import pipelines as pipelines_api
from app.api import projects as projects_api
from app.config import settings
from app.services.scheduler_service import get_scheduler
import logging

logging.basicConfig(level=logging.INFO)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    get_scheduler()
    yield
    # Shutdown
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

@app.get("/")
async def root():
    return {"message": "AI Orchestrator API v2.0", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy", "version": "2.0.0"}
