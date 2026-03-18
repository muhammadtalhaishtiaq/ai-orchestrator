import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export interface AuthUser {
  user_id: string;
  email: string;
  full_name?: string;
  access_token: string;
}

export const setAuthUser = (user: AuthUser) => {
  Cookies.set(TOKEN_KEY, user.access_token, { expires: 1, sameSite: 'strict' });
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const getAuthUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  const data = sessionStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const clearAuth = () => {
  Cookies.remove(TOKEN_KEY);
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(USER_KEY);
  }
};

export const isAuthenticated = (): boolean => {
  return !!Cookies.get(TOKEN_KEY);
};
