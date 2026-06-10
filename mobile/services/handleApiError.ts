import type { ApiError } from '@/types';
import axios from 'axios';

interface ParsedError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, string[]>;
}

/**
 * Detecta si un error es de red (sin conexión, timeout, DNS, etc.)
 * vs un error HTTP del servidor (4xx, 5xx).
 */
export function isNetworkError(error: unknown): boolean {
  if (axios.isAxiosError(error)) {
    // Si tiene response, es un error HTTP del servidor (4xx/5xx)
    if (error.response) return false;
    // Sin response = error de red/timeout
    return true;
  }
  // Errores no-Axios (fetch, etc.) - tratar como red si no hay más info
  if (error instanceof Error) {
    return error.message === 'Network Error' || error.message.includes('ERR_NETWORK');
  }
  return false;
}

export function handleApiError(error: unknown): ParsedError {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as {
      response?: { status: number; data?: ApiError };
    };
    if (axiosError.response?.data?.error) {
      const apiError = axiosError.response.data.error;
      return {
        message: apiError.message || 'Error del servidor',
        code: apiError.code || 'UNKNOWN_ERROR',
        status: axiosError.response.status,
        details: apiError.details,
      };
    }
    return {
      message: 'Error de conexión con el servidor',
      code: 'CONNECTION_ERROR',
      status: axiosError.response?.status || 0,
    };
  }

  if (error instanceof Error) {
    if (error.message === 'Network Error') {
      return {
        message: 'No hay conexión con el servidor',
        code: 'NETWORK_ERROR',
        status: 0,
      };
    }
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
      status: 0,
    };
  }

  return {
    message: 'Error inesperado',
    code: 'UNKNOWN_ERROR',
    status: 0,
  };
}
