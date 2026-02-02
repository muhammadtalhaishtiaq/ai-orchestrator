/**
 * API Client for Project Nebula
 * Handles all API calls with authentication
 */

import { getAuthHeaders, logout } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Generic API fetch with auth headers
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized - token expired or invalid
  if (response.status === 401) {
    logout();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Session expired. Please login again.");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || "Request failed");
  }

  return response.json();
}

/**
 * Create a new chat session
 */
export async function createChatSession(): Promise<{ session_id: string; created_at: string }> {
  return apiFetch("/api/sessions", { method: "POST" });
}

/**
 * Send a chat message
 */
export async function sendChatMessage(
  sessionId: string,
  message: string
): Promise<{ response: string; role: string; has_chart: boolean }> {
  return apiFetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ session_id: sessionId, message }),
  });
}

/**
 * Get health status
 */
export async function getHealthStatus(): Promise<{
  status: string;
  services: Record<string, { status: string }>;
}> {
  return apiFetch("/api/health");
}
