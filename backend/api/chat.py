"""Chat API routes (thin controllers)."""

from fastapi import APIRouter, Depends, status

from schemas.chat import (
    CreateSessionResponse,
    ChatRequest,
    ChatResponse,
)
from dependencies.auth import get_current_user
from services.chat_service import (
    create_chat_session,
    get_user_sessions,
    get_session_messages,
    send_message,
)


router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/sessions", response_model=CreateSessionResponse, status_code=status.HTTP_201_CREATED)
async def create_session(current_user: dict = Depends(get_current_user)):
    return await create_chat_session(user_id=current_user["id"])


@router.get("/sessions")
async def list_sessions(current_user: dict = Depends(get_current_user)):
    return await get_user_sessions(user_id=current_user["id"])


@router.get("/sessions/{session_id}/messages")
async def list_messages(session_id: str, current_user: dict = Depends(get_current_user)):
    return await get_session_messages(user_id=current_user["id"], session_id=session_id)


@router.post("/message", response_model=ChatResponse)
async def post_message(request: ChatRequest, current_user: dict = Depends(get_current_user)):
    return await send_message(
        user_id=current_user["id"],
        session_id=request.session_id,
        message=request.message,
    )
