---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Modelo de Datos Híbrido — Entidades Normalizadas y Aplanadas
---

# ADR-0018: Modelo de Datos Híbrido — Entidades Normalizadas y Aplanadas

## Contexto

El esquema de base de datos necesita representar dominios con distintos niveles de complejidad y frecuencia de cambio.

Por un lado, existen entidades con estructura compleja y relaciones múltiples (domicilios con múltiples días de entrega, cada día con múltiples horarios). Por otro lado, hay entidades operativas donde la simplicidad y velocidad de acceso son prioritarias.

El modelo de dominio documentado en `docs/especificacion/Modelo-Dominio.md` propone una normalización completa (Cliente → Domicilio → Dia → Horario), pero la implementación real del sistema tiene dos enfoques coexistiendo.

---

## Decisión

Se adopta un **modelo de datos híbrido** que combina:

### Entidades normalizadas (relaciones 1:N y N:M)
- **Ciudad** → **Domicilio** → **Dia** → **Horario**: cadena completa de ubicación y disponibilidad
- **Empleado** → **Visita**: trazabilidad de visitas a clientes
- **Pedido** → **PedidoItem**: items dentro de un pedido
- **Retenido**: vinculado a Item, Cliente y Pedido

### Entidades aplanadas (campos incrustados)
- **Cliente**: incluye `calle`, `numero`, `localidad`, `latitud`, `longitud`, `diaEntrega`, `horarioDesde`, `horarioHasta` como campos directos en la misma tabla
- **Item**: incluye `nombre`, `descripcion`, `unidad`, `precio` como campos directos

### Justificación del modelo híbrido

El modelo normalizado (Ciudad → Domicilio → Dia → Horario) está disponible en el esquema para cuando se necesite representar clientes con múltiples domicilios o múltiples días/horarios de entrega. Sin embargo, para el funcionamiento diario del negocio:

- La mayoría de los clientes tienen **un solo domicilio** con **un solo día y horario de entrega**
- La API REST y el WhatsApp Bot trabajan con el cliente de forma aplanada por simplicidad
- El panel admin expone el modelo normalizado (CRUD separado para ciudades, domicilios, días, horarios)
- El seed modular (Faker) genera datos en ambas representaciones

---

## Opciones Consideradas

### Opción 1: Modelo completamente normalizado (seleccionada para estructura)
Todas las entidades siguen la forma normalizada: Cliente → Domicilio → Dia → Horario como tablas separadas.

Ventajas:
- Sin duplicación de datos
- Flexibilidad total: un cliente puede tener múltiples domicilios con distintos días/horarios
- Integridad referencial completa

Desventajas:
- Complejidad de consultas: para obtener el día de entrega de un cliente se requieren 4 JOINs
- Overhead para el caso común (1 cliente, 1 domicilio, 1 día, 1 horario)
- Los endpoints API REST y el bot necesitan lógica de aplanado/desaplanado
- Mayor número de tablas y relaciones para mantener

### Opción 2: Modelo completamente aplanado
Todo en una sola tabla Cliente con campos incrustados (calle, numero, localidad, diaEntrega, horarioDesde, horarioHasta).

Ventajas:
- Consultas simples y rápidas (SELECT directo sin JOINs)
- Ideal para API REST y bot (respuesta plana)
- Menos tablas que mantener

Desventajas:
- Sin flexibilidad para clientes con múltiples domicilios o días
- Duplicación si un mismo domicilio sirve a múltiples clientes
- Dificultad para agregar funcionalidades como "cambiar día de entrega" (hay que actualizar al cliente directamente)

### Opción 3: Híbrido — modelo normalizado en DB, aplanado en API (seleccionada)
El esquema Prisma mantiene ambas representaciones: el cliente tiene campos aplanados (calle, numero, diaEntrega, etc.) Y también tiene relación con Domicilio → Dia → Horario.

Ventajas:
- Lo mejor de ambos mundos: simplicidad para el caso común, flexibilidad para el caso complejo
- El panel admin expone la versión normalizada (CRUD por entidad)
- La API REST y el bot trabajan con la versión aplanada
- Migración gradual: se puede poblar el modelo normalizado sin romper la API

Desventajas:
- Datos redundantes (la dirección del cliente existe tanto en Cliente.calle como en Domicilio.calle)
- Riesgo de inconsistencia si se actualiza un lado pero no el otro
- Mayor superficie de testing

### Opción seleccionada
Opción 3. La redundancia controlada es aceptable para un negocio donde el caso común (1 cliente, 1 domicilio, 1 día, 1 horario) representa >95% de los registros. El panel admin permite gestionar la versión normalizada, mientras que la API y el bot usan la versión aplanada.

---

## Consecuencias

### Positivas
- API REST simple: GET /clientes devuelve un JSON plano sin JOINs complejos
- WhatsApp Bot simple: registra clientes con campos directos
- Panel admin completo: CRUD separado para ciudades, domicilios, días y horarios
- Flexibilidad futura: cuando un cliente necesite múltiples domicilios, el modelo normalizado ya está listo
- Seed modular genera ambas representaciones consistentemente

### Negativas
- Redundancia de datos: la dirección del cliente está en Cliente (aplanado) y en Domicilio (normalizado)
- Riesgo de inconsistencia si se modifica un lado sin actualizar el otro
- Mayor superficie de testing (ambos caminos deben ser correctos)
- Confusión para nuevos desarrolladores: "¿por qué hay dos representaciones?"

---

## Impacto en el Sistema

### Backend
- Schema Prisma con 12 modelos: 5 normalizados (Ciudad, Domicilio, Dia, Horario, Empleado), 4 aplanados (Cliente, Item, Pedido, Reparto), 3 de relación (PedidoItem, Visita, Retenido), 1 maestro (Reclamo)
- API REST en `features/clientes/` opera con modelo aplanado
- Panel admin tiene controladores separados para ciudades, domicilios, días y horarios (modelo normalizado)
- No hay sincronización automática entre ambos modelos

### WhatsApp Bot
- El flow `alta` recoge datos aplanados (calle, numero, localidad, diaEntrega, horario)
- El service `cliente.service.ts` envía POST /clientes con datos aplanados

### Mobile
- Sin impacto directo. Consume la API REST que devuelve datos aplanados.

---

## Reglas Derivadas

- La API REST opera SIEMPRE con el modelo aplanado de Cliente
- El panel admin puede operar con ambos modelos según el recurso
- No implementar sincronización automática entre modelos aplanado y normalizado por ahora
- Si se detectan inconsistencias, el modelo normalizado (Domicilio → Dia → Horario) es la fuente de verdad
- Nuevas features deben elegir el modelo según su caso de uso: simplicidad → aplanado, flexibilidad → normalizado
