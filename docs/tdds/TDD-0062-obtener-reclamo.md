---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Obtener Reclamo
---

# TDD-0062: Obtener Reclamo

## Contexto de Negocio (PRD)

### Objetivo
Consultar un reclamo específico.

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Ver el detalle de un reclamo.

### Contrato de API

- **Endpoint**: `GET /api/v1/reclamos/:id`
- **Auth**: JWT
- **Response** `200 OK`

## Plan de Implementación

### Backend
1. Service: `prisma.reclamo.findUnique({ include: { cliente: true } })`
2. Tests

### Mobile
3. Hook `useQuery`
