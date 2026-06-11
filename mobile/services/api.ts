import axios from 'axios';
import { getToken, clearToken } from '@/features/auth/services/authStorage';
import { useAuthStore } from '@/stores/authStore';
import { router } from 'expo-router';
import type { ApiResponse, ApiListResponse } from '@/types/api';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
const TIMEOUT = parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '15000', 10);

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Extrae `data` de una respuesta API envuelta en { data: T } (ADR-0000).
 * Uso: `unwrapResponse(await apiClient.get<ApiResponse<T>>('/ruta'))`
 */
export function unwrapResponse<T>(response: { data: ApiResponse<T> }): T {
  return response.data.data;
}

/**
 * Extrae `data` y `total` de una respuesta API con lista paginada.
 * Uso: `unwrapList(await apiClient.get<ApiListResponse<T>>('/ruta'))`
 */
export function unwrapList<T>(response: { data: ApiListResponse<T> }): { data: T[]; total: number } {
  return response.data;
}

// Request interceptor: attach JWT token
// Lee primero del store en memoria (más rápido, evita race conditions con SecureStore)
apiClient.interceptors.request.use(
  async (config) => {
    const fromStore = useAuthStore.getState().token;
    const token = fromStore ?? (await getToken());
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 -> logout
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await clearToken();
      useAuthStore.getState().logout();
      router.replace('/login');
    }
    return Promise.reject(error);
  }
);
