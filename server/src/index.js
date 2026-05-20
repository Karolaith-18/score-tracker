import express          from 'express'
import cors             from 'cors'
import helmet           from 'helmet'
import { PORT, FRONTEND_URL, NODE_ENV } from './config/env.js'
import { connectDB }                    from './config/db.js'
import matchRoutes                      from './modules/matches/match.routes.js'
import { limiter, writeLimiter }        from './middlewares/rateLimiter.js'
import { notFound }                     from './middlewares/notFound.js'
import { errorHandler }                 from './middlewares/errorHandler.js'

const app = express()

app.use(helmet())
app.use(cors({ origin: FRONTEND_URL }))
app.use(limiter)
app.use(express.json({ limit: '10kb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, env: NODE_ENV, uptime: process.uptime() })
})

app.use('/api/matches', writeLimiter, matchRoutes)

app.use(notFound)
app.use(errorHandler)

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🏐  Score Tracker API → http://localhost:${PORT}`)
    console.log(`🔒  CORS habilitado para: ${FRONTEND_URL}`)
  })
})