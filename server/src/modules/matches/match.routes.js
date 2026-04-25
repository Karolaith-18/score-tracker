/**
 * modules/matches/match.routes.js
 * Define las rutas del módulo y las conecta con el controller.
 * Se monta en /api/matches desde index.js.
 */

import { Router }          from 'express'
import { matchController } from './match.controller.js'

const router = Router()

// GET    /api/matches
router.get('/',    matchController.getAll)

// POST   /api/matches
router.post('/',   matchController.create)

// GET    /api/matches/:id
router.get('/:id', matchController.getById)

// PATCH  /api/matches/:id
router.patch('/:id', matchController.update)

// DELETE /api/matches/:id
router.delete('/:id', matchController.delete)

// POST   /api/matches/:id/point
router.post('/:id/point', matchController.recordPoint)

export default router
