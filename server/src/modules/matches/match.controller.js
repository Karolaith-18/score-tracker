/**
 * modules/matches/match.controller.js
 * Recibe req/res, delega al service y responde con los helpers de response.
 * No contiene lógica de negocio ni acceso a datos.
 */

import { matchService }                        from './match.service.js'
import { ok, created, notFound, badRequest, serverError } from '../../utils/response.js'

export const matchController = {

  getAll: (_req, res) => {
    try {
      const matches = matchService.getAllMatches()
      ok(res, matches)
    } catch (err) {
      serverError(res, err.message)
    }
  },

  getById: (req, res) => {
    try {
      const match = matchService.getMatchById(req.params.id)
      ok(res, match)
    } catch (err) {
      err.status === 404 ? notFound(res, err.message) : serverError(res, err.message)
    }
  },

  create: (req, res) => {
    try {
      const match = matchService.createMatch(req.body)
      created(res, match)
    } catch (err) {
      err.status === 400 ? badRequest(res, err.message) : serverError(res, err.message)
    }
  },

  update: (req, res) => {
    try {
      const match = matchService.updateMatch(req.params.id, req.body)
      ok(res, match)
    } catch (err) {
      err.status === 404 ? notFound(res, err.message) : serverError(res, err.message)
    }
  },

  delete: (req, res) => {
    try {
      const result = matchService.deleteMatch(req.params.id)
      ok(res, result)
    } catch (err) {
      err.status === 404 ? notFound(res, err.message) : serverError(res, err.message)
    }
  },

  recordPoint: (req, res) => {
    try {
      const event = matchService.recordPoint(req.params.id, req.body)
      created(res, event)
    } catch (err) {
      err.status === 404 ? notFound(res, err.message)  :
      err.status === 400 ? badRequest(res, err.message) :
      serverError(res, err.message)
    }
  },
}
