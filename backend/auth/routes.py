"""
Auth Routes - Register & Login Endpoints

🎓 LESSON: Authentication Flow
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REGISTRATION:
┌─────────┐     POST /auth/register      ┌─────────┐
│ Client  │ ────────────────────────────>│ Server  │
│         │  {email, password, name}     │         │
│         │                              │         │
│         │     {user_id, message}       │         │
│         │ <────────────────────────────│         │
└─────────┘                              └─────────┘
                                              │
                                              v
                                         Hash password
                                         Store in MongoDB

LOGIN:
┌─────────┐     POST /auth/login         ┌─────────┐
│ Client  │ ────────────────────────────>│ Server  │
│         │  {email, password}           │         │
│         │                              │         │
│         │     {access_token}           │         │
│         │ <────────────────────────────│         │
└─────────┘                              └─────────┘
                                              │
                                              v
                                         Find user
                                         Verify password
                                         Generate JWT

PROTECTED ROUTE:
┌─────────┐     GET /auth/me             ┌─────────┐
│ Client  │ ────────────────────────────>│ Server  │
│         │  Authorization: Bearer xxx   │         │
│         │                              │         │
│         │     {user data}              │         │
│         │ <────────────────────────────│         │
└─────────┘                              └─────────┘
                                              │
                                              v
                                         Verify JWT
                                         Extract user_id
                                         Return user data
"""

from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

import sys
from pathlib import Path
# Add backend to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from database import db
from .utils import hash_password, verify_password, create_access_token
from .dependencies import get_current_user


# Create router with prefix
router = APIRouter(prefix="/auth", tags=["Authentication"])


# ============== Request/Response Models ==============

class RegisterRequest(BaseModel):
    """What the client sends to register"""
    email: str
    password: str
    full_name: str = ""


class LoginRequest(BaseModel):
    """What the client sends to login"""
    email: str
    password: str


class AuthResponse(BaseModel):
    """What we send back after login/register"""
    access_token: str
    token_type: str = "bearer"
    user: dict


class UserResponse(BaseModel):
    """User data returned from /me endpoint"""
    id: str
    email: str
    full_name: str
    created_at: Optional[datetime] = None


# ============== Endpoints ==============

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(request: RegisterRequest):
    """
    Register a new user.
    
    - Checks if email already exists
    - Hashes password (NEVER store plain text!)
    - Creates user in MongoDB
    - Returns JWT token (user is logged in immediately)
    """
    
    # 1. Check if email already registered
    existing_user = await db.users.find_one({"email": request.email.lower()})
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # 2. Hash the password
    hashed_password = hash_password(request.password)
    
    # 3. Create user document
    user_doc = {
        "email": request.email.lower(),  # Always lowercase emails
        "hashed_password": hashed_password,
        "full_name": request.full_name,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # 4. Insert into MongoDB
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    # 5. Create JWT token
    access_token = create_access_token(data={"sub": user_id})
    
    # 6. Return token and user data
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "email": request.email.lower(),
            "full_name": request.full_name
        }
    }


@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    """
    Login with email and password.
    
    - Finds user by email
    - Verifies password hash
    - Returns JWT token
    """
    
    # 1. Find user by email
    user = await db.users.find_one({"email": request.email.lower()})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # 2. Verify password
    if not verify_password(request.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # 3. Create JWT token
    user_id = str(user["_id"])
    access_token = create_access_token(data={"sub": user_id})
    
    # 4. Return token and user data
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "email": user["email"],
            "full_name": user.get("full_name", "")
        }
    }


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    """
    Get current logged-in user's profile.
    
    This is a PROTECTED route - requires valid JWT token.
    The Depends(get_current_user) does all the work:
    1. Extracts token from Authorization header
    2. Verifies it's valid and not expired
    3. Fetches user from database
    4. Returns user dict
    
    If any step fails, it raises 401 Unauthorized.
    """
    return current_user


@router.post("/logout")
async def logout():
    """
    Logout endpoint.
    
    🎓 LESSON: JWT Logout Problem
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    JWTs are "stateless" - the server doesn't track them.
    This is a feature (scalability) but also a problem (can't invalidate).
    
    Options for "real" logout:
    1. Short token expiry (15 min) + refresh tokens
    2. Token blacklist in Redis
    3. Token version in database
    
    For now, we just tell the client "delete your token".
    The frontend removes it from localStorage/cookies.
    """
    return {"message": "Logged out successfully. Delete token on client side."}
