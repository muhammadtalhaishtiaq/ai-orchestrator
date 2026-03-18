import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 - redirect to login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data: { email: string; password: string; full_name: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
};

// GitHub
export const githubAPI = {
  connect: (token: string) => api.post('/github/connect', { token }),
  getConnection: () => api.get('/github/connection'),
  listRepos: () => api.get('/github/repos'),
  connectRepo: (owner: string, name: string) =>
    api.post(`/github/repos/${owner}/${name}/connect`),
  getStructure: (owner: string, name: string) =>
    api.get(`/github/repos/${owner}/${name}/structure`),
};

// Notebooks
export const notebooksAPI = {
  getQueue: (params?: { folder?: string; status?: string }) =>
    api.get('/notebooks/queue', { params }),
  updateStatus: (id: string, status: string) =>
    api.patch(`/notebooks/${id}/status`, null, { params: { status } }),
  getNext: () => api.get('/notebooks/next'),
  getStats: () => api.get("/notebooks/stats"),
  regenerate: (id: string) => api.post(`/notebooks/${id}/regenerate`),
  pushGitHub: (id: string) => api.post(`/notebooks/${id}/push-github`),
  syncFromGitHub: () => api.post("/notebooks/sync"),
};

// Projects
export const projectsAPI = {
  list: () => api.get('/projects/'),
  get: (id: string) => api.get(`/projects/${id}`),
  create: (data: { name: string; description?: string; color?: string; icon?: string }) =>
    api.post('/projects/', data),
  update: (id: string, data: any) => api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
  setDefault: (id: string) => api.post(`/projects/${id}/set-default`),
};

// Dashboard
export const dashboardAPI = {
  getSummary: () => api.get('/dashboard/summary'),
};

// Settings
export const settingsAPI = {
  getProfile:   () => api.get('/settings/profile'),
  updateProfile:(data: { full_name: string }) => api.put('/settings/profile', data),
  changePassword:(data: { current_password: string; new_password: string }) =>
    api.put('/settings/password', data),
  getApiKeys:   () => api.get('/settings/api-keys'),
  upsertApiKey: (data: { provider: string; api_key: string }) =>
    api.post('/settings/api-keys', data),
  deleteApiKey: (provider: string) => api.delete(`/settings/api-keys/${provider}`),
  revealApiKey: (provider: string) => api.get(`/settings/api-keys/${provider}/reveal`),
  getNotifications:    () => api.get('/settings/notifications'),
  updateNotifications: (data: any) => api.put('/settings/notifications', data),
  getLlmDefault:       () => api.get('/settings/llm-default'),
  setLlmDefault:       (data: { provider: string; model?: string }) =>
    api.put('/settings/llm-default', data),
};

// Analytics
export const analyticsAPI = {
  getOverview: () => api.get('/analytics/overview'),
};

// Pipelines
export const pipelinesAPI = {
  list: (projectId?: string) => api.get('/pipelines/', { params: projectId ? { project_id: projectId } : undefined }),
  get: (id: string) => api.get(`/pipelines/${id}`),
  create: (data: any) => api.post('/pipelines/', data),
  update: (id: string, data: any) => api.put(`/pipelines/${id}`, data),
  delete: (id: string) => api.delete(`/pipelines/${id}`),
  toggle: (id: string) => api.post(`/pipelines/${id}/toggle`),
  clone: (id: string) => api.post(`/pipelines/${id}/clone`),
  getAvailableSteps: () => api.get('/pipelines/available-steps'),
  runNow: (notebookId?: string) =>
    api.post('/pipeline/run', null, { params: notebookId ? { notebook_id: notebookId } : {} }),
  runPipeline: (pipelineId: string, notebookId?: string) =>
    api.post('/pipeline/run', null, { params: { pipeline_id: pipelineId, ...(notebookId ? { notebook_id: notebookId } : {}) } }),
  getRunStatus: (runId: string) => api.get(`/pipeline/run/${runId}/status`),
  getHistory: () => api.get('/pipeline/runs/history'),
};
