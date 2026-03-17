import Cookies from 'js-cookie';
import api from './api';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'ASSISTANT' | 'TEACHER' | 'STUDENT' | 'PARENT';
  avatarUrl?: string | null;
  school: {
    id: string;
    name: string;
    slug: string;
  };
}

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

export function setAuthTokens(accessToken: string, refreshToken: string, user: AuthUser) {
  Cookies.set(ACCESS_TOKEN_KEY, accessToken, { expires: 1 / 96, sameSite: 'lax' });
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { expires: 7, sameSite: 'lax' });
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
  Cookies.remove(ACCESS_TOKEN_KEY);
  Cookies.remove(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!Cookies.get(ACCESS_TOKEN_KEY);
}

export function getDashboardRoute(role: AuthUser['role']): string {
  const routes: Record<AuthUser['role'], string> = {
    ADMIN: '/admin',
    ASSISTANT: '/assistant',
    TEACHER: '/teacher',
    STUDENT: '/student',
    PARENT: '/parent',
  };
  return routes[role];
}

export async function login(email: string, password: string) {
  const response = await api.post('/auth/login', { email, password });
  const { accessToken, refreshToken, user } = response.data;
  setAuthTokens(accessToken, refreshToken, user);
  return user as AuthUser;
}

export async function logout() {
  try {
    await api.post('/auth/logout');
  } finally {
    clearAuth();
  }
}
