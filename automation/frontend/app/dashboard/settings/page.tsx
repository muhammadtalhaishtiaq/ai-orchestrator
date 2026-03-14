"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Key,
  Shield,
  Bell,
  User,
  Eye,
  EyeOff,
  Trash2,
  Save,
  AlertTriangle,
  Zap,
  CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import clsx from "clsx";
import { settingsAPI } from "@/lib/api";

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = "profile" | "api-keys" | "security" | "notifications";

interface Profile {
  full_name: string;
  email: string;
}

interface ApiKeyEntry {
  provider: string;
  masked_value: string | null;
  is_set: boolean;
}

interface NotificationPrefs {
  pipeline_completed: boolean;
  pipeline_failed: boolean;
  weekly_digest: boolean;
}

// ─── Provider Config ──────────────────────────────────────────────────────────

const PROVIDERS = [
  {
    id: "openai",
    name: "OpenAI",
    initials: "OA",
    color: "#10a37f",
    description: "GPT-4o and o-series models for notebook generation",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    initials: "AN",
    color: "#d97706",
    description: "Claude models for high-quality reasoning tasks",
  },
  {
    id: "gemini",
    name: "Gemini",
    initials: "GE",
    color: "#4285f4",
    description: "Google Gemini models for multimodal pipelines",
  },
  {
    id: "aiml-api",
    name: "AIML API",
    initials: "AI",
    color: "#6366f1",
    description: "Unified gateway for multiple AI providers",
  },
  {
    id: "kimi",
    name: "Kimi",
    initials: "KI",
    color: "#8b5cf6",
    description: "Moonshot AI's Kimi long-context model",
  },
];

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-3 animate-pulse">
      <div className="h-4 bg-slate-200 rounded w-1/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-3 bg-slate-200 rounded w-full" />
      ))}
    </div>
  );
}

function SkeletonProfile() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-4 bg-slate-200 rounded w-24" />
      <div className="h-10 bg-slate-200 rounded-lg w-full" />
      <div className="h-4 bg-slate-200 rounded w-24 mt-4" />
      <div className="h-10 bg-slate-200 rounded-lg w-full" />
      <div className="h-10 bg-slate-200 rounded-lg w-32 mt-2" />
    </div>
  );
}

