/**
 * utils/response.js
 * Helpers para respuestas HTTP estandarizadas.
 */

export const ok      = (res, data, status = 200) => res.status(status).json({ ok: true, data })
export const fail    = (res, msg, status = 400)  => res.status(status).json({ ok: false, message: msg })
export const created = (res, data)               => res.status(201).json({ ok: true, data })