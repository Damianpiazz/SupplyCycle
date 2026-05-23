import { describe, it, expect } from 'vitest';
import { mockLoginRequest, mockGetMeRequest } from '@/features/auth/services/mockAuthService';

describe('mockAuthService', () => {
  it('should login successfully with valid credentials', async () => {
    const result = await mockLoginRequest({
      email: 'repartidor@supplycycle.com',
      password: '12345678',
    });

    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('usuario');
    expect(result.usuario.email).toBe('repartidor@supplycycle.com');
    expect(result.usuario.rol).toBe('REPARTIDOR');
    expect(result.usuario.nombre).toBe('Juan');
    expect(result.usuario.apellido).toBe('Pérez');
  });

  it('should reject invalid email', async () => {
    await expect(
      mockLoginRequest({
        email: 'wrong@email.com',
        password: '12345678',
      })
    ).rejects.toThrow();
  });

  it('should reject invalid password', async () => {
    await expect(
      mockLoginRequest({
        email: 'repartidor@supplycycle.com',
        password: 'wrong-password',
      })
    ).rejects.toThrow();
  });

  it('should return usuario for getMeRequest', async () => {
    const usuario = await mockGetMeRequest();
    expect(usuario.email).toBe('repartidor@supplycycle.com');
    expect(usuario.rol).toBe('REPARTIDOR');
    expect(usuario.activo).toBe(true);
  });
});
