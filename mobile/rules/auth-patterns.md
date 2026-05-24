# Authentication Patterns

## SecureStore (único punto de acceso)
- El JWT se guarda/recupera EXCLUSIVAMENTE desde `features/auth/services/authStorage.ts`
- Usar `expo-secure-store` (no AsyncStorage, no Zustand, no variables en memoria持久)
- Funciones expuestas: `saveToken(token)`, `getToken(): string | null`, `clearToken()`

## Auth Store (Zustand)
- Store global en `store/authStore.ts`
- Estado: `token`, `usuario: Usuario | null`, `isAuthenticated`, `isLoading`
- Acciones: `login(credentials)`, `logout()`, `setUser(user)`
- `logout()` debe: limpiar SecureStore, limpiar store, redirigir a login

## Auth Gate (app/_layout.tsx)
- Al montar la app: intentar cargar token desde SecureStore
- Si hay token: llamar `GET /auth/me` para validar y obtener usuario
- Si token válido → mostrar `(tabs)`
- Si no hay token o token inválido/expirado → mostrar `login`
- Mientras carga → mostrar `LoadingSpinner`

## Login Flow
- Hook `useLogin` en `features/auth/hooks/useLogin.ts`
- Usa `useMutation` de TanStack Query
- Al éxito: guarda token en SecureStore, actualiza authStore, redirige a tabs
- Al error: muestra mensaje sin revelar si el email existe o no ("Credenciales inválidas")

## Credenciales Mock
- Usuario de prueba: `repartidor@supplycycle.com` / `12345678`
- Si el backend no responde o no existe, el mock debe devolver el mismo formato que `POST /auth/login`
- El mock debe generar un JWT simulado (string cualquiera) y un objeto `Usuario` que respete el tipo `AuthResponse`

## Restricciones
- NO acceder a `expo-secure-store` fuera de `features/auth/services/authStorage.ts`
- NO guardar el token en Zustand como persistencia (solo en SecureStore)
- NO usar fetch para login (siempre Axios)
- NO permitir registro público (solo login)
- El endpoint `GET /auth/me` devuelve el usuario sin la contraseña
