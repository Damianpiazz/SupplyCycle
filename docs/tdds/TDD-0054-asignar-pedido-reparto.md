---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Asignar Pedido a Reparto
---

# TDD-0054: Asignar Pedido a Reparto

## Contexto de Negocio (PRD)

### Objetivo
Agregar un pedido pendiente a un reparto existente.

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Asignar un pedido nuevo a un reparto ya planificado.

### Criterios de Aceptación
- Solo se pueden asignar pedidos en estado `pendiente`
- El reparto no debe estar iniciado o finalizado

### Contrato de API

- **Endpoint**: `POST /api/v1/repartos/:repartoId/pedidos`
- **Auth**: JWT (rol ADMIN)
- **Request Body**: `{ "pedidoId": 4 }`

## Plan de Implementación

### Backend
1. Service: verificar reparto no iniciado → verificar pedido pendiente → `prisma.pedido.update({ where: { id }, data: { repartoId } })`
2. Tests

### Mobile
3. Selector de pedidos en el detalle del reparto
