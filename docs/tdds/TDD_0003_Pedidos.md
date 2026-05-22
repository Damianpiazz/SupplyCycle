---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Pedido
---

# TDD-0003: Pedido

## Contexto de Negocio (PRD)

### Objetivo

El Pedido representa la entrega de uno o más ítems a un cliente en una fecha específica. Es la entidad central del flujo del repartidor: ver, confirmar o registrar como fallida cada entrega del día.

### User Persona

- **Nombre**: Repartidor
- **Necesidad**: Ver los pedidos asignados para el día, consultar el detalle de cada uno, y registrar si la entrega fue exitosa o fallida, indicando el motivo en caso de falla.

### Criterios de Aceptación

- El sistema debe mostrar todos los pedidos del día para un repartidor dado.
- Cada pedido debe tener un estado: `PENDIENTE`, `ENTREGADO` o `NO_ENTREGADO`.
- El repartidor puede confirmar una entrega, cambiando el estado a `ENTREGADO`.
- El repartidor puede registrar una entrega fallida, cambiando el estado a `NO_ENTREGADO` e indicando un motivo obligatorio.
- Si no hay pedidos para el día, el sistema responde con una lista vacía.
- El cambio de estado debe reflejarse inmediatamente en el listado y en el mapa.

---

## Diseño Técnico (RFC)

### Modelo de Datos (Prisma)

```prisma
model Pedido {
  id           String        @id @default(uuid())
  clienteId    String
  repartoId    String
  fecha        DateTime
  estado       EstadoPedido  @default(PENDIENTE)
  motivoFalla  String?
  orden        Int           // posición en el recorrido del día
  creadoEn     DateTime      @default(now())
  actualizadoEn DateTime     @updatedAt
  cliente      Cliente       @relation(fields: [clienteId], references: [id])
  reparto      Reparto       @relation(fields: [repartoId], references: [id])
  items        PedidoItem[]
}

model PedidoItem {
  id       String @id @default(uuid())
  pedidoId String
  itemId   String
  cantidad Int
  pedido   Pedido @relation(fields: [pedidoId], references: [id])
  item     Item   @relation(fields: [itemId], references: [id])
}

enum EstadoPedido {
  PENDIENTE
  ENTREGADO
  NO_ENTREGADO
}
```

### Contrato de API

#### Obtener pedidos del día para un repartidor

- **Endpoint**: `GET /api/v1/pedidos/hoy`
- **Query params**: `repartidorId` (requerido)
- **Response Body**:

```ts
{
  data: {
    id: string;
    orden: number;
    estado: 'PENDIENTE' | 'ENTREGADO' | 'NO_ENTREGADO';
    fecha: string; // ISO 8601
    cliente: {
      id: string;
      nombre: string;
      apellido: string;
      telefono: string;
      domicilio: Domicilio;
      horarioDesde: string;
      horarioHasta: string;
    };
    items: PedidoItem[];
  }[];
}
```

#### Obtener detalle de un pedido

- **Endpoint**: `GET /api/v1/pedidos/:id`
- **Response Body**:

```ts
{
  id: string;
  orden: number;
  estado: 'PENDIENTE' | 'ENTREGADO' | 'NO_ENTREGADO';
  fecha: string;
  motivoFalla?: string;
  cliente: Cliente;
  items: PedidoItem[];
}
```

#### Obtener todos los pedidos con filtros

- **Endpoint**: `GET /api/v1/pedidos`
- **Query params opcionales**: `clienteNombre`, `fecha`, `estado`
- **Response Body**:

```ts
{
  data: Pedido[];
  total: number;
}
```

#### Confirmar entrega exitosa

- **Endpoint**: `PATCH /api/v1/pedidos/:id/confirmar`
- **Request Body**: ninguno
- **Response Body**:

```ts
{
  id: string;
  estado: 'ENTREGADO';
  actualizadoEn: string;
}
```

#### Registrar entrega fallida

- **Endpoint**: `PATCH /api/v1/pedidos/:id/cancelar`
- **Request Body**:

```ts
{
  motivo: 'CLIENTE_AUSENTE' | 'DIRECCION_INCORRECTA' | 'ACCESO_DENEGADO' | 'OTRO';
}
```

- **Response Body**:

```ts
{
  id: string;
  estado: 'NO_ENTREGADO';
  motivoFalla: string;
  actualizadoEn: string;
}
```

#### Agregar un nuevo pedido

- **Endpoint**: `POST /api/v1/pedidos`
- **Request Body**:

```ts
{
  clienteId: string;
  repartoId: string;
  fecha: string; // ISO 8601
  orden: number;
  items: {
    itemId: string;
    cantidad: number;
  }[];
}
```

- **Response Body**:

```ts
{
  id: string;
  estado: 'PENDIENTE';
  creadoEn: string;
}
```

### Tipos TypeScript compartidos (mobile)

```ts
export type EstadoPedido = 'PENDIENTE' | 'ENTREGADO' | 'NO_ENTREGADO';

export type MotivoCancelacion =
  | 'CLIENTE_AUSENTE'
  | 'DIRECCION_INCORRECTA'
  | 'ACCESO_DENEGADO'
  | 'OTRO';

export interface Pedido {
  id: string;
  orden: number;
  estado: EstadoPedido;
  fecha: string;
  motivoFalla?: string;
  cliente: Cliente;
  items: PedidoItem[];
}
```

### Componentes de Arquitectura (Backend)

- **Domain**: Entidad `Pedido`, enum `EstadoPedido`, enum `MotivoCancelacion`, regla: solo se puede confirmar o cancelar un pedido en estado `PENDIENTE`
- **Application**: Casos de uso `ObtenerPedidosDelDia`, `ObtenerDetallePedido`, `ListarPedidos`, `ConfirmarEntrega`, `RegistrarEntregaFallida`, `AgregarPedido`
- **Infrastructure**: Controlador `pedidos.controller.ts`, servicio `pedidos.service.ts`, rutas `pedidos.routes.ts`, schema Zod `pedidos.schemas.ts`

---

## Casos de Borde y Errores

| Escenario | Resultado Esperado | Código HTTP |
|---|---|---|
| Pedido inexistente | Error "Pedido no encontrado" | 404 Not Found |
| Confirmar pedido ya entregado | Error "El pedido ya fue procesado" | 409 Conflict |
| Cancelar sin motivo | Error de validación | 400 Bad Request |
| Motivo de cancelación inválido | Error con valores aceptados | 400 Bad Request |
| `repartidorId` ausente en `/hoy` | Error de validación | 400 Bad Request |
| No hay pedidos para el día | Lista vacía sin error | 200 OK |
| Ítem inexistente al crear pedido | Error de validación | 400 Bad Request |

---

## Plan de Implementación

1. Definir modelos `Pedido` y `PedidoItem` en `prisma/schema.prisma`
2. Ejecutar migración con `npx prisma migrate dev`
3. Definir tipos TypeScript en el mobile (`types/pedido.ts`)
4. Implementar schema de validación Zod en `pedidos.schemas.ts`
5. Implementar servicio en `pedidos.service.ts` con todos los casos de uso
6. Implementar controlador en `pedidos.controller.ts`
7. Registrar rutas en `pedidos.routes.ts`
8. Cargar datos mock/seed para el día actual