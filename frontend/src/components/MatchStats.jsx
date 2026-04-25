import { useMatch } from '../context/MatchContext'

export default function MatchStats() {
  const { match, setServing } = useMatch()
  const { teamA, teamB } = match

  const totalPoints = teamA.score + teamB.score
  const pctA = totalPoints ? Math.round((teamA.score / totalPoints) * 100) : 50
  const pctB = 100 - pctA

  // Count total points scored per team across all sets
  const totalA = match.setHistory.reduce((acc, s) => acc + s.scoreA, 0) + teamA.score
  const totalB = match.setHistory.reduce((acc, s) => acc + s.scoreB, 0) + teamB.score

  return (
    <div className="card-dark p-3 d-flex flex-column gap-3">
      <span className="form-label-custom">
        <i className="bi bi-bar-chart-fill me-1" />
        Estadísticas del partido
      </span>

      {/* Points this set */}
      <div>
        <div className="d-flex justify-content-between mb-1" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          <span>{teamA.name}: {teamA.score}</span>
          <span style={{ color: 'var(--text-dim)', fontSize: 11 }}>Puntos este set</span>
          <span>{teamB.name}: {teamB.score}</span>
        </div>
        <div className="d-flex" style={{ height: 8, borderRadius: 4, overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
          <div style={{ width: `${pctA}%`, background: teamA.color, transition: 'width 0.3s ease' }} />
          <div style={{ width: `${pctB}%`, background: teamB.color, transition: 'width 0.3s ease' }} />
        </div>
      </div>

      {/* Total points match */}
      {(totalA + totalB) > 0 && (
        <div>
          <div className="d-flex justify-content-between mb-1" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            <span>{totalA}</span>
            <span style={{ color: 'var(--text-dim)', fontSize: 11 }}>Total puntos partido</span>
            <span>{totalB}</span>
          </div>
          <div className="d-flex" style={{ height: 8, borderRadius: 4, overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
            <div style={{
              width: `${Math.round((totalA / (totalA + totalB)) * 100)}%`,
              background: teamA.color, transition: 'width 0.3s ease'
            }} />
            <div style={{
              width: `${Math.round((totalB / (totalA + totalB)) * 100)}%`,
              background: teamB.color, transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      )}

      {/* Divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />

      {/* Manual serving toggle */}
      <div>
        <p className="form-label-custom mb-2">Cambiar saque</p>
        <div className="d-flex gap-2">
          {['A','B'].map(t => {
            const team = match[`team${t}`]
            const active = match.serving === t
            return (
              <button
                key={t}
                disabled={match.status !== 'playing'}
                onClick={() => setServing(t)}
                className="flex-fill py-2"
                style={{
                  borderRadius: 8,
                  border: active ? `1px solid ${team.color}` : '1px solid rgba(255,255,255,0.06)',
                  background: active ? `${team.color}22` : 'transparent',
                  color: active ? '#fff' : 'var(--text-dim)',
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: match.status === 'playing' ? 'pointer' : 'not-allowed',
                  transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                }}
              >
                {active && <span style={{ width: 6, height: 6, borderRadius: '50%', background: team.color }} />}
                {team.name}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
