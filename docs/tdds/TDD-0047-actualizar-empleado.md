---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Actualizar Empleado
---

# TDD-0047: Actualizar Empleado

## Contexto de Negocio (PRD)

### Objetivo
Modificar los datos de un empleado existente.

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Corregir el nombre o apellido de un empleado.

### Contrato de API

- **Endpoint**: `PATCH /api/v1/empleados/:id`
- **Auth**: JWT (rol ADMIN)

## Plan de Implementación

### Backend
1. Schema con campos opcionales
2. Service: verificar DNI único si cambia
3. Tests

### Mobile
4. Pantalla de edición
