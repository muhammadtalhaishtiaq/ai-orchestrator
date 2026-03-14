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

export default function AnalyticsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-extrabold text-slate-900">Analytics</h1>
        <p className="text-slate-500 text-sm mt-1">
          Monitor pipeline performance, run history, and automation health.
        </p>
      </div>

      {/* Empty state card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Decorative top bar */}
        <div className="h-1 gradient-hero" />

        <div className="px-8 py-16 text-center">
          {/* Icon */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-indigo-100 rounded-2xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <BarChart3 className="w-9 h-9 text-indigo-600" />
            </div>
            {/* Decorative chart bars */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-violet-100 rounded-lg flex items-end justify-center pb-0.5 overflow-hidden">
              <div className="flex items-end gap-0.5">
                <div className="w-1 h-2 bg-violet-400 rounded-sm" />
                <div className="w-1 h-3 bg-violet-500 rounded-sm" />
                <div className="w-1 h-1.5 bg-violet-300 rounded-sm" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Analytics coming soon</h2>
          <p className="text-slate-500 max-w-md mx-auto leading-relaxed text-sm">
            We're building a comprehensive analytics dashboard to give you deep visibility into your
            automation workflows. Here's what's on the way:
          </p>
        </div>

        {/* Feature previews */}
        <div className="border-t border-slate-100 grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {upcomingFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm mb-1">{feature.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <div className="px-8 py-5 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            Analytics will be available in a future update. Your pipeline run data is already being recorded.
          </p>
        </div>
      </div>

      {/* Placeholder stat cards — visual foreshadowing */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {[
          { label: "Total runs", value: "—" },
          { label: "Success rate", value: "—" },
          { label: "Avg. duration", value: "—" },
          { label: "Active pipelines", value: "—" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-slate-200 px-5 py-4 shadow-sm opacity-50 select-none"
          >
            <p className="text-slate-400 text-xs mb-1">{stat.label}</p>
            <p className="text-slate-300 font-bold text-2xl">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
