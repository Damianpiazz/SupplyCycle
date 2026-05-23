import type { AuthResponse, LoginCredentials, Usuario } from '@/types';

const MOCK_USUARIO: Usuario = {
  id: 'mock-user-001',
  email: 'repartidor@supplycycle.com',
  nombre: 'Juan',
  apellido: 'Pérez',
  rol: 'REPARTIDOR',
  activo: true,
};

const MOCK_TOKEN = 'mock-jwt-token-supplycycle-2026';

// Simulate network delay
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockLoginRequest(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  await delay(800);

  if (
    credentials.email === 'repartidor@supplycycle.com' &&
    credentials.password === '12345678'
  ) {
    return {
      token: MOCK_TOKEN,
      usuario: MOCK_USUARIO,
    };
  }

  throw {
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
}

export async function mockGetMeRequest(): Promise<Usuario> {
  await delay(300);
  return MOCK_USUARIO;
}
