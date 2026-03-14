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
  getStats: () => api.get('/notebooks/stats'),
};

// Dashboard
export const dashboardAPI = {
  getSummary: () => api.get('/dashboard/summary'),
};
