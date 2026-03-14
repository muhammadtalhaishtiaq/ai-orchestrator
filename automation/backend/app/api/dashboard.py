from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.database import supabase_admin

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary")
async def get_dashboard_summary(current_user: dict = Depends(get_current_user)):
    """Get dashboard summary data."""
    user_id = current_user["id"]

    # Notebook stats
    notebooks_result = supabase_admin.table("notebooks")\
        .select("status")\
        .eq("user_id", user_id)\
        .execute()
    notebooks = notebooks_result.data or []

    notebook_stats = {
        "total": len(notebooks),
        "pending": sum(1 for n in notebooks if n["status"] == "pending"),
        "published": sum(1 for n in notebooks if n["status"] == "published"),
        "generated": sum(1 for n in notebooks if n["status"] == "generated"),
    }

    # GitHub connection
    github_result = supabase_admin.table("github_connections")\
        .select("github_login, connected_repo, is_active")\
        .eq("user_id", user_id)\
        .eq("is_active", True)\
        .execute()

    github_connected = bool(github_result.data)
    connected_repo = github_result.data[0]["connected_repo"] if github_result.data else None

    # Pipeline stats
    pipeline_result = supabase_admin.table("pipelines")\
        .select("is_active")\
        .eq("user_id", user_id)\
        .execute()
    pipelines = pipeline_result.data or []

    return {
        "user": {
            "id": user_id,
            "email": current_user["email"],
            "full_name": current_user.get("full_name")
        },
        "github": {
            "connected": github_connected,
            "connected_repo": connected_repo
        },
        "notebooks": notebook_stats,
        "pipelines": {
            "total": len(pipelines),
            "active": sum(1 for p in pipelines if p["is_active"])
        }
    }
