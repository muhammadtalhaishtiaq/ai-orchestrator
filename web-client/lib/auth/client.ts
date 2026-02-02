import type { AuthError, AuthResponse, User } from "./types";
import { setCurrentUser, clearCurrentUser } from "./storage";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function register(
  email: string,
  password: string,
  fullName: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email,
      password,
      full_name: fullName,
    }),
  });

  if (!response.ok) {
    const error: AuthError = await response.json();
    throw new Error(error.detail || "Registration failed");
  }

  const data: AuthResponse = await response.json();
  setCurrentUser(data.user);
  return data;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error: AuthError = await response.json();
    throw new Error(error.detail || "Login failed");
  }

  const data: AuthResponse = await response.json();
  setCurrentUser(data.user);
  return data;
}

export async function logout(): Promise<void> {
  await fetch(`${API_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  clearCurrentUser();
}

export function getAuthHeaders(): HeadersInit {
  return {};
}

export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      credentials: "include",
    });

    if (!response.ok) {
      await logout();
      return null;
    }

    const user: User = await response.json();
    setCurrentUser(user);
    return user;
  } catch {
    return null;
  }
}
