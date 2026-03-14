"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { pipelinesAPI } from "@/lib/api";
import toast from "react-hot-toast";
import {
  GitBranch, ArrowLeft, Plus, Trash2, GripVertical,
  ChevronDown, ChevronUp, Save, Zap, Clock, Code2, Webhook
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

export default function NewPipelinePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [availableSteps, setAvailableSteps] = useState<AvailableStep[]>([]);
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
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  useEffect(() => {
    pipelinesAPI.getAvailableSteps().then(({ data }) => setAvailableSteps(data.steps)).catch(() => {});
  }, []);

  const addStep = (action: string) => {
    const newStep: StepConfig = {
      order: steps.length + 1,
      action,
      config: {},
      llm_provider: "",
      llm_model: "",
    };
    setSteps([...steps, newStep]);
    setExpandedStep(steps.length);
  };

  const removeStep = (idx: number) => {
    const updated = steps.filter((_, i) => i !== idx).map((s, i) => ({ ...s, order: i + 1 }));
    setSteps(updated);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error("Pipeline name is required"); return; }
    if (steps.length === 0) { toast.error("Add at least one step"); return; }

    setSaving(true);
    try {
      const payload = {
        ...form,
        trigger_config: buildTriggerConfig(),
        steps,
        source_repo: form.source_repo || null,
        source_folder: form.source_folder || null,
      };
      await pipelinesAPI.create(payload);
      toast.success("Pipeline created!");
      router.push("/dashboard/pipelines");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to create pipeline");
    } finally {
      setSaving(false);
    }
  };

  const buildTriggerConfig = () => {
    if (form.trigger_type === "scheduled") return { time: form.trigger_config.time || "17:00" };
    if (form.trigger_type === "cron") return { cron_expression: form.trigger_config.cron_expression || "0 17 * * *" };
    return {};
  };

  const STEP_COLORS: Record<string, string> = {
    generate_notebook: "bg-sky-100 text-sky-700 border-sky-200",
    test_notebook: "bg-blue-100 text-blue-700 border-blue-200",
    attach_outputs: "bg-indigo-100 text-indigo-700 border-indigo-200",
    push_to_github: "bg-slate-100 text-slate-700 border-slate-200",
    generate_infographic: "bg-purple-100 text-purple-700 border-purple-200",
    generate_social_post: "bg-pink-100 text-pink-700 border-pink-200",
    generate_video: "bg-orange-100 text-orange-700 border-orange-200",
    post_to_social: "bg-green-100 text-green-700 border-green-200",
  };

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/dashboard/pipelines" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">New Pipeline</h1>
          <p className="text-slate-500 text-sm">Configure your automation workflow</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs flex items-center justify-center font-bold">1</span>
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
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-sky-600" />
                <span className="text-sm text-slate-700">Active on creation</span>
              </label>
            </div>
          </div>
        </div>

        {/* Trigger */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs flex items-center justify-center font-bold">2</span>
            Trigger
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {TRIGGER_TYPES.map(({ value, label, icon: Icon, desc }) => (
              <button key={value} type="button"
                onClick={() => setForm({ ...form, trigger_type: value, trigger_config: {} })}
                className={clsx("p-3 rounded-xl border text-left transition-all",
                  form.trigger_type === value ? "border-sky-500 bg-sky-50 shadow-sm" : "border-slate-200 hover:border-slate-300")}>
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={clsx("w-4 h-4", form.trigger_type === value ? "text-sky-600" : "text-slate-500")} />
                  <span className={clsx("text-sm font-semibold", form.trigger_type === value ? "text-sky-700" : "text-slate-700")}>{label}</span>
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

        {/* Steps */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs flex items-center justify-center font-bold">3</span>
            Pipeline Steps
            <span className="text-xs text-slate-400 font-normal">({steps.length} configured)</span>
          </h2>

          {/* Configured steps */}
          {steps.length > 0 && (
            <div className="space-y-2">
              {steps.map((step, idx) => (
                <div key={idx} className={clsx("border rounded-xl overflow-hidden", STEP_COLORS[step.action] || "border-slate-200")}>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <GripVertical className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="w-5 h-5 rounded-full bg-white/80 text-xs flex items-center justify-center font-bold text-slate-600 shrink-0">{idx + 1}</span>
                    <span className="flex-1 text-sm font-medium">{step.action.replace(/_/g, " ")}</span>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => moveStep(idx, "up")} disabled={idx === 0}
                        className="p-1 hover:bg-white/50 rounded disabled:opacity-30"><ChevronUp className="w-3 h-3" /></button>
                      <button type="button" onClick={() => moveStep(idx, "down")} disabled={idx === steps.length - 1}
                        className="p-1 hover:bg-white/50 rounded disabled:opacity-30"><ChevronDown className="w-3 h-3" /></button>
                      <button type="button" onClick={() => setExpandedStep(expandedStep === idx ? null : idx)}
                        className="p-1 hover:bg-white/50 rounded text-xs font-medium px-2">
                        {expandedStep === idx ? "Less" : "Config"}
                      </button>
                      <button type="button" onClick={() => removeStep(idx)}
                        className="p-1 hover:bg-red-100 rounded text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  {expandedStep === idx && (
                    <div className="border-t border-white/40 px-4 py-3 bg-white/50 grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-slate-600 mb-1 block">LLM Provider</label>
                        <select value={step.llm_provider} onChange={(e) => updateStep(idx, "llm_provider", e.target.value)}
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

          {/* Add step buttons */}
          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">Add step:</p>
            <div className="flex flex-wrap gap-2">
              {availableSteps.map(({ action, description }) => (
                <button key={action} type="button" onClick={() => addStep(action)}
                  title={description}
                  className={clsx("text-xs px-3 py-1.5 rounded-lg border font-medium transition-all hover:shadow-sm",
                    STEP_COLORS[action] || "border-slate-200 text-slate-600 hover:border-slate-300")}>
                  <Plus className="w-3 h-3 inline mr-1" />
                  {action.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving}
            className="btn-primary flex items-center gap-2">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Create Pipeline</>}
          </button>
          <Link href="/dashboard/pipelines" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}

function Loader2({ className }: { className?: string }) {
  return <svg className={clsx("animate-spin", className)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>;
}
