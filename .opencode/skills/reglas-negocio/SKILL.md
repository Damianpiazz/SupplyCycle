# Reglas de Negocio: Gestión de Reparto de Bidones

Actúa como un Analista Funcional y Desarrollador Backend. El dominio del proyecto es un sistema de reparto de bidones de agua. Debes implementar las siguientes lógicas de negocio utilizando servicios independientes (Clean Architecture) y tareas programadas (CRON jobs).

## 1. Cálculo de Frecuencia de Pedidos
- **Lógica:** Para cada cliente, el sistema debe analizar su historial de pedidos completados. 
- **Cálculo:** Obtener el promedio de días que transcurren entre un pedido y el siguiente.
- **Implementación:** Crear un servicio `calculateClientFrequency(clientId)` que consulte la base de datos (Prisma) y retorne el promedio en días (ej. "cada 14 días").

## 2. Estimación de Demanda Futura (Predictiva)
- **Lógica:** Predecir cuándo un cliente necesitará bidones nuevamente para sugerir rutas al repartidor o enviar recordatorios.
- **Cálculo:** `Fecha del último pedido completado` + `Frecuencia de pedidos (días)`.
- **Implementación:** Un servicio que devuelva un listado de clientes cuya fecha estimada de próximo pedido caiga en los próximos X días.

## 3. Detección y Notificación de Demoras (Envases)
- **Lógica:** Rastrear si un cliente retiene envases (bidones vacíos) más tiempo del permitido.
- **Cálculo:** Comparar la cantidad de bidones entregados vs. devueltos en el historial del cliente. Si `(Entregados - Devueltos) > 0` y han pasado más de X días desde la entrega, se marca como "En Demora".
- **Implementación (Worker/Cron):** 
  1. Implementar un CRON job (ej. usando `node-cron` o `bullmq`) que se ejecute todos los días a las 08:00 AM.
  2. El CRON debe buscar en la base de datos a los clientes en mora.
  3. Integrar con el servicio de WhatsApp Cloud API para enviar automáticamente un mensaje de plantilla (template) recordando la devolución.

## 4. Gestión Autónoma del Cliente (WhatsApp)
- El webhook de WhatsApp debe procesar mensajes entrantes permitiendo al cliente:
  - Solicitar bidones fuera de su ruta asignada.
  - Cancelar el pedido del día.
  - Generar reclamos.
- Estos eventos deben impactar directamente en la base de datos (Prisma) y reflejarse en tiempo real en la interfaz del Administrador y la app del Repartidor.