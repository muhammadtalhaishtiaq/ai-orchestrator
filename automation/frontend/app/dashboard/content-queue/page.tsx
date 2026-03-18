"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { notebooksAPI } from "@/lib/api";
import toast from "react-hot-toast";
import {
  BookOpen, ChevronDown, ChevronRight, ArrowRight, RefreshCw,
  Wand2, Github, CheckCircle2, XCircle, Loader2, Eye, EyeOff, ListEnd,
} from "lucide-react";
import { clsx } from "clsx";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Cell { cell_type: "markdown" | "code"; source: string; }
interface Notebook {
  id: string; name: string; path: string; status: string;
  folder: string; notebook_order: number; is_next: boolean; html_url?: string;
}
interface Folder {
  name: string; order: number; notebooks: Notebook[];
  stats: Record<string, number>;
}
interface RegenResult {
  cells: Cell[]; notebook_id: string; name: string; path: string;
  difficulty: string; total_cells: number; config_version: string;
}

const STATUS_META: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  missing:   { label: "Missing",   color: "text-red-700",    bg: "bg-red-50",    dot: "bg-red-400" },
  pending:   { label: "Pending",   color: "text-yellow-700", bg: "bg-yellow-50", dot: "bg-yellow-400" },
  generated: { label: "Generated", color: "text-blue-700",   bg: "bg-blue-50",   dot: "bg-blue-400" },
  published: { label: "Published", color: "text-green-700",  bg: "bg-green-50",  dot: "bg-green-500" },
  skipped:   { label: "Skipped",   color: "text-slate-500",  bg: "bg-slate-50",  dot: "bg-slate-400" },
};
const VALID_STATUSES = ["missing", "pending", "generated", "published", "skipped"];

// ─── Cell preview ─────────────────────────────────────────────────────────────
function CellPreview({ cell, index }: { cell: Cell; index: number }) {
  const isCode = cell.cell_type === "code";
  return (
    <div className={clsx("rounded-lg overflow-hidden border mb-2", isCode ? "border-slate-200" : "border-transparent")}>
      {isCode ? (
        <div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-xs text-slate-400">
            <span className="text-sky-400">In [{index + 1}]:</span>
            <span>Python</span>
          </div>
          <pre className="bg-slate-900 text-slate-100 text-xs p-4 overflow-x-auto leading-relaxed whitespace-pre-wrap">{cell.source}</pre>
        </div>
      ) : (
        <div className="px-4 py-2 text-sm text-slate-700 bg-white">
          {cell.source.split("\n").map((line, i) => {
            if (line.startsWith("# "))  return <h3 key={i} className="text-base font-bold text-slate-800 mt-2 mb-1">{line.slice(2)}</h3>;
            if (line.startsWith("## ")) return <h4 key={i} className="text-sm font-semibold text-slate-700 mt-2 mb-1">{line.slice(3)}</h4>;
            if (line.startsWith("### ")) return <h5 key={i} className="text-xs font-semibold text-slate-600 mt-1">{line.slice(4)}</h5>;
            if (line.startsWith("- ") || line.startsWith("* ")) return <p key={i} className="text-xs text-slate-600 ml-3">• {line.slice(2)}</p>;
            if (line.startsWith("> ")) return <blockquote key={i} className="border-l-2 border-sky-400 pl-2 text-xs text-slate-500 italic my-1">{line.slice(2)}</blockquote>;
            if (line.trim() === "" || line === "---") return <div key={i} className="my-1" />;
            return <p key={i} className="text-xs text-slate-600 mb-0.5">{line}</p>;
          })}
        </div>
      )}
    </div>
  );
}

