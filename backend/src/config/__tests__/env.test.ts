import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// dotenv must be neutralized: vi.stubEnv(name, undefined) DELETES the key, so
// dotenv/config would re-read backend/.env (which sets NODE_ENV + JWT_SECRET)
// on every dynamic import of env.js after vi.resetModules().
vi.mock('dotenv/config', () => ({}));

type EnvModule = typeof import('../env.js');

function loadEnv(): Promise<EnvModule> {
  return import('../env.js');
}

describe('env — production fail-fast (SPEC-10 C5)', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('throws when JWT_SECRET is missing in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('JWT_SECRET', undefined);
    vi.stubEnv('SESSION_SECRET', 'prod-session-secret');

    await expect(loadEnv()).rejects.toThrow('JWT_SECRET is required');
  });

  it('throws when SESSION_SECRET is missing in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('JWT_SECRET', 'prod-jwt-secret');
    vi.stubEnv('SESSION_SECRET', undefined);

    await expect(loadEnv()).rejects.toThrow('SESSION_SECRET is required');
  });

  it('loads with both secrets present in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('JWT_SECRET', 'prod-jwt-secret');
    vi.stubEnv('SESSION_SECRET', 'prod-session-secret');

    const { env } = await loadEnv();
    expect(env.nodeEnv).toBe('production');
    expect(env.jwtSecret).toBe('prod-jwt-secret');
    expect(env.sessionSecret).toBe('prod-session-secret');
  });

  it('keeps dev defaults when secrets are absent (non-production)', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('JWT_SECRET', undefined);
    vi.stubEnv('SESSION_SECRET', undefined);

    const { env } = await loadEnv();
    expect(env.nodeEnv).toBe('development');
    expect(env.jwtSecret).toBe('supplycycle-dev-secret');
    expect(env.sessionSecret).toBe('supplycycle-session-secret');
  });
});
