"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { pipelinesAPI } from "@/lib/api";
import toast from "react-hot-toast";
import {
  GitBranch, Plus, Play, Zap, CheckCircle, XCircle,
  Loader2, Clock, Copy, Trash2, ToggleLeft, ToggleRight,
  ChevronRight, Calendar, History, ChevronDown, ChevronUp, Pencil,
} from "lucide-react";
import { clsx } from "clsx";

interface Pipeline {
  id: string;
  name: string;
  description?: string;
  trigger_type: string;
  trigger_config: any;
  steps: any[];
  is_active: boolean;
  last_run_at?: string;
  last_run_status?: string;
  next_run_time?: string;
  created_at: string;
}

interface LogEntry {
  step: number;
  message: string;
  timestamp: string;
  status: string;
}

interface RunState {
  run_id: string;
  status: string;
  current_step: number;
  current_step_name: string;
  logs: LogEntry[];
  notebook: { name: string; path: string } | null;
  error: string | null;
  completed_at: string | null;
  showLogs: boolean;
}

const TOTAL_STEPS = 8;

const triggerBadge = (type: string) => {
  const map: Record<string, string> = {
    manual: "bg-slate-100 text-slate-600",
    scheduled: "bg-blue-100 text-blue-700",
    cron: "bg-purple-100 text-purple-700",
    webhook: "bg-orange-100 text-orange-700",
  };
  return map[type] || "bg-slate-100 text-slate-600";
};

