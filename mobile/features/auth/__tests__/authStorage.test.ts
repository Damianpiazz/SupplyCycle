import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock expo-secure-store
vi.mock('expo-secure-store', () => ({
  default: {
    setItemAsync: vi.fn(),
    getItemAsync: vi.fn(),
    deleteItemAsync: vi.fn(),
  },
  setItemAsync: vi.fn(),
  getItemAsync: vi.fn(),
  deleteItemAsync: vi.fn(),
}));

describe('authStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should save token', async () => {
    const { saveToken } = await import('@/features/auth/services/authStorage');
    await saveToken('test-token');
    const SecureStore = await import('expo-secure-store');
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('auth_token', 'test-token');
  });

  it('should get token', async () => {
    const SecureStore = await import('expo-secure-store');
    vi.mocked(SecureStore.getItemAsync).mockResolvedValue('stored-token');

    const { getToken } = await import('@/features/auth/services/authStorage');
    const token = await getToken();
    expect(token).toBe('stored-token');
    expect(SecureStore.getItemAsync).toHaveBeenCalledWith('auth_token');
  });

  it('should return null when no token', async () => {
    const SecureStore = await import('expo-secure-store');
    vi.mocked(SecureStore.getItemAsync).mockRejectedValue(new Error('No item'));

    const { getToken } = await import('@/features/auth/services/authStorage');
    const token = await getToken();
    expect(token).toBeNull();
  });

  it('should clear token', async () => {
    const { clearToken } = await import('@/features/auth/services/authStorage');
    await clearToken();
    const SecureStore = await import('expo-secure-store');
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_token');
  });
});
