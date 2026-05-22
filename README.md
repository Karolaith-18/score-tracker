# 🏐 Score Tracker — Voleibol

Aplicación web para llevar el marcador de partidos de voleibol en tiempo real, siguiendo las reglas oficiales FIVB.

## 🔗 Demo en producción

| Servicio | URL |
|---|---|
| **Frontend** | https://score-tracker-sage.vercel.app |
| **Backend API** | https://score-tracker-api.onrender.com |
| **Health check** | https://score-tracker-api.onrender.com/api/health |

> ⚠️ El backend usa el tier gratuito de Render — puede tardar ~30 segundos en responder la primera vez si estuvo inactivo.

---

## 🏗️ Arquitectura

```
score-tracker/
├── frontend/                        ← React 18 + Vite 5 + Bootstrap 5
│   └── src/
│       ├── components/              ← Componentes de UI
│       ├── config/game.js           ← Constantes FIVB
│       ├── context/MatchContext.jsx ← Estado global con useReducer
│       ├── services/api.js          ← Capa HTTP hacia el backend
│       └── utils/match.js           ← Funciones puras de lógica
│
└── server/                          ← Express 4 + MongoDB + Mongoose
    └── src/
        ├── config/
        │   ├── db.js                ← Conexión MongoDB Atlas
        │   └── env.js               ← Variables de entorno
        ├── middlewares/
        │   ├── errorHandler.js      ← Manejo global de errores
        │   ├── notFound.js          ← Ruta 404
        │   └── rateLimiter.js       ← Rate limiting
        ├── modules/matches/
        │   ├── match.controller.js  ← Recibe req/res
        │   ├── match.model.js       ← Esquema Mongoose
        │   ├── match.repository.js  ← Acceso a datos
        │   ├── match.routes.js      ← Define rutas
        │   └── match.service.js     ← Lógica de negocio
        └── utils/response.js        ← Helpers de respuesta HTTP
```

---

## 🚀 Correr en local

### Requisitos
- Node.js 18+
- Cuenta en MongoDB Atlas (o MongoDB local)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Karolaith-18/score-tracker.git
cd score-tracker

# Instalar todas las dependencias
npm install
```

### Variables de entorno

**`server/.env`** (crear desde `server/.env.example`):
```
PORT=3001
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/score_tracker
FRONTEND_URL=http://localhost:5173
```

**`frontend/.env`** (crear desde `frontend/.env.example`):
```
VITE_USE_API=false
VITE_API_URL=/api
```

### Arrancar

```bash
# Corre frontend y backend al mismo tiempo
npm run dev
```

- Frontend → http://localhost:5173
- Backend → http://localhost:3001

---

## 📡 Endpoints de la API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/matches` | Listar partidos |
| POST | `/api/matches` | Crear partido |
| GET | `/api/matches/:id` | Obtener partido |
| PATCH | `/api/matches/:id` | Actualizar estado |
| DELETE | `/api/matches/:id` | Eliminar partido |
| POST | `/api/matches/:id/point` | Registrar punto |
| POST | `/api/matches/:id/next-set` | Avanzar al siguiente set |


---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 18, Vite 5, Bootstrap 5 |
| Backend | Node.js, Express 4 |
| Base de datos | MongoDB Atlas + Mongoose |
| Despliegue frontend | Vercel |
| Despliegue backend | Render |
| Control de versiones | GitHub |

---

## 📋 Reglas FIVB implementadas

- Sets regulares: primero en llegar a 25 puntos con ventaja mínima de 2
- Tie-break (5.º set): primero en llegar a 15 puntos con ventaja mínima de 2
- Formato: best of 3 o best of 5 sets
- El saque cambia al equipo que ganó el set anterior
