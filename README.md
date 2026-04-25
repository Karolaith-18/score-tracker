# 🏐 Score Tracker — Voleibol

Monorepo con **frontend** (React + Vite + Bootstrap) y **backend** (Express).

```
score-tracker/
├── frontend/                   ← React + Vite
│   ├── src/
│   │   ├── components/         ← Componentes de UI
│   │   ├── config/
│   │   │   └── game.js         ← Constantes de las reglas del juego
│   │   ├── context/
│   │   │   └── MatchContext.jsx← Estado global con useReducer
│   │   ├── hooks/              ← Custom hooks (para ampliar)
│   │   ├── services/
│   │   │   └── api.js          ← Capa HTTP hacia el backend
│   │   └── utils/
│   │       └── match.js        ← Funciones puras de lógica
│   └── package.json
│
└── server/                     ← Express (feature-based)
    └── src/
        ├── config/
        │   └── env.js           ← Variables de entorno
        ├── middlewares/
        │   ├── errorHandler.js  ← Manejo global de errores
        │   └── notFound.js      ← Ruta 404
        ├── modules/
        │   └── matches/
        │       ├── match.controller.js ← Recibe req/res
        │       ├── match.repository.js ← Acceso a datos
        │       ├── match.routes.js     ← Define rutas
        │       └── match.service.js    ← Lógica de negocio
        ├── utils/
        │   └── response.js      ← Helpers de respuesta HTTP
        └── index.js             ← Entry point Express
```

---

## Levantar el frontend

```bash
cd frontend
npm install        # solo la primera vez
cp .env.example .env
npm run dev
```

Abre http://localhost:5173

---

## Levantar el backend (cuando esté listo)

```bash
cd server
npm install        # solo la primera vez
cp .env.example .env
npm run dev
```

Y en el `.env` del frontend cambia:
```
VITE_USE_API=true
```

---

## Endpoints disponibles

| Método | Ruta                      | Descripción            |
|--------|---------------------------|------------------------|
| GET    | /api/health               | Health check           |
| GET    | /api/matches              | Listar partidos        |
| POST   | /api/matches              | Crear partido          |
| GET    | /api/matches/:id          | Obtener partido        |
| PATCH  | /api/matches/:id          | Actualizar estado      |
| DELETE | /api/matches/:id          | Eliminar partido       |
| POST   | /api/matches/:id/point    | Registrar punto        |
