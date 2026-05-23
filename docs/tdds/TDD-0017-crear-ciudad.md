---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Crear Ciudad
---

# TDD-0017: Crear Ciudad

## Contexto de Negocio (PRD)

### Objetivo
Permitir registrar una nueva ciudad en el catálogo para asociarla a domicilios.

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Agregar una ciudad donde la empresa realiza repartos.

### Criterios de Aceptación
- El sistema debe crear la ciudad con nombre único
- Debe rechazar si el nombre ya existe o está vacío

## Diseño Técnico (RFC)

### Modelo de Datos

**Ciudad**

| Campo | Tipo | Restricciones |
|---|---|---|
| id | Int | PK, autoincrement |
| nombre | String | UNIQUE, NOT NULL |

### Contrato de API

- **Endpoint**: `POST /api/v1/ciudades`
- **Auth**: JWT (rol ADMIN)
- **Request Body**: `{ "nombre": "Córdoba" }`
- **Response** `201 Created`: `{ "data": { "id": 1, "nombre": "Córdoba" } }`

## Plan de Implementación

### Backend
1. Schema Zod con nombre requerido
2. Service: verificar unicidad → `prisma.ciudad.create()`
3. Ruta `POST /` con auth ADMIN
4. Tests

### Mobile
5. Formulario simple con input de texto
6. Mutation, invalidar lista de ciudades
