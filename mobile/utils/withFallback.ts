import axios from 'axios';

/**
 * Wraps an API call with a mock fallback.
 *
 * - If the API call succeeds, its result is returned.
 * - If the API call fails with a *network* error (ECONNREFUSED, timeout, etc.),
 *   the mock fallback is used instead.
 * - Other errors (4xx, 5xx) are re-thrown so the app can handle them normally.
 *
 * This lets the app work offline / without a backend during development,
 * but use real data whenever the backend is reachable.
 */
export async function withApiFallback<T>(
  apiCall: () => Promise<T>,
  mockFallback: () => Promise<T>,
): Promise<T> {
  try {
    return await apiCall();
  } catch (error: unknown) {
    // Network-level error (no response from server) -> fallback to mock
    if (axios.isAxiosError(error) && !error.response) {
      console.warn('[withApiFallback] Network error, using mock data:', error.message);
      return mockFallback();
    }
    throw error;
  }
}
