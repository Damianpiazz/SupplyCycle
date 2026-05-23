---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Actualizar Producto
---

# TDD-0029: Actualizar Producto

## Contexto de Negocio (PRD)

### Objetivo
Modificar los datos de un producto existente (precio, stock, descripción).

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Actualizar el precio de un producto o ajustar el stock.

### Contrato de API

- **Endpoint**: `PATCH /api/v1/productos/:id`
- **Auth**: JWT (rol ADMIN)
- **Request Body**: `{ "precio": 1800, "stock": 80 }`

## Plan de Implementación

### Backend
1. Schema con campos opcionales
2. Service: verificar existencia + nombre único si cambia → update
3. Ruta PATCH con auth ADMIN
4. Tests

### Mobile
5. Pantalla de edición con datos precargados
