---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Eliminar Empleado (Soft Delete)
---

# TDD-0048: Eliminar Empleado (Soft Delete)

## Contexto de Negocio (PRD)

### Objetivo
Dar de baja un empleado sin perder sus visitas históricas.

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Baja de un repartidor que ya no trabaja en la empresa.

### Contrato de API

- **Endpoint**: `DELETE /api/v1/empleados/:id`
- **Auth**: JWT (rol ADMIN)

## Plan de Implementación

### Backend
1. Soft delete con `deletedAt`
2. Tests

### Mobile
3. Botón con confirmación
