/**
 * services/api.js
 * ─────────────────────────────────────────────────────────
 * Capa de comunicación con el backend Express.
 *
 * Modo OFFLINE (por defecto):  VITE_USE_API=false
 *   → Todas las llamadas resuelven inmediatamente con datos mock.
 *   → El frontend funciona sin servidor.
 *
 * Modo ONLINE:                 VITE_USE_API=true
 *   → Las llamadas van a /api  (Vite lo proxea a localhost:3001).
 * ─────────────────────────────────────────────────────────
 */

const IS_PROD = window.location.hostname !== 'localhost'
const USE_API = IS_PROD || import.meta.env.VITE_USE_API === 'true'
const BASE_URL = IS_PROD
  ? 'https://score-tracker-api.onrender.com/api'
  : (import.meta.env.VITE_API_URL || '/api')

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(err.message || 'API error')
  }
  return res.json()
}

export const matchService = {
  getAll: () =>
    USE_API ? apiFetch('/matches') : Promise.resolve([]),

  getById: (id) =>
    USE_API ? apiFetch(`/matches/${id}`) : Promise.resolve(null),

  create: (data) =>
    USE_API
      ? apiFetch('/matches', { method: 'POST', body: JSON.stringify(data) })
      : Promise.resolve({ id: Date.now().toString(), ...data }),

  update: (id, updates) =>
    USE_API
      ? apiFetch(`/matches/${id}`, { method: 'PATCH', body: JSON.stringify(updates) })
      : Promise.resolve({ id, ...updates }),

  delete: (id) =>
    USE_API
      ? apiFetch(`/matches/${id}`, { method: 'DELETE' })
      : Promise.resolve({ deleted: id }),

  recordPoint: (id, payload) =>
    USE_API
      ? apiFetch(`/matches/${id}/point`, { method: 'POST', body: JSON.stringify(payload) })
      : Promise.resolve(payload),
}

export default matchService
