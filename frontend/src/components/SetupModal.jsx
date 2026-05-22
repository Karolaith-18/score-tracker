import { useState } from 'react'
import { useMatch } from '../context/MatchContext'
import { PRESET_COLORS_A, PRESET_COLORS_B, FORMAT_OPTIONS } from '../config/game.js'

export default function SetupModal() {
  const { setupMatch } = useMatch()

  const [form, setForm] = useState({
    teamAName: '',
    teamBName: '',
    teamAColor: '#3b7fff',
    teamBColor: '#ff3b3b',
    maxSets: 5,
    serving: 'A',
  })

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setupMatch({
      ...form,
      teamAName: form.teamAName.trim() || 'Equipo A',
      teamBName: form.teamBName.trim() || 'Equipo B',
    })
  }

  return (
    <div className="modal-backdrop-custom">
      <div className="modal-custom">
        {/* Header */}
        <div className="text-center mb-4">
          <img src="/volleyball.svg" width="40" height="40" alt="volleyball" className="mb-3" />
          <h2 className="font-display text-bright mb-1" style={{ fontSize: '28px' }}>NUEVO PARTIDO</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Configura el partido antes de comenzar</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Teams */}
          <div className="row g-3 mb-4">
            {/* Team A */}
            <div className="col-6">
              <div className="card-dark-inner p-3">
                <div style={{ width: 32, height: 4, borderRadius: 2, background: form.teamAColor, marginBottom: 12 }} />
                <label className="form-label-custom">Equipo Local</label>
                <input
                  type="text"
                  className="form-control form-control-dark mb-3"
                  placeholder="Equipo A"
                  value={form.teamAName}
                  onChange={e => set('teamAName', e.target.value)}
                  maxLength={20}
                />
                <div className="d-flex gap-2 flex-wrap">
                  {PRESET_COLORS_A.map(c => (
                    <button key={c} type="button"
                      onClick={() => set('teamAColor', c)}
                      style={{
                        width: 24, height: 24, borderRadius: '50%', background: c, border: 'none',
                        outline: form.teamAColor === c ? `2px solid #fff` : 'none',
                        outlineOffset: 2, cursor: 'pointer',
                        transform: form.teamAColor === c ? 'scale(1.2)' : 'scale(1)',
                        transition: 'transform 0.15s',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Team B */}
            <div className="col-6">
              <div className="card-dark-inner p-3">
                <div style={{ width: 32, height: 4, borderRadius: 2, background: form.teamBColor, marginBottom: 12 }} />
                <label className="form-label-custom">Equipo Visitante</label>
                <input
                  type="text"
                  className="form-control form-control-dark mb-3"
                  placeholder="Equipo B"
                  value={form.teamBName}
                  onChange={e => set('teamBName', e.target.value)}
                  maxLength={20}
                />
                <div className="d-flex gap-2 flex-wrap">
                  {PRESET_COLORS_B.map(c => (
                    <button key={c} type="button"
                      onClick={() => set('teamBColor', c)}
                      style={{
                        width: 24, height: 24, borderRadius: '50%', background: c, border: 'none',
                        outline: form.teamBColor === c ? `2px solid #fff` : 'none',
                        outlineOffset: 2, cursor: 'pointer',
                        transform: form.teamBColor === c ? 'scale(1.2)' : 'scale(1)',
                        transition: 'transform 0.15s',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Format */}
          <div className="row g-3 mb-4">
            <div className="col-6">
              <label className="form-label-custom">Formato</label>
              <select
                className="form-select form-control-dark"
                value={form.maxSets}
                onChange={e => set('maxSets', Number(e.target.value))}
              >
                {FORMAT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="col-6">
              <label className="form-label-custom">Saca primero</label>
              <div className="d-flex gap-2">
                {['A', 'B'].map(t => (
                  <button
                    key={t} type="button"
                    onClick={() => set('serving', t)}
                    className="flex-fill py-2"
                    style={{
                      borderRadius: 10,
                      border: form.serving === t
                        ? `1px solid ${t === 'A' ? form.teamAColor : form.teamBColor}`
                        : '1px solid rgba(255,255,255,0.08)',
                      background: form.serving === t
                        ? `${t === 'A' ? form.teamAColor : form.teamBColor}22`
                        : 'transparent',
                      color: form.serving === t ? '#fff' : 'var(--text-muted)',
                      fontWeight: 500,
                      fontSize: 13,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {t === 'A'
                      ? (form.teamAName.trim() || 'Equipo A')
                      : (form.teamBName.trim() || 'Equipo B')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button type="submit" className="btn w-100 py-3" style={{
            background: 'var(--accent-blue)',
            color: '#fff',
            borderRadius: 12,
            fontFamily: 'var(--font-display)',
            fontSize: '18px',
            letterSpacing: '0.06em',
            border: 'none',
          }}>
            INICIAR PARTIDO
          </button>
        </form>
      </div>
    </div>
  )
}