function formatNextRun(isoStr: string): string {
  const d = new Date(isoStr);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  if (diffMs < 0) return d.toLocaleString();
  const mins = Math.floor(diffMs / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `in ${days}d ${hrs % 24}h`;
  if (hrs > 0) return `in ${hrs}h ${mins % 60}m`;
  if (mins > 0) return `in ${mins}m`;
  return "very soon";
}

export default function PipelinesPage() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Global Quick Run state
  const [quickRunning, setQuickRunning] = useState(false);
  const [quickRunState, setQuickRunState] = useState<RunState | null>(null);
  const quickPollRef = useRef<NodeJS.Timeout | null>(null);
  const quickLogsEndRef = useRef<HTMLDivElement>(null);

  // Per-pipeline run states keyed by pipeline ID
  const [pipelineRuns, setPipelineRuns] = useState<Record<string, RunState>>({});
  const pipelinePolls = useRef<Record<string, NodeJS.Timeout>>({});
  const pipelineLogRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    loadPipelines();
    return () => {
      if (quickPollRef.current) clearInterval(quickPollRef.current);
      Object.values(pipelinePolls.current).forEach(clearInterval);
    };
  }, []);

  // Auto-scroll quick run logs
  useEffect(() => {
    quickLogsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [quickRunState?.logs]);

  // Auto-scroll per-pipeline logs
  useEffect(() => {
    Object.entries(pipelineRuns).forEach(([id, run]) => {
      if (run.logs.length > 0) {
        pipelineLogRefs.current[id]?.scrollIntoView({ behavior: "smooth" });
      }
    });
  }, [pipelineRuns]);

  const loadPipelines = async () => {
    setLoading(true);
    try {
      const { data } = await pipelinesAPI.list();
      setPipelines(data.pipelines || []);
    } catch { toast.error("Failed to load pipelines"); }
    finally { setLoading(false); }
  };

  const refreshPipeline = async (pipelineId: string) => {
    try {
      const { data } = await pipelinesAPI.get(pipelineId);
      setPipelines(prev => prev.map(p => p.id === pipelineId ? { ...p, ...data } : p));
    } catch { /* silently ignore */ }
  };

  // ── Quick Run (global) ────────────────────────────────────────────────────
  const startQuickPoll = useCallback((runId: string) => {
    if (quickPollRef.current) clearInterval(quickPollRef.current);
    quickPollRef.current = setInterval(async () => {
      try {
        const { data } = await pipelinesAPI.getRunStatus(runId);
        setQuickRunState(prev => prev ? { ...prev, ...data } : data);
        if (data.status === "success" || data.status === "failed") {
          clearInterval(quickPollRef.current!);
          setQuickRunning(false);
          if (data.status === "success") toast.success(`✅ "${data.notebook?.name}" generated!`);
          else toast.error(`❌ Failed: ${data.error}`);
          loadPipelines();
        }
      } catch { clearInterval(quickPollRef.current!); setQuickRunning(false); }
    }, 1200);
  }, []);

  const handleQuickRun = async () => {
    setQuickRunning(true);
    setQuickRunState(null);
    try {
      const { data } = await pipelinesAPI.runNow();
      setQuickRunState({ run_id: data.run_id, status: "queued", current_step: 0, current_step_name: "Starting...", logs: [], notebook: null, error: null, completed_at: null, showLogs: true });
      toast("🚀 Pipeline started!", { icon: "⚡" });
      startQuickPoll(data.run_id);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to start pipeline");
      setQuickRunning(false);
    }
  };

  // ── Per-pipeline Run ──────────────────────────────────────────────────────
  const startPipelinePoll = useCallback((runId: string, pipelineId: string) => {
    if (pipelinePolls.current[pipelineId]) clearInterval(pipelinePolls.current[pipelineId]);
    pipelinePolls.current[pipelineId] = setInterval(async () => {
      try {
        const { data } = await pipelinesAPI.getRunStatus(runId);
        setPipelineRuns(prev => ({
          ...prev,
          [pipelineId]: { ...prev[pipelineId], ...data },
        }));
        if (data.status === "success" || data.status === "failed") {
          clearInterval(pipelinePolls.current[pipelineId]);
          if (data.status === "success") toast.success(`✅ "${data.notebook?.name}" generated!`);
          else toast.error(`❌ Run failed: ${data.error}`);
          // Refresh this pipeline's metadata (last_run_at, last_run_status, next_run_time)
          await refreshPipeline(pipelineId);
        }
      } catch { clearInterval(pipelinePolls.current[pipelineId]); }
    }, 1200);
  }, []);

  const handleRunPipeline = async (pipelineId: string) => {
    setPipelineRuns(prev => ({
      ...prev,
      [pipelineId]: {
        run_id: "",
        status: "queued",
        current_step: 0,
        current_step_name: "Starting...",
        logs: [],
        notebook: null,
        error: null,
        completed_at: null,
        showLogs: true,
      },
    }));
    try {
      const { data } = await pipelinesAPI.runPipeline(pipelineId);
      setPipelineRuns(prev => ({
        ...prev,
        [pipelineId]: { ...prev[pipelineId], run_id: data.run_id, status: "queued" },
      }));
      toast("🚀 Pipeline started!", { icon: "⚡" });
      startPipelinePoll(data.run_id, pipelineId);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to start pipeline");
      setPipelineRuns(prev => {
        const next = { ...prev };
        delete next[pipelineId];
        return next;
      });
    }
  };

  const togglePipelineLogs = (pipelineId: string) => {
    setPipelineRuns(prev => ({
      ...prev,
      [pipelineId]: { ...prev[pipelineId], showLogs: !prev[pipelineId].showLogs },
    }));
  };

  // ── Other handlers ────────────────────────────────────────────────────────
  const handleToggle = async (id: string) => {
    try {
      const { data } = await pipelinesAPI.toggle(id);
      toast.success(data.message);
      loadPipelines();
    } catch { toast.error("Failed to toggle pipeline"); }
  };

  const handleClone = async (id: string) => {
    try {
      await pipelinesAPI.clone(id);
      toast.success("Pipeline cloned!");
      loadPipelines();
    } catch { toast.error("Failed to clone pipeline"); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete pipeline "${name}"?`)) return;
    setDeletingId(id);
    try {
      await pipelinesAPI.delete(id);
      toast.success("Pipeline deleted");
      loadPipelines();
    } catch { toast.error("Failed to delete pipeline"); }
    finally { setDeletingId(null); }
  };

  const quickProgress = quickRunState
    ? quickRunState.status === "success" || quickRunState.status === "failed" ? 100
    : Math.round((quickRunState.current_step / TOTAL_STEPS) * 100)
    : 0;

  const pipelineProgress = (run: RunState) =>
    run.status === "success" || run.status === "failed" ? 100
    : Math.round((run.current_step / TOTAL_STEPS) * 100);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <GitBranch className="w-7 h-7" /> Pipelines
          </h1>
          <p className="text-slate-500 mt-1">Build, schedule, and manage your ML content pipelines</p>
        </div>
        <Link href="/dashboard/pipelines/new" className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> New Pipeline
        </Link>
      </div>

      {/* QUICK RUN CARD */}
      <div className="card mb-6 border-2 border-dashed border-sky-200 bg-sky-50/40">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-1">
              <Zap className="w-5 h-5 text-sky-600" /> Quick Run
            </h3>
            <p className="text-sm text-slate-500">Instantly run the next pending notebook through the full pipeline.</p>
          </div>
          <button onClick={handleQuickRun} disabled={quickRunning}
            className={clsx("flex items-center gap-2 font-semibold px-6 py-3 rounded-xl transition-all text-sm shadow-sm",
              quickRunning ? "bg-sky-400 text-white cursor-not-allowed" : "bg-sky-600 hover:bg-sky-700 text-white hover:shadow-md")}>
            {quickRunning ? <><Loader2 className="w-4 h-4 animate-spin" /> Running...</> : <><Play className="w-4 h-4" /> Run Now</>}
          </button>
        </div>

        {quickRunState && (
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {quickRunState.status === "success" && <CheckCircle className="w-4 h-4 text-green-500" />}
                {quickRunState.status === "failed" && <XCircle className="w-4 h-4 text-red-500" />}
                {(quickRunState.status === "running" || quickRunState.status === "queued") && <Loader2 className="w-4 h-4 animate-spin text-sky-500" />}
                <span className="text-sm font-medium text-slate-700">
                  {quickRunState.status === "success" ? `✅ Done — "${quickRunState.notebook?.name}"` :
                   quickRunState.status === "failed" ? `Failed: ${quickRunState.error}` :
                   quickRunState.current_step_name || "Starting..."}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">{quickProgress}%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className={clsx("h-full rounded-full transition-all duration-700",
                  quickRunState.status === "success" ? "bg-green-500" :
                  quickRunState.status === "failed" ? "bg-red-500" : "bg-sky-500")}
                style={{ width: `${quickProgress}%` }} />
            </div>
            {quickRunState.showLogs && quickRunState.logs.length > 0 && (
              <div className="mt-3 bg-slate-900 rounded-xl p-4 font-mono text-xs max-h-52 overflow-y-auto">
                {quickRunState.logs.map((log, i) => (
                  <div key={i} className={clsx("flex gap-2 py-0.5",
                    log.status === "error" ? "text-red-400" : log.status === "done" ? "text-green-400" : "text-slate-300")}>
                    <span className="text-slate-500 shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    <span>{log.message}</span>
                    {log.status === "done" && log.step > 0 && <span className="ml-auto text-green-500 shrink-0">✓</span>}
                  </div>
                ))}
                <div ref={quickLogsEndRef} />
              </div>
            )}
            {quickRunState.logs.length > 0 && (
              <button onClick={() => setQuickRunState(prev => prev ? { ...prev, showLogs: !prev.showLogs } : prev)}
                className="mt-2 text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1">
                {quickRunState.showLogs ? <><ChevronUp className="w-3 h-3" /> Hide logs</> : <><ChevronDown className="w-3 h-3" /> Show logs</>}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pipeline List */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <GitBranch className="w-4 h-4" /> Your Pipelines
            <span className="text-xs text-slate-400 font-normal">({pipelines.length})</span>
          </h3>
        </div>

        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
        ) : pipelines.length === 0 ? (
          <div className="text-center py-12">
            <GitBranch className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No pipelines yet</p>
            <p className="text-slate-400 text-sm mt-1">Create your first pipeline to automate your content workflow</p>
            <Link href="/dashboard/pipelines/new" className="btn-primary inline-flex items-center gap-2 text-sm mt-4">
              <Plus className="w-4 h-4" /> Create Pipeline
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {pipelines.map((pipeline) => {
              const run = pipelineRuns[pipeline.id];
              const isRunning = run && (run.status === "queued" || run.status === "running");
              const progress = run ? pipelineProgress(run) : 0;

              return (
                <div key={pipeline.id} className={clsx(
                  "rounded-xl border transition-all",
                  pipeline.is_active ? "border-slate-200 hover:border-sky-200" : "border-slate-100 bg-slate-50 opacity-70")}>

                  {/* Pipeline Row */}
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={clsx("w-2.5 h-2.5 rounded-full shrink-0 mt-0.5",
                        isRunning ? "bg-sky-400 animate-pulse" :
                        pipeline.is_active ? "bg-green-400" : "bg-slate-300")} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link href={`/dashboard/pipelines/${pipeline.id}`}
                            className="font-semibold text-slate-800 hover:text-sky-600 transition-colors text-sm">
                            {pipeline.name}
                          </Link>
                          <span className={clsx("text-xs px-2 py-0.5 rounded-full font-medium capitalize", triggerBadge(pipeline.trigger_type))}>
                            {pipeline.trigger_type}
                          </span>
                          {pipeline.steps?.length > 0 && (
                            <span className="text-xs text-slate-400">{pipeline.steps.length} steps</span>
                          )}
                        </div>
                        {pipeline.description && (
                          <p className="text-xs text-slate-400 mt-0.5 truncate">{pipeline.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          {pipeline.next_run_time && (
                            <span className="text-xs text-blue-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Next: {formatNextRun(pipeline.next_run_time)}
                            </span>
                          )}
                          {pipeline.last_run_at && (
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <History className="w-3 h-3" />
                              Last: {new Date(pipeline.last_run_at).toLocaleString()}
                              {pipeline.last_run_status && (
                                <span className={clsx("ml-1 px-1.5 rounded font-medium text-[11px]",
                                  pipeline.last_run_status === "success"
                                    ? "text-green-600 bg-green-50"
                                    : "text-red-600 bg-red-50")}>
                                  {pipeline.last_run_status}
                                </span>
                              )}
                            </span>
                          )}
                          {!pipeline.last_run_at && (
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Never run
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 ml-4 shrink-0">
                      {/* Run Now button per pipeline */}
                      <button
                        onClick={() => handleRunPipeline(pipeline.id)}
                        disabled={!!isRunning}
                        title="Run this pipeline now"
                        className={clsx(
                          "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all mr-1",
                          isRunning
                            ? "bg-sky-100 text-sky-400 cursor-not-allowed"
                            : "bg-sky-600 hover:bg-sky-700 text-white shadow-sm hover:shadow"
                        )}>
                        {isRunning
                          ? <><Loader2 className="w-3 h-3 animate-spin" /> Running</>
                          : <><Play className="w-3 h-3" /> Run</>}
                      </button>

                      <button onClick={() => handleToggle(pipeline.id)} title={pipeline.is_active ? "Disable" : "Enable"}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors">
                        {pipeline.is_active ? <ToggleRight className="w-4 h-4 text-green-500" /> : <ToggleLeft className="w-4 h-4" />}
                      </button>
                      <button onClick={() => handleClone(pipeline.id)} title="Clone"
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors">
                        <Copy className="w-4 h-4" />
                      </button>
                      <Link href={`/dashboard/pipelines/${pipeline.id}/edit`}
                        className="p-2 rounded-lg hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 transition-colors" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <Link href={`/dashboard/pipelines/${pipeline.id}`}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(pipeline.id, pipeline.name)} title="Delete"
                        disabled={deletingId === pipeline.id}
                        className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                        {deletingId === pipeline.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Inline Run Panel — shown when this pipeline has an active/recent run */}
                  {run && (
                    <div className="px-4 pb-4 pt-0 border-t border-slate-100">
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            {run.status === "success" && <CheckCircle className="w-3.5 h-3.5 text-green-500" />}
                            {run.status === "failed" && <XCircle className="w-3.5 h-3.5 text-red-500" />}
                            {(run.status === "running" || run.status === "queued") && <Loader2 className="w-3.5 h-3.5 animate-spin text-sky-500" />}
                            <span className="text-xs font-medium text-slate-600">
                              {run.status === "success"
                                ? `✅ Done — "${run.notebook?.name}"`
                                : run.status === "failed"
                                ? `❌ ${run.error}`
                                : run.current_step_name || "Starting..."}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono">{progress}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className={clsx("h-full rounded-full transition-all duration-700",
                              run.status === "success" ? "bg-green-500" :
                              run.status === "failed" ? "bg-red-500" : "bg-sky-500")}
                            style={{ width: `${progress}%` }} />
                        </div>

                        {run.showLogs && run.logs.length > 0 && (
                          <div className="mt-2 bg-slate-900 rounded-lg p-3 font-mono text-xs max-h-44 overflow-y-auto">
                            {run.logs.map((log, i) => (
                              <div key={i} className={clsx("flex gap-2 py-0.5",
                                log.status === "error" ? "text-red-400" :
                                log.status === "done" ? "text-green-400" : "text-slate-300")}>
                                <span className="text-slate-500 shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                <span className="break-all">{log.message}</span>
                                {log.status === "done" && log.step > 0 && <span className="ml-auto text-green-500 shrink-0">✓</span>}
                              </div>
                            ))}
                            <div ref={(el) => { pipelineLogRefs.current[pipeline.id] = el; }} />
                          </div>
                        )}
                        {run.logs.length > 0 && (
                          <button onClick={() => togglePipelineLogs(pipeline.id)}
                            className="mt-1.5 text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1">
                            {run.showLogs
                              ? <><ChevronUp className="w-3 h-3" /> Hide logs</>
                              : <><ChevronDown className="w-3 h-3" /> Show logs ({run.logs.length})</>}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
