"use client";
import { BarChart3, TrendingUp, Activity, Clock, Bell } from "lucide-react";

const upcomingFeatures = [
  {
    icon: TrendingUp,
    title: "Pipeline performance trends",
    description: "Track success rates, run durations, and step-level timing across all your pipelines over time.",
  },
  {
    icon: Activity,
    title: "Real-time run feed",
    description: "A live view of all pipeline activity across your projects — runs in progress, failures, completions.",
  },
  {
    icon: Clock,
    title: "Scheduling insights",
    description: "See which pipelines run most frequently, identify bottlenecks, and spot missed schedules.",
  },
  {
    icon: Bell,
    title: "Alert history",
    description: "Review all failure alerts, retry events, and system notifications in a single audit log.",
  },
];

const chartPlaceholders = [
  { label: "Pipeline Runs Over Time", description: "Daily run counts across all pipelines" },
  { label: "Success vs. Failure Rate", description: "Outcome distribution per pipeline" },
  { label: "Avg. Run Duration", description: "P50 / P95 execution time trends" },
  { label: "Step-Level Timing", description: "Per-step latency breakdown" },
];

export default function AnalyticsPage() {
  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 border border-indigo-100 text-xs font-semibold px-3 py-1 rounded-full">
            Coming in Sprint 4
          </span>
        </div>
        <p className="text-slate-600 text-sm">
          Monitor pipeline performance, run history, and automation health.
        </p>
      </div>

      {/* Greyed-out chart placeholders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        {chartPlaceholders.map((chart) => (
          <div
            key={chart.label}
            className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 opacity-50 select-none"
          >
            <div className="mb-4">
              <p className="text-sm font-semibold text-slate-700">{chart.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{chart.description}</p>
            </div>
            {/* Fake chart bars */}
            <div className="flex items-end gap-1.5 h-20 pt-2">
              {[40, 65, 45, 80, 55, 70, 50, 90, 60, 75, 45, 85].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-slate-200 rounded-t-sm"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              {["Jan", "Feb", "Mar", "Apr"].map((m) => (
                <span key={m} className="text-xs text-slate-300">{m}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Main coming-soon card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        {/* Indigo accent bar */}
        <div className="h-1 bg-indigo-600" />

        <div className="px-8 py-12 text-center border-b border-slate-100">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-indigo-50 rounded-2xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <BarChart3 className="w-9 h-9 text-indigo-600" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-100 rounded-lg flex items-end justify-center pb-0.5 overflow-hidden">
              <div className="flex items-end gap-0.5">
                <div className="w-1 h-2 bg-indigo-400 rounded-sm" />
                <div className="w-1 h-3 bg-indigo-500 rounded-sm" />
                <div className="w-1 h-1.5 bg-indigo-300 rounded-sm" />
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-3">Full analytics dashboard coming in Sprint 4</h2>
          <p className="text-slate-600 max-w-md mx-auto leading-relaxed text-sm">
            We are building deep visibility into your automation workflows. Pipeline run data is already
            being recorded — it will surface here when the dashboard ships.
          </p>
        </div>

        {/* Feature preview grid */}
        <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {upcomingFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm mb-1">{feature.title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            Analytics launches in Sprint 4. Your pipeline run data is already being recorded.
          </p>
        </div>
      </div>

      {/* Placeholder stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total runs", value: "—" },
          { label: "Success rate", value: "—" },
          { label: "Avg. duration", value: "—" },
          { label: "Active pipelines", value: "—" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4 opacity-50 select-none"
          >
            <p className="text-slate-400 text-xs mb-1">{stat.label}</p>
            <p className="text-slate-300 font-bold text-2xl">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
