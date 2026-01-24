"""
Auth Dependencies - FastAPI Dependency Injection

🎓 LESSON: What is Dependency Injection?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Dependency Injection (DI) is when FastAPI automatically provides
something your function needs. Instead of you fetching it, FastAPI
gives it to you.

Example WITHOUT DI:
    @app.get("/profile")
    def get_profile(request: Request):
        token = request.headers.get("Authorization")
        user = verify_token_and_get_user(token)  # You do everything
        return user

Example WITH DI:
    @app.get("/profile")
    def get_profile(user: User = Depends(get_current_user)):
        return user  # FastAPI did the work for you!

Benefits:
1. Less boilerplate code
2. Reusable across many endpoints
3. Easy to test (just mock the dependency)
4. Clean separation of concerns

The "Depends()" function tells FastAPI:
"Before running this endpoint, run get_current_user() first
and pass the result as 'user'"
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional

import sys
from pathlib import Path
# Add backend to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from database import db
from .utils import decode_token


# This extracts the Bearer token from "Authorization: Bearer <token>" header
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """
    Dependency that extracts and validates the current user from JWT.
    
    Usage:
        @app.get("/protected")
        async def protected_route(user: dict = Depends(get_current_user)):
            return {"message": f"Hello, {user['email']}!"}
    
    Raises:
        HTTPException 401 if token is invalid or user not found
    """
    
    # Get the token from the Authorization header
    token = credentials.credentials
    
    # Decode and verify the token
    payload = decode_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get user_id from token payload
    user_id = payload.get("sub")
    
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Fetch user from database
    from bson import ObjectId
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Return user data (convert ObjectId to string)
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "full_name": user.get("full_name", "")
    }


async def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))
) -> Optional[dict]:
    """
    Same as get_current_user but returns None instead of raising error.
    Use for endpoints that work for both logged-in and anonymous users.
    
    Usage:
        @app.get("/items")
        async def get_items(user: Optional[dict] = Depends(get_current_user_optional)):
            if user:
                return {"items": get_user_items(user["id"])}
            else:
                return {"items": get_public_items()}
    """
    if credentials is None:
        return None
    
    try:
        return await get_current_user(credentials)
    except HTTPException:
        return None
