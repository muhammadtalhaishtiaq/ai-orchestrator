from fastapi import APIRouter, HTTPException, status, Depends, BackgroundTasks
from app.models.github import GitHubTokenConnect, RepoStructure
from app.services.github_service import (
    connect_github, get_user_repos, get_repo_structure,
    save_github_connection, get_github_token, sync_notebooks_to_db
)
from app.api.deps import get_current_user
from app.database import supabase_admin
from typing import List, Dict

router = APIRouter(prefix="/github", tags=["GitHub"])

@router.post("/connect")
async def connect_github_token(
    data: GitHubTokenConnect,
    current_user: dict = Depends(get_current_user)
):
    """Connect GitHub account with personal access token."""
    github_user = connect_github(data.token)
    if not github_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid GitHub token"
        )

    await save_github_connection(
        user_id=current_user["id"],
        token=data.token,
        github_login=github_user["login"]
    )

    return {
        "message": "GitHub connected successfully",
        "github_login": github_user["login"],
        "github_name": github_user["name"],
        "avatar_url": github_user["avatar_url"]
    }

@router.get("/repos")
async def list_repos(current_user: dict = Depends(get_current_user)):
    """List all repos for connected GitHub account."""
    token = await get_github_token(current_user["id"])
    if not token:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No GitHub token connected"
        )

    repos = get_user_repos(token)
    return {"repos": repos, "total": len(repos)}

@router.post("/repos/{repo_owner}/{repo_name}/connect")
async def connect_repo(
    repo_owner: str,
    repo_name: str,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_user)
):
    """Connect a specific repo and sync its structure."""
    token = await get_github_token(current_user["id"])
    if not token:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No GitHub token connected"
        )

    repo_full_name = f"{repo_owner}/{repo_name}"

    # Fetch structure
    structure = get_repo_structure(token, repo_full_name)

    # Update github connection with repo
    supabase_admin.table("github_connections").update({
        "connected_repo": repo_full_name
    }).eq("user_id", current_user["id"]).execute()

    # Sync notebooks in background
    background_tasks.add_task(
        sync_notebooks_to_db,
        current_user["id"],
        repo_full_name,
        structure
    )

    return {
        "message": f"Connected to {repo_full_name}",
        "total_folders": len(structure["folders"]),
        "total_notebooks": structure["total_notebooks"]
    }

@router.get("/repos/{repo_owner}/{repo_name}/structure", response_model=RepoStructure)
async def get_structure(
    repo_owner: str,
    repo_name: str,
    current_user: dict = Depends(get_current_user)
):
    """Get full repo structure with notebooks."""
    token = await get_github_token(current_user["id"])
    if not token:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No GitHub token connected"
        )

    repo_full_name = f"{repo_owner}/{repo_name}"
    structure = get_repo_structure(token, repo_full_name)
    return structure

@router.get("/connection")
async def get_connection_status(current_user: dict = Depends(get_current_user)):
    """Get GitHub connection status for current user."""
    result = supabase_admin.table("github_connections")\
        .select("github_login, connected_repo, is_active, created_at")\
        .eq("user_id", current_user["id"])\
        .eq("is_active", True)\
        .execute()

    if not result.data:
        return {"connected": False}

    conn = result.data[0]
    return {
        "connected": True,
        "github_login": conn["github_login"],
        "connected_repo": conn["connected_repo"],
        "connected_at": conn["created_at"]
    }
