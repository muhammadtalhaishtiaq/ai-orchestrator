"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { pipelinesAPI } from "@/lib/api";
import toast from "react-hot-toast";
import {
  GitBranch, ArrowLeft, Plus, Trash2, GripVertical,
  ChevronDown, ChevronUp, Save, Zap, Clock, Code2, Webhook, Loader2,
} from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

interface StepConfig {
  order: number;
  action: string;
  config: Record<string, any>;
  llm_provider: string;
  llm_model: string;
}

interface AvailableStep { action: string; description: string; }

const TRIGGER_TYPES = [
  { value: "manual",    label: "Manual",    icon: Zap,     desc: "Run only when triggered manually" },
  { value: "scheduled", label: "Scheduled", icon: Clock,   desc: "Run daily at a specific time" },
  { value: "cron",      label: "Cron",      icon: Code2,   desc: "Use a cron expression for full control" },
  { value: "webhook",   label: "Webhook",   icon: Webhook, desc: "Trigger via HTTP webhook URL" },
];

const LLM_PROVIDERS = ["openai", "anthropic", "gemini", "aiml-api", "kimi", "ollama"];

const STEP_COLORS: Record<string, string> = {
  generate_notebook:   "bg-indigo-50 text-indigo-700 border-indigo-200",
  test_notebook:       "bg-blue-50 text-blue-700 border-blue-200",
  attach_outputs:      "bg-violet-50 text-violet-700 border-violet-200",
  push_to_github:      "bg-slate-100 text-slate-700 border-slate-200",
  generate_infographic:"bg-purple-50 text-purple-700 border-purple-200",
  generate_social_post:"bg-pink-50 text-pink-700 border-pink-200",
  generate_video:      "bg-orange-50 text-orange-700 border-orange-200",
  post_to_social:      "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const stepBadgeNum = "w-5 h-5 rounded-full bg-white/80 text-xs flex items-center justify-center font-bold text-slate-600 shrink-0";

export default function EditPipelinePage() {
  const router = useRouter();
  const params = useParams();
  const pipelineId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [availableSteps, setAvailableSteps] = useState<AvailableStep[]>([]);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    trigger_type: "manual",
    trigger_config: {} as Record<string, any>,
    source_repo: "",
    source_folder: "",
    is_active: true,
  });
  const [steps, setSteps] = useState<StepConfig[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [pipelineRes, stepsRes] = await Promise.all([
          pipelinesAPI.get(pipelineId),
          pipelinesAPI.getAvailableSteps(),
        ]);
        const p = pipelineRes.data;
        setForm({
          name:          p.name || "",
          description:   p.description || "",
          trigger_type:  p.trigger_type || "manual",
          trigger_config: p.trigger_config || {},
          source_repo:   p.source_repo || "",
          source_folder: p.source_folder || "",
          is_active:     p.is_active ?? true,
        });
        // Normalise steps — ensure they have all required fields
        setSteps((p.steps || []).map((s: any, i: number) => ({
          order:        s.order ?? i + 1,
          action:       s.action || "",
          config:       s.config || {},
          llm_provider: s.llm_provider || "",
          llm_model:    s.llm_model || "",
        })));
        setAvailableSteps(stepsRes.data.steps || []);
      } catch {
        toast.error("Failed to load pipeline");
        router.push("/dashboard/pipelines");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [pipelineId]);

  // ── Step helpers ───────────────────────────────────────────────────────────
  const addStep = (action: string) => {
    const newStep: StepConfig = { order: steps.length + 1, action, config: {}, llm_provider: "", llm_model: "" };
    setSteps([...steps, newStep]);
    setExpandedStep(steps.length);
  };

  const removeStep = (idx: number) =>
    setSteps(steps.filter((_, i) => i !== idx).map((s, i) => ({ ...s, order: i + 1 })));

  const moveStep = (idx: number, dir: "up" | "down") => {
    const updated = [...steps];
    const target = dir === "up" ? idx - 1 : idx + 1;
    if (target < 0 || target >= updated.length) return;
    [updated[idx], updated[target]] = [updated[target], updated[idx]];
    setSteps(updated.map((s, i) => ({ ...s, order: i + 1 })));
  };

  const updateStep = (idx: number, field: string, value: string) => {
    const updated = [...steps];
    (updated[idx] as any)[field] = value;
    setSteps(updated);
  };

  // ── Trigger config ─────────────────────────────────────────────────────────
  const buildTriggerConfig = () => {
    if (form.trigger_type === "scheduled") return { time: form.trigger_config.time || "17:00" };
    if (form.trigger_type === "cron")      return { cron_expression: form.trigger_config.cron_expression || "0 17 * * *" };
    return {};
  };

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Pipeline name is required"); return; }
    if (steps.length === 0) { toast.error("Add at least one step"); return; }

    setSaving(true);
    try {
      await pipelinesAPI.update(pipelineId, {
        ...form,
        trigger_config: buildTriggerConfig(),
        steps,
        source_repo:   form.source_repo   || null,
        source_folder: form.source_folder || null,
      });
      toast.success("Pipeline saved!");
      router.push(`/dashboard/pipelines/${pipelineId}`);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to save pipeline");
    } finally {
      setSaving(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href={`/dashboard/pipelines/${pipelineId}`}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-indigo-500" />
            Edit Pipeline
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">Update your automation workflow configuration</p>
        </div>
        {/* Live status badge */}
        <div className="ml-auto">
          <span className={clsx("text-xs font-medium px-3 py-1.5 rounded-full",
            form.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500")}>
            {form.is_active ? "● Active" : "○ Inactive"}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── Section 1: Basic Info ──────────────────────────────────────── */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">1</span>
            Basic Info
          </h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Pipeline Name *</label>
            <input type="text" required className="input-field" placeholder="e.g. Daily ML Notebook Publisher"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea className="input-field resize-none" rows={2} placeholder="What does this pipeline do?"
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Source Folder (optional)</label>
              <input type="text" className="input-field" placeholder="e.g. 01-data-preprocessing"
                value={form.source_folder} onChange={(e) => setForm({ ...form, source_folder: e.target.value })} />
            </div>
            <div className="flex items-end pb-0.5">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <div className={clsx("w-9 h-5 rounded-full transition-colors relative",
                  form.is_active ? "bg-indigo-600" : "bg-slate-300")}
                  onClick={() => setForm({ ...form, is_active: !form.is_active })}>
                  <div className={clsx("absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform",
                    form.is_active ? "translate-x-4" : "translate-x-0.5")} />
                </div>
                <span className="text-sm text-slate-700">Active</span>
              </label>
            </div>
          </div>
        </div>

        {/* ── Section 2: Trigger ────────────────────────────────────────── */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">2</span>
            Trigger
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {TRIGGER_TYPES.map(({ value, label, icon: Icon, desc }) => (
              <button key={value} type="button"
                onClick={() => setForm({ ...form, trigger_type: value, trigger_config: {} })}
                className={clsx("p-3 rounded-xl border text-left transition-all",
                  form.trigger_type === value
                    ? "border-indigo-500 bg-indigo-50 shadow-sm"
                    : "border-slate-200 hover:border-indigo-200 hover:bg-slate-50")}>
                <div className="flex items-center gap-2 mb-0.5">
                  <Icon className={clsx("w-4 h-4", form.trigger_type === value ? "text-indigo-600" : "text-slate-400")} />
                  <span className={clsx("text-sm font-semibold", form.trigger_type === value ? "text-indigo-700" : "text-slate-700")}>
                    {label}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{desc}</p>
              </button>
            ))}
          </div>

          {form.trigger_type === "scheduled" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Run daily at (UTC)</label>
              <input type="time" className="input-field w-40"
                value={form.trigger_config.time || "17:00"}
                onChange={(e) => setForm({ ...form, trigger_config: { time: e.target.value } })} />
            </div>
          )}
          {form.trigger_type === "cron" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Cron Expression</label>
              <input type="text" className="input-field font-mono" placeholder="0 17 * * *"
                value={form.trigger_config.cron_expression || ""}
                onChange={(e) => setForm({ ...form, trigger_config: { cron_expression: e.target.value } })} />
              <p className="text-xs text-slate-400 mt-1">Format: minute hour day month day_of_week</p>
            </div>
          )}
        </div>

        {/* ── Section 3: Steps ──────────────────────────────────────────── */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 text-xs flex items-center justify-center font-bold">3</span>
            Pipeline Steps
            <span className="text-xs text-slate-400 font-normal">({steps.length} configured)</span>
          </h2>

          {/* Configured steps */}
          {steps.length > 0 && (
            <div className="space-y-2">
              {steps.map((step, idx) => (
                <div key={idx} className={clsx("border rounded-xl overflow-hidden", STEP_COLORS[step.action] || "border-slate-200 bg-slate-50")}>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <GripVertical className="w-4 h-4 text-slate-400 shrink-0 cursor-grab" />
                    <span className={stepBadgeNum}>{idx + 1}</span>
                    <span className="flex-1 text-sm font-medium capitalize">{step.action.replace(/_/g, " ")}</span>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => moveStep(idx, "up")} disabled={idx === 0}
                        className="p-1 hover:bg-white/60 rounded disabled:opacity-30 transition-colors">
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button type="button" onClick={() => moveStep(idx, "down")} disabled={idx === steps.length - 1}
                        className="p-1 hover:bg-white/60 rounded disabled:opacity-30 transition-colors">
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      <button type="button"
                        onClick={() => setExpandedStep(expandedStep === idx ? null : idx)}
                        className="text-xs font-medium px-2 py-1 rounded hover:bg-white/60 transition-colors">
                        {expandedStep === idx ? "Less" : "Config"}
                      </button>
                      <button type="button" onClick={() => removeStep(idx)}
                        className="p-1 hover:bg-red-100 rounded text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {expandedStep === idx && (
                    <div className="border-t border-white/40 px-4 py-3 bg-white/50 grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-slate-600 mb-1 block">LLM Provider</label>
                        <select value={step.llm_provider}
                          onChange={(e) => updateStep(idx, "llm_provider", e.target.value)}
                          className="input-field text-sm py-1.5">
                          <option value="">Inherit / None</option>
                          {LLM_PROVIDERS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-slate-600 mb-1 block">Model</label>
                        <input type="text" value={step.llm_model} placeholder="e.g. gpt-4o"
                          onChange={(e) => updateStep(idx, "llm_model", e.target.value)}
                          className="input-field text-sm py-1.5" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {steps.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
              <p className="text-slate-400 text-sm">No steps configured — add one below</p>
            </div>
          )}

          {/* Add step buttons */}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Add Step</p>
            <div className="flex flex-wrap gap-2">
              {availableSteps.map(({ action, description }) => (
                <button key={action} type="button" onClick={() => addStep(action)} title={description}
                  className={clsx("text-xs px-3 py-1.5 rounded-lg border font-medium transition-all hover:shadow-sm",
                    STEP_COLORS[action] || "border-slate-200 text-slate-600 bg-white hover:border-indigo-200")}>
                  <Plus className="w-3 h-3 inline mr-1" />
                  {action.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Actions ───────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
          </button>
          <Link href={`/dashboard/pipelines/${pipelineId}`}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-5 rounded-xl transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
