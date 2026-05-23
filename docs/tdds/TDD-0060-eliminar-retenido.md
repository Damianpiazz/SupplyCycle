---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Eliminar Retenido
---

# TDD-0060: Eliminar Retenido

## Contexto de Negocio (PRD)

### Objetivo
Eliminar un registro de retenido mal creado.

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Corregir errores de carga.

### Criterios de Aceptación
- Hard delete: se elimina físicamente (es dato administrativo, no histórico)

### Contrato de API

- **Endpoint**: `DELETE /api/v1/retenidos/:id`
- **Auth**: JWT (rol ADMIN)

## Plan de Implementación

### Backend
1. Service: `prisma.retenido.delete()`
2. Tests

### Mobile
3. Botón con confirmación
