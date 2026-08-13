<div align="center">

# 🚚 SupplyCycle

**Plataforma integral para la gestión del ciclo de entregas**

Automatiza la logística de reparto: pedidos, rutas y comunicación con el cliente desde una sola solución.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![Status](https://img.shields.io/badge/Estado-MVP-ff69b4.svg)

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?logo=expo&logoColor=white)
![WhatsApp](https://img.shields.io/badge/WhatsApp_Bot-25D366?logo=whatsapp&logoColor=white)

</div>

---

## ✨ ¿Qué es?

SupplyCycle es un **MVP** desarrollado para la materia **Desarrollo de Aplicaciones Móviles** de la **Universidad Tecnológica Nacional**. Integra tres frentes de la operación de reparto de envases de agua:

| Frente | Descripción |
|---|---|
| 🗄️ `backend/` | API REST con Express + Prisma + PostgreSQL |
| 📱 `mobile/` | App móvil para repartidores (React Native + Expo) |
| 💬 `whatsapp-bot/` | Bot de WhatsApp para comunicación con clientes (BuilderBot) |

---

## 🏗️ Estructura del monorepo

```
├── backend/          🗄️  API REST (Express + TypeScript + Prisma + PostgreSQL)
├── mobile/           📱  App móvil (React Native + Expo Router)
├── whatsapp-bot/     💬  Bot de WhatsApp (BuilderBot + Baileys)
├── docs/             📚  Documentación del proyecto
└── ia/               🤖  Entregas de investigación
```

---

## 🚀 Puesta en marcha

### Requisitos

- **Node.js** 20+
- **Docker** + Docker Compose

### Entorno completo

```bash
git clone https://github.com/Damianpiazz/SupplyCycle.git
cd SupplyCycle

docker compose -f docker-compose.dev.yml up --build
```

### Servicios

| Servicio   | URL                   | Credenciales (dev)        |
| ---------- | --------------------- | ------------------------- |
| Backend    | http://localhost:3000 | —                         |
| PostgreSQL | localhost:5433        | `postgres` / `postgres`   |
| pgAdmin    | http://localhost:5050 | `admin@supplycycle.com` / `admin` |

> ⚠️ `docker compose down -v` elimina los volúmenes (borra datos de la base).

---

## 📚 Documentación

| Documento | Contenido |
| --------- | --------- |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Convenciones de ramas, commits y Pull Requests |
| [LICENSE](./LICENSE) | Licencia del proyecto |

---

<div align="center">

**SupplyCycle** · 2026

*Hecho por Manuela, Lucia, Martina, Tiago y Damian* 🚀

</div>
