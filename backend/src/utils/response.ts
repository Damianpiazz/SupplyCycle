import type { Response } from 'express';

export function sendSuccess<T>(res: Response, data: T, statusCode = 200): void {
  res.status(statusCode).json({ data });
}

export function sendList<T>(res: Response, data: T[], total?: number): void {
  res.status(200).json({ data, total: total ?? data.length });
}
