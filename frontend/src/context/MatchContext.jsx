/**
 * context/MatchContext.jsx
 * Estado global del partido. Usa useReducer para manejar
 * la lógica compleja de sets, puntos y saque.
 */

import { createContext, useContext, useReducer, useCallback } from 'react'
import { isSetWon, appendLog } from '../utils/match.js'
import matchService from '../services/api.js'

// ─── Estado inicial ───────────────────────────
const initialMatch = {
  id: null,
  teamA: { name: 'Equipo A', color: '#3b7fff', score: 0, sets: 0 },
  teamB: { name: 'Equipo B', color: '#ff3b3b', score: 0, sets: 0 },
  currentSet: 1,
  serving: 'A',
  setStartServing: 'A', 
  status: 'idle',
  winner: null,
  setWinner: null,
  setHistory: [],
  eventLog: [],
  maxSets: 5,
  startedAt: null,
}

// ─── Reducer ──────────────────────────────────
function matchReducer(state, action) {
  switch (action.type) {

    case 'SETUP_MATCH': {
      const { teamAName, teamBName, teamAColor, teamBColor, maxSets, serving } = action.payload
      return {
        ...initialMatch,
        id: Date.now().toString(),
        teamA: { ...initialMatch.teamA, name: teamAName, color: teamAColor },
        teamB: { ...initialMatch.teamB, name: teamBName, color: teamBColor },
        maxSets,
        serving,
        setStartServing: serving,
        status: 'playing',
        startedAt: new Date().toISOString(),
      }
    }

    case 'SET_MATCH_ID':
      return { ...state, id: action.payload }

    case 'ADD_POINT': {
      if (state.status !== 'playing') return state

      const team       = action.payload
      const other      = team === 'A' ? 'B' : 'A'
      const isTiebreak = state.currentSet === state.maxSets
      const setsToWin  = Math.ceil(state.maxSets / 2)

      const newScore   = state[`team${team}`].score + 1
      const otherScore = state[`team${other}`].score

      const newLog = appendLog(state.eventLog, {
        set: state.currentSet, type: 'point', team,
        scoreA: team === 'A' ? newScore : otherScore,
        scoreB: team === 'B' ? newScore : otherScore,
      })

      const next = {
        ...state,
        [`team${team}`]: { ...state[`team${team}`], score: newScore },
        serving: team,
        eventLog: newLog,
      }

      if (!isSetWon(newScore, otherScore, isTiebreak)) return next

      const newSets    = state[`team${team}`].sets + 1
      const setHistory = [...state.setHistory, {
        set:    state.currentSet,
        scoreA: team === 'A' ? newScore : otherScore,
        scoreB: team === 'B' ? newScore : otherScore,
        winner: team,
      }]

      if (newSets >= setsToWin) {
        return {
          ...next,
          [`team${team}`]: { ...next[`team${team}`], sets: newSets },
          setHistory,
          status: 'match_over',
          winner: team,
          setWinner: team,
          eventLog: appendLog(newLog, { set: state.currentSet, type: 'match_over', team }),
        }
      }

      return {
        ...next,
        [`team${team}`]: { ...next[`team${team}`], sets: newSets },
        setHistory,
        status: 'set_over',
        setWinner: team,
        eventLog: appendLog(newLog, { set: state.currentSet, type: 'set_over', team }),
      }
    }

    case 'REMOVE_POINT': {
      if (state.status !== 'playing') return state
      const team     = action.payload
      const newScore = Math.max(0, state[`team${team}`].score - 1)
      return {
        ...state,
        [`team${team}`]: { ...state[`team${team}`], score: newScore },
        eventLog: appendLog(state.eventLog, {
          set: state.currentSet, type: 'correction', team,
          scoreA: team === 'A' ? newScore : state.teamA.score,
          scoreB: team === 'B' ? newScore : state.teamB.score,
        }),
      }
    }

    case 'NEXT_SET': {
      if (state.status !== 'set_over') return state
      const nextServing = action.payload?.serving ?? (state.setStartServing === 'A' ? 'B' : 'A')
      return {
        ...state,
        teamA:           { ...state.teamA, score: 0 },
        teamB:           { ...state.teamB, score: 0 },
        currentSet:      state.currentSet + 1,
        status:          'playing',
        setWinner:       null,
        serving:         nextServing,
        setStartServing: nextServing, 
        eventLog:        [],
      }
    }

    case 'SET_SERVING':
      return { ...state, serving: action.payload }

    case 'RESET':
      return initialMatch

    default:
      return state
  }
}

