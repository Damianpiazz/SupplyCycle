import pino from 'pino';
import type { DestinationStream } from 'pino';
import { env } from '../config/env.js';

/**
 * Sensitive request fields redacted by pino (SPEC-02). The `*.password` entry
 * covers depth-1 password keys; NESTED password keys are handled by the deep
 * scrub inside `serializeReq` (pino's wildcard does not recurse in v10).
 */
export const REDACT_PATHS = [
  'req.headers.authorization',
  'req.headers["x-api-key"]',
  'req.headers.cookie',
  'req.body.password',
  '*.password',
] as const;

/** Shared censor value used by pino redact and the serializeReq deep scrub. */
export const REDACT_CENSOR = '[REDACTED]';

const SENSITIVE_HEADERS = ['authorization', 'x-api-key', 'cookie'] as const;

interface ErrorWithMeta extends Error {
  type?: string;
  code?: unknown;
  statusCode?: unknown;
}

export interface SerializedError {
  type: string;
  message: string;
  stack: string;
  code?: unknown;
  statusCode?: unknown;
}

/**
 * Error whitelist (design D4): only known-safe fields are copied. Never copies
 * `err.body` / `err.raw` (body-parser attaches the raw request body to errors),
 * which is what kept leaking credentials into production logs.
 */
export function serializeError(err: Error): SerializedError {
  const meta = err as ErrorWithMeta;
  return {
    type: meta.type ?? 'Error',
    message: err.message,
    stack: err.stack ?? '',
    ...(meta.code !== undefined && { code: meta.code }),
    ...(meta.statusCode !== undefined && { statusCode: meta.statusCode }),
  };
}

interface ReqForSerializer {
  method?: unknown;
  url?: unknown;
  headers?: Record<string, unknown>;
  body?: unknown;
}

/** Recursively censor any key named "password" at any depth (SPEC-02 "nested *.password"). */
function deepRedactPasswords(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(deepRedactPasswords);
  }
  if (value !== null && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      out[key] = key === 'password' ? REDACT_CENSOR : deepRedactPasswords(val);
    }
    return out;
  }
  return value;
}

/**
 * Redact-only request serializer (SPEC-02 AC1/AC2): keeps method/url/headers/body
 * for debug (user-agent preserved — not a header whitelist) but censors sensitive
 * headers and any (nested) password key. pino redact paths stay as
 * defense-in-depth for raw req-shaped log objects.
 */
export function serializeReq(req: ReqForSerializer): {
  method: unknown;
  url: unknown;
  headers: Record<string, unknown>;
  body: unknown;
} {
  const headers: Record<string, unknown> = { ...req.headers };
  for (const header of SENSITIVE_HEADERS) {
    if (header in headers) headers[header] = REDACT_CENSOR;
  }
  return {
    method: req.method,
    url: req.url,
    headers,
    body: deepRedactPasswords(req.body),
  };
}

/** Build a logger with credential redaction + error whitelist (design D4). */
export function buildLogger(stream?: DestinationStream): pino.Logger {
  return pino(
    {
      level: env.logLevel,
      redact: { paths: [...REDACT_PATHS], censor: REDACT_CENSOR },
      serializers: { err: serializeError, req: serializeReq },
      // Pretty transport is dev-only; also skipped when an explicit stream is
      // passed (tests) to avoid spawning a dormant pino-pretty worker.
      ...(env.nodeEnv === 'development' && !stream
        ? {
            transport: {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'HH:MM:ss.l',
                ignore: 'pid,hostname',
              },
            },
          }
        : {}),
    },
    stream,
  );
}

export const logger = buildLogger();
