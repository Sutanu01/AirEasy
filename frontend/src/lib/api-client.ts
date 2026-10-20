import { ApiResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

let accessToken: string | null = null;
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  if (typeof window !== 'undefined') {
    if (token) {
      localStorage.setItem('aireasy_access_token', token);
    } else {
      localStorage.removeItem('aireasy_access_token');
    }
  }
};

export const getAccessToken = (): string | null => {
  if (accessToken) return accessToken;
  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('aireasy_access_token');
  }
  return accessToken;
};

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions extends RequestInit {
  idempotencyKey?: string;
  skipAuth?: boolean;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  const token = getAccessToken();
  if (token && !options.skipAuth) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (options.idempotencyKey) {
    headers['x-idempotency-key'] = options.idempotencyKey;
  }

  const fetchOptions: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Needed for refresh cookie 'jid'
  };

  try {
    const response = await fetch(url, fetchOptions);

    // If 401 Unauthorized and not already refreshing or calling auth endpoint
    if (response.status === 401 && !options.skipAuth && !endpoint.includes('/auth/')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          headers['Authorization'] = `Bearer ${newToken}`;
          return fetch(url, { ...fetchOptions, headers }).then((res) => res.json());
        });
      }

      isRefreshing = true;

      try {
        const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!refreshRes.ok) {
          throw new Error('Refresh token expired');
        }

        const refreshData: ApiResponse<{ accessToken: string }> = await refreshRes.json();
        const newToken = refreshData.data.accessToken;
        setAccessToken(newToken);
        processQueue(null, newToken);

        headers['Authorization'] = `Bearer ${newToken}`;
        const retryRes = await fetch(url, { ...fetchOptions, headers });
        return await retryRes.json();
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        setAccessToken(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('aireasy_user');
          window.dispatchEvent(new Event('aireasy_auth_change'));
        }
        throw new ApiError('Session expired. Please log in again.', 401);
      } finally {
        isRefreshing = false;
      }
    }

    const data = await response.json();

    if (!response.ok) {
      const errorMsg =
        data?.error?.explanation ||
        data?.message ||
        `Request failed with status ${response.status}`;
      const message = Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg;
      throw new ApiError(message, response.status, data);
    }

    return data as ApiResponse<T>;
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || 'Network error occurred', 500);
  }
}
