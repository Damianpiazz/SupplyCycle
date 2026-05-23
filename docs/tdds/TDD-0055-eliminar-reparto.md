---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Eliminar Reparto
---

# TDD-0055: Eliminar Reparto

## Contexto de Negocio (PRD)

### Objetivo
Eliminar un reparto planificado. Los pedidos asignados se desvinculan del reparto.

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Cancelar un reparto planificado y reasignar sus pedidos.

### Criterios de Aceptación
- Solo se puede eliminar un reparto no iniciado
- Los pedidos asignados quedan sin reparto (repartoId = null)
- Se usa soft delete

### Contrato de API

- **Endpoint**: `DELETE /api/v1/repartos/:id`
- **Auth**: JWT (rol ADMIN)

## Plan de Implementación

### Backend
1. Service: verificar reparto no iniciado → `prisma.pedido.updateMany({ where: { repartoId: id }, data: { repartoId: null } })` → `prisma.reparto.update({ data: { deletedAt: new Date() } })`
2. Tests

### Mobile
3. Botón con confirmación
