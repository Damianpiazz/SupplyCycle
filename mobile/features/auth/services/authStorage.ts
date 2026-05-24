import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';

// Detectamos si expo-secure-store está disponible en esta plataforma.
// En web, el módulo existe pero las funciones nativas no están implementadas.
function isSecureStoreAvailable(): boolean {
  try {
    return typeof SecureStore.setItemAsync === 'function';
  } catch {
    return false;
  }
}

const useSecureStore = isSecureStoreAvailable();

export async function saveToken(token: string): Promise<void> {
  if (useSecureStore) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  } else {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export async function getToken(): Promise<string | null> {
  try {
    if (useSecureStore) {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    }
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function clearToken(): Promise<void> {
  if (useSecureStore) {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}
