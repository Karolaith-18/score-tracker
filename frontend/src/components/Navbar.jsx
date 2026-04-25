import { useMatch } from '../context/MatchContext'

export default function Navbar() {
  const { match, resetMatch } = useMatch()

  return (
    <nav className="navbar-custom d-flex align-items-center justify-content-between sticky-top">
      <div className="d-flex align-items-center gap-3">
        {/* Volleyball SVG icon */}
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="14" cy="14" r="13" stroke="#3b7fff" strokeWidth="1.5"/>
          <path d="M14 1 Q20 7 20 14 Q20 21 14 27" stroke="#f5c518" strokeWidth="1.2" fill="none"/>
          <path d="M1 14 Q7 8 14 8 Q21 8 27 14" stroke="#f5c518" strokeWidth="1.2" fill="none"/>
          <path d="M14 1 Q8 7 8 14 Q8 21 14 27" stroke="#3b7fff" strokeWidth="1.2" fill="none" strokeDasharray="2 2"/>
          <circle cx="14" cy="14" r="2" fill="#f5c518"/>
        </svg>
        <span className="font-display text-bright" style={{ fontSize: '22px', letterSpacing: '0.06em' }}>
          SCORE TRACKER
        </span>
        <span className="badge" style={{
          background: 'rgba(245,197,24,0.1)',
          color: '#f5c518',
          border: '1px solid rgba(245,197,24,0.2)',
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.1em',
          padding: '3px 8px',
          borderRadius: '20px',
        }}>
          VOLEIBOL
        </span>
      </div>

      <div className="d-flex align-items-center gap-2">
        {match.status !== 'idle' && (
          <span style={{
            fontSize: '12px',
            color: match.status === 'playing' ? '#3b7fff' : '#f5c518',
            display: 'flex', alignItems: 'center', gap: '5px',
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: match.status === 'playing' ? '#3b7fff' : '#f5c518',
              display: 'inline-block',
              animation: match.status === 'playing' ? 'blink 1.2s infinite' : 'none',
            }} />
            {match.status === 'playing' ? `Set ${match.currentSet}` : 'Finalizado'}
          </span>
        )}

        {match.status !== 'idle' && (
          <button
            className="btn btn-sm"
            style={{
              background: 'rgba(255,59,59,0.1)',
              color: '#ff6b6b',
              border: '1px solid rgba(255,59,59,0.2)',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 500,
            }}
            onClick={() => { if (window.confirm('¿Reiniciar partido?')) resetMatch() }}
          >
            <i className="bi bi-arrow-counterclockwise me-1" />
            Reiniciar
          </button>
        )}
      </div>
    </nav>
  )
}
