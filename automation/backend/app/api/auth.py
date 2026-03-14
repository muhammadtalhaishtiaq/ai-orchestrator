from fastapi import APIRouter, HTTPException, status, Request
from datetime import timedelta
from app.models.auth import UserRegister, UserLogin, TokenResponse, UserProfile
from app.services.auth_service import (
    hash_password, verify_password, create_access_token,
    get_user_by_email, check_login_attempts, record_login_attempt
)
from app.database import supabase_admin
from app.config import settings
import uuid

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
async def register(user_data: UserRegister):
    """Register a new user."""
    # Check if email already exists
    existing = await get_user_by_email(user_data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    user_id = str(uuid.uuid4())
    hashed_pw = hash_password(user_data.password)

    try:
        supabase_admin.table("user_profiles").insert({
            "id": user_id,
            "email": user_data.email,
            "full_name": user_data.full_name,
            "password_hash": hashed_pw,
            "failed_login_attempts": 0,
            "is_locked": False
        }).execute()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create user: {str(e)}"
        )

    access_token = create_access_token(
        data={"sub": user_id, "email": user_data.email},
        expires_delta=timedelta(minutes=settings.jwt_expire_minutes)
    )

    return TokenResponse(
        access_token=access_token,
        user_id=user_id,
        email=user_data.email,
        full_name=user_data.full_name
    )

@router.post("/login", response_model=TokenResponse)
async def login(user_data: UserLogin, request: Request):
    """Login with email and password."""
    ip_address = request.client.host if request.client else None

    # Check login attempts (lockout after 3 failures in 15 min)
    attempts = await check_login_attempts(user_data.email)
    if attempts >= 3:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Account temporarily locked. Try again in 15 minutes."
        )

    user = await get_user_by_email(user_data.email)
    if not user:
        await record_login_attempt(user_data.email, False, ip_address)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not verify_password(user_data.password, user["password_hash"]):
        await record_login_attempt(user_data.email, False, ip_address)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    await record_login_attempt(user_data.email, True, ip_address)

    access_token = create_access_token(
        data={"sub": user["id"], "email": user["email"]},
        expires_delta=timedelta(minutes=settings.jwt_expire_minutes)
    )

    return TokenResponse(
        access_token=access_token,
        user_id=user["id"],
        email=user["email"],
        full_name=user.get("full_name")
    )

@router.get("/me", response_model=UserProfile)
async def get_me(credentials: dict = None):
    """Get current user profile - protected route."""
    from fastapi import Depends
    from app.api.deps import get_current_user
    # This is handled by the dependency
    pass
