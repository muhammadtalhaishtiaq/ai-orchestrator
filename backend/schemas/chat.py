"""Chat schemas for API and service layer."""

from pydantic import BaseModel
from typing import List, Optional, Literal
from datetime import datetime


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str
    timestamp: datetime = None

    # ML metadata (filled by models later)
    intent: Optional[str] = None
    confidence: Optional[float] = None
    agent: Optional[str] = None
    sentiment: Optional[str] = None


class ChatSession(BaseModel):
    id: str
    user_id: str
    title: str = "New Chat"
    created_at: datetime = None
    messages: List[ChatMessage] = []


class CreateSessionResponse(BaseModel):
    session_id: str
    created_at: datetime


class ChatRequest(BaseModel):
    session_id: str
    message: str


class ChatResponse(BaseModel):
    response: str
    session_id: str

    # Router info for UI
    intent: str = "general"
    confidence: float = 0.0
    agent: str = "General Agent"

    # Optional extras
    has_chart: bool = False
    suggestions: List[str] = []
