import { matchRepository } from './match.repository.js'

const POINTS_TO_WIN_SET      = 25
const POINTS_TO_WIN_TIEBREAK = 15
const MIN_LEAD               = 2

function isSetWon(score, opponentScore, isTiebreak) {
  const target = isTiebreak ? POINTS_TO_WIN_TIEBREAK : POINTS_TO_WIN_SET
  return score >= target && (score - opponentScore) >= MIN_LEAD
}

function notFound() {
  return Object.assign(new Error('Partido no encontrado'), { status: 404 })
}

export const matchService = {

  getAll: () => matchRepository.findAll(),

  getById: async (id) => {
    const match = await matchRepository.findById(id)
    if (!match) throw notFound()
    return match
  },

  create: ({ teamA, teamB, maxSets = 5, serving = 'A' }) => {
    return matchRepository.create({ teamA, teamB, maxSets, serving })
  },

  update: async (id, payload) => {
    const match = await matchRepository.update(id, payload)
    if (!match) throw notFound()
    return match
  },

  addPoint: async (id, { team }) => {
    const match = await matchRepository.findById(id)
    if (!match) throw notFound()

    if (match.status !== 'playing') {
      throw Object.assign(new Error('El partido no está en curso'), { status: 400 })
    }

    const other      = team === 'A' ? 'B' : 'A'
    const isTiebreak = match.currentSet === match.maxSets
    const setsToWin  = Math.ceil(match.maxSets / 2)
    const newScore   = match[`score${team}`] + 1
    const otherScore = match[`score${other}`]

    if (isSetWon(newScore, otherScore, isTiebreak)) {
      const newSets  = match[`sets${team}`] + 1
      const setEntry = {
        set:    match.currentSet,
        scoreA: team === 'A' ? newScore : otherScore,
        scoreB: team === 'B' ? newScore : otherScore,
        winner: team,
      }

      if (newSets >= setsToWin) {
        return matchRepository.update(id, {
          [`score${team}`]: newScore,
          [`sets${team}`]:  newSets,
          serving:          team,
          status:           'match_over',
          winner:           team,
          finishedAt:       new Date(),
          $push:            { setHistory: setEntry },
        })
      }

      return matchRepository.update(id, {
        [`score${team}`]: newScore,
        [`sets${team}`]:  newSets,
        serving:          team,
        status:           'set_over',
        $push:            { setHistory: setEntry },
      })
    }

    return matchRepository.update(id, {
      [`score${team}`]: newScore,
      serving:          team,
    })
  },

  nextSet: async (id) => {
    const match = await matchRepository.findById(id)
    if (!match) throw notFound()
    if (match.status !== 'set_over') {
      throw Object.assign(new Error('No hay un set terminado que continuar'), { status: 400 })
    }
    return matchRepository.update(id, {
      scoreA:     0,
      scoreB:     0,
      currentSet: match.currentSet + 1,
      status:     'playing',
      serving:    match.serving === 'A' ? 'B' : 'A',
    })
  },

  remove: async (id) => {
    const match = await matchRepository.delete(id)
    if (!match) throw notFound()
  },
}