import { useState, useEffect, useRef } from 'react'
import { useMatch, SETS_TO_WIN_MATCH } from '../context/MatchContext'

function TeamScore({ team, teamKey, isServing }) {
  const { match, addPoint, removePoint } = useMatch()
  const prevScore = useRef(match[`team${teamKey}`].score)
  const [pulse, setPulse] = useState(false)
  const data = match[`team${teamKey}`]

  useEffect(() => {
    if (data.score > prevScore.current) {
      setPulse(true)
      setTimeout(() => setPulse(false), 400)
    }
    prevScore.current = data.score
  }, [data.score])

  const isPlaying = match.status === 'playing'
  const setsToWin = Math.ceil(match.maxSets / 2)

  return (
    <div className="d-flex flex-column align-items-center gap-3" style={{ flex: 1 }}>
      {/* Team name + color bar */}
      <div className="text-center">
        <div style={{ width: 40, height: 3, borderRadius: 2, background: data.color, margin: '0 auto 8px' }} />
        <h2 className="font-display text-bright mb-1" style={{ fontSize: 'clamp(16px, 3vw, 22px)', letterSpacing: '0.06em' }}>
          {data.name.toUpperCase()}
        </h2>
        {isServing && (
          <div className="serving-badge mx-auto" style={{ width: 'fit-content' }}>
            <span className="dot" />
            SACANDO
          </div>
        )}
      </div>

      {/* Score */}
      <div
        className={`score-number ${pulse ? 'score-pulse' : ''}`}
        style={{ color: data.color }}
      >
        {String(data.score).padStart(2, '0')}
      </div>

      {/* Controls */}
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn-score btn-score-sub"
          onClick={() => removePoint(teamKey)}
          disabled={!isPlaying || data.score === 0}
          title="Quitar punto"
        >
          −
        </button>
        <button
          className="btn-score btn-score-add"
          onClick={() => addPoint(teamKey)}
          disabled={!isPlaying}
          style={{ background: data.color }}
          title="Agregar punto"
        >
          +
        </button>
      </div>

      {/* Sets won */}
      <div className="d-flex gap-2">
        {Array.from({ length: setsToWin }).map((_, i) => (
          <div key={i} className={`set-pip ${
            i < data.sets ? 'won' : 'lost'
          }`}>
            {i < data.sets ? '●' : '○'}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ScorePanel() {
  const { match } = useMatch()

  return (
    <div className="card-dark p-3 p-md-4">
      {/* Set info */}
      <div className="text-center mb-3">
        <span className="font-display" style={{ fontSize: 13, color: 'var(--text-muted)', letterSpacing: '0.12em' }}>
          SET {match.currentSet} / {match.maxSets}
        </span>
        {match.currentSet === match.maxSets && (
          <span className="ms-2" style={{ fontSize: 11, color: 'var(--accent-gold)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            · Tie-break (15 pts)
          </span>
        )}
      </div>

      {/* Scores */}
      <div className="d-flex align-items-center gap-2 gap-md-4">
        <TeamScore teamKey="A" isServing={match.serving === 'A'} />

        {/* VS divider */}
        <div className="divider-v" style={{ minHeight: 180 }}>
          <div className="d-flex flex-column align-items-center justify-content-center h-100 gap-2" style={{ minHeight: 180, padding: '0 4px' }}>
            <span className="font-display" style={{ color: 'var(--text-dim)', fontSize: 18, letterSpacing: '0.1em' }}>
              VS
            </span>
          </div>
        </div>

        <TeamScore teamKey="B" isServing={match.serving === 'B'} />
      </div>

      {/* Set history */}
      {match.setHistory.length > 0 && (
        <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="form-label-custom mb-2">Historial de sets</p>
          <div className="d-flex gap-2 flex-wrap">
            {match.setHistory.map((s) => (
              <div key={s.set} className="card-dark-inner px-3 py-2 text-center" style={{ minWidth: 80 }}>
                <div style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.08em', marginBottom: 4 }}>
                  SET {s.set}
                </div>
                <div className="d-flex align-items-center gap-2 justify-content-center">
                  <span style={{
                    fontSize: 18, fontFamily: 'var(--font-display)',
                    color: s.winner === 'A' ? match.teamA.color : 'var(--text-muted)',
                    fontWeight: s.winner === 'A' ? 700 : 400,
                  }}>{s.scoreA}</span>
                  <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>–</span>
                  <span style={{
                    fontSize: 18, fontFamily: 'var(--font-display)',
                    color: s.winner === 'B' ? match.teamB.color : 'var(--text-muted)',
                    fontWeight: s.winner === 'B' ? 700 : 400,
                  }}>{s.scoreB}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
