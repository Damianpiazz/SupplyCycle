---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Asignar Día de Visita a Domicilio
---

# TDD-0022: Asignar Día de Visita a Domicilio

## Contexto de Negocio (PRD)

### Objetivo
Asignar un día de la semana en que se visita un domicilio para planificar las rutas de reparto.

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Configurar qué días se le entrega pedido a un cliente.

### Criterios de Aceptación
- El sistema debe crear un registro Dia asociado al domicilio
- Debe rechazar si el domicilio no existe
- El día debe ser un valor válido del enum DiaSemana

## Diseño Técnico (RFC)

### Modelo de Datos

**Dia**

| Campo | Tipo | Restricciones |
|---|---|---|
| id | Int | PK, autoincrement |
| nombre | DiaSemana | NOT NULL |
| domicilioId | Int | FK -> Domicilio, NOT NULL |

### Contrato de API

- **Endpoint**: `POST /api/v1/domicilios/:domicilioId/dias`
- **Auth**: JWT (rol ADMIN)
- **Request Body**: `{ "nombre": "lunes" }`
- **Response** `201 Created`:
```json
{ "data": { "id": 1, "nombre": "lunes", "horarios": [] } }
```

## Plan de Implementación

### Backend
1. Schema Zod con nombre enum DiaSemana
2. Service: verificar domicilio → `prisma.dia.create()`
3. Ruta POST con auth ADMIN
4. Tests

### Mobile
5. Selector de día en formulario del domicilio
6. Mutation, invalidar query del domicilio