// ─── Notebook row with inline regenerate panel ───────────────────────────────
function NotebookRow({ nb, onStatusChange }: {
  nb: Notebook;
  onStatusChange: (id: string, status: string) => Promise<void>;
}) {
  const [updating, setUpdating]       = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [pushing, setPushing]         = useState(false);
  const [panelOpen, setPanelOpen]     = useState(false);
  const [regenResult, setRegenResult] = useState<RegenResult | null>(null);
  const [showAllCells, setShowAllCells] = useState(false);

  const meta = STATUS_META[nb.status] ?? STATUS_META.pending;

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    await onStatusChange(nb.id, newStatus);
    setUpdating(false);
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    setPanelOpen(true);
    setRegenResult(null);
    try {
      const res = await notebooksAPI.regenerate(nb.id);
      setRegenResult(res.data);
      toast.success(`Generated ${res.data.total_cells} cells`);
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "Failed to generate");
      setPanelOpen(false);
    } finally {
      setRegenerating(false);
    }
  };

  const handlePushGitHub = async () => {
    if (!regenResult) return;
    setPushing(true);
    try {
      const res = await notebooksAPI.pushGitHub(nb.id);
      toast.success(`Pushed to GitHub: ${res.data.path}`);
      setPanelOpen(false);
      setRegenResult(null);
      await onStatusChange(nb.id, "published");
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "Push failed");
    } finally {
      setPushing(false);
    }
  };

  const previewCells = regenResult
    ? (showAllCells ? regenResult.cells : regenResult.cells.slice(0, 5))
    : [];

  return (
    <div className={clsx("border-b border-slate-50 last:border-0", nb.is_next && "border-l-2 border-l-sky-500")}>
      {/* Row */}
      <div className={clsx("flex items-center gap-3 px-5 py-3 text-sm", nb.is_next && "bg-sky-50")}>
        <span className="text-slate-400 w-6 text-xs font-mono shrink-0">{nb.notebook_order}</span>
        <span className={clsx("flex-1 truncate text-slate-700", nb.is_next && "font-semibold text-sky-700")}>
          {nb.name}
          {nb.is_next && <span className="ml-2 inline-flex items-center gap-1 text-xs text-sky-500"><ArrowRight className="w-3 h-3" />Next up</span>}
        </span>

        {/* Status badge */}
        <span className={clsx("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium shrink-0", meta.color, meta.bg)}>
          <span className={clsx("w-1.5 h-1.5 rounded-full", meta.dot)} />{meta.label}
        </span>

        {/* Status selector */}
        <select
          value={nb.status}
          disabled={updating}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white shrink-0"
        >
          {VALID_STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>

        {/* Set as Next Up button — only shown when not already pending/published */}
        {nb.status !== "pending" && nb.status !== "published" && (
          <button
            onClick={() => handleStatusChange("pending")}
            disabled={updating}
            title="Move this notebook to the front of the queue"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors shrink-0"
          >
            <ListEnd className="w-3 h-3" />
            Next Up
          </button>
        )}

        {/* Generate button */}
        <button
          onClick={handleRegenerate}
          disabled={regenerating || nb.status === "published"}
          className={clsx(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0",
            nb.status === "published"
              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
              : "bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200"
          )}
        >
          {regenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
          {regenerating ? "Generating..." : "Generate"}
        </button>

        {/* Toggle preview */}
        {regenResult && (
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            {panelOpen ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Inline preview panel */}
      {panelOpen && (
        <div className="mx-5 mb-4 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <BookOpen className="w-4 h-4 text-sky-600" />
              <div>
                <p className="text-sm font-semibold text-slate-800">{nb.name}</p>
                <p className="text-xs text-slate-500">
                  {regenerating
                    ? "Generating notebook..."
                    : regenResult
                      ? `${regenResult.total_cells} cells · ${regenResult.difficulty} difficulty · config v${regenResult.config_version}`
                      : ""}
                </p>
              </div>
            </div>
            {regenResult && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">{nb.path}</span>
                <button
                  onClick={handlePushGitHub}
                  disabled={pushing}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  {pushing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Github className="w-3 h-3" />}
                  {pushing ? "Pushing..." : "Push to GitHub"}
                </button>
              </div>
            )}
          </div>

          {regenerating ? (
            <div className="flex items-center justify-center py-12 gap-3 text-slate-500">
              <Loader2 className="w-5 h-5 animate-spin text-sky-500" />
              <span className="text-sm">Building notebook from config template...</span>
            </div>
          ) : regenResult ? (
            <div className="p-4">
              <div className="space-y-1">
                {previewCells.map((cell, i) => <CellPreview key={i} cell={cell} index={i} />)}
              </div>
              {regenResult.cells.length > 5 && (
                <button
                  onClick={() => setShowAllCells(!showAllCells)}
                  className="mt-3 w-full text-center text-xs text-sky-600 hover:text-sky-800 py-2 border border-dashed border-sky-200 rounded-lg"
                >
                  {showAllCells ? "Show less" : `Show ${regenResult.cells.length - 5} more cells`}
                </button>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ContentQueuePage() {
  const [folders, setFolders]           = useState<Folder[]>([]);
  const [stats, setStats]               = useState<any>({});
  const [loading, setLoading]           = useState(true);
  const [syncing, setSyncing]           = useState(false);
  const [syncResult, setSyncResult]     = useState<any>(null);
  const [expanded, setExpanded]         = useState<Set<string>>(new Set());
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const loadQueue = useCallback(async () => {
    setLoading(true);
    try {
      const [queueRes, statsRes] = await Promise.all([
        notebooksAPI.getQueue(),
        notebooksAPI.getStats(),
      ]);
      setFolders(queueRes.data.folders);
      setStats(statsRes.data);
      if (queueRes.data.folders.length > 0 && expanded.size === 0) {
        setExpanded(new Set([queueRes.data.folders[0].name]));
      }
    } catch { toast.error("Failed to load content queue"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadQueue(); }, [loadQueue]);

  // Reload whenever the page becomes visible again (user navigates back)
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") loadQueue();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [loadQueue]);

  const toggleFolder = (name: string) => {
    setExpanded(prev => { const n = new Set(prev); n.has(name) ? n.delete(name) : n.add(name); return n; });
  };

  const handleStatusChange = async (notebookId: string, newStatus: string) => {
    try {
      await notebooksAPI.updateStatus(notebookId, newStatus);
      setFolders(prev => prev.map(f => ({
        ...f,
        notebooks: f.notebooks.map(nb => nb.id === notebookId ? { ...nb, status: newStatus } : nb),
      })));
    } catch { toast.error("Failed to update status"); }
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await notebooksAPI.syncFromGitHub();
      setSyncResult(res.data);
      toast.success(`Sync queued — ${res.data.summary.db_updates_queued} notebooks updating`);
      setTimeout(() => loadQueue(), 3000);
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "GitHub sync failed");
    } finally { setSyncing(false); }
  };

  const filteredFolders = filterStatus === "all"
    ? folders
    : folders.map(f => ({ ...f, notebooks: f.notebooks.filter(nb => nb.status === filterStatus) }))
             .filter(f => f.notebooks.length > 0);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600" />
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-sky-600" /> Content Queue
          </h1>
          <p className="text-slate-500 mt-1">
            {stats.total ?? 0} notebooks · {stats.published ?? 0} published · {stats.missing ?? 0} not yet written
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setExpanded(new Set(folders.map(f => f.name)))} className="btn-secondary text-xs px-3 py-1.5">Expand all</button>
          <button onClick={() => setExpanded(new Set())} className="btn-secondary text-xs px-3 py-1.5">Collapse all</button>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-medium transition-colors"
          >
            {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Github className="w-4 h-4" />}
            {syncing ? "Syncing..." : "Sync from GitHub"}
          </button>
          <button onClick={loadQueue} className="btn-secondary flex items-center gap-2 text-sm">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sync result banner */}
      {syncResult && (
        <div className="mb-6 p-4 bg-sky-50 border border-sky-200 rounded-xl flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
          <div className="text-sm text-sky-800 flex-1">
            <p className="font-semibold">GitHub sync complete</p>
            <p className="text-xs mt-0.5">
              <strong>{syncResult.summary.found_on_github}</strong> found on GitHub ·{" "}
              <strong>{syncResult.summary.not_on_github}</strong> not yet created ·{" "}
              <strong>{syncResult.summary.already_published}</strong> published ·{" "}
              <strong>{syncResult.summary.db_updates_queued}</strong> status updates applied
            </p>
            <p className="text-xs text-sky-500 mt-1">
              Synced at {new Date(syncResult.synced_at).toLocaleTimeString()} · Repo: {syncResult.repo}
            </p>
          </div>
          <button onClick={() => setSyncResult(null)} className="text-sky-400 hover:text-sky-600">
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats bar (clickable filters) */}
      <div className="grid grid-cols-6 gap-3 mb-6">
        {[
          { key: "total",     label: "Total",     color: "text-slate-700", bg: "bg-slate-100", border: "border-slate-200" },
          { key: "missing",   label: "Missing",   color: "text-red-700",   bg: "bg-red-50",    border: "border-red-200" },
          { key: "pending",   label: "Pending",   color: "text-yellow-700",bg: "bg-yellow-50", border: "border-yellow-200" },
          { key: "generated", label: "Generated", color: "text-blue-700",  bg: "bg-blue-50",   border: "border-blue-200" },
          { key: "published", label: "Published", color: "text-green-700", bg: "bg-green-50",  border: "border-green-200" },
          { key: "skipped",   label: "Skipped",   color: "text-slate-500", bg: "bg-slate-50",  border: "border-slate-200" },
        ].map(({ key, label, color, bg, border }) => (
          <button
            key={key}
            onClick={() => setFilterStatus(filterStatus === key ? "all" : key)}
            className={clsx(
              `${bg} border ${border} rounded-xl p-3 text-center transition-all`,
              filterStatus === key && "ring-2 ring-sky-400 ring-offset-1"
            )}
          >
            <p className={`text-xl font-bold ${color}`}>{stats[key] ?? 0}</p>
            <p className={`text-xs font-medium ${color} opacity-80`}>{label}</p>
          </button>
        ))}
      </div>

      {filterStatus !== "all" && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-slate-600">Filtering: <strong className="capitalize">{filterStatus}</strong></span>
          <button onClick={() => setFilterStatus("all")} className="text-xs text-sky-600 hover:underline">Clear</button>
        </div>
      )}

      {/* Folders */}
      {filteredFolders.length === 0 ? (
        <div className="card text-center py-12">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No notebooks match filter</p>
          <button onClick={() => setFilterStatus("all")} className="mt-2 text-sky-600 text-sm hover:underline">Clear filter</button>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredFolders.map((folder) => {
            const isOpen = expanded.has(folder.name);
            const total  = folder.notebooks.length;
            const done   = folder.stats.published ?? 0;
            const ready  = folder.stats.generated ?? 0;
            const missing = folder.stats.missing ?? 0;
            const progress = total > 0 ? Math.round((done / total) * 100) : 0;

            return (
              <div key={folder.name} className="card p-0 overflow-hidden">
                <button onClick={() => toggleFolder(folder.name)}
                  className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                    <div className="text-left">
                      <p className="font-semibold text-slate-800 text-sm">{folder.name}</p>
                      <p className="text-xs text-slate-400">{total} notebooks · {done} published · {missing} missing</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-xs text-slate-400 w-8">{progress}%</span>
                    </div>
                    <div className="flex gap-1">
                      {done > 0    && <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">{done} done</span>}
                      {ready > 0   && <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">{ready} ready</span>}
                      {missing > 0 && <span className="px-2 py-0.5 text-xs bg-red-100 text-red-600 rounded-full">{missing} missing</span>}
                    </div>
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100">
                    {folder.notebooks.map(nb => (
                      <NotebookRow key={nb.id} nb={nb} onStatusChange={handleStatusChange} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
