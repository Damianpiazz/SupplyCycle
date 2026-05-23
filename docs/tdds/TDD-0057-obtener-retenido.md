---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Obtener Retenido
---

# TDD-0057: Obtener Retenido

## Contexto de Negocio (PRD)

### Objetivo
Consultar un registro de retenido específico.

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Ver el detalle de un envase retenido.

### Contrato de API

- **Endpoint**: `GET /api/v1/retenidos/:id`
- **Auth**: JWT
- **Response** `200 OK`:
```json
{
  "data": {
    "id": 1,
    "estado": "retenido",
    "inicio": "2026-05-22",
    "producto": { "id": 1, "nombre": "Bidón 20L" },
    "cliente": { "id": 1, "nombre": "Juan Pérez" }
  }
}
```

## Plan de Implementación

### Backend
1. Service: `prisma.retenido.findUnique({ include: { producto: true, cliente: true } })` → NOT_FOUND
2. Tests

### Mobile
3. Hook `useQuery`
