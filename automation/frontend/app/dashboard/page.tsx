"use client";
import { useEffect, useState } from "react";
import { dashboardAPI } from "@/lib/api";
import { BookOpen, GitBranch, Github, CheckCircle, Clock, AlertCircle, Zap } from "lucide-react";

interface Summary {
  user: { email: string; full_name: string };
  github: { connected: boolean; connected_repo: string };
  notebooks: { total: number; pending: number; published: number; generated: number };
  pipelines: { total: number; active: number };
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.getSummary()
      .then(({ data }) => setSummary(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600" />
    </div>
  );

  const stats = [
    { label: "Total Notebooks", value: summary?.notebooks.total ?? 0, icon: BookOpen, color: "text-sky-600", bg: "bg-sky-50" },
    { label: "Published", value: summary?.notebooks.published ?? 0, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
    { label: "Pending", value: summary?.notebooks.pending ?? 0, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-50" },
    { label: "Active Pipelines", value: summary?.pipelines.active ?? 0, icon: Zap, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Welcome back, {summary?.user.full_name || summary?.user.email}
        </h1>
        <p className="text-slate-500 mt-1">Here&apos;s your content automation overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                <div className={`w-9 h-9 ${stat.bg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* GitHub Status */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Github className="w-5 h-5 text-slate-700" />
            <h3 className="font-semibold text-slate-800">GitHub Connection</h3>
          </div>
          {summary?.github.connected ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm text-slate-600">Connected to <strong>{summary.github.connected_repo}</strong></span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-slate-500">Not connected — <a href="/dashboard/github" className="text-sky-600 hover:underline">Connect GitHub</a></span>
            </div>
          )}
        </div>

        {/* Pipelines Status */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <GitBranch className="w-5 h-5 text-slate-700" />
            <h3 className="font-semibold text-slate-800">Pipelines</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-800">{summary?.pipelines.total ?? 0}</p>
              <p className="text-xs text-slate-500">Total</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{summary?.pipelines.active ?? 0}</p>
              <p className="text-xs text-slate-500">Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
