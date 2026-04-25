/**
 * src/index.js
 * Entry point del servidor Express.
 * Solo orquesta: registra middlewares, monta rutas y arranca.
 */

import express      from 'express'
import cors         from 'cors'
import { PORT, FRONTEND_URL } from './config/env.js'
import matchRoutes  from './modules/matches/match.routes.js'
import { notFound }     from './middlewares/notFound.js'
import { errorHandler } from './middlewares/errorHandler.js'

const app = express()

// ─── Middlewares globales ─────────────────────
app.use(cors({ origin: FRONTEND_URL }))
app.use(express.json())

// ─── Rutas ────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() })
})

app.use('/api/matches', matchRoutes)

// ─── Manejo de errores (siempre al final) ─────
app.use(notFound)
app.use(errorHandler)

// ─── Arrancar ─────────────────────────────────
app.listen(PORT, () => {
  console.log(`🏐  Score Tracker API → http://localhost:${PORT}`)
})
