from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from app.api.deps import get_current_user
from app.database import supabase_admin
from app.services.scheduler_service import (
    register_pipeline_job, unregister_pipeline_job, get_next_run_time
)
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uuid
from datetime import datetime

router = APIRouter(prefix="/pipelines", tags=["Pipelines"])

AVAILABLE_STEPS = [
    "generate_notebook",
    "test_notebook",
    "attach_outputs",
    "push_to_github",
    "generate_infographic",
    "generate_social_post",
    "generate_video",
    "post_to_social",
]

STEP_DESCRIPTIONS = {
    "generate_notebook":    "Generate a full Jupyter notebook using LLM",
    "test_notebook":        "Execute all cells and capture outputs",
    "attach_outputs":       "Embed cell outputs into the notebook file",
    "push_to_github":       "Commit and push notebook to GitHub",
    "generate_infographic": "Create a visual summary via NotebookLM",
    "generate_social_post": "Write X/Instagram posts using LLM",
    "generate_video":       "Render educational video with Python/FFmpeg",
    "post_to_social":       "Publish posts to connected social media accounts",
}

class PipelineStepIn(BaseModel):
    order: int
    action: str
    config: Dict[str, Any] = {}
    llm_provider: Optional[str] = None
    llm_model: Optional[str] = None

class PipelineCreate(BaseModel):
    name: str
    description: Optional[str] = None
    trigger_type: str = "manual"
    trigger_config: Dict[str, Any] = {}
    source_repo: Optional[str] = None
    source_folder: Optional[str] = None
    steps: List[PipelineStepIn] = []
    is_active: bool = True
    project_id: Optional[str] = None

class PipelineUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    trigger_type: Optional[str] = None
    trigger_config: Optional[Dict[str, Any]] = None
    source_repo: Optional[str] = None
    source_folder: Optional[str] = None
    steps: Optional[List[PipelineStepIn]] = None
    is_active: Optional[bool] = None
    project_id: Optional[str] = None

def _enrich_pipeline(pipeline: dict) -> dict:
    """Add next_run_time to pipeline dict."""
    pipeline["next_run_time"] = get_next_run_time(pipeline["id"])
    return pipeline

@router.get("/available-steps")
async def get_available_steps():
    """Return all configurable pipeline step types."""
    return {
        "steps": [
            {"action": action, "description": STEP_DESCRIPTIONS.get(action, "")}
            for action in AVAILABLE_STEPS
        ]
    }

