"use client";

import { useState, useEffect, useCallback } from "react";
import { BarChart2, RefreshCw, TrendingUp, CheckCircle2, Clock, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import clsx from "clsx";
import { analyticsAPI } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DailySummary {
  date: string;
  label: string;
  success: number;
  failed: number;
  total: number;
}

interface NotebookBreakdown {
  status: string;
  count: number;
  pct: number;
  color: string;
}

interface RecentRun {
  run_id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  duration_s: number | null;
  pipeline_id: string;
  pipeline_name: string;
}

interface AnalyticsSummary {
  total_runs_30d: number;
  success_runs_30d: number;
  failed_runs_30d: number;
  success_rate: number;
  avg_duration_s: number;
  total_notebooks: number;
  published_notebooks: number;
  total_pipelines: number;
  active_pipelines: number;
}

interface AnalyticsData {
  summary: AnalyticsSummary;
  daily_runs: DailySummary[];
  notebook_breakdown: NotebookBreakdown[];
  recent_activity: RecentRun[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  if (!seconds || seconds < 0) return "0s";
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function timeAgo(isoString: string): string {
  if (!isoString) return "—";
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  sub,
  accentClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub: string;
  accentClass: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <span className={clsx("p-2 rounded-lg", accentClass)}>{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800 leading-none">{value}</p>
        <p className="text-xs text-slate-400 mt-1">{sub}</p>
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return <div className="bg-slate-200 animate-pulse rounded-xl h-24" />;
}

// ─── Status Dot ───────────────────────────────────────────────────────────────

function StatusDot({ status }: { status: string }) {
  const color =
    status === "success" || status === "completed"
      ? "bg-green-500"
      : status === "failed" || status === "error"
      ? "bg-red-400"
      : status === "running"
      ? "bg-indigo-500"
      : "bg-amber-400";
  return (
    <span className={clsx("inline-block w-2 h-2 rounded-full flex-shrink-0 mt-0.5", color)} />
  );
}

// ─── Daily Runs Chart ─────────────────────────────────────────────────────────

function DailyRunsChart({ data }: { data: DailySummary[] }) {
  const maxTotal = Math.max(...data.map((d) => d.total), 1);
  const BAR_MAX_PX = 120;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-slate-700">
          Pipeline Runs — Last 14 Days
        </h2>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
            Success
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
            Failed
          </span>
        </div>
      </div>

      <div className="flex items-end gap-0">
        {/* Y-axis labels */}
        <div
          className="flex flex-col justify-between items-end pr-2 shrink-0"
          style={{ height: `${BAR_MAX_PX + 20}px` }}
        >
          <span className="text-xs text-slate-400 leading-none">{maxTotal}</span>
          <span className="text-xs text-slate-400 leading-none">0</span>
        </div>

        {/* Bar columns */}
        <div className="flex-1 flex items-end gap-1">
          {data.map((day) => {
            const totalPx =
              day.total > 0
                ? Math.max(Math.round((day.total / maxTotal) * BAR_MAX_PX), 4)
                : 0;
            const successPx =
              day.total > 0 ? Math.round((day.success / day.total) * totalPx) : 0;
            const failedPx = totalPx - successPx;

            return (
              <div
                key={day.date}
                className="flex-1 flex flex-col items-center"
                style={{ minWidth: 0 }}
              >
                {/* Count above bar */}
                <span
                  className="text-xs text-slate-400 leading-none mb-1"
                  style={{ height: "14px", display: "flex", alignItems: "center" }}
                >
                  {day.total > 0 ? day.total : ""}
                </span>

                {/* Stacked bar container */}
                <div
                  className="w-full flex flex-col justify-end"
                  style={{ height: `${BAR_MAX_PX}px` }}
                >
                  {day.total === 0 ? (
                    <div className="w-full h-1 bg-slate-100 rounded-sm" />
                  ) : (
                    <div
                      className="w-full flex flex-col justify-end rounded-sm overflow-hidden"
                      style={{ height: `${totalPx}px` }}
                    >
                      {failedPx > 0 && (
                        <div
                          className="w-full bg-red-400"
                          style={{ height: `${failedPx}px` }}
                        />
                      )}
                      {successPx > 0 && (
                        <div
                          className="w-full bg-green-500"
                          style={{ height: `${successPx}px` }}
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* X-axis label */}
                <span
                  className="text-slate-400 mt-1.5 truncate w-full text-center leading-none"
                  style={{ fontSize: "10px" }}
                >
                  {day.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Notebook Progress ────────────────────────────────────────────────────────

function NotebookProgress({ data }: { data: NotebookBreakdown[] }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-slate-700">Notebook Progress</h2>

      {/* Stacked horizontal progress bar */}
      <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100">
        {data.map((item) =>
          item.pct > 0 ? (
            <div
              key={item.status}
              className="h-full transition-all"
              style={{ width: `${item.pct}%`, backgroundColor: item.color }}
              title={`${item.status}: ${item.pct.toFixed(1)}%`}
            />
          ) : null
        )}
      </div>

      {/* Status breakdown list */}
      <ul className="flex flex-col gap-2.5">
        {data.map((item) => (
          <li key={item.status} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-slate-600 capitalize">{item.status}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700">{item.count}</span>
              <span className="text-xs text-slate-400 w-12 text-right">
                {item.pct.toFixed(1)}%
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Recent Activity ──────────────────────────────────────────────────────────

function RecentActivity({ data }: { data: RecentRun[] }) {
  const rows = data.slice(0, 10);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-3">
      <h2 className="text-sm font-semibold text-slate-700">Recent Runs</h2>

      {rows.length === 0 ? (
        <p className="text-sm text-slate-400 py-8 text-center">No runs recorded yet.</p>
      ) : (
        <ul className="flex flex-col">
          {rows.map((run) => (
            <li
              key={run.run_id}
              className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-slate-50 transition-colors cursor-default"
            >
              <StatusDot status={run.status} />
              <span className="flex-1 text-sm text-slate-700 truncate min-w-0">
                {run.pipeline_name || run.pipeline_id}
              </span>
              <span className="text-xs text-slate-400 shrink-0">
                {run.duration_s != null ? formatDuration(run.duration_s) : "—"}
              </span>
              <span className="text-xs text-slate-400 shrink-0 w-16 text-right">
                {timeAgo(run.started_at)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyChartState() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center gap-3 text-center">
      <BarChart2 className="w-10 h-10 text-slate-300" />
      <p className="text-sm font-medium text-slate-500">No pipeline runs yet.</p>
      <p className="text-xs text-slate-400">Run a pipeline to see data here.</p>
    </div>
  );
}

// ─── Default values ───────────────────────────────────────────────────────────

const DEFAULT_SUMMARY: AnalyticsSummary = {
  total_runs_30d: 0,
  success_runs_30d: 0,
  failed_runs_30d: 0,
  success_rate: 0,
  avg_duration_s: 0,
  total_notebooks: 0,
  published_notebooks: 0,
  total_pipelines: 0,
  active_pipelines: 0,
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [summary, setSummary] = useState<AnalyticsSummary>(DEFAULT_SUMMARY);
  const [dailyRuns, setDailyRuns] = useState<DailySummary[]>([]);
  const [notebookBreakdown, setNotebookBreakdown] = useState<NotebookBreakdown[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentRun[]>([]);

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await analyticsAPI.getOverview();
      const data: AnalyticsData = res.data;
      setSummary(data.summary ?? DEFAULT_SUMMARY);
      setDailyRuns(data.daily_runs ?? []);
      setNotebookBreakdown(data.notebook_breakdown ?? []);
      setRecentActivity(data.recent_activity ?? []);
    } catch {
      toast.error("Failed to load analytics data.");
      setSummary(DEFAULT_SUMMARY);
      setDailyRuns([]);
      setNotebookBreakdown([]);
      setRecentActivity([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const isEmpty = summary.total_runs_30d === 0 && recentActivity.length === 0;

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col gap-6">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart2 className="w-6 h-6 text-indigo-500" />
          <div>
            <h1 className="text-xl font-bold text-slate-800">Analytics</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Last 30 days · updates on each visit
            </p>
          </div>
        </div>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className={clsx(
            "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors",
            refreshing && "opacity-60 cursor-not-allowed"
          )}
        >
          <RefreshCw className={clsx("w-4 h-4", refreshing && "animate-spin")} />
          Refresh
        </button>
      </div>

      {/* ── Row 1: Stat Cards ──────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<TrendingUp className="w-4 h-4 text-indigo-600" />}
            label="Total Runs"
            value={summary.total_runs_30d.toLocaleString()}
            sub="last 30 days"
            accentClass="bg-indigo-50"
          />
          <StatCard
            icon={<CheckCircle2 className="w-4 h-4 text-green-600" />}
            label="Success Rate"
            value={`${summary.success_rate.toFixed(1)}%`}
            sub={`${summary.success_runs_30d.toLocaleString()} / ${summary.total_runs_30d.toLocaleString()} runs`}
            accentClass="bg-green-50"
          />
          <StatCard
            icon={<Clock className="w-4 h-4 text-amber-600" />}
            label="Avg Duration"
            value={formatDuration(summary.avg_duration_s)}
            sub="average per run"
            accentClass="bg-amber-50"
          />
          <StatCard
            icon={<BookOpen className="w-4 h-4 text-slate-600" />}
            label="Published"
            value={summary.published_notebooks.toLocaleString()}
            sub={`of ${summary.total_notebooks.toLocaleString()} total`}
            accentClass="bg-slate-100"
          />
        </div>
      )}

      {/* ── Row 2: Daily Runs Chart ────────────────────────────────────── */}
      {loading ? (
        <div className="bg-slate-200 animate-pulse rounded-xl h-48" />
      ) : isEmpty ? (
        <EmptyChartState />
      ) : dailyRuns.length > 0 ? (
        <DailyRunsChart data={dailyRuns} />
      ) : null}

      {/* ── Row 3: Notebook Breakdown + Recent Activity ────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-slate-200 animate-pulse rounded-xl h-64" />
          <div className="bg-slate-200 animate-pulse rounded-xl h-64" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <NotebookProgress data={notebookBreakdown} />
          <RecentActivity data={recentActivity} />
        </div>
      )}
    </div>
  );
}