function SkeletonApiKeys() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 rounded w-28" />
            <div className="h-3 bg-slate-200 rounded w-48" />
          </div>
          <div className="h-8 bg-slate-200 rounded-lg w-24" />
        </div>
      ))}
    </div>
  );
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={clsx(
        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2",
        checked ? "bg-indigo-600" : "bg-slate-200"
      )}
    >
      <span
        className={clsx(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

// ─── Tab: Profile ─────────────────────────────────────────────────────────────

function ProfileTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile>({ full_name: "", email: "" });
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await settingsAPI.getProfile();
        const data: Profile = res.data;
        setProfile(data);
        setFullName(data.full_name ?? "");
      } catch {
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    if (!fullName.trim()) {
      toast.error("Full name cannot be empty.");
      return;
    }
    setSaving(true);
    try {
      await settingsAPI.updateProfile({ full_name: fullName.trim() });
      setProfile((prev) => ({ ...prev, full_name: fullName.trim() }));
      toast.success("Profile updated.");
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <SkeletonProfile />;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-lg">
      <h2 className="text-base font-semibold text-slate-900 mb-5">
        Profile Information
      </h2>
      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-base font-medium text-slate-700 mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your full name"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
          />
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="block text-base font-medium text-slate-700 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            value={profile.email}
            disabled
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-400 bg-slate-50 cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-slate-400">
            Email cannot be changed. Contact support if needed.
          </p>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving || fullName.trim() === profile.full_name}
          className={clsx(
            "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition",
            saving || fullName.trim() === profile.full_name
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          )}
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

// ─── Tab: API Keys ────────────────────────────────────────────────────────────

function ApiKeyCard({
  provider,
  entry,
  onSaved,
  onDeleted,
}: {
  provider: (typeof PROVIDERS)[number];
  entry: ApiKeyEntry | undefined;
  onSaved: (provider: string, masked: string) => void;
  onDeleted: (provider: string) => void;
}) {
  const isSet = entry?.is_set ?? false;
  const [inputValue, setInputValue] = useState("");
  const [revealedValue, setRevealedValue] = useState<string | null>(null);
  const [showRevealed, setShowRevealed] = useState(false);
  const [savingKey, setSavingKey] = useState(false);
  const [removingKey, setRemovingKey] = useState(false);
  const [revealingKey, setRevealingKey] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const handleSave = async () => {
    if (!inputValue.trim()) {
      toast.error("API key cannot be empty.");
      return;
    }
    setSavingKey(true);
    try {
      await settingsAPI.upsertApiKey({
        provider: provider.id,
        api_key: inputValue.trim(),
      });
      toast.success(`${provider.name} key saved.`);
      onSaved(provider.id, inputValue.trim().slice(0, 6) + "…");
      setInputValue("");
      setEditMode(false);
    } catch {
      toast.error(`Failed to save ${provider.name} key.`);
    } finally {
      setSavingKey(false);
    }
  };

  const handleDelete = async () => {
    setRemovingKey(true);
    try {
      await settingsAPI.deleteApiKey(provider.id);
      toast.success(`${provider.name} key removed.`);
      onDeleted(provider.id);
      setRevealedValue(null);
      setShowRevealed(false);
      setEditMode(false);
    } catch {
      toast.error(`Failed to remove ${provider.name} key.`);
    } finally {
      setRemovingKey(false);
    }
  };

  const handleReveal = async () => {
    if (revealedValue !== null) {
      setShowRevealed((prev) => !prev);
      return;
    }
    setRevealingKey(true);
    try {
      const res = await settingsAPI.revealApiKey(provider.id);
      setRevealedValue(res.data.api_key ?? res.data.value ?? "");
      setShowRevealed(true);
    } catch {
      toast.error(`Could not reveal ${provider.name} key.`);
    } finally {
      setRevealingKey(false);
    }
  };

  const maskedDisplay =
    revealedValue && showRevealed
      ? revealedValue
      : entry?.masked_value ?? "sk-…";

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-start gap-4">
        {/* Icon circle */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold"
          style={{ backgroundColor: provider.color }}
        >
          {provider.initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-slate-900">
            {provider.name}
          </p>
          <p className="text-sm text-slate-500 mt-0.5">{provider.description}</p>

          {/* Key display / input */}
          <div className="mt-3">
            {isSet && !editMode ? (
              <div className="flex items-center gap-2 flex-wrap">
                <code className="text-sm font-mono text-slate-700 bg-slate-50 border border-slate-200 rounded px-2 py-1">
                  {maskedDisplay}
                </code>
                {/* Reveal toggle */}
                <button
                  onClick={handleReveal}
                  disabled={revealingKey}
                  title={showRevealed ? "Hide key" : "Reveal key"}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  {showRevealed ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
                {/* Remove */}
                <button
                  onClick={handleDelete}
                  disabled={removingKey}
                  title="Remove key"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {/* Replace */}
                <button
                  onClick={() => setEditMode(true)}
                  className="text-xs text-indigo-600 hover:underline ml-1"
                >
                  Replace
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Paste ${provider.name} API key…`}
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
                  onKeyDown={(e) => e.key === "Enter" && handleSave()}
                />
                <button
                  onClick={handleSave}
                  disabled={savingKey}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-1 disabled:opacity-60"
                >
                  <Save className="w-3.5 h-3.5" />
                  {savingKey ? "Saving…" : "Save"}
                </button>
                {editMode && (
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setInputValue("");
                    }}
                    className="text-sm text-slate-400 hover:text-slate-600 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── Default LLM Selector ─────────────────────────────────────────────────────

const PROVIDER_MODELS: Record<string, string[]> = {
  openai:    ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo", "gpt-3.5-turbo"],
  anthropic: ["claude-3-5-sonnet-20241022", "claude-3-5-haiku-20241022", "claude-3-opus-20240229"],
  gemini:    ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-2.0-flash"],
  "aiml-api": ["gpt-4o", "gpt-4o-mini", "claude-3-5-sonnet", "gemini-1.5-pro"],
  kimi:      ["moonshot-v1-8k", "moonshot-v1-32k", "moonshot-v1-128k"],
};

function DefaultLlmSelector({ keyMap }: { keyMap: Record<string, ApiKeyEntry> }) {
  const [provider, setProvider] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [current, setCurrent] = useState<{ provider: string; model: string } | null>(null);

  useEffect(() => {
    settingsAPI.getLlmDefault()
      .then(({ data }) => {
        if (data.provider) {
          setCurrent({ provider: data.provider, model: data.model || "" });
          setProvider(data.provider);
          setModel(data.model || "");
        }
      })
      .catch(() => {});
  }, []);

  const availableProviders = PROVIDERS.filter((p) => keyMap[p.id]?.is_set);
  const models = provider ? (PROVIDER_MODELS[provider] || []) : [];

  const handleSave = async () => {
    if (!provider) { toast.error("Select a provider first."); return; }
    setSaving(true);
    try {
      await settingsAPI.setLlmDefault({ provider, model: model || undefined });
      setCurrent({ provider, model });
      toast.success(`Default LLM set to ${provider}${model ? " / " + model : ""}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.detail || "Failed to set default LLM.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border-2 border-indigo-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-indigo-500" />
        <div>
          <h3 className="text-sm font-bold text-slate-900">Default LLM for Notebook Generation</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Pipelines will use this provider to generate real AI content for each notebook.
          </p>
        </div>
      </div>

      {current && (
        <div className="flex items-center gap-2 mb-4 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
          <span className="text-sm text-green-700">
            Currently: <strong>{current.provider}</strong>
            {current.model && <> / <strong>{current.model}</strong></>}
          </span>
        </div>
      )}

      {availableProviders.length === 0 ? (
        <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          Save at least one API key above to enable LLM generation.
        </p>
      ) : (
        <div className="flex items-end gap-3 flex-wrap">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Provider</label>
            <select
              value={provider}
              onChange={(e) => { setProvider(e.target.value); setModel(""); }}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white min-w-[140px]"
            >
              <option value="">Choose provider…</option>
              {availableProviders.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          {provider && models.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Model</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white min-w-[200px]"
              >
                <option value="">Default model</option>
                {models.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          )}
          <button
            onClick={handleSave}
            disabled={saving || !provider}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "Saving…" : "Set as Default"}
          </button>
        </div>
      )}
    </div>
  );
}

function ApiKeysTab() {
  const [loading, setLoading] = useState(true);
  const [keyMap, setKeyMap] = useState<Record<string, ApiKeyEntry>>({});

  useEffect(() => {
    (async () => {
      try {
        const res = await settingsAPI.getApiKeys();
        const entries: ApiKeyEntry[] = res.data?.api_keys ?? [];
        const map: Record<string, ApiKeyEntry> = {};
        entries.forEach((e) => {
          map[e.provider] = e;
        });
        setKeyMap(map);
      } catch {
        toast.error("Failed to load API keys.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSaved = (provider: string, masked: string) => {
    setKeyMap((prev) => ({
      ...prev,
      [provider]: { provider, masked_value: masked, is_set: true },
    }));
  };

  const handleDeleted = (provider: string) => {
    setKeyMap((prev) => ({
      ...prev,
      [provider]: { provider, masked_value: null, is_set: false },
    }));
  };

  if (loading) return <SkeletonApiKeys />;

  return (
    <div className="space-y-4 max-w-2xl">
      {/* Default LLM Selector */}
      <DefaultLlmSelector keyMap={keyMap} />

      {/* Info note */}
      <div className="flex items-start gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
        <Key className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-indigo-700">
          Keys are encrypted at rest. Used by pipelines for AI notebook
          generation.
        </p>
      </div>

      {PROVIDERS.map((provider) => (
        <ApiKeyCard
          key={provider.id}
          provider={provider}
          entry={keyMap[provider.id]}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
        />
      ))}
    </div>
  );
}

// ─── Tab: Security ────────────────────────────────────────────────────────────

function SecurityTab() {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  const newPwTooShort = newPw.length > 0 && newPw.length < 8;
  const confirmMismatch = confirmPw.length > 0 && confirmPw !== newPw;

  const canSubmit =
    currentPw.length > 0 &&
    newPw.length >= 8 &&
    confirmPw === newPw &&
    !saving;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    try {
      await settingsAPI.changePassword({
        current_password: currentPw,
        new_password: newPw,
      });
      toast.success("Password changed successfully.");
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ?? "Failed to change password.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const PasswordInput = ({
    label,
    value,
    onChange,
    show,
    onToggleShow,
    error,
    placeholder,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    show: boolean;
    onToggleShow: () => void;
    error?: string;
    placeholder?: string;
  }) => (
    <div>
      <label className="block text-base font-medium text-slate-700 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={clsx(
            "w-full border rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition",
            error ? "border-red-400" : "border-slate-200"
          )}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={onToggleShow}
          className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-600 transition"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );

  return (
    <div className="space-y-6 max-w-lg">
      {/* Change password card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-base font-semibold text-slate-900 mb-5">
          Change Password
        </h2>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <PasswordInput
            label="Current Password"
            value={currentPw}
            onChange={setCurrentPw}
            show={showCurrent}
            onToggleShow={() => setShowCurrent((s) => !s)}
            placeholder="Enter current password"
          />
          <PasswordInput
            label="New Password"
            value={newPw}
            onChange={setNewPw}
            show={showNew}
            onToggleShow={() => setShowNew((s) => !s)}
            error={newPwTooShort ? "Password must be at least 8 characters." : undefined}
            placeholder="At least 8 characters"
          />
          <PasswordInput
            label="Confirm New Password"
            value={confirmPw}
            onChange={setConfirmPw}
            show={showConfirm}
            onToggleShow={() => setShowConfirm((s) => !s)}
            error={confirmMismatch ? "Passwords do not match." : undefined}
            placeholder="Re-enter new password"
          />
          <button
            type="submit"
            disabled={!canSubmit}
            className={clsx(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition",
              canSubmit
                ? "bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            )}
          >
            <Shield className="w-4 h-4" />
            {saving ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-xl border border-red-200 p-6">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <h2 className="text-base font-semibold text-red-600">Danger Zone</h2>
        </div>
        <p className="text-sm text-slate-500 mb-4">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>
        <button
          disabled
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
          title="Contact support to delete your account"
        >
          <Trash2 className="w-4 h-4" />
          Delete Account — Contact support to delete your account
        </button>
      </div>
    </div>
  );
}

// ─── Tab: Notifications ───────────────────────────────────────────────────────

function NotificationsTab() {
  const [loading, setLoading] = useState(true);
  const [prefs, setPrefs] = useState<NotificationPrefs>({
    pipeline_completed: false,
    pipeline_failed: true,
    weekly_digest: false,
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await settingsAPI.getNotifications();
        setPrefs(res.data);
      } catch {
        toast.error("Failed to load notification preferences.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleToggle = async (
    key: keyof NotificationPrefs,
    value: boolean
  ) => {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    try {
      await settingsAPI.updateNotifications(updated);
      toast.success("Saved", { duration: 1500 });
    } catch {
      // Revert on failure
      setPrefs(prefs);
      toast.error("Failed to save preference.");
    }
  };

  const notifications: {
    key: keyof NotificationPrefs;
    title: string;
    description: string;
  }[] = [
    {
      key: "pipeline_completed",
      title: "Pipeline completed",
      description:
        "Receive an email notification when a pipeline run finishes successfully.",
    },
    {
      key: "pipeline_failed",
      title: "Pipeline failed",
      description:
        "Get alerted immediately when a pipeline run encounters an error.",
    },
    {
      key: "weekly_digest",
      title: "Weekly digest",
      description:
        "A weekly summary email with pipeline activity, stats, and highlights.",
    },
  ];

  if (loading)
    return (
      <div className="space-y-4 max-w-lg animate-pulse">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4"
          >
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-40" />
              <div className="h-3 bg-slate-200 rounded w-72" />
            </div>
            <div className="w-11 h-6 bg-slate-200 rounded-full flex-shrink-0" />
          </div>
        ))}
      </div>
    );

  return (
    <div className="space-y-4 max-w-lg">
      <p className="text-sm text-slate-500 mb-2">
        Manage how and when you receive email notifications.
      </p>
      {notifications.map(({ key, title, description }) => (
        <div
          key={key}
          className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4"
        >
          <div className="flex-1 min-w-0">
            <p className="text-base font-medium text-slate-900">{title}</p>
            <p className="text-sm text-slate-500 mt-0.5">{description}</p>
          </div>
          <Toggle
            checked={prefs[key]}
            onChange={(val) => handleToggle(key, val)}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "api-keys", label: "API Keys", icon: Key },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Settings className="w-7 h-7 text-indigo-600" />
            Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your account, API keys, and preferences
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6 w-fit">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={clsx(
                "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeTab === id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div>
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "api-keys" && <ApiKeysTab />}
          {activeTab === "security" && <SecurityTab />}
          {activeTab === "notifications" && <NotificationsTab />}
        </div>
      </div>
    </div>
  );
}
