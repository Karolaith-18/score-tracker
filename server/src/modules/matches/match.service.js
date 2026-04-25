/**
 * modules/matches/match.service.js
 * Lógica de negocio del módulo de partidos.
 * No sabe nada de HTTP (req/res); solo trabaja con datos.
 * Llama al repository para leer/escribir.
 */

import { matchRepository } from './match.repository.js'

export const matchService = {

  getAllMatches: () => matchRepository.findAll(),

  getMatchById: (id) => {
    const match = matchRepository.findById(id)
    if (!match) throw { status: 404, message: `Partido ${id} no encontrado` }
    return match
  },

  createMatch: (data) => {
    const { teamAName, teamBName } = data
    if (!teamAName || !teamBName) {
      throw { status: 400, message: 'teamAName y teamBName son requeridos' }
    }
    return matchRepository.create(data)
  },

  updateMatch: (id, updates) => {
    const match = matchRepository.update(id, updates)
    if (!match) throw { status: 404, message: `Partido ${id} no encontrado` }
    return match
  },

  deleteMatch: (id) => {
    const deleted = matchRepository.delete(id)
    if (!deleted) throw { status: 404, message: `Partido ${id} no encontrado` }
    return { deleted: id }
  },

  recordPoint: (id, eventData) => {
    // Verificar que el partido exista
    const match = matchRepository.findById(id)
    if (!match) throw { status: 404, message: `Partido ${id} no encontrado` }

    const { team } = eventData
    if (!['A', 'B'].includes(team)) {
      throw { status: 400, message: 'team debe ser "A" o "B"' }
    }

    return matchRepository.addEvent(id, eventData)
  },
}
