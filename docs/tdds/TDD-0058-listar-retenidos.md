---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Listar Retenidos
---

# TDD-0058: Listar Retenidos

## Contexto de Negocio (PRD)

### Objetivo
Consultar todos los productos retenidos, con filtros por cliente, producto y estado.

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Ver qué clientes tienen envases retenidos sin devolver.

### Contrato de API

- **Endpoint**: `GET /api/v1/retenidos`
- **Auth**: JWT
- **Query Params**: `?clienteId=&productoId=&estado=&page=1&pageSize=20`

## Plan de Implementación

### Backend
1. Service: filtros dinámicos, paginación
2. Tests

### Mobile
3. FlatList con filtros
