"""Auth API routes (thin controllers)."""

from fastapi import APIRouter, Depends, Response, status

from schemas.auth import RegisterRequest, LoginRequest, AuthResponse, UserResponse
from services.auth_service import register_user, login_user
from dependencies.auth import get_current_user


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(request: RegisterRequest, response: Response):
    payload = await register_user(request.email, request.password, request.full_name)

    response.set_cookie(
        key="nebula_token",
        value=payload["access_token"],
        httponly=True,
        secure=False,  # set True in production with HTTPS
        samesite="lax",
        max_age=60 * 60 * 24 * 7,  # 7 days
        path="/",
    )

    return payload


@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest, response: Response):
    payload = await login_user(request.email, request.password)

    response.set_cookie(
        key="nebula_token",
        value=payload["access_token"],
        httponly=True,
        secure=False,  # set True in production with HTTPS
        samesite="lax",
        max_age=60 * 60 * 24 * 7,  # 7 days
        path="/",
    )

    return payload


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key="nebula_token", path="/")
    return {"message": "Logged out successfully."}