@router.post("/", status_code=201)
async def create_pipeline(
    data: PipelineCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new pipeline."""
    pipeline_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()

    steps_data = [s.model_dump() for s in data.steps]

    insert_data = {
        "id": pipeline_id,
        "user_id": current_user["id"],
        "name": data.name,
        "description": data.description,
        "trigger_type": data.trigger_type,
        "trigger_config": data.trigger_config,
        "source_repo": data.source_repo,
        "source_folder": data.source_folder,
        "steps": steps_data,
        "is_active": data.is_active,
        "created_at": now,
        "updated_at": now,
    }
    if data.project_id:
        insert_data["project_id"] = data.project_id

    try:
        result = supabase_admin.table("pipelines").insert(insert_data).execute()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create pipeline: {str(e)}")

    pipeline = result.data[0]

    # Register scheduler if needed
    if data.is_active and data.trigger_type in ("cron", "scheduled"):
        register_pipeline_job(pipeline_id, current_user["id"], data.trigger_type, data.trigger_config)

    return _enrich_pipeline(pipeline)

@router.get("/")
async def list_pipelines(
    project_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """List all pipelines for the current user, optionally filtered by project."""
    query = supabase_admin.table("pipelines")\
        .select("*")\
        .eq("user_id", current_user["id"])

    if project_id:
        query = query.eq("project_id", project_id)

    result = query.order("created_at", desc=True).execute()

    pipelines = [_enrich_pipeline(p) for p in (result.data or [])]
    return {"pipelines": pipelines, "total": len(pipelines)}

@router.get("/{pipeline_id}")
async def get_pipeline(pipeline_id: str, current_user: dict = Depends(get_current_user)):
    """Get a single pipeline with its run history."""
    result = supabase_admin.table("pipelines")\
        .select("*")\
        .eq("id", pipeline_id)\
        .eq("user_id", current_user["id"])\
        .execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    pipeline = _enrich_pipeline(result.data[0])

    # Fetch recent runs
    runs_result = supabase_admin.table("pipeline_runs")\
        .select("id, status, trigger_type, started_at, completed_at, error_message")\
        .eq("pipeline_id", pipeline_id)\
        .order("started_at", desc=True)\
        .limit(10)\
        .execute()

    pipeline["recent_runs"] = runs_result.data or []
    return pipeline

@router.put("/{pipeline_id}")
async def update_pipeline(
    pipeline_id: str,
    data: PipelineUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update a pipeline."""
    # Verify ownership
    existing = supabase_admin.table("pipelines")\
        .select("id, trigger_type, trigger_config, is_active")\
        .eq("id", pipeline_id).eq("user_id", current_user["id"]).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    update_data = {k: v for k, v in data.model_dump(exclude_none=True).items()}
    if "steps" in update_data:
        update_data["steps"] = [s if isinstance(s, dict) else s for s in update_data["steps"]]
    update_data["updated_at"] = datetime.utcnow().isoformat()

    result = supabase_admin.table("pipelines")\
        .update(update_data)\
        .eq("id", pipeline_id)\
        .execute()

    pipeline = result.data[0]

    # Re-register scheduler
    trigger_type = data.trigger_type or existing.data[0]["trigger_type"]
    trigger_config = data.trigger_config or existing.data[0]["trigger_config"] or {}
    is_active = data.is_active if data.is_active is not None else existing.data[0]["is_active"]

    if is_active and trigger_type in ("cron", "scheduled"):
        register_pipeline_job(pipeline_id, current_user["id"], trigger_type, trigger_config)
    else:
        unregister_pipeline_job(pipeline_id)

    return _enrich_pipeline(pipeline)

@router.post("/{pipeline_id}/toggle")
async def toggle_pipeline(pipeline_id: str, current_user: dict = Depends(get_current_user)):
    """Enable or disable a pipeline."""
    existing = supabase_admin.table("pipelines")\
        .select("*").eq("id", pipeline_id).eq("user_id", current_user["id"]).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    pipeline = existing.data[0]
    new_active = not pipeline["is_active"]

    result = supabase_admin.table("pipelines")\
        .update({"is_active": new_active, "updated_at": datetime.utcnow().isoformat()})\
        .eq("id", pipeline_id).execute()

    if new_active and pipeline["trigger_type"] in ("cron", "scheduled"):
        register_pipeline_job(pipeline_id, current_user["id"], pipeline["trigger_type"], pipeline.get("trigger_config", {}))
    else:
        unregister_pipeline_job(pipeline_id)

    updated = _enrich_pipeline(result.data[0])
    return {"message": f"Pipeline {'enabled' if new_active else 'disabled'}", "pipeline": updated}

@router.post("/{pipeline_id}/clone")
async def clone_pipeline(pipeline_id: str, current_user: dict = Depends(get_current_user)):
    """Clone a pipeline."""
    existing = supabase_admin.table("pipelines")\
        .select("*").eq("id", pipeline_id).eq("user_id", current_user["id"]).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    original = existing.data[0]
    new_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()

    cloned = supabase_admin.table("pipelines").insert({
        **{k: v for k, v in original.items() if k not in ("id", "created_at", "updated_at", "last_run_at", "last_run_status")},
        "id": new_id,
        "name": f"{original['name']} (copy)",
        "is_active": False,  # Clones start disabled
        "created_at": now,
        "updated_at": now,
    }).execute()

    return {"message": "Pipeline cloned", "pipeline": _enrich_pipeline(cloned.data[0])}

@router.delete("/{pipeline_id}", status_code=204)
async def delete_pipeline(pipeline_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a pipeline."""
    existing = supabase_admin.table("pipelines")\
        .select("id").eq("id", pipeline_id).eq("user_id", current_user["id"]).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Pipeline not found")

    unregister_pipeline_job(pipeline_id)
    supabase_admin.table("pipelines").delete().eq("id", pipeline_id).execute()
    return None
