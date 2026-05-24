import axios from 'axios';
import { getToken, clearToken } from '@/features/auth/services/authStorage';
import { useAuthStore } from '@/stores/authStore';
import { router } from 'expo-router';

const MOCK_TOKEN = 'mock-jwt-token-supplycycle-2026';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
const TIMEOUT = parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '15000', 10);

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
      const token = useAuthStore.getState().token;

      // Si es el token mock, NO hacer logout — estamos en desarrollo
      // y el backend no reconoce este token.
      // Dejamos que el error se propague para que cada hook lo maneje.
      if (token === MOCK_TOKEN) {
        return Promise.reject(error);
      }

      // Token real del backend -> logout automático
      await clearToken();
      useAuthStore.getState().logout();
      router.replace('/login');
    }
    return Promise.reject(error);
  }
);
