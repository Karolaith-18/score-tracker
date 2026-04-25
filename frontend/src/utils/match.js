/**
 * utils/match.js
 * Funciones puras de lógica del partido (sin estado, sin efectos).
 * Se pueden testear de forma aislada.
 */

import { POINTS_TO_WIN_SET, POINTS_TO_WIN_TIEBREAK, MIN_LEAD } from '../config/game.js'

/**
 * Determina si un equipo ganó el set.
 * @param {number} score         - Puntos del equipo que se evalúa
 * @param {number} opponentScore - Puntos del equipo contrario
 * @param {boolean} isTiebreak   - Si es el set de desempate
 */
export function isSetWon(score, opponentScore, isTiebreak) {
  const target = isTiebreak ? POINTS_TO_WIN_TIEBREAK : POINTS_TO_WIN_SET
  return score >= target && (score - opponentScore) >= MIN_LEAD
}

/**
 * Agrega un evento al inicio del log, con hora local y límite de 200 entradas.
 * @param {Array}  log   - Log actual
 * @param {Object} entry - Datos del nuevo evento
 */
export function appendLog(log, entry) {
  const time = new Date().toLocaleTimeString('es-CO', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
  return [{ id: Date.now(), time, ...entry }, ...log].slice(0, 200)
}
