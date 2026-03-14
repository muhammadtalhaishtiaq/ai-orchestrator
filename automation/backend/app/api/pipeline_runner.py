from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from app.api.deps import get_current_user
from app.database import supabase_admin
from app.services.github_service import get_github_token
from app.services.notebook_generator import build_cells, build_notebook_file
from typing import Optional
from github import Github, GithubException
import uuid
from datetime import datetime

router = APIRouter(prefix="/pipeline", tags=["Pipeline Runner"])

# In-memory run status (per process)
_run_status: dict = {}


async def _execute_pipeline_run(run_id: str, user_id: str, notebook_id: Optional[str], pipeline_id: Optional[str] = None):
    """
    Execute a real pipeline run:
    1. Find next pending notebook
    2. Generate .ipynb from notebook_config.json
    3. Push to GitHub
    4. Update DB status
    5. Auto-advance next notebook
    """
    STEPS = [
        (1, "Fetching next notebook from queue"),
        (2, "Syncing GitHub connection"),
        (3, "Validating notebook structure"),
        (4, "Generating notebook content"),
        (5, "Building .ipynb file"),
        (6, "Connecting to GitHub"),
        (7, "Pushing to GitHub"),
        (8, "Updating content queue"),
    ]

    logs = []
    _run_status[run_id]["status"] = "running"

    import asyncio

    def _log(step: int, msg: str, status: str = "running"):
        entry = {
            "step": step,
            "total_steps": len(STEPS),
            "message": msg,
            "timestamp": datetime.utcnow().isoformat(),
            "status": status,
        }
        logs.append(entry)
        _run_status[run_id]["logs"] = list(logs)
        return entry

    try:
        # ── Step 1: Find notebook ─────────────────────────────────────────────
        _log(1, f"[1/{len(STEPS)}] Fetching next notebook from queue...")
        _run_status[run_id]["current_step"] = 1
        _run_status[run_id]["current_step_name"] = STEPS[0][1]

        target_nb = None
        if notebook_id:
            r = supabase_admin.table("notebooks").select("*")\
                .eq("id", notebook_id).eq("user_id", user_id).execute()
            target_nb = r.data[0] if r.data else None
        else:
            r = supabase_admin.table("notebooks").select("*")\
                .eq("user_id", user_id).eq("status", "pending")\
                .order("folder_order").order("notebook_order").limit(1).execute()
            target_nb = r.data[0] if r.data else None

        if not target_nb:
            _run_status[run_id]["status"] = "failed"
            _run_status[run_id]["error"] = "No pending notebook in queue. Use 'Next Up' to queue one."
            _run_status[run_id]["completed_at"] = datetime.utcnow().isoformat()
            logs[-1]["status"] = "error"
            logs[-1]["message"] += " ❌ No pending notebooks found"
            _run_status[run_id]["logs"] = list(logs)
            return

        nb_name = target_nb.get("name", "Unknown")
        nb_path = target_nb.get("path", "")
        nb_folder = target_nb.get("folder", "")
        _run_status[run_id]["notebook"] = {"id": target_nb["id"], "name": nb_name, "path": nb_path}
        logs[-1]["status"] = "done"
        logs[-1]["message"] += f" ✓ Found: {nb_name}"
        _run_status[run_id]["logs"] = list(logs)

        # ── Step 2: Get GitHub token ──────────────────────────────────────────
        _log(2, f"[2/{len(STEPS)}] Syncing GitHub connection...")
        _run_status[run_id]["current_step"] = 2
        await asyncio.sleep(0.5)

        token = await get_github_token(user_id)
        conn_res = supabase_admin.table("github_connections").select("connected_repo")\
            .eq("user_id", user_id).eq("is_active", True).execute()

        if not token or not conn_res.data or not conn_res.data[0].get("connected_repo"):
            _run_status[run_id]["status"] = "failed"
            _run_status[run_id]["error"] = "No GitHub token or repo connected. Go to Settings → GitHub."
            _run_status[run_id]["completed_at"] = datetime.utcnow().isoformat()
            logs[-1]["status"] = "error"
            _run_status[run_id]["logs"] = list(logs)
            return

        repo_full_name = conn_res.data[0]["connected_repo"]
        logs[-1]["status"] = "done"
        logs[-1]["message"] += f" ✓ Repo: {repo_full_name}"
        _run_status[run_id]["logs"] = list(logs)

        # ── Step 3: Validate ──────────────────────────────────────────────────
        _log(3, f"[3/{len(STEPS)}] Validating notebook structure...")
        _run_status[run_id]["current_step"] = 3
        await asyncio.sleep(0.3)
        logs[-1]["status"] = "done"
        logs[-1]["message"] += " ✓"
        _run_status[run_id]["logs"] = list(logs)

        # ── Step 4: Generate cells ────────────────────────────────────────────
        _log(4, f"[4/{len(STEPS)}] Generating notebook content from config...")
        _run_status[run_id]["current_step"] = 4
        await asyncio.sleep(0.5)

        cells = build_cells(
            notebook_name=nb_name,
            folder=nb_folder,
            path=nb_path,
        )
        logs[-1]["status"] = "done"
        logs[-1]["message"] += f" ✓ {len(cells)} cells built"
        _run_status[run_id]["logs"] = list(logs)

        # ── Step 5: Build .ipynb ──────────────────────────────────────────────
        _log(5, f"[5/{len(STEPS)}] Building .ipynb file...")
        _run_status[run_id]["current_step"] = 5
        await asyncio.sleep(0.3)

        nb_json = build_notebook_file(cells)
        logs[-1]["status"] = "done"
        logs[-1]["message"] += " ✓"
        _run_status[run_id]["logs"] = list(logs)

        # ── Step 6: Connect to GitHub ─────────────────────────────────────────
        _log(6, f"[6/{len(STEPS)}] Connecting to GitHub...")
        _run_status[run_id]["current_step"] = 6
        await asyncio.sleep(0.3)

        g = Github(token)
        repo = g.get_repo(repo_full_name)
        logs[-1]["status"] = "done"
        logs[-1]["message"] += f" ✓ Connected"
        _run_status[run_id]["logs"] = list(logs)

        # ── Step 7: Push to GitHub ────────────────────────────────────────────
        _log(7, f"[7/{len(STEPS)}] Pushing {nb_path} to GitHub...")
        _run_status[run_id]["current_step"] = 7

        commit_msg = f"feat: add {nb_name} notebook"
        try:
            existing = repo.get_contents(nb_path)
            repo.update_file(path=nb_path, message=commit_msg, content=nb_json, sha=existing.sha)
            gh_action = "updated"
        except GithubException:
            repo.create_file(path=nb_path, message=commit_msg, content=nb_json)
            gh_action = "created"

        github_url = f"https://github.com/{repo_full_name}/blob/main/{nb_path}"
        logs[-1]["status"] = "done"
        logs[-1]["message"] += f" ✓ {gh_action.capitalize()} on GitHub"
        _run_status[run_id]["logs"] = list(logs)

        # ── Step 8: Update DB + auto-advance ─────────────────────────────────
        _log(8, f"[8/{len(STEPS)}] Updating content queue...")
        _run_status[run_id]["current_step"] = 8
        await asyncio.sleep(0.3)

        # Mark this notebook as published
        pub_res = supabase_admin.table("notebooks").update({
            "status": "published",
            "html_url": github_url,
            "generated_at": datetime.utcnow().isoformat(),
        }).eq("id", target_nb["id"]).execute()

        published_ok = bool(pub_res.data)
        _log_extra = f" ✓ Published ({target_nb['id'][:8]})" if published_ok else " ⚠️ DB publish may have failed"

        # ── Auto-advance: find next missing notebook ──────────────────────────
        # Strategy 1: same folder, higher notebook_order
        # Strategy 2: any folder with higher folder_order (first missing)
        # Strategy 3: any missing notebook globally (fallback)
        advanced_name = None
        next_nb = None

        nb_order = target_nb.get("notebook_order")
        folder_order_val = target_nb.get("folder_order")

        # Promotable statuses = anything not yet published or already pending
        PROMOTABLE = ("missing", "generated")

        # Strategy 1 — same folder, next notebook_order, any promotable status
        if nb_order is not None:
            r = supabase_admin.table("notebooks").select("id, name, folder, notebook_order, status")\
                .eq("user_id", user_id).eq("folder", nb_folder)\
                .in_("status", list(PROMOTABLE))\
                .gt("notebook_order", nb_order)\
                .order("notebook_order").limit(1).execute()
            if r.data:
                next_nb = r.data[0]

        # Strategy 1b — same folder but notebook_order is null: check if ANY promotable sibling exists
        if not next_nb:
            r = supabase_admin.table("notebooks").select("id, name, folder, notebook_order, status")\
                .eq("user_id", user_id).eq("folder", nb_folder)\
                .in_("status", list(PROMOTABLE))\
                .order("notebook_order").limit(1).execute()
            if r.data:
                next_nb = r.data[0]

        # Strategy 2 — no more siblings: move to next folder(s), first promotable notebook
        if not next_nb and folder_order_val is not None:
            r = supabase_admin.table("notebooks").select("id, name, folder, notebook_order, status")\
                .eq("user_id", user_id)\
                .in_("status", list(PROMOTABLE))\
                .gt("folder_order", folder_order_val)\
                .order("folder_order").order("notebook_order").limit(1).execute()
            if r.data:
                next_nb = r.data[0]

        # Strategy 3 — global fallback: any promotable notebook by folder+notebook order
        if not next_nb:
            r = supabase_admin.table("notebooks").select("id, name, folder, notebook_order, status")\
                .eq("user_id", user_id)\
                .in_("status", list(PROMOTABLE))\
                .order("folder_order").order("notebook_order").limit(1).execute()
            if r.data:
                next_nb = r.data[0]

        if next_nb:
            adv_res = supabase_admin.table("notebooks").update({"status": "pending"})\
                .eq("id", next_nb["id"]).execute()
            if adv_res.data:
                advanced_name = next_nb["name"]
                _log_extra += f" | ⏭️ Queued: {advanced_name}"
            else:
                _log_extra += f" | ⚠️ Auto-advance DB write failed for {next_nb['name']}"
        else:
            _log_extra += " | 🏁 No more missing notebooks to queue"

        logs[-1]["status"] = "done"
        logs[-1]["message"] += f" {_log_extra}"
        _run_status[run_id]["logs"] = list(logs)

        # ── Resolve pipeline_id for DB log ────────────────────────────────────
        now_iso = datetime.utcnow().isoformat()
        if pipeline_id:
            # Validate ownership
            pl_check = supabase_admin.table("pipelines").select("id")\
                .eq("id", pipeline_id).eq("user_id", user_id).execute()
            resolved_pipeline_id = pl_check.data[0]["id"] if pl_check.data else pipeline_id
        else:
            pl_res = supabase_admin.table("pipelines").select("id")\
                .eq("user_id", user_id).order("created_at").limit(1).execute()
            if pl_res.data:
                resolved_pipeline_id = pl_res.data[0]["id"]
            else:
                new_pl = supabase_admin.table("pipelines").insert({
                    "user_id": user_id, "name": "Manual Runs",
                    "description": "Default pipeline for ad-hoc manual runs",
                    "trigger_type": "manual", "is_active": True, "steps": []
                }).execute()
                resolved_pipeline_id = new_pl.data[0]["id"]

        supabase_admin.table("pipeline_runs").insert({
            "id": run_id,
            "pipeline_id": resolved_pipeline_id,
            "user_id": user_id,
            "status": "success",
            "trigger_type": "manual",
            "started_at": _run_status[run_id]["started_at"],
            "completed_at": now_iso,
            "logs": logs,
            "notebook_id": target_nb["id"],
        }).execute()

        # Update pipeline last_run_at and last_run_status
        supabase_admin.table("pipelines").update({
            "last_run_at": now_iso,
            "last_run_status": "success",
        }).eq("id", resolved_pipeline_id).execute()

        # ── Final success log ──────────────────────────────────────────────────
        success_msg = (
            f"✅ Done! **{nb_name}** pushed to GitHub.\n"
            + (f"⏭️ Next up: **{advanced_name}** is now queued." if advanced_name else "")
        )
        logs.append({
            "step": len(STEPS) + 1, "total_steps": len(STEPS),
            "message": success_msg,
            "timestamp": datetime.utcnow().isoformat(), "status": "done"
        })
        _run_status[run_id]["status"] = "success"
        _run_status[run_id]["completed_at"] = datetime.utcnow().isoformat()
        _run_status[run_id]["github_url"] = github_url
        _run_status[run_id]["advanced_next"] = advanced_name
        _run_status[run_id]["logs"] = list(logs)

    except GithubException as e:
        err = f"GitHub error: {str(e)}"
        _run_status[run_id]["status"] = "failed"
        _run_status[run_id]["error"] = err
        _run_status[run_id]["completed_at"] = datetime.utcnow().isoformat()
        logs.append({"step": -1, "message": f"❌ {err}",
                     "timestamp": datetime.utcnow().isoformat(), "status": "error"})
        _run_status[run_id]["logs"] = list(logs)
        if pipeline_id:
            try:
                supabase_admin.table("pipelines").update({
                    "last_run_at": datetime.utcnow().isoformat(),
                    "last_run_status": "failed",
                }).eq("id", pipeline_id).execute()
            except Exception:
                pass

    except Exception as e:
        err = str(e)
        _run_status[run_id]["status"] = "failed"
        _run_status[run_id]["error"] = err
        _run_status[run_id]["completed_at"] = datetime.utcnow().isoformat()
        logs.append({"step": -1, "message": f"❌ Failed: {err}",
                     "timestamp": datetime.utcnow().isoformat(), "status": "error"})
        _run_status[run_id]["logs"] = list(logs)
        if pipeline_id:
            try:
                supabase_admin.table("pipelines").update({
                    "last_run_at": datetime.utcnow().isoformat(),
                    "last_run_status": "failed",
                }).eq("id", pipeline_id).execute()
            except Exception:
                pass


