from github import Github, GithubException
from typing import List, Optional, Dict, Any
from app.services.encryption import encrypt_value, decrypt_value
from app.database import supabase_admin
import re

def connect_github(token: str) -> Optional[Dict]:
    """Validate GitHub token and return user info."""
    try:
        g = Github(token)
        user = g.get_user()
        return {
            "login": user.login,
            "name": user.name,
            "avatar_url": user.avatar_url,
            "valid": True
        }
    except GithubException:
        return None

def get_user_repos(token: str) -> List[Dict]:
    """Get all repos for the authenticated user."""
    try:
        g = Github(token)
        user = g.get_user()
        repos = []
        for repo in user.get_repos():
            repos.append({
                "name": repo.name,
                "full_name": repo.full_name,
                "description": repo.description or "",
                "default_branch": repo.default_branch,
                "html_url": repo.html_url,
                "private": repo.private,
                "updated_at": repo.updated_at.isoformat() if repo.updated_at else None
            })
        return repos
    except GithubException as e:
        raise Exception(f"Failed to fetch repos: {str(e)}")

def get_repo_structure(token: str, repo_full_name: str) -> Dict:
    """Fetch full repo structure - folders and notebooks."""
    try:
        g = Github(token)
        repo = g.get_repo(repo_full_name)
        contents = repo.get_contents("")

        folders = []

        # Get top-level directories
        dirs = [c for c in contents if c.type == "dir" and not c.name.startswith('.')]
        dirs.sort(key=lambda x: x.name)

        for idx, directory in enumerate(dirs):
            # Extract order from folder name (e.g., "05-classification" -> 5)
            order = idx
            match = re.match(r'^(\d+)', directory.name)
            if match:
                order = int(match.group(1))

            folder_contents = repo.get_contents(directory.path)
            notebooks = []

            for item in folder_contents:
                if item.name.endswith('.ipynb'):
                    # Extract notebook order from name
                    nb_order = 0
                    nb_match = re.match(r'^(\d+)', item.name)
                    if nb_match:
                        nb_order = int(nb_match.group(1))

                    notebooks.append({
                        "path": item.path,
                        "name": item.name.replace('.ipynb', '').replace('_', ' ').replace('-', ' '),
                        "raw_name": item.name,
                        "folder": directory.name,
                        "folder_order": order,
                        "notebook_order": nb_order,
                        "status": "pending",
                        "sha": item.sha,
                        "html_url": item.html_url,
                        "last_modified": None
                    })

            notebooks.sort(key=lambda x: x["notebook_order"])

            if notebooks:  # Only include folders with notebooks
                folders.append({
                    "name": directory.name,
                    "path": directory.path,
                    "order": order,
                    "notebooks": notebooks,
                    "total": len(notebooks),
                    "published": 0,
                    "pending": len(notebooks)
                })

        total_notebooks = sum(len(f["notebooks"]) for f in folders)

        return {
            "repo_name": repo.name,
            "full_name": repo.full_name,
            "folders": folders,
            "total_notebooks": total_notebooks
        }
    except GithubException as e:
        raise Exception(f"Failed to fetch repo structure: {str(e)}")

async def save_github_connection(user_id: str, token: str, github_login: str, repo_full_name: str = None):
    """Save encrypted GitHub token to Supabase."""
    encrypted_token = encrypt_value(token)

    # Upsert github connection
    supabase_admin.table("github_connections").upsert({
        "user_id": user_id,
        "github_login": github_login,
        "encrypted_token": encrypted_token,
        "connected_repo": repo_full_name,
        "is_active": True
    }).execute()

async def get_github_token(user_id: str) -> Optional[str]:
    """Get decrypted GitHub token for user."""
    try:
        result = supabase_admin.table("github_connections")\
            .select("encrypted_token")\
            .eq("user_id", user_id)\
            .eq("is_active", True)\
            .execute()

        if result.data:
            return decrypt_value(result.data[0]["encrypted_token"])
        return None
    except Exception:
        return None

async def sync_notebooks_to_db(user_id: str, repo_full_name: str, structure: Dict):
    """Sync repo notebook structure to Supabase."""
    for folder in structure["folders"]:
        for notebook in folder["notebooks"]:
            # Check if notebook already exists
            existing = supabase_admin.table("notebooks")\
                .select("id, status")\
                .eq("user_id", user_id)\
                .eq("path", notebook["path"])\
                .execute()

            if not existing.data:
                # Insert new notebook
                supabase_admin.table("notebooks").insert({
                    "user_id": user_id,
                    "repo_full_name": repo_full_name,
                    "path": notebook["path"],
                    "name": notebook["name"],
                    "raw_name": notebook["raw_name"],
                    "folder": notebook["folder"],
                    "folder_order": notebook["folder_order"],
                    "notebook_order": notebook["notebook_order"],
                    "status": "pending",
                    "sha": notebook["sha"],
                    "html_url": notebook["html_url"]
                }).execute()
            else:
                # Update sha and html_url but preserve status
                supabase_admin.table("notebooks").update({
                    "sha": notebook["sha"],
                    "html_url": notebook["html_url"],
                    "folder_order": notebook["folder_order"],
                    "notebook_order": notebook["notebook_order"]
                }).eq("id", existing.data[0]["id"]).execute()
