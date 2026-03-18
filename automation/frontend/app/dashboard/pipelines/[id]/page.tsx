"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { pipelinesAPI } from "@/lib/api";
import toast from "react-hot-toast";
import {
  ArrowLeft, Play, Copy, Trash2, ToggleLeft, ToggleRight,
  Clock, CheckCircle, XCircle, Loader2, Calendar, GitBranch,
  BookOpen, Zap, Pencil
} from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

const STEP_COLORS: Record<string, string> = {
  generate_notebook: "bg-sky-100 text-sky-700",
  test_notebook: "bg-blue-100 text-blue-700",
  attach_outputs: "bg-indigo-100 text-indigo-700",
  push_to_github: "bg-slate-100 text-slate-700",
  generate_infographic: "bg-purple-100 text-purple-700",
  generate_social_post: "bg-pink-100 text-pink-700",
  generate_video: "bg-orange-100 text-orange-700",
  post_to_social: "bg-green-100 text-green-700",
};

export default function PipelineDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [pipeline, setPipeline] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadPipeline();
  }, [id]);

  const loadPipeline = async () => {
    setLoading(true);
    try {
      const { data } = await pipelinesAPI.get(id);
      setPipeline(data);
    } catch { toast.error("Pipeline not found"); router.push("/dashboard/pipelines"); }
    finally { setLoading(false); }
  };

  const handleToggle = async () => {
    try {
      const { data } = await pipelinesAPI.toggle(id);
      toast.success(data.message);
      loadPipeline();
    } catch { toast.error("Failed to toggle pipeline"); }
  };

  const handleClone = async () => {
    try {
      const { data } = await pipelinesAPI.clone(id);
      toast.success("Pipeline cloned!");
      router.push(`/dashboard/pipelines/${data.pipeline.id}`);
    } catch { toast.error("Failed to clone"); }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${pipeline.name}"?`)) return;
    try {
      await pipelinesAPI.delete(id);
      toast.success("Pipeline deleted");
      router.push("/dashboard/pipelines");
    } catch { toast.error("Failed to delete"); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>;
  if (!pipeline) return null;

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-3">
          <Link href="/dashboard/pipelines" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 mt-0.5">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-800">{pipeline.name}</h1>
              <div className={clsx("w-2.5 h-2.5 rounded-full", pipeline.is_active ? "bg-green-400" : "bg-slate-300")} />
              <span className="text-sm text-slate-500">{pipeline.is_active ? "Active" : "Disabled"}</span>
            </div>
            {pipeline.description && <p className="text-slate-500 text-sm mt-1">{pipeline.description}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/pipelines/${id}/edit`}
            className="flex items-center gap-2 text-sm py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors shadow-sm">
            <Pencil className="w-4 h-4" /> Edit
          </Link>
          <button onClick={handleToggle} className="btn-secondary flex items-center gap-2 text-sm py-2">
            {pipeline.is_active ? <ToggleRight className="w-4 h-4 text-green-500" /> : <ToggleLeft className="w-4 h-4" />}
            {pipeline.is_active ? "Disable" : "Enable"}
          </button>
          <button onClick={handleClone} className="btn-secondary flex items-center gap-2 text-sm py-2">
            <Copy className="w-4 h-4" /> Clone
          </button>
          <button onClick={handleDelete} className="flex items-center gap-2 text-sm py-2 px-4 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Steps */}
        <div className="col-span-2 space-y-6">
          {/* Steps */}
          <div className="card">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-sky-600" /> Pipeline Steps ({pipeline.steps?.length || 0})
            </h3>
            {!pipeline.steps?.length ? (
              <p className="text-slate-400 text-sm text-center py-4">No steps configured</p>
            ) : (
              <div className="space-y-2">
                {pipeline.steps.map((step: any, i: number) => (
                  <div key={i} className={clsx("flex items-center gap-3 px-4 py-3 rounded-xl border", STEP_COLORS[step.action] || "border-slate-200 text-slate-700")}>
                    <span className="w-6 h-6 rounded-full bg-white/70 text-xs flex items-center justify-center font-bold shrink-0">{i + 1}</span>
                    <span className="flex-1 text-sm font-medium">{step.action.replace(/_/g, " ")}</span>
                    {step.llm_provider && <span className="text-xs opacity-70">{step.llm_provider}{step.llm_model ? ` / ${step.llm_model}` : ""}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Runs */}
          <div className="card">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Recent Runs
            </h3>
            {!pipeline.recent_runs?.length ? (
              <div className="text-center py-8">
                <Clock className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">No runs yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {pipeline.recent_runs.map((run: any) => (
                  <div key={run.id} className="flex items-center justify-between px-4 py-3 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-3">
                      {run.status === "success" ? <CheckCircle className="w-4 h-4 text-green-500" /> :
                       run.status === "failed" ? <XCircle className="w-4 h-4 text-red-500" /> :
                       <Loader2 className="w-4 h-4 animate-spin text-sky-500" />}
                      <span className={clsx("text-xs font-semibold px-2 py-0.5 rounded-full",
                        run.status === "success" ? "bg-green-100 text-green-700" :
                        run.status === "failed" ? "bg-red-100 text-red-700" : "bg-sky-100 text-sky-700")}>
                        {run.status}
                      </span>
                      <span className="text-xs text-slate-400 capitalize">{run.trigger_type}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">{new Date(run.started_at).toLocaleString()}</p>
                      {run.completed_at && (
                        <p className="text-xs text-slate-400">
                          {Math.round((new Date(run.completed_at).getTime() - new Date(run.started_at).getTime()) / 1000)}s
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Config */}
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold text-slate-800 mb-4 text-sm">Configuration</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Trigger</p>
                <span className={clsx("inline-block px-2.5 py-1 rounded-lg text-xs font-semibold capitalize",
                  pipeline.trigger_type === "manual" ? "bg-slate-100 text-slate-700" :
                  pipeline.trigger_type === "scheduled" ? "bg-blue-100 text-blue-700" :
                  pipeline.trigger_type === "cron" ? "bg-purple-100 text-purple-700" : "bg-orange-100 text-orange-700")}>
                  {pipeline.trigger_type}
                </span>
                {pipeline.trigger_config?.time && <p className="text-xs text-slate-500 mt-1">Daily at {pipeline.trigger_config.time} UTC</p>}
                {pipeline.trigger_config?.cron_expression && <p className="text-xs text-slate-500 mt-1 font-mono">{pipeline.trigger_config.cron_expression}</p>}
              </div>
              {pipeline.source_folder && (
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Source Folder</p>
                  <p className="text-xs font-mono text-slate-600 bg-slate-50 px-2 py-1 rounded">{pipeline.source_folder}</p>
                </div>
              )}
              {pipeline.next_run_time && (
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Next Run</p>
                  <p className="text-xs text-slate-600 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {new Date(pipeline.next_run_time).toLocaleString()}
                  </p>
                </div>
              )}
              {pipeline.last_run_at && (
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Last Run</p>
                  <p className="text-xs text-slate-600">{new Date(pipeline.last_run_at).toLocaleString()}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-slate-400 mb-0.5">Created</p>
                <p className="text-xs text-slate-600">{new Date(pipeline.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
