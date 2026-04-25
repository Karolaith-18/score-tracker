/**
 * middlewares/notFound.js
 * Responde 404 para cualquier ruta no definida.
 * Debe registrarse ANTES del errorHandler y DESPUÉS de las rutas.
 */

export function notFound(_req, res) {
  res.status(404).json({ ok: false, message: 'Ruta no encontrada' })
}
