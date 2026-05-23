---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Actualizar Estado de Pedido
---

# TDD-0034: Actualizar Estado de Pedido

## Contexto de Negocio (PRD)

### Objetivo
Cambiar el estado de un pedido a lo largo de su ciclo de vida: `pendiente` → `en_ruta` → `entregado`.

### User Persona
- **Nombre**: Administrador / Repartidor
- **Necesidad**: Marcar un pedido como entregado después de la visita.

### Criterios de Aceptación
- Solo se puede avanzar al siguiente estado (no retroceder)
- `pendiente` → `en_ruta` → `entregado`
- No se puede cambiar el estado de un pedido cancelado

## Diseño Técnico (RFC)

### Máquina de Estados

```
pendiente ──→ en_ruta ──→ entregado
     │                     
     └──→ cancelado        
```

### Contrato de API

- **Endpoint**: `PATCH /api/v1/pedidos/:id/estado`
- **Auth**: JWT (rol ADMIN o REPARTIDOR)
- **Request Body**: `{ "estado": "entregado" }`
- **Response** `200 OK`
- **Response** `409 Conflict` si la transición no es válida:
```json
{
  "error": { "code": "CONFLICT", "message": "No se puede cambiar de 'cancelado' a 'entregado'" }
}
```

## Plan de Implementación

### Backend
1. Schema Zod con estado válido
2. Service: `updateEstado(id, nuevoEstado)` → obtener estado actual → validar transición permitida → `prisma.pedido.update()`
3. Ruta PATCH con authMiddleware + validación de transiciones
4. Tests: transiciones válidas, inválidas, pedido cancelado

### Mobile
5. Botones de acción según estado actual (ej: "Marcar entregado")
6. Mutation, invalidar query del pedido y lista
