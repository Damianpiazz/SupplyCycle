---
autor: Equipo SupplyCycle
fecha: 2026-05-22
titulo: API Key para Comunicación Machine-to-Machine (WhatsApp Bot)
---

# ADR-0017: API Key para Comunicación Machine-to-Machine (WhatsApp Bot)

## Contexto

El WhatsApp bot necesita comunicarse con la API REST del backend para crear/consultar clientes, pedidos, items y reclamos. Esta comunicación es machine-to-machine (M2M): no hay un usuario humano interactuando con la API, sino un bot automatizado.

El sistema ya tiene autenticación JWT (ADR-0001) para usuarios humanos (repartidores, administradores), pero el bot no puede:
- Tener un par email+contraseña persistente
- Renovar tokens periódicamente
- Manejar expiración de sesión

Se necesita un mecanismo de autenticación diferente para integraciones automatizadas.

---

## Decisión

Se implementa un **header `x-api-key`** compartido entre el backend y el WhatsApp bot como mecanismo de autenticación M2M.

Mecanismo:
- El backend valida la API Key en un middleware **no-bloqueante** (`api-key-auth.ts`)
- El bot envía la API Key en todas las requests via Axios interceptor
- La API Key se configura via variable de entorno `BOT_API_KEY` en ambos servicios
- Si el header `x-api-key` no está presente, el middleware pasa al siguiente (permite autenticación JWT como fallback)
- Si está presente y es inválida, rechaza con 401
- Si es válida, asigna un sujeto `{ userId: 'bot', rol: 'BOT' }` al request

---

## Opciones Consideradas

### Opción 1: API Key en header (seleccionada)
Clave compartida estática enviada en el header HTTP `x-api-key`.

Ventajas:
- Simple de implementar y entender
- Sin expiración — ideal para M2M
- Bajo overhead computacional (comparación de strings)
- Fácil de rotar (actualizar env var en ambos servicios + reiniciar)

Desventajas:
- Clave compartida — si se filtra, cualquiera puede actuar como bot
- Sin granularidad de permisos (una sola clave para todo)
- Rotación requiere reinicio de ambos servicios (o recarga de env)

### Opción 2: JWT para bot con client_credentials (OAuth2)
El bot solicita un JWT usando client_id + client_secret, similar a OAuth2 Client Credentials Flow.

Ventajas:
- Estándar de la industria para M2M
- Tokens con expiración limitada
- Posibilidad de múltiples clientes con distintos alcances

Desventajas:
- Requiere endpoint adicional de token y lógica de refresco en el bot
- Complejidad innecesaria para un solo cliente (el bot)
- El bot necesitaría manejar renovación de tokens periódicamente

### Opción 3: Autenticación por red interna (sin auth)
Asumir que el bot y el backend están en la misma red segura.

Ventajas:
- Máxima simplicidad — sin overhead de autenticación

Desventajas:
- Sin seguridad en profundidad
- Si un atacante accede a la red interna, tiene acceso total a la API
- Impide desplegar servicios en redes separadas

### Opción 4: JWT del bot autenticándose como usuario real
El bot usa credenciales de un usuario real (email+password) para obtener un JWT.

Ventajas:
- Reutiliza el sistema JWT existente

Desventajas:
- El token expira — el bot necesita renovarlo periódicamente
- Un usuario humano ocupado por un bot es confuso en auditoría
- Si cambia la contraseña del usuario "bot", el bot deja de funcionar

### Opción seleccionada
Opción 1. Para un solo cliente M2M (el WhatsApp bot), una API Key compartida es la solución más pragmática. Si en el futuro aparecen más integraciones M2M, se puede migrar a OAuth2 Client Credentials.

---

## Consecuencias

### Positivas
- Mecanismo simple, sin estado, sin expiración
- Middleware no-bloqueante: permite coexistencia con JWT en los mismos endpoints
- El bot no necesita lógica de renovación de tokens
- Fácil de auditar: todas las operaciones del bot se registran con rol BOT
- Variable de entorno única (`BOT_API_KEY`) para ambos servicios

### Negativas
- Clave compartida estática — riesgo si se filtra
- Sin granularidad: el bot tiene acceso a todos los endpoints que aceptan API Key
- Rotación requiere coordinación entre servicios
- No hay revocación individual (solo rotando la clave global)

---

## Impacto en el Sistema

### Backend
- Nuevo middleware: `src/middleware/api-key-auth.ts`
- Endpoints que aceptan API Key: clientes (GET), items (GET), pedidos (GET, POST, PATCH), reclamos (POST)
- Variable de entorno: `BOT_API_KEY` en `src/config/env.ts`
- El middleware asigna `req.user = { userId: 'bot', email: 'bot@supplycycle.com', rol: 'BOT' }`

### WhatsApp Bot
- Cliente Axios singleton en `src/lib/axios.ts` con header `x-api-key` en todas las requests
- Sin necesidad de manejar expiración o renovación
- 4 servicios que consumen la API: cliente.service, item.service, pedido.service, reclamo.service

### Infraestructura / Compartido
- `BOT_API_KEY` debe ser igual en backend y whatsapp-bot
- Puerto 3008 para el bot, puerto 3000 para el backend

---

## Reglas Derivadas

- La API Key se envía exclusivamente en el header `x-api-key` (no en URL, body ni cookies)
- El middleware `apiKeyAuth` debe ejecutarse ANTES que `authenticate` para que la API Key tenga prioridad
- El rol `BOT` no tiene acceso a endpoints admin (solo lectura/escritura de datos operativos)
- Rotar la API Key inmediatamente si se sospecha filtración
- No logear ni exponer la API Key en mensajes de error, logs o respuestas
