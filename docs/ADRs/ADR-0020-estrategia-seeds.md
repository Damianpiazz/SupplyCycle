---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Estrategia de Seeds y Datos de Prueba
---

# ADR-0020: Estrategia de Seeds y Datos de Prueba

## Contexto

El backend necesita datos de prueba para desarrollo, testing y demostraciones. Sin un mecanismo de seed, cada desarrollador tendría que crear datos manualmente para probar cualquier funcionalidad.

Existen dos necesidades distintas:
- **Seed rápido y predecible**: para tests automatizados y demostraciones controladas, con datos conocidos (usuarios mock, clientes específicos, pedidos en estados concretos)
- **Seed masivo y realista**: para desarrollo y pruebas de performance, con datos sintéticos que se asemejen a datos reales (cientos de clientes, pedidos históricos, relaciones complejas)

Ambos deben compartir las mismas credenciales de usuario demo para que la documentación y los flujos de onboarding sean consistentes.

---

## Decisión

Se implementan **dos sistemas de seed** en el backend, ambos ejecutables via `npx prisma db seed`:

### Seed principal (`prisma/seed.ts`)
- **Propósito**: datos de demostración controlados y predecibles
- **Contenido**: 2 usuarios (repartidor + admin), 3 items, 6 clientes, 1 reparto con 6 pedidos en distintos estados
- **Características**: rápido (<1s), determinista, ideal para tests y demos
- **Credenciales demo**: `repartidor@supplycycle.com` / `Repartidor123`, `admin@supplycycle.com` / `Admin1234`

### Seed modular (`prisma/seed/index.ts`)
- **Propósito**: datos masivos realistas para desarrollo y performance
- **Contenido**: 1000+ clientes sintéticos con Faker, ciudades, domicilios, días, horarios, empleados, visitas, retenidos, reclamos
- **Características**: modular (cada entidad en su propio archivo `.seed.ts`), configurable, datos con distribución realista
- **Ejecución**: `npx tsx prisma/seed/index.ts` (manual, no vinculado a `prisma db seed`)

### Configuración en `package.json`
```json
{
  "prisma": {
    "seed": "npx tsx prisma/seed.ts"
  }
}
```

---

## Opciones Consideradas

### Opción 1: Seed único con condicional (descartada)
Un solo archivo que detecta entorno y decide si sembrar datos chicos o grandes.

Ventajas:
- Un solo punto de entrada

Desventajas:
- Complejidad condicional en el seed
- Dificultad para testear con datos controlados si el seed siempre genera datos masivos
- Tiempo de ejecución largo incluso para tests rápidos

### Opción 2: Seed principal + seed modular (seleccionada)
Seed chico vinculado a `prisma db seed` para el caso común, seed modular separado para desarrollo intensivo.

Ventajas:
- Seed rápido para tests (`prisma db seed` se ejecuta en <1s)
- Seed modular para desarrollo cuando se necesitan datos masivos
- Separación clara de responsabilidades
- Modularidad permite sembrar entidades individualmente

Desventajas:
- Dos puntos de entrada que pueden desincronizarse
- El seed modular no se ejecuta automáticamente con `prisma db seed`

### Opción 3: Migraciones con datos (descartada)
Datos sembrados directamente en migraciones de Prisma.

Ventajas:
- Datos disponibles desde la primera migración

Desventajas:
- Mezcla migraciones de esquema con datos de prueba
- Difícil de modificar o limpiar
- No recomendado por Prisma

### Opción seleccionada
Opción 2. La separación permite tener un seed rápido y predecible para el día a día, y un seed masivo bajo demanda para escenarios específicos.

---

## Consecuencias

### Positivas
- Seed rápido (<1s) para tests y demos via `prisma db seed`
- Seed masivo configurable (1000+ registros) para desarrollo
- Credenciales demo consistentes entre ambos sistemas
- Modularidad: se pueden sembrar entidades individualmente
- El seed principal es determinista — ideal para tests de integración

### Negativas
- El seed modular no está vinculado a `prisma db seed` (hay que ejecutarlo manualmente)
- Mantenimiento de dos sistemas de seed
- El seed modular depende de Faker como dependencia de desarrollo
- La limpieza de datos se duplica en ambos seeds

---

## Impacto en el Sistema

### Backend
- `prisma/seed.ts`: seed principal con 2 usuarios, 3 items, 6 clientes, 1 reparto, 6 pedidos
- `prisma/seed/`: directorio con 10 archivos modulares (ciudades, items, usuarios, empleados, clientes, repartos, pedidos, visitas, retenidos, reclamos)
- Dependencia dev: `@faker-js/faker` para datos sintéticos
- Configuración en `package.json`: `"prisma": { "seed": "npx tsx prisma/seed.ts" }`

### WhatsApp Bot
- Las credenciales demo (`repartidor@supplycycle.com`) son usadas en el mock de autenticación del bot
- Sin impacto directo en la estrategia de seed del backend

### Mobile
- Sin impacto directo. Los datos de prueba se generan desde el backend.

---

## Reglas Derivadas

- `prisma db seed` ejecuta SIEMPRE el seed chico (`prisma/seed.ts`)
- El seed modular se ejecuta manualmente con `npx tsx prisma/seed/index.ts` cuando se necesitan datos masivos
- Ambos seeds deben limpiar datos existentes antes de sembrar (DELETE en orden inverso de dependencias)
- Las credenciales demo deben ser las mismas en ambos seeds: `repartidor@supplycycle.com` / `Repartidor123` y `admin@supplycycle.com` / `Admin1234`
- No sembrar datos sensibles ni reales (solo datos sintéticos con Faker)
- El seed modular debe generar al menos 1000 clientes para pruebas de performance significativas
- Nuevas entidades en Prisma deben agregarse a ambos seeds (o al menos al seed modular)
