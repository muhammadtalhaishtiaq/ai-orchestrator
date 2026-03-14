from fastapi import APIRouter, HTTPException, Depends, status
from app.api.deps import get_current_user
from app.database import supabase_admin
from pydantic import BaseModel
from typing import Optional, List
import uuid
from datetime import datetime

router = APIRouter(prefix="/projects", tags=["Projects"])


# ---------------------------------------------------------------------------
# Pydantic schemas
# ---------------------------------------------------------------------------

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    color: str = "#6366F1"
    icon: str = "zap"


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None


# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------

def _get_pipeline_count(project_id: str, user_id: str) -> int:
    """Return the number of pipelines linked to a project for a given user."""
    try:
        result = (
            supabase_admin.table("pipelines")
            .select("id", count="exact")
            .eq("project_id", project_id)
            .eq("user_id", user_id)
            .execute()
        )
        return result.count if result.count is not None else len(result.data or [])
    except Exception:
        return 0


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@router.get("/")
async def list_projects(current_user: dict = Depends(get_current_user)):
    """List all projects belonging to the current user, with pipeline counts."""
    try:
        result = (
            supabase_admin.table("projects")
            .select("*")
            .eq("user_id", current_user["id"])
            .order("created_at", desc=False)
            .execute()
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "Could not query the projects table. "
                "It may not exist yet — run your database migrations first. "
                f"Error: {str(e)}"
            ),
        )

    projects = result.data or []
    for project in projects:
        project["pipeline_count"] = _get_pipeline_count(project["id"], current_user["id"])

    return {"projects": projects, "total": len(projects)}


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_project(
    data: ProjectCreate,
    current_user: dict = Depends(get_current_user),
):
    """Create a new project for the current user."""
    project_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()

    try:
        result = supabase_admin.table("projects").insert({
            "id": project_id,
            "user_id": current_user["id"],
            "name": data.name,
            "description": data.description,
            "color": data.color,
            "icon": data.icon,
            "is_default": False,
            "created_at": now,
            "updated_at": now,
        }).execute()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "Could not insert into the projects table. "
                "It may not exist yet — run your database migrations first. "
                f"Error: {str(e)}"
            ),
        )

    project = result.data[0]
    project["pipeline_count"] = 0
    return project


@router.get("/{project_id}")
async def get_project(
    project_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Get a single project by ID, including its pipeline count."""
    try:
        result = (
            supabase_admin.table("projects")
            .select("*")
            .eq("id", project_id)
            .eq("user_id", current_user["id"])
            .execute()
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "Could not query the projects table. "
                "It may not exist yet — run your database migrations first. "
                f"Error: {str(e)}"
            ),
        )

    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    project = result.data[0]
    project["pipeline_count"] = _get_pipeline_count(project_id, current_user["id"])
    return project


@router.put("/{project_id}")
async def update_project(
    project_id: str,
    data: ProjectUpdate,
    current_user: dict = Depends(get_current_user),
):
    """Update a project's metadata."""
    # Verify ownership
    try:
        existing = (
            supabase_admin.table("projects")
            .select("id")
            .eq("id", project_id)
            .eq("user_id", current_user["id"])
            .execute()
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "Could not query the projects table. "
                "It may not exist yet — run your database migrations first. "
                f"Error: {str(e)}"
            ),
        )

    if not existing.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    update_payload = {k: v for k, v in data.model_dump(exclude_none=True).items()}
    if not update_payload:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="No fields provided for update",
        )

    update_payload["updated_at"] = datetime.utcnow().isoformat()

    try:
        result = (
            supabase_admin.table("projects")
            .update(update_payload)
            .eq("id", project_id)
            .eq("user_id", current_user["id"])
            .execute()
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update project: {str(e)}",
        )

    project = result.data[0]
    project["pipeline_count"] = _get_pipeline_count(project_id, current_user["id"])
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: str,
    current_user: dict = Depends(get_current_user),
):
    """
    Delete a project.
    Deletion is refused when the project still has associated pipelines.
    """
    # Verify ownership
    try:
        existing = (
            supabase_admin.table("projects")
            .select("id, is_default")
            .eq("id", project_id)
            .eq("user_id", current_user["id"])
            .execute()
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "Could not query the projects table. "
                "It may not exist yet — run your database migrations first. "
                f"Error: {str(e)}"
            ),
        )

    if not existing.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    # Guard: refuse deletion when pipelines exist
    pipeline_count = _get_pipeline_count(project_id, current_user["id"])
    if pipeline_count > 0:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                f"Cannot delete project: it still has {pipeline_count} pipeline(s) attached. "
                "Delete or reassign those pipelines first."
            ),
        )

    try:
        supabase_admin.table("projects").delete().eq("id", project_id).eq("user_id", current_user["id"]).execute()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete project: {str(e)}",
        )

    return None


@router.post("/{project_id}/set-default", status_code=status.HTTP_200_OK)
async def set_default_project(
    project_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Mark a project as the user's default, clearing any previous default."""
    # Verify target project belongs to user
    try:
        existing = (
            supabase_admin.table("projects")
            .select("id")
            .eq("id", project_id)
            .eq("user_id", current_user["id"])
            .execute()
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "Could not query the projects table. "
                "It may not exist yet — run your database migrations first. "
                f"Error: {str(e)}"
            ),
        )

    if not existing.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    now = datetime.utcnow().isoformat()

    try:
        # Clear existing default for this user
        supabase_admin.table("projects").update({"is_default": False, "updated_at": now}).eq("user_id", current_user["id"]).eq("is_default", True).execute()

        # Set the new default
        result = (
            supabase_admin.table("projects")
            .update({"is_default": True, "updated_at": now})
            .eq("id", project_id)
            .eq("user_id", current_user["id"])
            .execute()
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to set default project: {str(e)}",
        )

    project = result.data[0]
    project["pipeline_count"] = _get_pipeline_count(project_id, current_user["id"])
    return {"message": "Default project updated", "project": project}
