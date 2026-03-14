from pydantic import BaseModel
from typing import Optional, List

class GitHubTokenConnect(BaseModel):
    token: str

class Repository(BaseModel):
    id: Optional[str] = None
    name: str
    full_name: str
    description: Optional[str] = None
    default_branch: str = "main"
    html_url: str
    is_connected: bool = False

class NotebookItem(BaseModel):
    id: Optional[str] = None
    path: str
    name: str
    folder: str
    folder_order: int = 0
    notebook_order: int = 0
    status: str = "pending"  # pending, generated, published, skipped, missing
    last_modified: Optional[str] = None
    sha: Optional[str] = None
    html_url: Optional[str] = None

class FolderItem(BaseModel):
    name: str
    path: str
    order: int = 0
    notebooks: List[NotebookItem] = []
    total: int = 0
    published: int = 0
    pending: int = 0

class RepoStructure(BaseModel):
    repo_name: str
    full_name: str
    folders: List[FolderItem] = []
    total_notebooks: int = 0
