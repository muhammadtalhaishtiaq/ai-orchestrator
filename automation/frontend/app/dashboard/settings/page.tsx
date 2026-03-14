"use client";
import { Settings, Key } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
          <Settings className="w-7 h-7" /> Settings
        </h1>
        <p className="text-slate-500 mt-1">Manage your account, API keys, and platform settings</p>
      </div>
      <div className="card text-center py-16">
        <Key className="w-16 h-16 text-slate-200 mx-auto mb-4" />
        <p className="text-slate-500 font-semibold text-lg">Settings Panel — Sprint 2</p>
        <p className="text-slate-400 text-sm mt-2">LLM provider management and API key configuration coming in Sprint 2</p>
      </div>
    </div>
  );
}
