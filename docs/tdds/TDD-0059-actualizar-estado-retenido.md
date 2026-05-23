---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Actualizar Estado de Retenido
---

# TDD-0059: Actualizar Estado de Retenido

## Contexto de Negocio (PRD)

### Objetivo
Cambiar el estado de un retenido: `retenido` → `devuelto` o → `perdido`.

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Registrar que el cliente devolvió el envase o se declaró como perdido.

### Criterios de Aceptación
- Al marcar como `devuelto`, se setea `fin` con la fecha actual
- Al marcar como `perdido`, se setea `fin` con la fecha actual
- No se puede cambiar el estado de un retenido ya finalizado

### Contrato de API

- **Endpoint**: `PATCH /api/v1/retenidos/:id/estado`
- **Auth**: JWT (rol ADMIN)
- **Request Body**: `{ "estado": "devuelto" }`
- **Response** `200 OK`

## Plan de Implementación

### Backend
1. Schema Zod con estado válido (devuelto, perdido)
2. Service: verificar no finalizado → `prisma.retenido.update({ data: { estado, fin: new Date() } })`
3. Tests

### Mobile
4. Botones "Marcar devuelto" / "Marcar perdido"
