from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.date import DateTrigger
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
import logging

logger = logging.getLogger(__name__)

# Global scheduler instance
scheduler = AsyncIOScheduler(timezone="UTC")
_scheduler_started = False

def get_scheduler() -> AsyncIOScheduler:
    global _scheduler_started
    if not _scheduler_started:
        try:
            scheduler.start()
            _scheduler_started = True
            logger.info("APScheduler started")
        except Exception as e:
            logger.error(f"Failed to start scheduler: {e}")
    return scheduler

def parse_trigger(trigger_type: str, trigger_config: Dict[str, Any]):
    """Parse trigger config into APScheduler trigger."""
    if trigger_type == "cron":
        cron_expr = trigger_config.get("cron_expression", "0 17 * * *")
        parts = cron_expr.strip().split()
        if len(parts) == 5:
            minute, hour, day, month, day_of_week = parts
            return CronTrigger(
                minute=minute, hour=hour,
                day=day, month=month,
                day_of_week=day_of_week,
                timezone="UTC"
            )
    elif trigger_type == "scheduled":
        time_str = trigger_config.get("time", "17:00")
        hour, minute = time_str.split(":")
        return CronTrigger(hour=int(hour), minute=int(minute), timezone="UTC")
    return None

async def _run_pipeline_job(pipeline_id: str, user_id: str):
    """Background job that executes a scheduled pipeline."""
    from app.database import supabase_admin
    from app.api.pipeline_runner import _execute_pipeline_run
    import uuid

    run_id = str(uuid.uuid4())
    from app.api.pipeline_runner import _run_status
    _run_status[run_id] = {
        "run_id": run_id,
        "user_id": user_id,
        "status": "queued",
        "started_at": datetime.utcnow().isoformat(),
        "completed_at": None,
        "current_step": 0,
        "current_step_name": "Scheduled trigger",
        "logs": [],
        "notebook": None,
        "error": None
    }

    # Get pipeline to find source_folder
    try:
        result = supabase_admin.table("pipelines").select("*").eq("id", pipeline_id).execute()
        if result.data:
            pipeline = result.data[0]
            await _execute_pipeline_run(run_id, user_id, None)
            # Update pipeline last_run
            supabase_admin.table("pipelines").update({
                "last_run_at": datetime.utcnow().isoformat(),
                "last_run_status": _run_status.get(run_id, {}).get("status", "unknown")
            }).eq("id", pipeline_id).execute()
    except Exception as e:
        logger.error(f"Scheduled pipeline run failed: {e}")

def register_pipeline_job(pipeline_id: str, user_id: str, trigger_type: str, trigger_config: Dict):
    """Register or update a scheduled pipeline job."""
    sched = get_scheduler()
    job_id = f"pipeline_{pipeline_id}"

    # Remove existing job if any
    if sched.get_job(job_id):
        sched.remove_job(job_id)

    if trigger_type in ("cron", "scheduled"):
        trigger = parse_trigger(trigger_type, trigger_config)
        if trigger:
            sched.add_job(
                _run_pipeline_job,
                trigger=trigger,
                id=job_id,
                args=[pipeline_id, user_id],
                replace_existing=True,
                misfire_grace_time=300
            )
            logger.info(f"Registered scheduled job for pipeline {pipeline_id}")
            return True
    return False

def unregister_pipeline_job(pipeline_id: str):
    """Remove a scheduled pipeline job."""
    sched = get_scheduler()
    job_id = f"pipeline_{pipeline_id}"
    if sched.get_job(job_id):
        sched.remove_job(job_id)
        return True
    return False

def get_next_run_time(pipeline_id: str) -> Optional[str]:
    """Get next scheduled run time for a pipeline."""
    sched = get_scheduler()
    job = sched.get_job(f"pipeline_{pipeline_id}")
    if job and job.next_run_time:
        return job.next_run_time.isoformat()
    return None

def list_scheduled_jobs() -> list:
    """List all active scheduled jobs."""
    sched = get_scheduler()
    jobs = []
    for job in sched.get_jobs():
        jobs.append({
            "job_id": job.id,
            "pipeline_id": job.id.replace("pipeline_", ""),
            "next_run_time": job.next_run_time.isoformat() if job.next_run_time else None,
        })
    return jobs