@router.post("/run")
async def run_pipeline_now(
    background_tasks: BackgroundTasks,
    notebook_id: Optional[str] = None,
    pipeline_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """Trigger a real pipeline run: generate notebook + push to GitHub."""
    run_id = str(uuid.uuid4())
    started_at = datetime.utcnow().isoformat()

    _run_status[run_id] = {
        "run_id": run_id,
        "user_id": current_user["id"],
        "pipeline_id": pipeline_id,
        "status": "queued",
        "started_at": started_at,
        "completed_at": None,
        "current_step": 0,
        "current_step_name": "Queued",
        "logs": [],
        "notebook": None,
        "error": None,
        "github_url": None,
        "advanced_next": None,
    }

    background_tasks.add_task(
        _execute_pipeline_run, run_id, current_user["id"], notebook_id, pipeline_id
    )

    return {
        "run_id": run_id,
        "status": "queued",
        "message": "Pipeline run started.",
        "started_at": started_at,
        "pipeline_id": pipeline_id,
    }


@router.get("/run/{run_id}/status")
async def get_run_status(run_id: str, current_user: dict = Depends(get_current_user)):
    """Poll the status of a pipeline run."""
    if run_id not in _run_status:
        raise HTTPException(404, "Run not found")
    run = _run_status[run_id]
    if run["user_id"] != current_user["id"]:
        raise HTTPException(403, "Not authorized")
    return run


@router.get("/runs/history")
async def get_run_history(current_user: dict = Depends(get_current_user)):
    """Get recent pipeline run history from DB."""
    try:
        result = supabase_admin.table("pipeline_runs")\
            .select("id, status, trigger_type, started_at, completed_at, error_message, notebook_id")\
            .eq("user_id", current_user["id"])\
            .order("started_at", desc=True).limit(20).execute()
        return {"runs": result.data or [], "total": len(result.data or [])}
    except Exception:
        return {"runs": [], "total": 0}
