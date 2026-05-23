---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Obtener Empleado
---

# TDD-0045: Obtener Empleado

## Contexto de Negocio (PRD)

### Objetivo
Consultar los datos de un empleado específico.

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Ver los datos de un repartidor.

### Contrato de API

- **Endpoint**: `GET /api/v1/empleados/:id`
- **Auth**: JWT
- **Response** `200 OK`

## Plan de Implementación

### Backend
1. Service: `prisma.empleado.findUnique()` → NOT_FOUND
2. Tests

### Mobile
3. Hook `useQuery`
