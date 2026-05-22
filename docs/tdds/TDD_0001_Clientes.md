---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Cliente
---

# TDD-0001: Cliente

## Contexto de Negocio (PRD)

### Objetivo

Definir la entidad Cliente como base del sistema. Un cliente es una persona que recibe entregas periódicas de bidones de agua en un domicilio fijo, en un día asignado de la semana. El repartidor necesita acceder a sus datos para ejecutar y registrar las entregas del día.

### User Persona

- **Nombre**: Repartidor
- **Necesidad**: Conocer el nombre, domicilio, contacto y horario de cada cliente para poder realizar la entrega de forma eficiente durante su recorrido diario.

### Criterios de Aceptación

- El sistema debe permitir obtener los datos de un cliente por su ID.
- El cliente debe tener asociado un día fijo de entrega en la semana.
- El cliente debe tener una franja horaria preferida de entrega.
- El contacto telefónico del cliente debe estar disponible para que el repartidor pueda llamar directamente desde la app.
- El domicilio debe incluir calle, número, localidad y coordenadas geográficas para su uso en el mapa.

---

## Diseño Técnico (RFC)

### Modelo de Datos (Prisma)

```prisma
model Cliente {
  id          String    @id @default(uuid())
  nombre      String
  apellido    String
  telefono    String
  calle       String
  numero      String
  localidad   String
  latitud     Float
  longitud    Float
  diaEntrega  DiaSemana
  horarioDesde String   // ej: "10:00"
  horarioHasta String   // ej: "12:00"
  observaciones String?
  creadoEn    DateTime  @default(now())
  actualizadoEn DateTime @updatedAt
  pedidos     Pedido[]
}

enum DiaSemana {
  LUNES
  MARTES
  MIERCOLES
  JUEVES
  VIERNES
  SABADO
}
```

### Contrato de API

#### Obtener cliente por ID

- **Endpoint**: `GET /api/v1/clientes/:id`
- **Request Body**: ninguno
- **Response Body**:

```ts
{
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  domicilio: {
    calle: string;
    numero: string;
    localidad: string;
    latitud: number;
    longitud: number;
  };
  diaEntrega: 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO';
  horarioDesde: string;
  horarioHasta: string;
  observaciones?: string;
}
```

#### Listar todos los clientes

- **Endpoint**: `GET /api/v1/clientes`
- **Query params opcionales**: `nombre`, `dia`
- **Response Body**:

```ts
{
  data: Cliente[];
  total: number;
}
```

### Tipos TypeScript compartidos (mobile)

```ts
export type DiaSemana = 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO';

export interface Domicilio {
  calle: string;
  numero: string;
  localidad: string;
  latitud: number;
  longitud: number;
}

export interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  domicilio: Domicilio;
  diaEntrega: DiaSemana;
  horarioDesde: string;
  horarioHasta: string;
  observaciones?: string;
}
```

### Componentes de Arquitectura (Backend)

- **Domain**: Entidad `Cliente`, Value Object `Domicilio`, regla de negocio: el día de entrega debe ser un día válido de la semana
- **Application**: Caso de uso `ObtenerClientePorId`, `ListarClientes`
- **Infrastructure**: Controlador `clientes.controller.ts`, servicio `clientes.service.ts`, rutas `clientes.routes.ts`, schema Zod `clientes.schemas.ts`

---

## Casos de Borde y Errores

| Escenario | Resultado Esperado | Código HTTP |
|---|---|---|
| ID de cliente inexistente | Error con mensaje "Cliente no encontrado" | 404 Not Found |
| ID con formato inválido | Error de validación | 400 Bad Request |
| Coordenadas fuera de rango | Error de validación | 400 Bad Request |
| Día de entrega inválido | Error de validación con valores aceptados | 400 Bad Request |

---

## Plan de Implementación

1. Definir el modelo `Cliente` en `prisma/schema.prisma`
2. Ejecutar migración con `npx prisma migrate dev`
3. Definir tipos TypeScript en el mobile (`types/cliente.ts`)
4. Implementar schema de validación Zod en `clientes.schemas.ts`
5. Implementar servicio en `clientes.service.ts`
6. Implementar controlador en `clientes.controller.ts`
7. Registrar rutas en `clientes.routes.ts`
8. Cargar datos mock/seed para desarrollo