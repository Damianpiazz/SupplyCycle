---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Crear Reparto
---

# TDD-0049: Crear Reparto

## Contexto de Negocio (PRD)

### Objetivo
Crear una hoja de ruta que agrupa pedidos para ser entregados en una misma fecha por un repartidor.

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Planificar los pedidos del día asignándolos a un reparto.

### Criterios de Aceptación
- El sistema debe crear el reparto con fecha, inicio y fin opcionales
- Debe permitir asignar pedidos pendientes al reparto

## Diseño Técnico (RFC)

### Modelo de Datos

**Reparto**

| Campo | Tipo | Restricciones |
|---|---|---|
| id | Int | PK, autoincrement |
| fecha | DateTime | NOT NULL |
| inicio | DateTime? | |
| fin | DateTime? | |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |

### Contrato de API

- **Endpoint**: `POST /api/v1/repartos`
- **Auth**: JWT (rol ADMIN)
- **Request Body**:
```json
{
  "fecha": "2026-05-23",
  "pedidosIds": [1, 2, 3]
}
```
- **Response** `201 Created`

## Plan de Implementación

### Backend
1. Schema Zod
2. Service: verificar pedidos existan y estén pendientes → `prisma.reparto.create({ data: { fecha, pedidos: { connect: pedidosIds.map(id => ({ id })) } } })`
3. Tests

### Mobile
4. Pantalla con selector de fecha y selector múltiple de pedidos
5. Mutation
