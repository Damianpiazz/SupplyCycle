import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import request from 'supertest';
import type { DestinationStream } from 'pino';

// ─── Mocks (hoisted by vitest; factories run on first import of each module) ─

const mockPrisma = {
  usuario: { findUnique: vi.fn() },
};

vi.mock('./lib/prisma.js', () => ({ prisma: mockPrisma }));

// Capture every line the app logs through the real buildLogger into an in-memory
// sink, so tests can assert what actually reached the transport (SPEC-02).
const logLines: string[] = [];
const sink: DestinationStream = {
  write(chunk: string) {
    logLines.push(chunk);
  },
};

vi.mock('./lib/logger.js', async (importOriginal) => {
  const mod = await importOriginal<typeof import('./lib/logger.js')>();
  return { ...mod, logger: mod.buildLogger(sink) };
});

// ─── Env set BEFORE the dynamic app import (D6) ───────────────────────────────
// dotenv never overrides an already-set process.env, so these assignments win.

process.env['NODE_ENV'] = 'test';
process.env['BOT_API_KEY'] = 'test-bot-key';
process.env['SESSION_SECRET'] = 'test-session-secret';
process.env['JWT_SECRET'] = 'supplycycle-dev-secret';

// ─── App (singleton, dynamically imported after env + mocks) ─────────────────

let app: import('express').Express;

beforeAll(async () => {
  const { default: appModule } = await import('./app.js');
  app = appModule;
}, 20000);

afterEach(() => {
  vi.clearAllMocks();
  logLines.length = 0;
});

// ─── Secrets used to prove nothing reaches the transport ──────────────────────

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.secret-token-value';
const API_KEY = 'sk-secret-api-key-value';
const SESSION_VALUE = 's%3Asecret-session-value';
const PASSWORD = 'hunter2-secret-password';

function joinedLines(): string {
  return logLines.join('\n');
}

// ─── SPEC-02 AC1/AC2: HTTP logging never leaks credentials ────────────────────

describe('HTTP logging — credential redaction (SPEC-02 AC1/AC2)', () => {
  it('logs a 500 on malformed JSON with a whitelisted error (no body/raw leak)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${TOKEN}`)
      .set('x-api-key', API_KEY)
      .set('Cookie', `connect.sid=${SESSION_VALUE}`)
      .send(`{"email":"user@example.com","password":"${PASSWORD}"`); // unclosed JSON

    expect(res.status).toBe(500);
    expect(logLines.length).toBeGreaterThan(0);

    // The only log line on this path comes from the error handler, and the err
    // serializer must be a whitelist: type/message/stack/statusCode, never body.
    const parsed = logLines.map((line) => JSON.parse(line) as Record<string, unknown>);
    const errLine = parsed.find((entry) => entry['err'] !== undefined)!;
    const serializedErr = errLine['err'] as Record<string, unknown>;

    expect(serializedErr['type']).toBe('entity.parse.failed');
    expect(serializedErr['statusCode']).toBe(400);
    expect(serializedErr).not.toHaveProperty('body');
    expect(serializedErr).not.toHaveProperty('raw');
    expect(joinedLines()).not.toContain(PASSWORD);
  });

  it('never logs the request body or credentials of a failed login (401)', async () => {
    mockPrisma.usuario.findUnique.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/v1/auth/login')
      .set('Authorization', `Bearer ${TOKEN}`)
      .set('x-api-key', API_KEY)
      .set('Cookie', `connect.sid=${SESSION_VALUE}`)
      .send({ email: 'user@example.com', password: PASSWORD });

    expect(res.status).toBe(401);
    expect(logLines.length).toBeGreaterThan(0);

    const joined = joinedLines();
    expect(joined).not.toContain(PASSWORD);
    expect(joined).not.toContain(TOKEN);
    expect(joined).not.toContain(API_KEY);
    expect(joined).not.toContain(SESSION_VALUE);
    expect(joined).toContain('[REDACTED]');
  });
});
