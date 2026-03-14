"use client";
import { GitBranch, Plus, Zap } from "lucide-react";

export default function PipelinesPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <GitBranch className="w-7 h-7" /> Pipelines
          </h1>
          <p className="text-slate-500 mt-1">Build and manage your automation pipelines</p>
        </div>
        <button className="btn-primary flex items-center gap-2 opacity-50 cursor-not-allowed" disabled>
          <Plus className="w-4 h-4" /> New Pipeline
        </button>
      </div>
      <div className="card text-center py-16">
        <Zap className="w-16 h-16 text-slate-200 mx-auto mb-4" />
        <p className="text-slate-500 font-semibold text-lg">Pipeline Builder — Sprint 2</p>
        <p className="text-slate-400 text-sm mt-2">Full pipeline configuration UI coming in Sprint 2</p>
      </div>
    </div>
  );
}
