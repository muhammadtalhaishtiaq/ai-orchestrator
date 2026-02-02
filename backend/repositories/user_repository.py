"""User repository for MongoDB access."""

from typing import Optional
from bson import ObjectId

import sys
from pathlib import Path
# Add backend to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from database import db


async def get_user_by_email(email: str) -> Optional[dict]:
    return await db.users.find_one({"email": email.lower()})


async def get_user_by_id(user_id: str) -> Optional[dict]:
    try:
        oid = ObjectId(user_id)
    except Exception:
        return None
    return await db.users.find_one({"_id": oid})


async def create_user(user_doc: dict) -> str:
    result = await db.users.insert_one(user_doc)
    return str(result.inserted_id)
