"""
Database models for Project Nebula
Pydantic models for MongoDB documents - KEPT SIMPLE
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from datetime import datetime


# ============== USER MODELS ==============

class UserCreate(BaseModel):
    """Model for creating a new user"""
    email: str
    password: str
    full_name: str = ""


class User(BaseModel):
    """User model returned to client"""
    id: str
    email: str
    full_name: str = ""
    created_at: datetime = None
    
    class Config:
        from_attributes = True


# ============== CHAT MODELS ==============

class ChatMessage(BaseModel):
    """Simple chat message"""
    role: Literal["user", "assistant"]
    content: str
    timestamp: datetime = None
    
    # ML metadata (filled by our models)
    intent: Optional[str] = None
    confidence: Optional[float] = None
    agent: Optional[str] = None
    sentiment: Optional[str] = None


class ChatSession(BaseModel):
    """Chat session"""
    id: str
    user_id: str
    title: str = "New Chat"
    created_at: datetime = None
    messages: List[ChatMessage] = []


# ============== API MODELS ==============

class ChatRequest(BaseModel):
    """Request to send a message"""
    session_id: str
    message: str


class ChatResponse(BaseModel):
    """Response from chat"""
    response: str
    session_id: str
    
    # Router info for UI
    intent: str = "general"
    confidence: float = 0.0
    agent: str = "General Agent"
    
    # Optional extras
    has_chart: bool = False
    suggestions: List[str] = []


class TokenResponse(BaseModel):
    """Login response"""
    access_token: str
    token_type: str = "bearer"
    user: User
