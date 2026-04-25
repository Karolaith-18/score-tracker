/**
 * modules/matches/match.repository.js
 * Acceso a datos: aquí vive toda la interacción con la fuente de datos.
 *
 * Actualmente usa un Map en memoria.
 * Para conectar una BD, solo hay que reemplazar este archivo:
 *   - MongoDB  → usar mongoose Model
 *   - SQLite   → usar better-sqlite3
 *   - Postgres → usar pg Pool
 * El service y el controller NO cambian.
 */

const db = new Map()

export const matchRepository = {
  findAll: () => [...db.values()],

  findById: (id) => db.get(id) ?? null,

  create: (data) => {
    const match = {
      id:        Date.now().toString(),
      createdAt: new Date().toISOString(),
      eventLog:  [],
      ...data,
    }
    db.set(match.id, match)
    return match
  },

  update: (id, updates) => {
    const match = db.get(id)
    if (!match) return null
    const updated = { ...match, ...updates, updatedAt: new Date().toISOString() }
    db.set(id, updated)
    return updated
  },

  delete: (id) => {
    if (!db.has(id)) return false
    db.delete(id)
    return true
  },

  addEvent: (id, eventData) => {
    const match = db.get(id)
    if (!match) return null
    const event = {
      id:        Date.now().toString(),
      matchId:   id,
      timestamp: new Date().toISOString(),
      ...eventData,
    }
    match.eventLog = [event, ...(match.eventLog || [])]
    db.set(id, match)
    return event
  },
}
