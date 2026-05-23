import { describe, it, expect } from 'vitest';
import { handleApiError } from '@/services/handleApiError';

describe('handleApiError', () => {
  it('should parse Axios error with response data', () => {
    const axiosError = {
      response: {
        status: 401,
        data: {
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Credenciales inválidas',
            timestamp: new Date().toISOString(),
          },
        },
      },
    };

    const result = handleApiError(axiosError);
    expect(result.message).toBe('Credenciales inválidas');
    expect(result.code).toBe('INVALID_CREDENTIALS');
    expect(result.status).toBe(401);
  });

  it('should handle Network Error', () => {
    const error = new Error('Network Error');
    const result = handleApiError(error);
    expect(result.message).toBe('No hay conexión con el servidor');
    expect(result.code).toBe('NETWORK_ERROR');
  });

  it('should handle unknown errors', () => {
    const result = handleApiError('unexpected string');
    expect(result.message).toBe('Error inesperado');
    expect(result.code).toBe('UNKNOWN_ERROR');
  });

  it('should handle errors without response data', () => {
    const axiosError = {
      response: {
        status: 500,
      },
    };

    const result = handleApiError(axiosError);
    expect(result.message).toBe('Error de conexión con el servidor');
    expect(result.code).toBe('CONNECTION_ERROR');
  });
});
