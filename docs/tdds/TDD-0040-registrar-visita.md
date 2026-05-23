---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Registrar Visita
---

# TDD-0040: Registrar Visita

## Contexto de Negocio (PRD)

### Objetivo
Registrar una visita de reparto a un pedido. La visita documenta que el repartidor asistió al domicilio del cliente para entregar el pedido.

### User Persona
- **Nombre**: Repartidor
- **Necesidad**: Registrar que asistió a entregar un pedido, con fecha, hora y empleado asignado.

### Criterios de Aceptación
- La visita se asocia a un pedido y a un empleado
- La visita registra fecha y hora
- El pedido debe estar en estado `en_ruta` o `pendiente`

## Diseño Técnico (RFC)

### Modelo de Datos

**Visita**

| Campo | Tipo | Restricciones |
|---|---|---|
| id | Int | PK, autoincrement |
| fecha | DateTime | NOT NULL |
| hora | DateTime | NOT NULL |
| falta | Boolean | DEFAULT false |
| pedidoId | Int | FK -> Pedido |
| empleadoId | Int | FK -> Empleado |

### Contrato de API

- **Endpoint**: `POST /api/v1/visitas`
- **Auth**: JWT (rol REPARTIDOR o ADMIN)
- **Request Body**:
```json
{
  "pedidoId": 1,
  "empleadoId": 1,
  "fecha": "2026-05-23",
  "hora": "10:30"
}
```
- **Response** `201 Created`

## Plan de Implementación

### Backend
1. Schema Zod con validaciones
2. Service: verificar pedido existe → `prisma.visita.create()`
3. Ruta POST con auth
4. Tests

### Mobile
5. Pantalla simple: escanear/ingresar pedido, seleccionar empleado, registrar fecha/hora
6. La hora puede tomarse automáticamente del dispositivo
