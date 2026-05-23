---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: Versionado de API con Prefijo /api/v1/
---

# ADR-0012: Versionado de API con Prefijo /api/v1/

## Contexto

La API evolucionará con el tiempo: nuevos campos, cambios en contratos, deprecación de endpoints. El mobile puede no actualizarse al mismo ritmo que el backend. Sin versionado, un cambio breaking en la API puede romper la app mobile en producción.

Se necesita una estrategia que permita convivir múltiples versiones de la API durante períodos de transición.

---

## Decisión

Todas las rutas API se montan bajo el prefijo `/api/v1/`. Ejemplo:

- `GET /api/v1/clientes`
- `POST /api/v1/pedidos`
- `POST /api/v1/auth/login`

Cuando sea necesario introducir cambios breaking, se crea `/api/v2/` mientras `/api/v1/` sigue funcionando con soporte por tiempo definido.

---

## Opciones Consideradas

### Opción 1: Prefijo en la URL /api/v1/ (seleccionada)
Simple, explícito, fácil de implementar con `app.use('/api/v1', router)` en Express.

### Opción 2: Header HTTP (Accept-Version, X-API-Version)
La versión va en el header, la URL se mantiene limpia. Más complejo de implementar y depurar (el versionado es implícito).

### Opción 3: Subdominio (v1.api.example.com)
Requiere configuración de DNS y reverse proxy. Sobredimensionado para el alcance del proyecto.

### Opción 4: Sin versionado (siempre hacia adelante)
No hay compatibilidad hacia atrás. Cualquier cambio puede romper clientes. Solo viable si mobile se actualiza forzosamente.

### Opción seleccionada
Opción 1. El prefijo en la URL es el estándar en APIs REST públicas (GitHub, Stripe, Twilio). Es explícito, fácil de depurar y no requiere infraestructura adicional.

---

## Consecuencias

### Positivas
- Explícito: al ver la URL se sabe qué versión se está usando
- Fácil de implementar: un `app.use()` en Express
- El mobile puede migrar gradualmente apuntando a la nueva versión
- Posible tener rutas v1 y v2 coexistiendo

### Negativas
- URLs más largas
- Si hay muchas versiones, el código se llena de routers legacy
- Mantener versiones anteriores requiere backports de bug fixes
- La versión en la URL es menos flexible que negociación por content-type

---

## Impacto en el Sistema

### Backend
- `app.ts` monta rutas con `app.use('/api/v1', router)`
- Cada feature define sus rutas relativas (sin /api/v1/)
- Cuando se necesite v2, se crea un nuevo `router-v2` en paralelo

### Frontend (Mobile)
- `EXPO_PUBLIC_API_URL` apunta a la raíz (ej: `https://api.example.com`)
- El prefijo `/api/v1/` está hardcodeado en el cliente Axios
- Migrar a v2 requiere cambiar la URL base o agregar un interceptor

### Infraestructura / Compartido
- Sin cambios en infraestructura
- Documentación de API referenciada por versión

---

## Reglas Derivadas

- El prefijo `/api/v1/` se configura en `app.ts`, no en cada router
- Las rutas internas en cada feature se definen sin el prefijo
- Una nueva versión implica un nuevo archivo de rutas, no modificar el existente
- Las versiones antiguas se deprecan con un plan de descontinuación comunicado
- El mobile usa una variable de entorno para configurar la versión de API
