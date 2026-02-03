"""Chat repository for MongoDB access."""

from datetime import datetime
from typing import List, Optional
from bson import ObjectId

import sys
from pathlib import Path
# Add backend to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from database import db


async def create_session(user_id: str, title: str = "New Chat") -> dict:
    session_doc = {
        "user_id": user_id,
        "title": title,
        "created_at": datetime.utcnow(),
    }
    result = await db.chat_sessions.insert_one(session_doc)
    return {
        "session_id": str(result.inserted_id),
        "created_at": session_doc["created_at"],
    }


async def get_session(session_id: str, user_id: str) -> Optional[dict]:
    try:
        oid = ObjectId(session_id)
    except Exception:
        return None
    return await db.chat_sessions.find_one({"_id": oid, "user_id": user_id})


async def list_sessions(user_id: str) -> List[dict]:
    cursor = db.chat_sessions.find({"user_id": user_id}).sort("created_at", -1)
    return await cursor.to_list(length=100)


async def add_message(
    session_id: str,
    user_id: str,
    role: str,
    content: str,
    metadata: Optional[dict] = None,
) -> dict:
    metadata = metadata or {}

    message_doc = {
        "session_id": session_id,
        "user_id": user_id,
        "role": role,
        "content": content,
        "timestamp": datetime.utcnow(),
        **metadata,
    }

    result = await db.chat_messages.insert_one(message_doc)
    return {
        "message_id": str(result.inserted_id),
        "timestamp": message_doc["timestamp"],
    }


async def list_messages(session_id: str, user_id: str) -> List[dict]:
    cursor = db.chat_messages.find({"session_id": session_id, "user_id": user_id}).sort("timestamp", 1)
    return await cursor.to_list(length=500)
