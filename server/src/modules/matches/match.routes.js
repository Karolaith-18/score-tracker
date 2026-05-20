import { Router } from 'express'
import { matchController, rules } from './match.controller.js'

const router = Router()

router.get('/',               matchController.list)
router.post('/',              rules.create,  matchController.create)
router.get('/:id',            rules.id,      matchController.get)
router.patch('/:id',          rules.id,      matchController.update)
router.delete('/:id',         rules.id,      matchController.remove)
router.post('/:id/point',     rules.point,   matchController.addPoint)
router.post('/:id/next-set',  rules.id,      matchController.nextSet)

export default router