"use client";
import { useState, useEffect } from "react";
import { githubAPI } from "@/lib/api";
import toast from "react-hot-toast";
import { Github, Link2, RefreshCw, Folder, BookOpen, CheckCircle } from "lucide-react";

interface Repo { name: string; full_name: string; description: string; updated_at: string; private: boolean; }
interface Connection { connected: boolean; github_login: string; connected_repo: string; }

export default function GitHubPage() {
  const [token, setToken] = useState("");
  const [connection, setConnection] = useState<Connection | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectingToken, setConnectingToken] = useState(false);
  const [fetchingRepos, setFetchingRepos] = useState(false);
  const [connectingRepo, setConnectingRepo] = useState<string | null>(null);

  useEffect(() => {
    githubAPI.getConnection()
      .then(({ data }) => setConnection(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setConnectingToken(true);
    try {
      await githubAPI.connect(token);
      toast.success("GitHub connected!");
      setToken("");
      const { data } = await githubAPI.getConnection();
      setConnection(data);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to connect GitHub");
    } finally {
      setConnectingToken(false);
    }
  };

  const handleFetchRepos = async () => {
    setFetchingRepos(true);
    try {
      const { data } = await githubAPI.listRepos();
      setRepos(data.repos);
    } catch {
      toast.error("Failed to fetch repos");
    } finally {
      setFetchingRepos(false);
    }
  };

  const handleConnectRepo = async (fullName: string) => {
    const [owner, name] = fullName.split("/");
    setConnectingRepo(fullName);
    try {
      await githubAPI.connectRepo(owner, name);
      toast.success(`Connected to ${fullName} — syncing notebooks...`);
      const { data } = await githubAPI.getConnection();
      setConnection(data);
    } catch {
      toast.error("Failed to connect repo");
    } finally {
      setConnectingRepo(null);
    }
  };

  if (loading) return (
    <div className="p-8 space-y-6">
      <div className="h-8 bg-slate-200 rounded w-48 animate-pulse" />
      <div className="h-4 bg-slate-200 rounded w-72 animate-pulse" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-slate-200 rounded-xl animate-pulse" />
        ))}
      </div>
      <div className="h-64 bg-slate-200 rounded-xl animate-pulse" />
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <Github className="w-7 h-7 text-slate-900" />
          GitHub Integration
        </h1>
        <p className="text-slate-600 mt-1">Connect your GitHub account and select a repo to track</p>
      </div>

      {/* Connection Status */}
      {connection?.connected && (
        <div className="bg-white rounded-xl border border-emerald-200 shadow-sm p-6 mb-6 bg-emerald-50">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-emerald-800">GitHub Connected</p>
              <p className="text-sm text-emerald-700 mt-0.5">
                @{connection.github_login}
                {connection.connected_repo && (
                  <> · Repo: <strong>{connection.connected_repo}</strong></>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Connect Token Form */}
      {!connection?.connected && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-indigo-600" />
            Connect GitHub Token
          </h3>
          <form onSubmit={handleConnect} className="flex gap-3">
            <input
              type="password"
              required
              className="input-field flex-1"
              placeholder="github_pat_xxxx..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <button
              type="submit"
              disabled={connectingToken}
              className="btn-primary whitespace-nowrap"
            >
              {connectingToken ? "Connecting..." : "Connect"}
            </button>
          </form>
          <p className="text-xs text-slate-400 mt-2">Your token is encrypted with AES-256 before storage</p>
        </div>
      )}

      {/* Repos */}
      {connection?.connected && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Folder className="w-4 h-4 text-indigo-600" />
              Your Repositories
            </h3>
            <button
              onClick={handleFetchRepos}
              disabled={fetchingRepos}
              className="btn-secondary flex items-center gap-2 text-sm py-2 px-3"
            >
              <RefreshCw className={`w-4 h-4 ${fetchingRepos ? "animate-spin" : ""}`} />
              {fetchingRepos ? "Loading..." : "Fetch Repos"}
            </button>
          </div>

          {fetchingRepos && (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-200 rounded-lg animate-pulse" />
              ))}
            </div>
          )}

          {!fetchingRepos && repos.length === 0 && (
            <p className="text-slate-400 text-sm text-center py-8">
              Click &quot;Fetch Repos&quot; to load your repositories
            </p>
          )}

          {!fetchingRepos && repos.length > 0 && (
            <div className="space-y-3">
              {repos.map((repo) => {
                const isConnected = connection.connected_repo === repo.full_name;
                return (
                  <div
                    key={repo.full_name}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                      isConnected
                        ? "border-indigo-300 bg-indigo-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-slate-400" />
                        <p className="font-medium text-slate-900 text-sm">{repo.full_name}</p>
                        {repo.private && (
                          <span className="text-xs bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                            Private
                          </span>
                        )}
                        {isConnected && (
                          <span className="text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-medium">
                            Active
                          </span>
                        )}
                      </div>
                      {repo.description && (
                        <p className="text-xs text-slate-400 mt-0.5 ml-6">{repo.description}</p>
                      )}
                    </div>
                    {!isConnected && (
                      <button
                        onClick={() => handleConnectRepo(repo.full_name)}
                        disabled={connectingRepo === repo.full_name}
                        className="btn-primary text-sm py-1.5 px-3 ml-4"
                      >
                        {connectingRepo === repo.full_name ? "Connecting..." : "Use This Repo"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
