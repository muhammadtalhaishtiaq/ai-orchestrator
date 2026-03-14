from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.config import settings
from app.database import supabase_admin

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.jwt_expire_minutes))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.jwt_algorithm)

def verify_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
        return payload
    except JWTError:
        return None

async def get_user_by_email(email: str) -> Optional[dict]:
    try:
        result = supabase_admin.table("user_profiles").select("*").eq("email", email).execute()
        if result.data:
            return result.data[0]
        return None
    except Exception:
        return None

async def check_login_attempts(email: str) -> int:
    """Check failed login attempts in the last 15 minutes."""
    try:
        result = supabase_admin.table("login_attempts")\
            .select("*")\
            .eq("email", email)\
            .eq("success", False)\
            .gte("created_at", (datetime.utcnow() - timedelta(minutes=15)).isoformat())\
            .execute()
        return len(result.data) if result.data else 0
    except Exception:
        return 0

async def record_login_attempt(email: str, success: bool, ip_address: str = None):
    """Record a login attempt."""
    try:
        supabase_admin.table("login_attempts").insert({
            "email": email,
            "success": success,
            "ip_address": ip_address,
            "created_at": datetime.utcnow().isoformat()
        }).execute()
    except Exception:
        pass
