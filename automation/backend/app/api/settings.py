from fastapi import APIRouter, HTTPException, Depends
from app.api.deps import get_current_user
from app.database import supabase_admin
from app.services.auth_service import hash_password, verify_password
from pydantic import BaseModel
from typing import Optional, Dict
import base64
import json
import os

router = APIRouter(prefix="/settings", tags=["Settings"])

# ── Encryption helpers ────────────────────────────────────────────────────────
# Simple reversible masking for API keys using base64 + XOR with a per-install secret.
# For production, replace with Fernet or AWS KMS.

_SECRET = os.getenv("JWT_SECRET", "orion-default-secret-key-change-this")[:32].ljust(32)


def _encrypt(value: str) -> str:
    """Encode API key for storage."""
    key = (_SECRET * 8).encode()[:len(value)]
    xored = bytes(a ^ b for a, b in zip(value.encode(), key))
    return base64.b64encode(xored).decode()


def _decrypt(value: str) -> str:
    """Decode stored API key."""
    raw = base64.b64decode(value.encode())
    key = (_SECRET * 8).encode()[:len(raw)]
    return bytes(a ^ b for a, b in zip(raw, key)).decode()


def _mask(value: str) -> str:
    """Return a masked version for display (show last 4 chars only)."""
    if len(value) <= 8:
        return "****"
    return "sk-..." + value[-4:]


# ── Models ────────────────────────────────────────────────────────────────────

class ProfileUpdate(BaseModel):
    full_name: str


class PasswordChange(BaseModel):
    current_password: str
    new_password: str


class ApiKeyUpsert(BaseModel):
    provider: str   # e.g. "openai", "anthropic", "gemini"
    api_key: str


class NotificationPrefs(BaseModel):
    pipeline_success: bool = True
    pipeline_failure: bool = True
    weekly_digest: bool = False


# ── Helpers ───────────────────────────────────────────────────────────────────

def _get_user_settings(user_id: str) -> dict:
    """Fetch user_settings row, return empty dict if table missing or no row."""
    try:
        r = supabase_admin.table("user_settings").select("*").eq("user_id", user_id).execute()
        return r.data[0] if r.data else {}
    except Exception:
        return {}


def _upsert_user_settings(user_id: str, updates: dict):
    """Upsert into user_settings, silently fails if table missing."""
    try:
        existing = supabase_admin.table("user_settings").select("id").eq("user_id", user_id).execute()
        if existing.data:
            supabase_admin.table("user_settings").update(updates).eq("user_id", user_id).execute()
        else:
            supabase_admin.table("user_settings").insert({"user_id": user_id, **updates}).execute()
    except Exception:
        pass


# ── Profile ───────────────────────────────────────────────────────────────────

