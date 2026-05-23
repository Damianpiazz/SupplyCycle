---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Cancelar Pedido
---

# TDD-0035: Cancelar Pedido

## Contexto de Negocio (PRD)

### Objetivo
Permitir cancelar un pedido que aún no fue entregado. Un pedido cancelado no puede cambiar a otro estado.

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Cancelar un pedido porque el cliente se arrepintió o hubo un error.

### Criterios de Aceptación
- Solo se puede cancelar un pedido en estado `pendiente`
- Un pedido cancelado no puede cambiar a otro estado

### Contrato de API

- **Endpoint**: `POST /api/v1/pedidos/:id/cancelar`
- **Auth**: JWT (rol ADMIN)
- **Response** `200 OK`:
```json
{ "data": { "id": 1, "estado": "cancelado" } }
```

## Plan de Implementación

### Backend
1. Service: verificar estado `pendiente` → `prisma.pedido.update({ data: { estado: 'cancelado' } })`
2. Si ya está cancelado o entregado, throw CONFLICT
3. Tests

### Mobile
4. Botón "Cancelar pedido" solo visible en estado pendiente
5. Confirmación antes de cancelar
