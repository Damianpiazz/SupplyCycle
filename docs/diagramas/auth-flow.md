# Flujo de Autenticación

```mermaid
sequenceDiagram
    participant M as Mobile App
    participant A as Backend API
    participant DB as PostgreSQL
    participant SS as SecureStore

    Note over M: App inicia, no hay token

    M->>A: POST /auth/login { email, password }
    A->>DB: findUnique usuario by email

    alt usuario no existe
        A-->>M: 401 { error: "Credenciales inválidas" }
    else usuario inactivo
        A-->>M: 403 { error: "Usuario inactivo" }
    else password incorrecto
        A-->>M: 401 { error: "Credenciales inválidas" }
    else éxito
        A->>A: jwt.sign({ userId, email, rol })
        A-->>M: 200 { data: { token, usuario } }
        M->>SS: saveToken(token)
        M->>M: authStore.login({ token, usuario })
        M->>M: router.replace("/(tabs)")
    end

    Note over M,A: App en segundo plano → relanzamiento

    M->>SS: getToken()
    alt token existe
        M->>A: GET /auth/me (Authorization: Bearer <token>)
        A->>A: authenticate → jwt.verify
        A->>DB: findUnique usuario
        alt token válido, usuario activo
            A-->>M: 200 { data: { usuario } }
            M->>M: authStore.setUser(usuario)
            M->>M: router.replace("/(tabs)")
        else token expirado o usuario inactivo
            A-->>M: 401
            M->>SS: clearToken()
            M->>M: router.replace("/login")
        end
    else no token
        M->>M: router.replace("/login")
    end

    Note over M,A: Request autenticado cualquiera

    M->>M: apiClient interceptor → attach Bearer
    M->>A: GET /api/v1/pedidos/hoy?repartidorId=...
    A->>A: authenticate → jwt.verify
    alt token expiró
        A-->>M: 401
        M->>SS: clearToken()
        M->>M: authStore.logout()
        M->>M: router.replace("/login")
    else válido
        A-->>M: 200 { data: [...] }
    end
```

## Componentes involucrados

| Capa | Archivo | Rol |
|---|---|---|
| Backend | `features/auth/service.ts` | Login, getMe, updateMe |
| Backend | `middleware/auth.middleware.ts` | authenticate + requireRole |
| Backend | `config/env.ts` | jwtSecret, jwtExpiresIn |
| Mobile | `features/auth/services/authStorage.ts` | getToken / saveToken / clearToken (SecureStore) |
| Mobile | `stores/authStore.ts` | Estado global de sesión (Zustand) |
| Mobile | `app/_layout.tsx` | Auth gate (bootstrap) |
| Mobile | `hooks/useLogin.ts` | useMutation para login |
| Mobile | `services/api.ts` | interceptors (attach JWT + 401 → logout) |

## Mock Credenciales

| Usuario | Email | Password |
|---|---|---|
| Repartidor | `repartidor@supplycycle.com` | `Repartidor123` |
| Admin | `admin@supplycycle.com` | `Admin1234` |
