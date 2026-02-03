import type {
  ChatMessage,
  ChatSession,
  CreateSessionResponse,
  ChatResponse,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function createSession(): Promise<CreateSessionResponse> {
  const response = await fetch(`${API_URL}/api/chat/sessions`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to create session");
  }

  return response.json();
}

export async function listSessions(): Promise<ChatSession[]> {
  const response = await fetch(`${API_URL}/api/chat/sessions`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch sessions");
  }

  return response.json();
}

export async function getSessionMessages(sessionId: string): Promise<ChatMessage[]> {
  const response = await fetch(`${API_URL}/api/chat/sessions/${sessionId}/messages`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }

  return response.json();
}

export async function sendMessage(sessionId: string, message: string): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/api/chat/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ session_id: sessionId, message }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || "Failed to send message");
  }

  return response.json();
}
