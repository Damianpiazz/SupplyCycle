---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Crear Empleado
---

# TDD-0044: Crear Empleado

## Contexto de Negocio (PRD)

### Objetivo
Registrar un nuevo empleado (repartidor) en el sistema.

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Dar de alta un nuevo repartidor.

### Criterios de Aceptación
- El sistema debe crear el empleado con nombre, apellido y DNI
- El DNI debe ser único

## Diseño Técnico (RFC)

### Modelo de Datos

**Empleado**

| Campo | Tipo | Restricciones |
|---|---|---|
| id | Int | PK, autoincrement |
| nombre | String | NOT NULL |
| apellido | String | NOT NULL |
| dni | String | UNIQUE, NOT NULL |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |
| deletedAt | DateTime? | |

### Contrato de API

- **Endpoint**: `POST /api/v1/empleados`
- **Auth**: JWT (rol ADMIN)
- **Request Body**: `{ "nombre": "Carlos", "apellido": "Gómez", "dni": "12345678" }`
- **Response** `201 Created`

## Plan de Implementación

### Backend
1. Schema Zod
2. Service: verificar DNI único → create
3. Tests

### Mobile
5. Formulario simple
6. Mutation
