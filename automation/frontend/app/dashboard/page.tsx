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
    <div className="p-8 space-y-6">
      <div className="h-8 bg-slate-200 rounded w-48 animate-pulse" />
      <div className="h-4 bg-slate-200 rounded w-64 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-slate-200 rounded-xl animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-36 bg-slate-200 rounded-xl animate-pulse" />
        <div className="h-36 bg-slate-200 rounded-xl animate-pulse" />
      </div>
      <div className="h-40 bg-slate-200 rounded-xl animate-pulse" />
    </div>
  );

  const stats = [
    {
      label: "Total Notebooks",
      value: summary?.notebooks.total ?? 0,
      icon: BookOpen,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Published",
      value: summary?.notebooks.published ?? 0,
      icon: CheckCircle,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Pending",
      value: summary?.notebooks.pending ?? 0,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Active Pipelines",
      value: summary?.pipelines.active ?? 0,
      icon: Zap,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {summary?.user.full_name || summary?.user.email}
        </h1>
        <p className="text-slate-600 mt-1">Here&apos;s your content automation overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
                <div className={`w-9 h-9 ${stat.bg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* GitHub Status */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <Github className="w-5 h-5 text-slate-600" />
            <h3 className="font-semibold text-slate-900">GitHub Connection</h3>
          </div>
          {summary?.github.connected ? (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <span className="text-sm text-slate-600">
                Connected to <strong>{summary.github.connected_repo}</strong>
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-slate-600">
                Not connected —{" "}
                <a href="/dashboard/github" className="text-indigo-600 hover:text-indigo-700 hover:underline font-medium">
                  Connect GitHub
                </a>
              </span>
            </div>
          )}
        </div>

        {/* Pipelines Status */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <GitBranch className="w-5 h-5 text-slate-600" />
            <h3 className="font-semibold text-slate-900">Pipelines</h3>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-900">{summary?.pipelines.total ?? 0}</p>
              <p className="text-xs text-slate-400 mt-0.5">Total</p>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">{summary?.pipelines.active ?? 0}</p>
              <p className="text-xs text-slate-400 mt-0.5">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Run Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900 mb-1">Quick Run</h3>
            <p className="text-sm text-slate-600">
              Trigger a pipeline run or navigate to your active automation.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/dashboard/projects"
              className="inline-flex items-center gap-2 border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 font-medium px-4 py-2 rounded-lg transition-colors text-sm"
            >
              View Projects
            </a>
            <a
              href="/dashboard/github"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm shadow-sm"
            >
              <Zap className="w-4 h-4" />
              Go to GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
