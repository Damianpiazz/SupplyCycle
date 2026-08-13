import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';

export function apiKeyAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  // D3 (SPEC-07): Bearer JWT takes precedence over the BOT api key. Checked
  // BEFORE parsing the key so a key+JWT hybrid request is never downgraded to
  // BOT (which would deny ADMIN routes). Key-only requests keep flowing here.
  if (req.headers.authorization?.startsWith('Bearer ')) {
    return next();
  }

  const apiKey = req.headers['x-api-key'] as string | undefined;

  if (!apiKey) {
    return next();
  }

  if (!env.botApiKey) {
    console.error('BOT_API_KEY not configured');
    _res.status(500).json({
      error: {
        code: 'SERVER_ERROR',
        message: 'Error de configuración del servidor',
        timestamp: new Date().toISOString(),
      },
    });
    return;
  }

  if (apiKey !== env.botApiKey) {
    _res.status(401).json({
      error: {
        code: 'INVALID_API_KEY',
        message: 'API Key inválida',
        timestamp: new Date().toISOString(),
      },
    });
    return;
  }

  req.user = {
    userId: 'bot',
    email: 'bot@supplycycle.com',
    rol: 'BOT',
  } as any;

  next();
}
