# Offline Patterns

## Detección de conectividad
- Usar `@react-native-community/netinfo` via `hooks/useNetworkStatus.ts`
- Expone `{ isConnected: boolean, connectionType: string }`
- Escuchar cambios con `NetInfo.addEventListener()`

## Caché local
- Los pedidos del día se cachean en AsyncStorage al primer fetch exitoso
- Si `!isConnected`, cargar desde caché en lugar de llamar a la API
- Usar `persistQueryClient` de TanStack Query para persistencia automática del query cache

## Cola de mutaciones offline
- Las confirmaciones/cancelaciones hechas sin conexión se encolan en AsyncStorage
- Al恢复ar la conexión, ejecutar la cola en orden FIFO
- Mostrar indicador visual si hay cambios pendientes de sincronizar

## Estados UI
- Mostrar un banner "Sin conexión — los datos pueden no estar actualizados" cuando offline
- Las acciones offline muestran confirmación local inmediata + indicador "Pendiente de sincronizar"
- Diferenciar visualmente datos cacheados vs datos frescos

## Reglas
- NO bloquear la UI cuando offline (el repartidor debe poder seguir trabajando)
- NO perder datos: si falla la sincronización, mantener la cola hasta reintentar
- Sincronizar al恢复ar conexión automáticamente (escuchar evento `NetInfo.addEventListener`)
- La cola offline debe tener un límite máximo de reintentos (3) antes de marcar como fallido permanente
- No cachear datos sensibles (contraseñas, tokens) en AsyncStorage
