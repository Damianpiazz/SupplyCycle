import type { ApiError } from '@/types';

interface ParsedError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, string[]>;
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
