/**
 * utils/response.js
 * Helpers para respuestas HTTP estandarizadas.
 * Todos los controllers usan estas funciones para mantener
 * un formato consistente en toda la API.
 */

export const ok      = (res, data, status = 200) => res.status(status).json({ ok: true,  data })
export const created = (res, data)               => res.status(201).json({ ok: true,  data })
export const notFound = (res, msg = 'Not found') => res.status(404).json({ ok: false, message: msg })
export const badRequest = (res, msg)             => res.status(400).json({ ok: false, message: msg })
export const serverError = (res, msg = 'Internal server error') =>
  res.status(500).json({ ok: false, message: msg })
