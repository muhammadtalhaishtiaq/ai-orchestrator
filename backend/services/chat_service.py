"""Chat business logic (service layer)."""

import logging
from fastapi import HTTPException, status

from repositories.chat_repository import (
    create_session,
    list_sessions,
    get_session,
    add_message,
    list_messages,
)

logger = logging.getLogger(__name__)


async def create_chat_session(user_id: str, title: str = "New Chat") -> dict:
    session = await create_session(user_id=user_id, title=title)
    logger.info("Chat session created", extra={"user_id": user_id, "session_id": session.get("session_id")})
    return session


async def get_user_sessions(user_id: str) -> list:
    sessions = await list_sessions(user_id=user_id)
    logger.info("Chat sessions listed", extra={"user_id": user_id, "count": len(sessions)})
    return sessions


async def get_session_messages(user_id: str, session_id: str) -> list:
    session = await get_session(session_id=session_id, user_id=user_id)
    if session is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )

    messages = await list_messages(session_id=session_id, user_id=user_id)
    logger.info(
        "Chat messages listed",
        extra={"user_id": user_id, "session_id": session_id, "count": len(messages)},
    )
    return messages


async def send_message(user_id: str, session_id: str, message: str) -> dict:
    session = await get_session(session_id=session_id, user_id=user_id)
    if session is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found",
        )

    logger.info("Chat message received", extra={"user_id": user_id, "session_id": session_id})

    # Store user message
    await add_message(
        session_id=session_id,
        user_id=user_id,
        role="user",
        content=message,
    )

    # Placeholder assistant response (Phase 2 MVP)
    assistant_text = "Got it. Chat engine is coming next."

    await add_message(
        session_id=session_id,
        user_id=user_id,
        role="assistant",
        content=assistant_text,
    )

    logger.info("Chat response sent", extra={"user_id": user_id, "session_id": session_id})

    return {
        "response": assistant_text,
        "session_id": session_id,
        "intent": "general",
        "confidence": 0.0,
        "agent": "General Agent",
        "has_chart": False,
        "suggestions": [],
    }
