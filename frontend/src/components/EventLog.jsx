import { useMatch } from '../context/MatchContext'

function LogIcon({ type, team, match }) {
  if (type === 'set_over' || type === 'match_over') {
    return <i className="bi bi-trophy-fill text-gold" style={{ fontSize: 12 }} />
  }
  if (type === 'correction') {
    return <i className="bi bi-pencil" style={{ fontSize: 11, color: 'var(--text-muted)' }} />
  }
  const color = team === 'A' ? match.teamA.color : match.teamB.color
  return <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
}

function formatEntry(entry, match) {
  const teamName = entry.team === 'A' ? match.teamA.name : match.teamB.name
  if (entry.type === 'set_over') return `Set ${entry.set} — Gana ${teamName}`
  if (entry.type === 'match_over') return `🏆 Partido — Gana ${teamName}`
  if (entry.type === 'correction') return `Corrección punto ${teamName}`
  return `Punto ${teamName}  ${entry.scoreA}–${entry.scoreB}`
}

export default function EventLog() {
  const { match } = useMatch()

  return (
    <div className="card-dark p-3 h-100 d-flex flex-column" style={{ minHeight: 200 }}>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <span className="form-label-custom mb-0">
          <i className="bi bi-list-ul me-1" />
          Bitácora
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>
          {match.eventLog.length} eventos
        </span>
      </div>

      <div className="d-flex flex-column gap-1 overflow-auto" style={{ maxHeight: 380, flex: 1 }}>
        {match.eventLog.length === 0 && (
          <div className="text-center py-4" style={{ color: 'var(--text-dim)', fontSize: 13 }}>
            <i className="bi bi-journal mb-2 d-block" style={{ fontSize: 24 }} />
            Sin eventos aún
          </div>
        )}

        {match.eventLog.map((entry) => (
          <div
            key={entry.id}
            className={`log-entry ${
              entry.type === 'point' ? (entry.team === 'A' ? 'log-point-a' : 'log-point-b') :
              entry.type === 'set_over' || entry.type === 'match_over' ? 'log-set' : ''
            }`}
          >
            <div className="d-flex align-items-center gap-2">
              <LogIcon type={entry.type} team={entry.team} match={match} />
              <span style={{ flex: 1 }}>{formatEntry(entry, match)}</span>
              <span style={{ fontSize: 11, color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>{entry.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
