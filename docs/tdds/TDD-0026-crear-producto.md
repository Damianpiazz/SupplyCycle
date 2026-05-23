---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Crear Producto
---

# TDD-0026: Crear Producto

## Contexto de Negocio (PRD)

### Objetivo
Registrar un nuevo producto en el catálogo (bidones de agua, garrafas, etc.) con precio, unidad y stock.

### User Persona
- **Nombre**: Administrador
- **Necesidad**: Agregar un producto nuevo al sistema para ofrecerlo a los clientes.

### Criterios de Aceptación
- El sistema debe crear el producto con nombre, descripción, precio, unidad, stock, cantidad y retornable
- El nombre no debe estar duplicado
- Precio y stock deben ser positivos

## Diseño Técnico (RFC)

### Modelo de Datos

**Producto**

| Campo | Tipo | Restricciones |
|---|---|---|
| id | Int | PK, autoincrement |
| nombre | String | UNIQUE, NOT NULL |
| descripcion | String? | |
| precio | Float | NOT NULL, > 0 |
| unidad | String | NOT NULL |
| stock | Int | NOT NULL, >= 0 |
| cantidad | Int | NOT NULL, > 0 |
| retornable | Boolean | DEFAULT false |

### Contrato de API

- **Endpoint**: `POST /api/v1/productos`
- **Auth**: JWT (rol ADMIN)
- **Request Body**:
```json
{
  "nombre": "Bidón 20L",
  "descripcion": "Bidón de agua mineral 20 litros",
  "precio": 1500,
  "unidad": "unidad",
  "stock": 100,
  "cantidad": 1,
  "retornable": true
}
```
- **Response** `201 Created`

## Plan de Implementación

### Backend
1. Schema Zod con validaciones (precio > 0, stock >= 0)
2. Service: verificar nombre único → `prisma.producto.create()`
3. Ruta POST con auth ADMIN
4. Tests

### Mobile
5. Formulario con campos del producto
6. Mutation, invalidar lista de productos
