from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from contextlib import asynccontextmanager
import uuid
from datetime import datetime
import logging

from config import settings
from database import db, connect_db, close_db
from api.auth import router as auth_router  # Import auth routes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Lifespan handler for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle startup and shutdown events"""
    # Startup
    logger.info("🚀 Starting Project Nebula API...")
    try:
        await connect_db(settings.mongodb_uri, settings.database_name)
        logger.info("✅ All systems operational!")
    except Exception as e:
        logger.error(f"❌ Startup failed: {e}")
        raise
    
    yield  # App runs here
    
    # Shutdown
    logger.info("🛑 Shutting down Project Nebula API...")
    await close_db()


app = FastAPI(
    title="Project Nebula API", 
    version="0.1.0",
    description="Hybrid AI Orchestrator - ML-powered intelligent routing",
    lifespan=lifespan
)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api")  # Routes: /api/auth/*

# --- In-Memory Database ---
# Structure: { session_id: [ {role: "user", content: "hi"}, ... ] }
sessions: Dict[str, List[Dict[str, Any]]] = {}

# --- Pydantic Models ---
class SessionResponse(BaseModel):
    session_id: str
    created_at: str

class ChatRequest(BaseModel):
    session_id: str
    message: str

class ChatResponse(BaseModel):
    response: str
    role: str = "ai"
    has_chart: bool = False

# --- Endpoints ---

@app.get("/")
def health_check():
    return {"status": "online", "system": "Project Nebula Orchestrator"}


@app.get("/api/health")
async def full_health_check():
    """Complete health check for all services"""
    health = {
        "status": "online",
        "system": "Project Nebula Orchestrator",
        "timestamp": datetime.now().isoformat(),
        "services": {}
    }
    
    # Check MongoDB
    try:
        await db.client.admin.command('ping')
        health["services"]["mongodb"] = {"status": "connected", "database": settings.database_name}
    except Exception as e:
        health["services"]["mongodb"] = {"status": "error", "message": str(e)}
    
    # Check OpenAI (just verify key exists)
    if settings.openai_api_key and settings.openai_api_key.startswith("sk-"):
        health["services"]["openai"] = {"status": "configured"}
    else:
        health["services"]["openai"] = {"status": "not configured"}
    
    return health

@app.post("/api/sessions", response_model=SessionResponse)
def create_session():
    """Create a new chat session and return the ID."""
    session_id = str(uuid.uuid4())
    sessions[session_id] = []  # Initialize empty history
    
    print(f"--> New Session Created: {session_id}")
    return {
        "session_id": session_id,
        "created_at": datetime.now().isoformat()
    }

@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    """
    Handle a user message.
    1. Retrieve session history.
    2. (TODO) Route to correct Agent.
    3. Return response.
    """
    if request.session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session_id = request.session_id
    user_msg = request.message
    
    print(f"[{session_id}] User: {user_msg}")

    # 1. Update History (User)
    sessions[session_id].append({"role": "user", "content": user_msg})
    
    # 2. Logic (Mock for now)
    # Check for keywords to simulate "routing"
    has_chart = False
    if "trend" in user_msg.lower() or "sales" in user_msg.lower():
        ai_text = "I've analyzed the sales trends. It looks like Q4 is projected to grow by 15%."
        has_chart = True
    else:
        ai_text = f"I received your message: '{user_msg}'. Routing logic coming soon!"

    # 3. Update History (AI)
    sessions[session_id].append({"role": "ai", "content": ai_text, "has_chart": has_chart})
    
    return {
        "response": ai_text,
        "role": "ai",
        "has_chart": has_chart
    }

@app.get("/api/router/status")
def router_status():
    """Mock endpoint for the Router UI component"""
    return {
        "status": "active",
        "current_model": "LogisticRegression (v1)",
        "routing_to": "Agent A (General Chat)"
    }
