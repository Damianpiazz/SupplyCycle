---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Item
---

# TDD-0002: Item

## Contexto de Negocio (PRD)

### Objetivo

Definir la entidad Item como los productos que pueden ser incluidos en un pedido. En la Entrega 1, el ítem principal es el bidón de agua, pero la entidad debe estar preparada para soportar otros productos en el futuro.

### User Persona

- **Nombre**: Repartidor
- **Necesidad**: Ver qué productos y en qué cantidad debe entregar en cada parada, para no cometer errores durante el reparto.

### Criterios de Aceptación

- Cada ítem debe tener un nombre, descripción opcional y unidad de medida.
- Un ítem puede estar activo o inactivo (para no eliminarlo si tiene historial).
- El repartidor debe ver los ítems asociados a cada pedido con su cantidad.

---

## Diseño Técnico (RFC)

### Modelo de Datos (Prisma)

```prisma
model Item {
  id          String      @id @default(uuid())
  nombre      String
  descripcion String?
  unidad      String      // ej: "unidad", "litros"
  activo      Boolean     @default(true)
  creadoEn    DateTime    @default(now())
  pedidoItems PedidoItem[]
}
```

### Contrato de API

#### Listar ítems disponibles

- **Endpoint**: `GET /api/v1/items`
- **Response Body**:

```ts
{
  data: Item[];
}
```

#### Obtener ítem por ID

- **Endpoint**: `GET /api/v1/items/:id`
- **Response Body**:

```ts
{
  id: string;
  nombre: string;
  descripcion?: string;
  unidad: string;
  activo: boolean;
}
```

### Tipos TypeScript compartidos (mobile)

```ts
export interface Item {
  id: string;
  nombre: string;
  descripcion?: string;
  unidad: string;
  activo: boolean;
}

export interface PedidoItem {
  item: Item;
  cantidad: number;
}
```

### Componentes de Arquitectura (Backend)

- **Domain**: Entidad `Item`, regla: no se puede eliminar un ítem con historial de pedidos, solo desactivar
- **Application**: Caso de uso `ListarItems`, `ObtenerItemPorId`
- **Infrastructure**: Controlador `items.controller.ts`, servicio `items.service.ts`, rutas `items.routes.ts`, schema Zod `items.schemas.ts`

---

## Casos de Borde y Errores

| Escenario | Resultado Esperado | Código HTTP |
|---|---|---|
| ID de ítem inexistente | Error "Ítem no encontrado" | 404 Not Found |
| Ítem inactivo incluido en pedido nuevo | Error de validación | 400 Bad Request |
| Nombre vacío | Error de validación | 400 Bad Request |

---

## Plan de Implementación

1. Definir el modelo `Item` y `PedidoItem` en `prisma/schema.prisma`
2. Ejecutar migración con `npx prisma migrate dev`
3. Definir tipos TypeScript en el mobile (`types/item.ts`)
4. Implementar schema de validación Zod en `items.schemas.ts`
5. Implementar servicio en `items.service.ts`
6. Implementar controlador en `items.controller.ts`
7. Registrar rutas en `items.routes.ts`
8. Cargar datos mock/seed (ej: Bidón 20L, Bidón 12L)