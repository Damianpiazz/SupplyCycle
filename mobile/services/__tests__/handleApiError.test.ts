import { describe, it, expect } from 'vitest';
import { handleApiError, isNetworkError } from '@/services/handleApiError';

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

describe('isNetworkError', () => {
  it('returns true for Axios error without response (network error)', () => {
    const error = { isAxiosError: true, response: undefined, message: 'Network Error' };
    expect(isNetworkError(error)).toBe(true);
  });

  it('returns false for Axios error with response (HTTP error)', () => {
    const error = { isAxiosError: true, response: { status: 500 }, message: 'Internal Server Error' };
    expect(isNetworkError(error)).toBe(false);
  });

  it('returns true for native Error with Network Error message', () => {
    const error = new Error('Network Error');
    expect(isNetworkError(error)).toBe(true);
  });

  it('returns false for native Error without Network Error message', () => {
    const error = new Error('Something went wrong');
    expect(isNetworkError(error)).toBe(false);
  });

  it('returns false for non-error values', () => {
    expect(isNetworkError('string')).toBe(false);
    expect(isNetworkError(null)).toBe(false);
    expect(isNetworkError(undefined)).toBe(false);
  });
});
