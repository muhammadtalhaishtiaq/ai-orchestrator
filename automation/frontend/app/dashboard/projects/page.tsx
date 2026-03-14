"use client";
import { useState, useEffect, useCallback } from "react";
import {
  FolderOpen,
  Plus,
  Pencil,
  Trash2,
  Star,
  GitBranch,
  Calendar,
  X,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { clsx } from "clsx";

interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  pipeline_count: number;
  is_default: boolean;
  created_at: string;
}

interface ProjectFormData {
  name: string;
  description: string;
  color: string;
}

const PROJECT_COLORS = [
  "#6366F1",
  "#8B5CF6",
  "#EC4899",
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#06B6D4",
  "#3B82F6",
  "#64748B",
];

const EMPTY_FORM: ProjectFormData = { name: "", description: "", color: "#6366F1" };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form, setForm] = useState<ProjectFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get("/projects/");
      setProjects(res.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setProjects([]);
      } else {
        setError("Failed to load projects. The projects API may not be available yet.");
        setProjects([]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const openCreateModal = () => {
    setEditingProject(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setForm({
      name: project.name,
      description: project.description,
      color: project.color,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProject(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Project name is required");
      return;
    }
    setSubmitting(true);
    try {
      if (editingProject) {
        const res = await api.put(`/projects/${editingProject.id}`, form);
        setProjects((prev) => prev.map((p) => (p.id === editingProject.id ? res.data : p)));
        toast.success("Project updated");
      } else {
        const res = await api.post("/projects/", form);
        setProjects((prev) => [...prev, res.data]);
        toast.success("Project created");
      }
      closeModal();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to save project");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (project: Project) => {
    if (!confirm(`Delete project "${project.name}"? This cannot be undone.`)) return;
    setDeletingId(project.id);
    try {
      await api.delete(`/projects/${project.id}`);
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
      toast.success("Project deleted");
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to delete project");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetDefault = async (project: Project) => {
    if (project.is_default) return;
    setSettingDefaultId(project.id);
    try {
      await api.post(`/projects/${project.id}/set-default`);
      setProjects((prev) =>
        prev.map((p) => ({ ...p, is_default: p.id === project.id }))
      );
      toast.success(`"${project.name}" is now the default project`);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to set default project");
    } finally {
      setSettingDefaultId(null);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Projects</h1>
          <p className="text-slate-600 text-sm mt-1">
            Organize your automations into isolated workspaces.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors text-sm shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800 mb-1">Failed to load projects</p>
            <p className="text-xs text-amber-700 mb-3">{error}</p>
            <button
              onClick={() => { setLoading(true); fetchProjects(); }}
              className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-slate-200 rounded-xl" />
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-3 bg-slate-200 rounded mb-2" />
                <div className="h-3 bg-slate-200 rounded w-4/5 mb-6" />
                <div className="h-8 bg-slate-200 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      ) : projects.length === 0 ? (
        /* Empty state */
        <div className="text-center py-24 px-4">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <FolderOpen className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No projects yet</h3>
          <p className="text-slate-500 mb-6 max-w-sm mx-auto">
            Create your first project to start organizing your pipelines and automation workflows.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Create your first project
          </button>
        </div>
      ) : (
        /* Project grid */
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group"
            >
              {/* Card header */}
              <div className="p-5 pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${project.color}18` }}
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 truncate">{project.name}</h3>
                        {project.is_default && (
                          <span className="flex-shrink-0 bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 min-h-[2.5rem]">
                  {project.description || (
                    <span className="italic text-slate-300">No description</span>
                  )}
                </p>
              </div>

              {/* Meta */}
              <div className="px-5 py-3 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>{project.pipeline_count ?? 0} pipeline{(project.pipeline_count ?? 0) !== 1 ? "s" : ""}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(project.created_at)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="px-5 py-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => handleSetDefault(project)}
                  disabled={project.is_default || settingDefaultId === project.id}
                  className={clsx(
                    "flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors",
                    project.is_default
                      ? "text-indigo-600 bg-indigo-50 cursor-default"
                      : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50"
                  )}
                >
                  {settingDefaultId === project.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Star className={clsx("w-3.5 h-3.5", project.is_default && "fill-current")} />
                  )}
                  {project.is_default ? "Default" : "Set default"}
                </button>
                <div className="flex-1" />
                <button
                  onClick={() => openEditModal(project)}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project)}
                  disabled={deletingId === project.id}
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  {deletingId === project.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 text-lg">
                {editingProject ? "Edit project" : "New project"}
              </h2>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Project name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="My Automation Project"
                  className="input-field"
                  autoFocus
                  maxLength={80}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="What does this project automate?"
                  rows={3}
                  className="input-field resize-none"
                  maxLength={280}
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Color
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {PROJECT_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, color }))}
                      className={clsx(
                        "w-8 h-8 rounded-full border-2 transition-all",
                        form.color === color
                          ? "border-slate-900 scale-110"
                          : "border-transparent hover:scale-105"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingProject ? "Save changes" : "Create project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
