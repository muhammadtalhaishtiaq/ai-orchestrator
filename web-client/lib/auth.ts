/**
 * Auth Library - Frontend Authentication for Project Nebula
 * 
 * 🎓 LESSON: How Frontend Auth Works
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 1. User enters email/password
 * 2. Frontend sends to /api/auth/login
 * 3. Backend returns JWT token
 * 4. Frontend stores token in localStorage
 * 5. Every API request includes token in header
 * 6. Backend verifies token = user authenticated!
 */

// API Base URL - uses environment variable or localhost for dev
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Types
export interface User {
  id: string;
  email: string;
  full_name: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface AuthError {
  detail: string;
}

// Storage keys
const TOKEN_KEY = "nebula_token";
const USER_KEY = "nebula_user";

/**
 * Register a new user
 */
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
  
  // Store token and user data
  saveAuth(data);
  
  return data;
}

/**
 * Login with email and password
 */
export async function login(email: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error: AuthError = await response.json();
    throw new Error(error.detail || "Login failed");
  }

  const data: AuthResponse = await response.json();
  
  // Store token and user data
  saveAuth(data);
  
  return data;
}

/**
 * Logout - clear stored auth data
 */
export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}

/**
 * Get current user from localStorage
 */
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

/**
 * Get auth token from localStorage
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Check if user is logged in
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * Save auth data to localStorage
 */
function saveAuth(data: AuthResponse): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  }
}

/**
 * Get auth headers for API requests
 */
export function getAuthHeaders(): HeadersInit {
  const token = getToken();
  if (!token) return {};
  
  return {
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Fetch user profile from API (verifies token is still valid)
 */
export async function fetchCurrentUser(): Promise<User | null> {
  const token = getToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Token invalid or expired
      logout();
      return null;
    }

    const user: User = await response.json();
    
    // Update stored user data
    if (typeof window !== "undefined") {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
    
    return user;
  } catch {
    return null;
  }
}
