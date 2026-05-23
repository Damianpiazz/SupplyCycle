---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Crear Reclamo
---

# TDD-0061: Crear Reclamo

## Contexto de Negocio (PRD)

### Objetivo
Registrar un reclamo de un cliente.

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Cargar un reclamo que un cliente realizó.

### Criterios de Aceptación
- El reclamo se asocia a un cliente existente
- El cliente debe estar activo

## Diseño Técnico (RFC)

### Modelo de Datos

**Reclamo**

| Campo | Tipo | Restricciones |
|---|---|---|
| id | Int | PK, autoincrement |
| clienteId | Int | FK -> Cliente |
| createdAt | DateTime | @default(now()) |

### Contrato de API

- **Endpoint**: `POST /api/v1/reclamos`
- **Auth**: JWT (rol ADMIN)
- **Request Body**: `{ "clienteId": 1 }`
- **Response** `201 Created`

## Plan de Implementación

### Backend
1. Schema Zod
2. Service: verificar cliente activo → `prisma.reclamo.create()`
3. Tests

### Mobile
4. Botón "Nuevo reclamo" en detalle del cliente
5. Mutation, invalidar reclamos del cliente
