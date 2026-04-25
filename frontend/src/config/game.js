/**
 * config/game.js
 * Constantes globales de las reglas de voleibol.
 * Centralizar aquí facilita ajustarlas sin tocar la lógica.
 */

export const POINTS_TO_WIN_SET       = 25
export const POINTS_TO_WIN_TIEBREAK  = 15
export const MIN_LEAD                = 2   // ventaja mínima para ganar un set

export const FORMAT_OPTIONS = [
  { label: 'Al mejor de 3 sets', value: 3 },
  { label: 'Al mejor de 5 sets', value: 5 },
]

export const PRESET_COLORS_A = ['#3b7fff', '#00c48c', '#a855f7', '#f5c518']
export const PRESET_COLORS_B = ['#ff3b3b', '#ff6b00', '#ec4899', '#06b6d4']
