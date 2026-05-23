---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Eliminar Reclamo
---

# TDD-0064: Eliminar Reclamo

## Contexto de Negocio (PRD)

### Objetivo
Eliminar un reclamo.

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Quitar un reclamo mal cargado o resuelto.

### Contrato de API

- **Endpoint**: `DELETE /api/v1/reclamos/:id`
- **Auth**: JWT (rol ADMIN)

## Plan de Implementación

### Backend
1. Service: `prisma.reclamo.delete()`
2. Tests

### Mobile
3. Botón con confirmación
