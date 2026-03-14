"use client";
import { useState, useEffect } from "react";
import { notebooksAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { BookOpen, ChevronDown, ChevronRight, ArrowRight, RefreshCw } from "lucide-react";
import { clsx } from "clsx";

const STATUS_OPTIONS = ["pending", "generated", "published", "skipped", "missing"];

interface Notebook {
  id: string; name: string; path: string; status: string;
  folder: string; notebook_order: number; is_next: boolean;
}
interface Folder {
  name: string; order: number; notebooks: Notebook[];
  stats: { pending: number; generated: number; published: number; skipped: number; missing: number; };
}

export default function ContentQueuePage() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [updating, setUpdating] = useState<string | null>(null);

  const loadQueue = async () => {
    setLoading(true);
    try {
      const [queueRes, statsRes] = await Promise.all([
        notebooksAPI.getQueue(),
        notebooksAPI.getStats()
      ]);
      setFolders(queueRes.data.folders);
      setStats(statsRes.data);
      // Auto-expand first folder
      if (queueRes.data.folders.length > 0) {
        setExpanded(new Set([queueRes.data.folders[0].name]));
      }
    } catch { toast.error("Failed to load content queue"); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadQueue(); }, []);

  const toggleFolder = (name: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const handleStatusChange = async (notebookId: string, newStatus: string) => {
    setUpdating(notebookId);
    try {
      await notebooksAPI.updateStatus(notebookId, newStatus);
      toast.success("Status updated");
      await loadQueue();
    } catch { toast.error("Failed to update status"); }
    finally { setUpdating(null); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600" />
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <BookOpen className="w-7 h-7" /> Content Queue
          </h1>
          <p className="text-slate-500 mt-1">Track and manage your ML notebook content pipeline</p>
        </div>
        <button onClick={loadQueue} className="btn-secondary flex items-center gap-2 text-sm">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        {[
          { key: "total", label: "Total", color: "text-slate-700", bg: "bg-slate-100" },
          { key: "pending", label: "Pending", color: "text-yellow-700", bg: "bg-yellow-100" },
          { key: "generated", label: "Generated", color: "text-blue-700", bg: "bg-blue-100" },
          { key: "published", label: "Published", color: "text-green-700", bg: "bg-green-100" },
          { key: "missing", label: "Missing", color: "text-red-700", bg: "bg-red-100" },
        ].map(({ key, label, color, bg }) => (
          <div key={key} className={`${bg} rounded-xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${color}`}>{stats[key] ?? 0}</p>
            <p className={`text-xs font-medium ${color} opacity-80 mt-0.5`}>{label}</p>
          </div>
        ))}
      </div>

      {/* Folders */}
      {folders.length === 0 ? (
        <div className="card text-center py-12">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No notebooks found</p>
          <p className="text-slate-400 text-sm mt-1">Connect a GitHub repo to sync your notebooks</p>
        </div>
      ) : (
        <div className="space-y-3">
          {folders.map((folder) => {
            const isOpen = expanded.has(folder.name);
            return (
              <div key={folder.name} className="card p-0 overflow-hidden">
                <button onClick={() => toggleFolder(folder.name)}
                  className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    {isOpen ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
                    <span className="font-semibold text-slate-800 text-sm">{folder.name}</span>
                    <span className="text-xs text-slate-400">
                      {folder.notebooks.length} notebooks · {folder.stats.published} published · {folder.stats.pending} pending
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {folder.stats.published > 0 && <span className="badge-published">{folder.stats.published} published</span>}
                    {folder.stats.pending > 0 && <span className="badge-pending">{folder.stats.pending} pending</span>}
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100">
                    {folder.notebooks.map((nb, idx) => (
                      <div key={nb.id}
                        className={clsx(
                          "flex items-center justify-between px-5 py-3 text-sm border-b border-slate-50 last:border-0",
                          nb.is_next && "bg-sky-50 border-l-2 border-l-sky-500"
                        )}>
                        <div className="flex items-center gap-3 flex-1">
                          <span className="text-slate-400 w-6 text-xs font-mono">{idx + 1}</span>
                          <span className={clsx("text-slate-700", nb.is_next && "font-semibold text-sky-700")}>
                            {nb.name}
                          </span>
                          {nb.is_next && (
                            <span className="flex items-center gap-1 text-xs text-sky-600 font-medium">
                              <ArrowRight className="w-3 h-3" /> Next in queue
                            </span>
                          )}
                        </div>
                        <select
                          value={nb.status}
                          disabled={updating === nb.id}
                          onChange={(e) => handleStatusChange(nb.id, e.target.value)}
                          className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white">
                          {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </div>
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
