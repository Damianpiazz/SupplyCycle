---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Reparto
---

# TDD-0004: Reparto

## Contexto de Negocio (PRD)

### Objetivo

Definir la entidad `Reparto` como la agrupación lógica y física de entregas que un repartidor debe realizar en una jornada. Un reparto organiza los pedidos del día según un recorrido preestablecido , permitiendo además calcular el "resumen de carga del camión" necesario antes de salir a la calle.

### User Persona

- **Nombre**: Repartidor.
- **Necesidad**: Iniciar su jornada de trabajo conociendo qué y cuánto debe cargar en el camión , visualizar el progreso de su ruta (entregas pendientes vs. completadas), y dar por finalizado su recorrido diario una vez visitados todos los domicilios.

### Criterios de Aceptación

- El sistema debe agrupar los pedidos asignados a un repartidor para una fecha específica bajo una única entidad de Reparto.
- El reparto debe reflejar un estado general (`PENDIENTE`, `EN_CURSO`, `COMPLETADO`) para controlar el flujo de trabajo.
- El sistema debe poder calcular y mostrar un "Resumen de carga del camión", sumando las cantidades de todos los ítems de los pedidos asociados a ese reparto.
- El sistema debe proveer métricas básicas por reparto (total de pedidos, cuántos están pendientes, cuántos completados/cancelados) para alimentar la vista de mis entregas.

---

## Diseño Técnico (RFC)

### Modelo de Datos (Prisma)

model Reparto {
  id            String         @id @default(uuid())
  repartidorId  String         // ID del usuario/repartidor asignado
  fecha         DateTime       @db.Date
  estado        EstadoReparto  @default(PENDIENTE)
  horaInicio    String?        // ej: "10:00" - momento en que inicia la ruta
  horaFin       String?        // ej: "14:30" - momento en que finaliza la ruta
  creadoEn      DateTime       @default(now())
  actualizadoEn DateTime       @updatedAt
  
  // Relación con los pedidos que componen este reparto
  pedidos       Pedido[]       
}

model Pedido {
  id            String         @id @default(uuid())
  repartoId     String
  estado        EstadoPedido   @default(PENDIENTE)
  
  reparto       Reparto        @relation(fields: [repartoId], references: [id])
  items         PedidoItem[]
}

model PedidoItem {
  id            String         @id @default(uuid())
  pedidoId      String
  itemId        String
  cantidad      Int
  
  pedido        Pedido         @relation(fields: [pedidoId], references: [id])
  item          Item           @relation(fields: [itemId], references: [id])
}

model Item {
  id            String         @id @default(uuid())
  nombre        String
  unidad        String
  pedidoItems   PedidoItem[]
}

enum EstadoReparto {
  PENDIENTE
  EN_CURSO
  COMPLETADO
}

enum EstadoPedido {
  PENDIENTE
  ENTREGADO
  NO_ENTREGADO
}

### Contrato de API

#### Obtener los repartos asignados a un repartidor

- **Endpoint**: `GET /api/v1/repartos`
- **Query params**: `repartidorId` (requerido), `fecha` (opcional, por defecto hoy), `estado` (opcional)
- **Response Body**:

```ts
{
  data: {
    id: string;
    fecha: string; // ISO 8601
    estado: 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO';
    horaInicio?: string;
    resumen: {
      totalPedidos: number;
      completados: number;
      pendientes: number;
    }
  }[];
}

```

#### Obtener resumen de carga del camión

- **Endpoint**: `GET /api/v1/repartos/:id/carga`
- **Response Body**:

```ts
{
  repartoId: string;
  items: {
    producto: string; // Ej: "Bidon 20L"
    cantidadTotal: number;
    unidad: string; // Ej: "L" o "Unidades"
  }[];
}

```

#### Iniciar / Finalizar un Reparto

* **Endpoint**: `PATCH /api/v1/repartos/:id/estado`
* **Request Body**:

```ts
{
  estado: 'EN_CURSO' | 'COMPLETADO';
}

```

* **Response Body**:

```ts
{
  id: string;
  estado: string;
  actualizadoEn: string;
}

```

### Tipos TypeScript compartidos (mobile)

```ts
export type EstadoReparto = 'PENDIENTE' | 'EN_CURSO' | 'COMPLETADO';

export interface ResumenCarga {
  producto: string;
  cantidadTotal: number;
  unidad: string;
}

export interface Reparto {
  id: string;
  repartidorId: string;
  fecha: string;
  estado: EstadoReparto;
  horaInicio?: string;
  horaFin?: string;
  pedidos?: Pedido[]; // Importado de types/pedido.ts
  resumen?: {
    totalPedidos: number;
    completados: number;
    pendientes: number;
  };
}

```

### Componentes de Arquitectura (Backend)

- **Domain**: Entidad `Reparto`, enum `EstadoReparto`. Reglas de negocio:
1. No se puede iniciar un reparto si el repartidor ya tiene otro en estado `EN_CURSO`.
2. No se puede marcar un reparto como `COMPLETADO` si aún posee pedidos en estado `PENDIENTE`.
- **Application**: Casos de uso `ListarRepartosPorRepartidor`, `ObtenerResumenCarga`, `ActualizarEstadoReparto`.
- **Infrastructure**: Controlador `repartos.controller.ts`, servicio `repartos.service.ts`, rutas `repartos.routes.ts`, schema Zod `repartos.schemas.ts`.

---

## Casos de Borde y Errores

| Escenario | Resultado Esperado | Código HTTP |
| --- | --- | --- |
| Reparto inexistente | Error "Reparto no encontrado" | 404 Not Found |
| Iniciar reparto teniendo otro activo | Error "Ya existe un reparto en curso para hoy" | 409 Conflict |
| Completar reparto con pedidos pendientes | Error "Existen entregas sin procesar en la ruta" | 400 Bad Request |
| `repartidorId` ausente al listar | Error de validación Zod | 400 Bad Request |
| Cambiar estado a `PENDIENTE` desde `EN_CURSO` | Error de flujo "Transición de estado inválida" | 400 Bad Request |

---

## Plan de Implementación

1. Definir el modelo `Reparto` y actualizar la relación en `Pedido` en `prisma/schema.prisma`.
2. Ejecutar migración con `npx prisma migrate dev`.
3. Definir tipos TypeScript compartidos en el frontend (`types/reparto.ts`).
4. Implementar schema de validación Zod en `repartos.schemas.ts`.
5. Implementar lógicas complejas (como la agrupación de la carga del camión) en `repartos.service.ts`.
6. Implementar controlador en `repartos.controller.ts`.
7. Registrar rutas en `repartos.routes.ts`.
8. Asegurar que el *seed* de desarrollo asigne correctamente los pedidos creados en `TDD-0003` a un reparto válido.