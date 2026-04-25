import { useMatch } from '../context/MatchContext'

export default function WinnerScreen() {
  const { match, resetMatch } = useMatch()
  if (match.status !== 'match_over') return null

  const winner = match.winner === 'A' ? match.teamA : match.teamB
  const loser  = match.winner === 'A' ? match.teamB : match.teamA

  return (
    <div className="winner-overlay">
      <div className="text-center p-4" style={{ maxWidth: 480, width: '100%' }}>
        <div className="winner-trophy">🏆</div>

        <p className="form-label-custom mt-3 mb-2" style={{ color: 'var(--text-muted)' }}>
          CAMPEÓN DEL PARTIDO
        </p>
        <h1 className="font-display mb-2" style={{ fontSize: 'clamp(36px, 8vw, 56px)', color: winner.color }}>
          {winner.name.toUpperCase()}
        </h1>

        {/* Final sets score */}
        <div className="d-flex justify-content-center align-items-center gap-4 mb-4">
          <div className="text-center">
            <div className="font-display" style={{ fontSize: 56, color: winner.color }}>{winner.sets}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>sets</div>
          </div>
          <span className="font-display" style={{ fontSize: 28, color: 'var(--text-dim)' }}>–</span>
          <div className="text-center">
            <div className="font-display" style={{ fontSize: 56, color: 'var(--text-muted)' }}>{loser.sets}</div>
            <div style={{ fontSize: 12, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>sets</div>
          </div>
        </div>

        {/* Set-by-set breakdown */}
        <div className="card-dark p-3 mb-4 mx-auto" style={{ maxWidth: 320 }}>
          <p className="form-label-custom mb-3">Resumen de sets</p>
          <div className="d-flex flex-column gap-2">
            {match.setHistory.map(s => (
              <div key={s.set} className="d-flex align-items-center gap-3">
                <span style={{ fontSize: 11, color: 'var(--text-dim)', width: 36, textAlign: 'right' }}>
                  Set {s.set}
                </span>
                <div className="d-flex align-items-center gap-2 flex-fill justify-content-center">
                  <span className="font-display" style={{
                    fontSize: 22, color: s.winner === 'A' ? match.teamA.color : 'var(--text-muted)'
                  }}>{s.scoreA}</span>
                  <span style={{ color: 'var(--text-dim)', fontSize: 12 }}>–</span>
                  <span className="font-display" style={{
                    fontSize: 22, color: s.winner === 'B' ? match.teamB.color : 'var(--text-muted)'
                  }}>{s.scoreB}</span>
                </div>
                <div style={{ width: 20, textAlign: 'center' }}>
                  {s.winner === (match.winner) && <i className="bi bi-check-circle-fill" style={{ color: winner.color, fontSize: 12 }} />}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="btn py-3 px-5"
          style={{
            background: 'rgba(255,255,255,0.06)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            fontFamily: 'var(--font-display)',
            fontSize: 18,
            letterSpacing: '0.06em',
          }}
          onClick={resetMatch}
        >
          NUEVO PARTIDO
        </button>
      </div>
    </div>
  )
}
