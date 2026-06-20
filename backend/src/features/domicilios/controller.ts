import type { Request, Response, NextFunction } from 'express';
import {
  domicilioSchema,
  actualizarDomicilioSchema,
  crearDiaSchema,
  actualizarDiaSchema,
  crearHorarioSchema,
  actualizarHorarioSchema,
} from './schema.js';
import * as domiciliosService from './service.js';
import { sendSuccess, sendList } from '../../utils/response.js';

export async function listarController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const clienteId = typeof req.query.clienteId === 'string' ? req.query.clienteId : undefined;
    const result = await domiciliosService.listarDomicilios(clienteId);
    sendList(res, result);
  } catch (err) {
    next(err);
  }
}

export async function obtenerController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const result = await domiciliosService.obtenerDomicilio(id);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function crearController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = domicilioSchema.parse(req.body);
    const result = await domiciliosService.crearDomicilio(input);
    sendSuccess(res, result, 201);
  } catch (err) {
    next(err);
  }
}

export async function actualizarController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const input = actualizarDomicilioSchema.parse(req.body);
    const result = await domiciliosService.actualizarDomicilio(id, input);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function eliminarController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const result = await domiciliosService.eliminarDomicilio(id);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

// ─── Días ────────────────────────────────────────────────────────────────────

export async function agregarDiaController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const domicilioId = req.params['domicilioId'] as string;
    const input = crearDiaSchema.parse(req.body);
    const result = await domiciliosService.agregarDia(domicilioId, input);
    sendSuccess(res, result, 201);
  } catch (err) {
    next(err);
  }
}

export async function actualizarDiaController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['diaId'] as string;
    const input = actualizarDiaSchema.parse(req.body);
    const result = await domiciliosService.actualizarDia(id, input);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function eliminarDiaController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['diaId'] as string;
    const result = await domiciliosService.eliminarDia(id);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

// ─── Horarios ────────────────────────────────────────────────────────────────

export async function agregarHorarioController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const diaId = req.params['diaId'] as string;
    const input = crearHorarioSchema.parse(req.body);
    const result = await domiciliosService.agregarHorario(diaId, input);
    sendSuccess(res, result, 201);
  } catch (err) {
    next(err);
  }
}

export async function actualizarHorarioController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['horarioId'] as string;
    const input = actualizarHorarioSchema.parse(req.body);
    const result = await domiciliosService.actualizarHorario(id, input);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function eliminarHorarioController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['horarioId'] as string;
    const result = await domiciliosService.eliminarHorario(id);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}
