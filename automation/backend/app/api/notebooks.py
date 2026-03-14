from fastapi import APIRouter, HTTPException, Depends, Query
from app.api.deps import get_current_user
from app.database import supabase_admin
from typing import Optional, List

router = APIRouter(prefix="/notebooks", tags=["Notebooks"])

VALID_STATUSES = ["pending", "generated", "published", "skipped", "missing"]

@router.get("/queue")
async def get_content_queue(
    folder: Optional[str] = Query(None, description="Filter by folder name"),
    status: Optional[str] = Query(None, description="Filter by status"),
    current_user: dict = Depends(get_current_user)
):
    """Get ordered content queue for the user."""
    query = supabase_admin.table("notebooks")\
        .select("*")\
        .eq("user_id", current_user["id"])\
        .order("folder_order", desc=False)\
        .order("notebook_order", desc=False)

    if folder:
        query = query.eq("folder", folder)
    if status:
        query = query.eq("status", status)

    result = query.execute()
    notebooks = result.data or []

    # Find next in line (first pending notebook)
    next_in_line = None
    for nb in notebooks:
        if nb["status"] == "pending":
            next_in_line = nb["id"]
            break

    # Group by folder
    folders = {}
    for nb in notebooks:
        folder_name = nb["folder"]
        if folder_name not in folders:
            folders[folder_name] = {
                "name": folder_name,
                "order": nb["folder_order"],
                "notebooks": [],
                "stats": {"pending": 0, "generated": 0, "published": 0, "skipped": 0, "missing": 0}
            }
        folders[folder_name]["notebooks"].append({**nb, "is_next": nb["id"] == next_in_line})
        status_key = nb["status"] if nb["status"] in folders[folder_name]["stats"] else "pending"
        folders[folder_name]["stats"][status_key] += 1

    sorted_folders = sorted(folders.values(), key=lambda x: x["order"])

    return {
        "folders": sorted_folders,
        "total": len(notebooks),
        "next_in_line_id": next_in_line,
        "stats": {
            "pending": sum(1 for n in notebooks if n["status"] == "pending"),
            "generated": sum(1 for n in notebooks if n["status"] == "generated"),
            "published": sum(1 for n in notebooks if n["status"] == "published"),
            "skipped": sum(1 for n in notebooks if n["status"] == "skipped"),
            "missing": sum(1 for n in notebooks if n["status"] == "missing"),
        }
    }

@router.patch("/{notebook_id}/status")
async def update_notebook_status(
    notebook_id: str,
    status: str,
    current_user: dict = Depends(get_current_user)
):
    """Update notebook status."""
    if status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {VALID_STATUSES}")

    result = supabase_admin.table("notebooks")\
        .update({"status": status})\
        .eq("id", notebook_id)\
        .eq("user_id", current_user["id"])\
        .execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Notebook not found")

    return {"message": "Status updated", "notebook": result.data[0]}

@router.get("/next")
async def get_next_notebook(current_user: dict = Depends(get_current_user)):
    """Get the next notebook in queue."""
    result = supabase_admin.table("notebooks")\
        .select("*")\
        .eq("user_id", current_user["id"])\
        .eq("status", "pending")\
        .order("folder_order", desc=False)\
        .order("notebook_order", desc=False)\
        .limit(1)\
        .execute()

    if not result.data:
        return {"next_notebook": None, "message": "No pending notebooks in queue"}

    return {"next_notebook": result.data[0]}

@router.get("/stats")
async def get_notebook_stats(current_user: dict = Depends(get_current_user)):
    """Get overall notebook statistics."""
    result = supabase_admin.table("notebooks")\
        .select("status")\
        .eq("user_id", current_user["id"])\
        .execute()

    notebooks = result.data or []
    stats = {"pending": 0, "generated": 0, "published": 0, "skipped": 0, "missing": 0, "total": len(notebooks)}
    for nb in notebooks:
        s = nb["status"]
        if s in stats:
            stats[s] += 1

    return stats
