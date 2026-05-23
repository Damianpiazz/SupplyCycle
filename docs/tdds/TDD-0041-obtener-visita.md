---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Obtener Visita
---

# TDD-0041: Obtener Visita

## Contexto de Negocio (PRD)

### Objetivo
Consultar los detalles de una visita específica.

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Verificar si un pedido fue visitado y por quién.

### Contrato de API

- **Endpoint**: `GET /api/v1/visitas/:id`
- **Auth**: JWT
- **Response** `200 OK`:
```json
{
  "data": {
    "id": 1,
    "fecha": "2026-05-23",
    "hora": "10:30",
    "falta": false,
    "pedido": { "id": 1, "estado": "entregado" },
    "empleado": { "id": 1, "nombre": "Carlos" }
  }
}
```

## Plan de Implementación

### Backend
1. Service: `prisma.visita.findUnique({ include: { pedido: true, empleado: true } })` → NOT_FOUND
2. Tests

### Mobile
3. Hook `useQuery`