// ─── Helpers para sincronizar con el backend ──
function calcNextState(match, team) {
  const other      = team === 'A' ? 'B' : 'A'
  const isTiebreak = match.currentSet === match.maxSets
  const setsToWin  = Math.ceil(match.maxSets / 2)
  const newScore   = match[`team${team}`].score + 1
  const otherScore = match[`team${other}`].score

  if (!isSetWon(newScore, otherScore, isTiebreak)) {
    return {
      [`score${team}`]: newScore,
      serving: team,
    }
  }

  const newSets    = match[`team${team}`].sets + 1
  const setEntry   = {
    set:    match.currentSet,
    scoreA: team === 'A' ? newScore : otherScore,
    scoreB: team === 'B' ? newScore : otherScore,
    winner: team,
  }

  if (newSets >= setsToWin) {
    return {
      [`score${team}`]: newScore,
      [`sets${team}`]:  newSets,
      serving:          team,
      status:           'match_over',
      winner:           team,
      finishedAt:       new Date().toISOString(),
      $push:            { setHistory: setEntry },
    }
  }

  return {
    [`score${team}`]: newScore,
    [`sets${team}`]:  newSets,
    serving:          team,
    status:           'set_over',
    $push:            { setHistory: setEntry },
  }
}

// ─── Context ──────────────────────────────────
const MatchContext = createContext(null)

export function MatchProvider({ children }) {
  const [match, dispatch] = useReducer(matchReducer, initialMatch)

  const setupMatch = useCallback(async (config) => {
    dispatch({ type: 'SETUP_MATCH', payload: config })
    try {
      const res     = await matchService.create({
        teamA: { name: config.teamAName, color: config.teamAColor },
        teamB: { name: config.teamBName, color: config.teamBColor },
        maxSets: config.maxSets,
        serving: config.serving,
      })
      const mongoId = res?.data?._id || res?._id
      if (mongoId) dispatch({ type: 'SET_MATCH_ID', payload: mongoId })
    } catch (e) {
      console.warn('Backend no disponible:', e.message)
    }
  }, [])

  const addPoint = useCallback(async (team) => {
    dispatch({ type: 'ADD_POINT', payload: team })
    if (match.id) {
      try {
        const updates = calcNextState(match, team)
        await matchService.update(match.id, updates)
      } catch (e) {
        console.warn('Backend no disponible:', e.message)
      }
    }
  }, [match])

  const removePoint = useCallback((team) => {
    dispatch({ type: 'REMOVE_POINT', payload: team })
  }, [])

  const nextSet = useCallback(async (forcedServing = null) => {
    const nextServing = forcedServing ?? (match.setStartServing === 'A' ? 'B' : 'A') 
    dispatch({ type: 'NEXT_SET', payload: { serving: nextServing } })
    if (match.id) {
      try {
        await matchService.update(match.id, {
          scoreA:     0,
          scoreB:     0,
          currentSet: match.currentSet + 1,
          status:     'playing',
          serving:    nextServing,
        })
      } catch (e) {
        console.warn('Backend no disponible:', e.message)
      }
    }
  }, [match])

  const setServing = useCallback((team) => dispatch({ type: 'SET_SERVING', payload: team }), [])
  const resetMatch = useCallback(() => dispatch({ type: 'RESET' }), [])

  return (
    <MatchContext.Provider value={{ match, setupMatch, addPoint, removePoint, nextSet, setServing, resetMatch }}>
      {children}
    </MatchContext.Provider>
  )
}

export const useMatch = () => {
  const ctx = useContext(MatchContext)
  if (!ctx) throw new Error('useMatch debe usarse dentro de <MatchProvider>')
  return ctx
}