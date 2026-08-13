import jwt from 'jsonwebtoken';
import type { AllowedRole, JwtPayload } from '../middleware/auth.middleware.js';

/**
 * Dev JWT secret — matches the fallback used by src/config/env.ts when
 * JWT_SECRET is unset. Route tests must stub process.env.JWT_SECRET to this
 * value (or leave it unset) before importing the app (D6 route-test pattern).
 */
const DEV_JWT_SECRET = 'supplycycle-dev-secret';

/** Sign a JWT for a given role using the dev secret (D6 route-test pattern). */
export function makeToken(
  rol: AllowedRole,
  overrides: Partial<Pick<JwtPayload, 'userId' | 'email'>> = {}
): string {
  const payload: JwtPayload = {
    userId: overrides.userId ?? 'user-test',
    email: overrides.email ?? 'test@supplycycle.com',
    rol,
  };
  return jwt.sign(payload, DEV_JWT_SECRET, { expiresIn: '1h' });
}
