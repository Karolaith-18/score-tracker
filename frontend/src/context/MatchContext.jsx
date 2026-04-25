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
  serving: 'A',        // 'A' | 'B'
  status: 'idle',      // 'idle' | 'playing' | 'set_over' | 'match_over'
  winner: null,
  setWinner: null,
  setHistory: [],      // [{ set, scoreA, scoreB, winner }]
  eventLog: [],        // [{ id, set, type, team?, scoreA, scoreB, time }]
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
        status: 'playing',
        startedAt: new Date().toISOString(),
      }
    }

    case 'ADD_POINT': {
      if (state.status !== 'playing') return state

      const team      = action.payload        // 'A' | 'B'
      const other     = team === 'A' ? 'B' : 'A'
      const isTiebreak = state.currentSet === state.maxSets
      const setsToWin  = Math.ceil(state.maxSets / 2)

      const newScore  = state[`team${team}`].score + 1
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

      // Set ganado
      const newSets = state[`team${team}`].sets + 1
      const setHistory = [...state.setHistory, {
        set: state.currentSet,
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
      const team = action.payload
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
      return {
        ...state,
        teamA: { ...state.teamA, score: 0 },
        teamB: { ...state.teamB, score: 0 },
        currentSet: state.currentSet + 1,
        status: 'playing',
        setWinner: null,
        serving: state.setWinner === 'A' ? 'B' : 'A',
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

// ─── Context ──────────────────────────────────
const MatchContext = createContext(null)

export function MatchProvider({ children }) {
  const [match, dispatch] = useReducer(matchReducer, initialMatch)

  const setupMatch = useCallback((config) => {
    dispatch({ type: 'SETUP_MATCH', payload: config })
    // TODO (backend): matchService.create(config)
  }, [])

  const addPoint = useCallback((team) => {
    dispatch({ type: 'ADD_POINT', payload: team })
    // TODO (backend): matchService.recordPoint(match.id, { team, type: 'point' })
  }, [])

  const removePoint = useCallback((team) => {
    dispatch({ type: 'REMOVE_POINT', payload: team })
  }, [])

  const nextSet  = useCallback(() => dispatch({ type: 'NEXT_SET' }), [])
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
