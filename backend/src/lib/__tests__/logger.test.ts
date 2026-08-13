import { describe, it, expect } from 'vitest';
import type { DestinationStream } from 'pino';
import { buildLogger, serializeReq, REDACT_CENSOR } from '../logger.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** In-memory pino destination: any object with write() is a valid stream (pino v10). */
function createSink(): { lines: string[]; stream: DestinationStream } {
  const lines: string[] = [];
  const stream: DestinationStream = {
    write(chunk: string) {
      lines.push(chunk);
    },
  };
  return { lines, stream };
}

function parseLines(lines: string[]): Record<string, unknown>[] {
  return lines.map((line) => JSON.parse(line) as Record<string, unknown>);
}

// ─── SPEC-02 TDD-0060 (a): error whitelist ────────────────────────────────────

describe('buildLogger — serializeError whitelist (SPEC-02 TDD-0060)', () => {
  it('drops body/raw keys and never logs the plaintext carried in err.body', () => {
    const { lines, stream } = createSink();
    const logger = buildLogger(stream);

    const err = Object.assign(new Error('boom'), {
      body: '{"password":"hunter2"}',
      raw: { password: 'hunter2' },
      code: 'INTERNAL_ERROR',
      statusCode: 500,
    });

    logger.error({ err });

    expect(lines).toHaveLength(1);
    const line = lines[0]!;
    const serialized = parseLines(lines)[0]!['err'] as Record<string, unknown>;

    expect(serialized).toEqual({
      type: 'Error',
      message: 'boom',
      stack: expect.any(String),
      code: 'INTERNAL_ERROR',
      statusCode: 500,
    });
    expect(serialized).not.toHaveProperty('body');
    expect(serialized).not.toHaveProperty('raw');
    expect(line).not.toContain('hunter2');
  });

  it('serializes plain errors with exactly {type, message, stack}', () => {
    const { lines, stream } = createSink();
    const logger = buildLogger(stream);

    logger.error({ err: new Error('boom') });

    const serialized = parseLines(lines)[0]!['err'] as Record<string, unknown>;
    expect(Object.keys(serialized).sort()).toEqual(['message', 'stack', 'type']);
    expect(serialized['type']).toBe('Error');
    expect(serialized['message']).toBe('boom');
    expect(serialized['stack']).toEqual(expect.any(String));
  });
});

// ─── SPEC-02 TDD-0060 (b): request redaction ──────────────────────────────────

describe('buildLogger — request redaction (SPEC-02 AC1/AC2)', () => {
  it('serializeReq redacts sensitive headers and nested *.password, keeping user-agent', () => {
    const { lines, stream } = createSink();
    const logger = buildLogger(stream);

    logger.info({
      req: serializeReq({
        method: 'POST',
        url: '/api/v1/auth/login',
        headers: {
          authorization: 'Bearer supersecret-token',
          'x-api-key': 'secret-api-key',
          cookie: 'connect.sid=secret-session',
          'user-agent': 'Mozilla/5.0 test-agent',
        },
        body: {
          email: 'user@example.com',
          password: 'hunter2',
          profile: { password: 'nested-secret' },
        },
      }),
    });

    expect(lines).toHaveLength(1);
    const line = lines[0]!;
    const req = parseLines(lines)[0]!['req'] as {
      headers: Record<string, unknown>;
      body: Record<string, unknown>;
    };

    expect(req.headers['authorization']).toBe(REDACT_CENSOR);
    expect(req.headers['x-api-key']).toBe(REDACT_CENSOR);
    expect(req.headers['cookie']).toBe(REDACT_CENSOR);
    expect(req.headers['user-agent']).toBe('Mozilla/5.0 test-agent');
    expect(req.body['password']).toBe(REDACT_CENSOR);
    expect((req.body['profile'] as Record<string, unknown>)['password']).toBe(REDACT_CENSOR);

    expect(line).not.toContain('supersecret-token');
    expect(line).not.toContain('secret-api-key');
    expect(line).not.toContain('secret-session');
    expect(line).not.toContain('hunter2');
    expect(line).not.toContain('nested-secret');
  });

  it('REDACT_PATHS censor raw req-shaped objects as defense-in-depth', () => {
    const { lines, stream } = createSink();
    const logger = buildLogger(stream);

    logger.info({
      req: {
        method: 'POST',
        url: '/api/v1/auth/login',
        headers: {
          authorization: 'Bearer raw-token',
          'x-api-key': 'raw-key',
          cookie: 'raw-session',
          'user-agent': 'Mozilla/5.0 raw-agent',
        },
        body: { password: 'raw-password' },
      },
    });

    const req = parseLines(lines)[0]!['req'] as {
      headers: Record<string, unknown>;
      body: Record<string, unknown>;
    };
    expect(req.headers['authorization']).toBe(REDACT_CENSOR);
    expect(req.headers['x-api-key']).toBe(REDACT_CENSOR);
    expect(req.headers['cookie']).toBe(REDACT_CENSOR);
    expect(req.headers['user-agent']).toBe('Mozilla/5.0 raw-agent');
    expect(req.body['password']).toBe(REDACT_CENSOR);

    const line = lines[0]!;
    expect(line).not.toContain('raw-token');
    expect(line).not.toContain('raw-key');
    expect(line).not.toContain('raw-session');
    expect(line).not.toContain('raw-password');
  });
});
