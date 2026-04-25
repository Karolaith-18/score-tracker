import { useMatch } from '../context/MatchContext'

export default function SetOverBanner() {
  const { match, nextSet } = useMatch()
  if (match.status !== 'set_over') return null

  const winner = match.setWinner === 'A' ? match.teamA : match.teamB

  return (
    <div className="modal-backdrop-custom">
      <div className="modal-custom text-center">
        <div style={{ fontSize: 60, marginBottom: 8 }}>🏐</div>
        <p className="form-label-custom mb-1">SET {match.currentSet} TERMINADO</p>
        <h2 className="font-display mb-3" style={{ fontSize: 32, color: winner.color }}>
          {winner.name.toUpperCase()} GANA EL SET
        </h2>

        {/* Score of set */}
        {match.setHistory.slice(-1).map(s => (
          <div key={s.set} className="d-flex justify-content-center align-items-center gap-3 mb-4">
            <span className="font-display" style={{ fontSize: 42, color: match.teamA.color }}>{s.scoreA}</span>
            <span style={{ color: 'var(--text-dim)', fontSize: 20 }}>–</span>
            <span className="font-display" style={{ fontSize: 42, color: match.teamB.color }}>{s.scoreB}</span>
          </div>
        ))}

        {/* Sets score */}
        <div className="d-flex justify-content-center gap-4 mb-4">
          {['A','B'].map(t => {
            const team = match[`team${t}`]
            return (
              <div key={t} className="text-center">
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {team.name}
                </div>
                <div className="font-display" style={{ fontSize: 28, color: team.color }}>{team.sets}</div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>sets</div>
              </div>
            )
          })}
        </div>

        <button
          className="btn w-100 py-3"
          style={{
            background: 'var(--accent-blue)',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            fontFamily: 'var(--font-display)',
            fontSize: 18,
            letterSpacing: '0.06em',
          }}
          onClick={nextSet}
        >
          CONTINUAR — SET {match.currentSet + 1}
          {match.currentSet + 1 === match.maxSets && ' (TIE-BREAK)'}
        </button>
      </div>
    </div>
  )
}
