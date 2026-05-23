---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Listar Empleados
---

# TDD-0046: Listar Empleados

## Contexto de Negocio (PRD)

### Objetivo
Consultar todos los empleados registrados.

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Seleccionar un repartidor para asignarlo a un reparto.

### Contrato de API

- **Endpoint**: `GET /api/v1/empleados`
- **Auth**: JWT
- **Query Params**: `?search=&page=1&pageSize=20`

## Plan de Implementación

### Backend
1. Service: filtro search por nombre/apellido, paginación
2. Tests

### Mobile
3. FlatList con search
4. Selector en formulario de reparto