@router.get("/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    """Get current user profile."""
    return {
        "id":        current_user["id"],
        "email":     current_user["email"],
        "full_name": current_user.get("full_name", ""),
    }


@router.put("/profile")
async def update_profile(
    data: ProfileUpdate,
    current_user: dict = Depends(get_current_user),
):
    """Update display name."""
    if not data.full_name.strip():
        raise HTTPException(400, "Name cannot be empty")

    try:
        supabase_admin.table("user_profiles") \
            .update({"full_name": data.full_name.strip()}) \
            .eq("id", current_user["id"]).execute()
    except Exception as e:
        raise HTTPException(500, f"Failed to update profile: {str(e)}")

    return {"message": "Profile updated", "full_name": data.full_name.strip()}


# ── Password ──────────────────────────────────────────────────────────────────

@router.put("/password")
async def change_password(
    data: PasswordChange,
    current_user: dict = Depends(get_current_user),
):
    """Change user password."""
    if len(data.new_password) < 8:
        raise HTTPException(400, "New password must be at least 8 characters")

    # Re-fetch user to get password_hash
    user_row = supabase_admin.table("user_profiles") \
        .select("password_hash").eq("id", current_user["id"]).execute()

    if not user_row.data:
        raise HTTPException(404, "User not found")

    stored_hash = user_row.data[0].get("password_hash", "")
    if not verify_password(data.current_password, stored_hash):
        raise HTTPException(400, "Current password is incorrect")

    new_hash = hash_password(data.new_password)
    try:
        supabase_admin.table("user_profiles") \
            .update({"password_hash": new_hash}) \
            .eq("id", current_user["id"]).execute()
    except Exception as e:
        raise HTTPException(500, f"Failed to update password: {str(e)}")

    return {"message": "Password changed successfully"}


# ── API Keys ──────────────────────────────────────────────────────────────────

SUPPORTED_PROVIDERS = {"openai", "anthropic", "gemini", "aiml-api", "kimi"}


@router.get("/api-keys")
async def list_api_keys(current_user: dict = Depends(get_current_user)):
    """List configured API keys (masked)."""
    row = _get_user_settings(current_user["id"])
    raw_keys: dict = row.get("api_keys", {}) or {}

    masked = {}
    for provider, enc_val in raw_keys.items():
        try:
            plain = _decrypt(enc_val)
            masked[provider] = {
                "provider": provider,
                "masked": _mask(plain),
                "is_set": True,
            }
        except Exception:
            masked[provider] = {"provider": provider, "masked": "****", "is_set": True}

    # Always return all supported providers
    for p in SUPPORTED_PROVIDERS:
        if p not in masked:
            masked[p] = {"provider": p, "masked": None, "is_set": False}

    return {"api_keys": list(masked.values())}


@router.post("/api-keys")
async def upsert_api_key(
    data: ApiKeyUpsert,
    current_user: dict = Depends(get_current_user),
):
    """Add or update an API key for a provider."""
    provider = data.provider.lower().strip()
    if provider not in SUPPORTED_PROVIDERS:
        raise HTTPException(400, f"Unsupported provider. Allowed: {', '.join(SUPPORTED_PROVIDERS)}")
    if not data.api_key.strip():
        raise HTTPException(400, "API key cannot be empty")

    row = _get_user_settings(current_user["id"])
    api_keys: dict = dict(row.get("api_keys", {}) or {})
    api_keys[provider] = _encrypt(data.api_key.strip())

    _upsert_user_settings(current_user["id"], {"api_keys": api_keys})
    return {"message": f"{provider} API key saved", "provider": provider, "masked": _mask(data.api_key.strip())}


@router.delete("/api-keys/{provider}")
async def delete_api_key(
    provider: str,
    current_user: dict = Depends(get_current_user),
):
    """Remove an API key."""
    provider = provider.lower().strip()
    row = _get_user_settings(current_user["id"])
    api_keys: dict = dict(row.get("api_keys", {}) or {})

    if provider not in api_keys:
        raise HTTPException(404, "API key not found")

    del api_keys[provider]
    _upsert_user_settings(current_user["id"], {"api_keys": api_keys})
    return {"message": f"{provider} API key removed"}


@router.get("/api-keys/{provider}/reveal")
async def reveal_api_key(
    provider: str,
    current_user: dict = Depends(get_current_user),
):
    """Return the decrypted API key for copying (rate-limited in production)."""
    provider = provider.lower().strip()
    row = _get_user_settings(current_user["id"])
    api_keys: dict = row.get("api_keys", {}) or {}

    if provider not in api_keys:
        raise HTTPException(404, "API key not found")

    try:
        plain = _decrypt(api_keys[provider])
        return {"provider": provider, "api_key": plain}
    except Exception:
        raise HTTPException(500, "Failed to decrypt API key")


# ── Notifications ─────────────────────────────────────────────────────────────

@router.get("/notifications")
async def get_notification_prefs(current_user: dict = Depends(get_current_user)):
    """Get notification preferences."""
    row = _get_user_settings(current_user["id"])
    prefs = row.get("notification_prefs", {}) or {}
    return {
        "pipeline_success": prefs.get("pipeline_success", True),
        "pipeline_failure": prefs.get("pipeline_failure", True),
        "weekly_digest":    prefs.get("weekly_digest", False),
    }


@router.put("/notifications")
async def update_notification_prefs(
    data: NotificationPrefs,
    current_user: dict = Depends(get_current_user),
):
    """Update notification preferences."""
    _upsert_user_settings(current_user["id"], {
        "notification_prefs": data.model_dump()
    })
    return {"message": "Notification preferences saved", **data.model_dump()}
