from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, github, notebooks, dashboard
from app.config import settings

app = FastAPI(
    title="AI Orchestrator API",
    description="ML Content Automation Platform - Backend API",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(github.router, prefix="/api/v1")
app.include_router(notebooks.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "AI Orchestrator API v1.0", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy", "version": "1.0.0"}
