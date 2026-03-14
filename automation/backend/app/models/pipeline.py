from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class PipelineStep(BaseModel):
    order: int
    action: str  # generate_notebook, test_notebook, push_to_github, etc.
    config: Dict[str, Any] = {}
    llm_provider: Optional[str] = None
    llm_model: Optional[str] = None

class PipelineCreate(BaseModel):
    name: str
    description: Optional[str] = None
    trigger_type: str = "manual"  # manual, scheduled, cron, webhook
    trigger_config: Dict[str, Any] = {}
    source_repo: Optional[str] = None
    source_folder: Optional[str] = None
    steps: List[PipelineStep] = []
    is_active: bool = True

class PipelineResponse(PipelineCreate):
    id: str
    user_id: str
    created_at: str
    updated_at: Optional[str] = None
    last_run_at: Optional[str] = None
    last_run_status: Optional[str] = None
