/**
 * config/env.js
 * Lee las variables de entorno una sola vez.
 * El resto de la app importa desde aquí, nunca de process.env directamente.
 */

import 'dotenv/config'

export const PORT         = process.env.PORT         || 3001
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
