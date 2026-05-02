/**
 * API client for Django backend.
 * In dev (Vite) requests to /api go through proxy to localhost:8000.
 * When served by Django, same origin so /api works as-is.
 */

const API_BASE = '/api';

export function getApiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${p}`;
}

const ACCESS_KEY = 'access';
const REFRESH_KEY = 'refresh';
const USER_KEY = 'toi-user';

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(access: string, refresh: string): void {
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

export function setUser(user: object): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): { id: number; username: string; email: string; phone: string; role: string } | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as { id: number; username: string; email: string; phone: string; role: string };
  } catch {
    return null;
  }
}

export function clearAuth(): void {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
}

export interface ApiError {
  message: string;
  status: number;
  data?: unknown;
}

/** Из тела ответа DRF (400) достаёт первое человекочитаемое сообщение. */
export function parseApiErrorBody(data: unknown): string | null {
  if (data === null || data === undefined) return null;
  if (typeof data === 'string') return data;
  if (typeof data !== 'object') return null;
  const d = data as Record<string, unknown>;
  if (typeof d.detail === 'string') return d.detail;
  if (Array.isArray(d.detail) && d.detail.length > 0) {
    const first = d.detail[0];
    if (typeof first === 'string') return first;
  }
  if (typeof d.error === 'string') return d.error;
  if (Array.isArray(d.non_field_errors) && d.non_field_errors.length > 0) {
    const first = d.non_field_errors[0];
    if (typeof first === 'string') return first;
  }
  for (const [, value] of Object.entries(d)) {
    if (Array.isArray(value) && value.length > 0) {
      const first = value[0];
      if (typeof first === 'string') return first;
    }
    if (typeof value === 'string') return value;
  }
  return null;
}

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;
  const res = await fetch(getApiUrl('token/refresh/'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (data.access) {
    localStorage.setItem(ACCESS_KEY, data.access);
    return data.access;
  }
  return null;
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = getApiUrl(path);
  const token = getAccessToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  let res = await fetch(url, { ...options, headers });

  if (res.status === 401 && token) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${newToken}`;
      res = await fetch(url, { ...options, headers });
    }
  }

  const text = await res.text();
  let data: T;
  try {
    data = text ? (JSON.parse(text) as T) : ({} as T);
  } catch {
    throw { message: res.statusText || 'Request failed', status: res.status, data: text } as ApiError;
  }

  if (!res.ok) {
    const parsed = parseApiErrorBody(data);
    const err = data as { error?: string; detail?: unknown };
    const fallback =
      parsed ||
      (typeof err.error === 'string' ? err.error : null) ||
      (typeof err.detail === 'string' ? err.detail : null) ||
      res.statusText ||
      'Request failed';
    throw {
      message: fallback,
      status: res.status,
      data,
    } as ApiError;
  }

  return data;
}

export const api = {
  get: <T = unknown>(path: string) => apiRequest<T>(path, { method: 'GET' }),
  post: <T = unknown>(path: string, body?: unknown) =>
    apiRequest<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T = unknown>(path: string, body?: unknown) =>
    apiRequest<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  patch: <T = unknown>(path: string, body?: unknown) =>
    apiRequest<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T = unknown>(path: string) => apiRequest<T>(path, { method: 'DELETE' }),
};
