"""Auth business logic (service layer)."""

from datetime import datetime
from fastapi import HTTPException, status

from repositories.user_repository import (
    get_user_by_email,
    create_user,
    get_user_by_id,
)
from core.security import hash_password, verify_password, create_access_token


async def register_user(email: str, password: str, full_name: str) -> dict:
    existing_user = await get_user_by_email(email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    hashed_password = hash_password(password)

    user_doc = {
        "email": email.lower(),
        "hashed_password": hashed_password,
        "full_name": full_name,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }

    user_id = await create_user(user_doc)
    access_token = create_access_token(data={"sub": user_id})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "email": email.lower(),
            "full_name": full_name,
        },
    }


async def login_user(email: str, password: str) -> dict:
    user = await get_user_by_email(email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not verify_password(password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    user_id = str(user["_id"])
    access_token = create_access_token(data={"sub": user_id})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "email": user["email"],
            "full_name": user.get("full_name", ""),
        },
    }


async def get_user_by_token_subject(user_id: str) -> dict:
    user = await get_user_by_id(user_id)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "full_name": user.get("full_name", ""),
    }
