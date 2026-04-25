/**
 * middlewares/errorHandler.js
 * Captura cualquier error que llegue con next(err).
 * Debe registrarse ÚLTIMO en el index.js (después de todas las rutas).
 */

export function errorHandler(err, _req, res, _next) {
  console.error('[Error]', err.message)
  res.status(err.status || 500).json({
    ok:      false,
    message: err.message || 'Internal server error',
  })
}
