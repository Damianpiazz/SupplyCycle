---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Listar Reclamos
---

# TDD-0063: Listar Reclamos

## Contexto de Negocio (PRD)

### Objetivo
Consultar reclamos con filtros por cliente y fecha.

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Ver los reclamos registrados en el sistema.

### Contrato de API

- **Endpoint**: `GET /api/v1/reclamos`
- **Auth**: JWT
- **Query Params**: `?clienteId=&fechaDesde=&fechaHasta=&page=1&pageSize=20`

## Plan de Implementación

### Backend
1. Service: filtros dinámicos, paginación
2. Tests

### Mobile
3. FlatList con filtros
