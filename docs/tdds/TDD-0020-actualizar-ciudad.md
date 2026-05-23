---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Actualizar Ciudad
---

# TDD-0020: Actualizar Ciudad

## Contexto de Negocio (PRD)

### Objetivo
Modificar el nombre de una ciudad existente.

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Corregir el nombre de una ciudad mal cargada.

### Contrato de API

- **Endpoint**: `PATCH /api/v1/ciudades/:id`
- **Auth**: JWT (rol ADMIN)
- **Request Body**: `{ "nombre": "Córdoba Capital" }`

## Plan de Implementación

### Backend
1. Schema: nombre opcional
2. Service: verificar unicidad si cambia nombre → update
3. Ruta con auth ADMIN
4. Tests

### Mobile
5. Pantalla de edición simple
