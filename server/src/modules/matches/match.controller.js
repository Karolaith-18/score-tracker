import { body, param, validationResult } from 'express-validator'
import { matchService } from './match.service.js'
import { ok, fail }     from '../../utils/response.js'

const validate = (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    fail(res, errors.array()[0].msg, 422)
    return false
  }
  return true
}

export const rules = {
  create: [
    body('teamA.name').trim().notEmpty().withMessage('El nombre del equipo A es requerido').isLength({ max: 30 }),
    body('teamB.name').trim().notEmpty().withMessage('El nombre del equipo B es requerido').isLength({ max: 30 }),
    body('maxSets').optional().isIn([3, 5]).withMessage('maxSets debe ser 3 o 5'),
    body('serving').optional().isIn(['A', 'B']).withMessage('serving debe ser A o B'),
  ],
  id: [
    param('id').isMongoId().withMessage('ID de partido inválido'),
  ],
  point: [
    param('id').isMongoId().withMessage('ID de partido inválido'),
    body('team').isIn(['A', 'B']).withMessage('team debe ser A o B'),
  ],
}

export const matchController = {

  list: async (req, res, next) => {
    try { ok(res, await matchService.getAll()) }
    catch (e) { next(e) }
  },

  get: async (req, res, next) => {
    if (!validate(req, res)) return
    try { ok(res, await matchService.getById(req.params.id)) }
    catch (e) { next(e) }
  },

  create: async (req, res, next) => {
    if (!validate(req, res)) return
    try { ok(res, await matchService.create(req.body), 201) }
    catch (e) { next(e) }
  },

  update: async (req, res, next) => {
    if (!validate(req, res)) return
    try { ok(res, await matchService.update(req.params.id, req.body)) }
    catch (e) { next(e) }
  },

  addPoint: async (req, res, next) => {
    if (!validate(req, res)) return
    try { ok(res, await matchService.addPoint(req.params.id, req.body)) }
    catch (e) { next(e) }
  },

  nextSet: async (req, res, next) => {
    if (!validate(req, res)) return
    try { ok(res, await matchService.nextSet(req.params.id)) }
    catch (e) { next(e) }
  },

  remove: async (req, res, next) => {
    if (!validate(req, res)) return
    try { await matchService.remove(req.params.id); ok(res, { deleted: true }) }
    catch (e) { next(e) }
  },
}