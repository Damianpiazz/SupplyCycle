# Modelo de Dominio — SupplyCycle

## Producto

| Columna | Tipo | PK | FK | Ref | Obligatorio |
|---|---|---|---|---|---|
| id | Int | ✓ | | | ✓ |
| nombre | String | | | | ✓ |
| descripcion | String | | | | |
| precio | Float | | | | ✓ |
| unidad | String | | | | ✓ |
| stock | Int | | | | ✓ |
| cantidad | Int | | | | ✓ |
| retornable | Boolean | | | | ✓ |

Relaciones:
- `itemsPedido` → ItemPedido(productoId) 1:N
- `retenidos` → Retenido(productoId) 1:N

---

## Cliente

| Columna | Tipo | PK | FK | Ref | Obligatorio |
|---|---|---|---|---|---|
| id | Int | ✓ | | | ✓ |
| nombre | String | | | | ✓ |
| apellido | String | | | | ✓ |
| telefono | String (UNIQUE) | | | | ✓ |
| estado | EstadoCliente | | | | ✓ |

Relaciones:
- `pedidos` → Pedido(clienteId) 1:N
- `retenidos` → Retenido(clienteId) 1:N
- `reclamos` → Reclamo(clienteId) 1:N
- `domicilios` → Domicilio(clienteId) 1:N

---

## Domicilio

| Columna | Tipo | PK | FK | Ref | Obligatorio |
|---|---|---|---|---|---|
| id | Int | ✓ | | | ✓ |
| calle | String | | | | ✓ |
| entreCalle1 | String | | | | |
| entreCalle2 | String | | | | |
| numero | String | | | | ✓ |
| piso | String | | | | |
| clienteId | Int | | ✓ | Cliente(id) | ✓ |
| ciudadId | Int | | ✓ | Ciudad(id) | ✓ |

Relaciones:
- `dias` → Dia(domicilioId) 1:N

---

## Ciudad

| Columna | Tipo | PK | FK | Ref | Obligatorio |
|---|---|---|---|---|---|
| id | Int | ✓ | | | ✓ |
| nombre | String | | | | ✓ |

Relaciones:
- `domicilios` → Domicilio(ciudadId) 1:N

---

## Dia

| Columna | Tipo | PK | FK | Ref | Obligatorio |
|---|---|---|---|---|---|
| id | Int | ✓ | | | ✓ |
| nombre | DiaSemana | | | | ✓ |
| domicilioId | Int | | ✓ | Domicilio(id) | ✓ |

Relaciones:
- `horarios` → Horario(diaId) 1:N

---

## Horario

| Columna | Tipo | PK | FK | Ref | Obligatorio |
|---|---|---|---|---|---|
| id | Int | ✓ | | | ✓ |
| inicio | DateTime | | | | ✓ |
| fin | DateTime | | | | ✓ |
| diaId | Int | | ✓ | Dia(id) | ✓ |

---

## Pedido

| Columna | Tipo | PK | FK | Ref | Obligatorio |
|---|---|---|---|---|---|
| id | Int | ✓ | | | ✓ |
| estado | EstadoPedido | | | | ✓ |
| fechaAlta | DateTime | | | | ✓ |
| clienteId | Int | | ✓ | Cliente(id) | ✓ |
| repartoId | Int? | | ✓ | Reparto(id) | |

Relaciones:
- `items` → ItemPedido(pedidoId) 1:N
- `visitas` → Visita(pedidoId) 1:N
- `retenidos` → Retenido(pedidoId) 1:N

---

## ItemPedido

| Columna | Tipo | PK | FK | Ref | Obligatorio |
|---|---|---|---|---|---|
| id | Int | ✓ | | | ✓ |
| cantidad | Int | | | | ✓ |
| precioUnitario | Float | | | | ✓ |
| productoId | Int | | ✓ | Producto(id) | ✓ |
| pedidoId | Int | | ✓ | Pedido(id) | ✓ |

---

## Retenido

| Columna | Tipo | PK | FK | Ref | Obligatorio |
|---|---|---|---|---|---|
| id | Int | ✓ | | | ✓ |
| estado | EstadoRetenido | | | | ✓ |
| inicio | DateTime | | | | ✓ |
| fin | DateTime? | | | | |
| productoId | Int | | ✓ | Producto(id) | ✓ |
| clienteId | Int | | ✓ | Cliente(id) | ✓ |
| pedidoId | Int | | ✓ | Pedido(id) | ✓ |

---

## Visita

| Columna | Tipo | PK | FK | Ref | Obligatorio |
|---|---|---|---|---|---|
| id | Int | ✓ | | | ✓ |
| fecha | DateTime | | | | ✓ |
| hora | DateTime | | | | ✓ |
| falta | Boolean | | | | ✓ |
| pedidoId | Int | | ✓ | Pedido(id) | ✓ |
| empleadoId | Int | | ✓ | Empleado(id) | ✓ |

---

## Empleado

| Columna | Tipo | PK | FK | Ref | Obligatorio |
|---|---|---|---|---|---|
| id | Int | ✓ | | | ✓ |
| nombre | String | | | | ✓ |
| apellido | String | | | | ✓ |
| dni | String (UNIQUE) | | | | ✓ |

Relaciones:
- `visitas` → Visita(empleadoId) 1:N

---

## Reparto

| Columna | Tipo | PK | FK | Ref | Obligatorio |
|---|---|---|---|---|---|
| id | Int | ✓ | | | ✓ |
| fecha | DateTime | | | | ✓ |
| inicio | DateTime? | | | | |
| fin | DateTime? | | | | |

Relaciones:
- `pedidos` → Pedido(repartoId) 1:N

---

## Reclamo

| Columna | Tipo | PK | FK | Ref | Obligatorio |
|---|---|---|---|---|---|
| id | Int | ✓ | | | ✓ |
| clienteId | Int | | ✓ | Cliente(id) | ✓ |

---

## Enumeraciones

### EstadoCliente
| Valor | Descripción |
|---|---|
| activo | Operación normal |
| baja | Baja permanente |
| inactivo | Sin pedidos recientes |
| moroso | Deudas pendientes |

### EstadoPedido
| Valor | Descripción |
|---|---|
| pendiente | Creado, sin asignar a reparto |
| en_ruta | Asignado a reparto en curso |
| entregado | Entregado |
| cancelado | Cancelado |

### EstadoRetenido
| Valor | Descripción |
|---|---|
| retenido | Envase retenido |
| devuelto | Envase devuelto |
| perdido | Envase perdido |

### DiaSemana
lunes, martes, miercoles, jueves, viernes, sabado, domingo
