from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.database import supabase_admin
from datetime import datetime, timedelta
from collections import defaultdict

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/overview")
async def get_analytics_overview(current_user: dict = Depends(get_current_user)):
    """
    Returns full analytics data:
    - Pipeline run stats (30-day window)
    - Daily run counts (last 14 days)
    - Notebook status breakdown
    - Recent activity feed
    - Pipeline success rate
    """
    user_id = current_user["id"]
    now = datetime.utcnow()
    since_30d = (now - timedelta(days=30)).isoformat()
    since_14d = (now - timedelta(days=14)).isoformat()

    # ── Pipeline runs (last 30 days) ──────────────────────────────────────────
    try:
        runs_res = supabase_admin.table("pipeline_runs") \
            .select("id, status, started_at, completed_at, pipeline_id") \
            .eq("user_id", user_id) \
            .gte("started_at", since_30d) \
            .order("started_at", desc=True) \
            .execute()
        runs = runs_res.data or []
    except Exception:
        runs = []

    total_runs = len(runs)
    success_runs = sum(1 for r in runs if r.get("status") == "success")
    failed_runs  = sum(1 for r in runs if r.get("status") == "failed")
    success_rate = round((success_runs / total_runs * 100) if total_runs > 0 else 0, 1)

    # Average duration in seconds
    durations = []
    for r in runs:
        if r.get("started_at") and r.get("completed_at"):
            try:
                start = datetime.fromisoformat(r["started_at"].replace("Z", "+00:00"))
                end   = datetime.fromisoformat(r["completed_at"].replace("Z", "+00:00"))
                delta = (end - start).total_seconds()
                if 0 < delta < 3600:  # ignore unrealistic values
                    durations.append(delta)
            except Exception:
                pass
    avg_duration = round(sum(durations) / len(durations)) if durations else 0

    # ── Daily run counts (last 14 days) ───────────────────────────────────────
    try:
        daily_res = supabase_admin.table("pipeline_runs") \
            .select("status, started_at") \
            .eq("user_id", user_id) \
            .gte("started_at", since_14d) \
            .execute()
        daily_runs = daily_res.data or []
    except Exception:
        daily_runs = []

    # Build date → {success, failed} map
    day_counts: dict = defaultdict(lambda: {"success": 0, "failed": 0, "total": 0})
    for r in daily_runs:
        if r.get("started_at"):
            try:
                day = r["started_at"][:10]  # "YYYY-MM-DD"
                day_counts[day]["total"] += 1
                if r.get("status") == "success":
                    day_counts[day]["success"] += 1
                elif r.get("status") == "failed":
                    day_counts[day]["failed"] += 1
            except Exception:
                pass

    # Fill all 14 days even if no runs
    daily_chart = []
    for i in range(13, -1, -1):
        day = (now - timedelta(days=i)).strftime("%Y-%m-%d")
        label = (now - timedelta(days=i)).strftime("%b %d")
        daily_chart.append({
            "date":    day,
            "label":   label,
            "success": day_counts[day]["success"],
            "failed":  day_counts[day]["failed"],
            "total":   day_counts[day]["total"],
        })

    # ── Notebook status breakdown ─────────────────────────────────────────────
    try:
        nb_res = supabase_admin.table("notebooks") \
            .select("status") \
            .eq("user_id", user_id) \
            .execute()
        notebooks = nb_res.data or []
    except Exception:
        notebooks = []

    nb_counts = defaultdict(int)
    for nb in notebooks:
        nb_counts[nb.get("status", "missing")] += 1

    nb_total = len(notebooks)
    notebook_breakdown = [
        {"status": "published", "count": nb_counts["published"],
         "pct": round(nb_counts["published"] / nb_total * 100) if nb_total else 0,
         "color": "#22c55e"},
        {"status": "generated", "count": nb_counts["generated"],
         "pct": round(nb_counts["generated"] / nb_total * 100) if nb_total else 0,
         "color": "#6366f1"},
        {"status": "pending",   "count": nb_counts["pending"],
         "pct": round(nb_counts["pending"] / nb_total * 100) if nb_total else 0,
         "color": "#f59e0b"},
        {"status": "missing",   "count": nb_counts["missing"],
         "pct": round(nb_counts["missing"] / nb_total * 100) if nb_total else 0,
         "color": "#e2e8f0"},
        {"status": "skipped",   "count": nb_counts["skipped"],
         "pct": round(nb_counts["skipped"] / nb_total * 100) if nb_total else 0,
         "color": "#94a3b8"},
    ]

    # ── Recent activity (last 10 runs) ────────────────────────────────────────
    try:
        activity_res = supabase_admin.table("pipeline_runs") \
            .select("id, status, started_at, completed_at, pipeline_id, notebook_id") \
            .eq("user_id", user_id) \
            .order("started_at", desc=True) \
            .limit(10) \
            .execute()
        activity_rows = activity_res.data or []
    except Exception:
        activity_rows = []

    # Enrich with pipeline name
    pipeline_ids = list({r["pipeline_id"] for r in activity_rows if r.get("pipeline_id")})
    pipeline_names: dict = {}
    if pipeline_ids:
        try:
            pl_res = supabase_admin.table("pipelines") \
                .select("id, name") \
                .in_("id", pipeline_ids) \
                .execute()
            pipeline_names = {p["id"]: p["name"] for p in (pl_res.data or [])}
        except Exception:
            pass

    recent_activity = []
    for r in activity_rows:
        duration_s = None
        if r.get("started_at") and r.get("completed_at"):
            try:
                start = datetime.fromisoformat(r["started_at"].replace("Z", "+00:00"))
                end   = datetime.fromisoformat(r["completed_at"].replace("Z", "+00:00"))
                duration_s = int((end - start).total_seconds())
            except Exception:
                pass
        recent_activity.append({
            "run_id":        r["id"],
            "status":        r.get("status", "unknown"),
            "started_at":    r.get("started_at"),
            "completed_at":  r.get("completed_at"),
            "duration_s":    duration_s,
            "pipeline_id":   r.get("pipeline_id"),
            "pipeline_name": pipeline_names.get(r.get("pipeline_id", ""), "Manual Run"),
        })

    # ── Pipelines summary ─────────────────────────────────────────────────────
    try:
        pl_all = supabase_admin.table("pipelines") \
            .select("id, is_active, last_run_status") \
            .eq("user_id", user_id).execute()
        pipelines_data = pl_all.data or []
    except Exception:
        pipelines_data = []

    return {
        "summary": {
            "total_runs_30d":  total_runs,
            "success_runs_30d": success_runs,
            "failed_runs_30d":  failed_runs,
            "success_rate":     success_rate,
            "avg_duration_s":   avg_duration,
            "total_notebooks":  nb_total,
            "published_notebooks": nb_counts["published"],
            "total_pipelines":  len(pipelines_data),
            "active_pipelines": sum(1 for p in pipelines_data if p.get("is_active")),
        },
        "daily_runs":          daily_chart,
        "notebook_breakdown":  notebook_breakdown,
        "recent_activity":     recent_activity,
    }
