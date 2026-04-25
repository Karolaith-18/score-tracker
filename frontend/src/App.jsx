import { MatchProvider, useMatch } from './context/MatchContext'
import Navbar        from './components/Navbar'
import SetupModal    from './components/SetupModal'
import ScorePanel    from './components/ScorePanel'
import EventLog      from './components/EventLog'
import MatchStats    from './components/MatchStats'
import SetOverBanner from './components/SetOverBanner'
import WinnerScreen  from './components/WinnerScreen'

function AppContent() {
  const { match } = useMatch()
  const isActive  = match.status !== 'idle'

  return (
    <>
      <Navbar />

      <main className="container-xl py-3 py-md-4 px-3 px-md-4">
        {!isActive ? (
          <div className="row justify-content-center" style={{ minHeight: '70vh', alignItems: 'center' }}>
            <div className="col-12 col-md-8 col-lg-6 text-center">
              <svg width="80" height="80" viewBox="0 0 28 28" fill="none" className="mb-4">
                <circle cx="14" cy="14" r="13" stroke="#3b7fff" strokeWidth="1"/>
                <path d="M14 1 Q20 7 20 14 Q20 21 14 27" stroke="#f5c518" strokeWidth="1.5" fill="none"/>
                <path d="M1 14 Q7 8 14 8 Q21 8 27 14" stroke="#f5c518" strokeWidth="1.5" fill="none"/>
                <path d="M14 1 Q8 7 8 14 Q8 21 14 27" stroke="#3b7fff" strokeWidth="1.5" fill="none" strokeOpacity="0.5"/>
                <circle cx="14" cy="14" r="2.5" fill="#f5c518"/>
              </svg>
              <h1 className="font-display mb-2" style={{ fontSize: 'clamp(40px, 8vw, 64px)', letterSpacing: '0.04em' }}>
                SCORE TRACKER
              </h1>
              <p style={{ color: 'var(--text-muted)', marginBottom: 36, fontSize: 15 }}>
                Marcador oficial para partidos de voleibol
              </p>
              <SetupModal />
            </div>
          </div>
        ) : (
          <div className="row g-3">
            <div className="col-12 col-lg-8">
              <div className="d-flex flex-column gap-3">
                <ScorePanel />
                <MatchStats />
              </div>
            </div>
            <div className="col-12 col-lg-4">
              <EventLog />
            </div>
          </div>
        )}
      </main>

      <SetOverBanner />
      <WinnerScreen />
    </>
  )
}

export default function App() {
  return (
    <MatchProvider>
      <AppContent />
    </MatchProvider>
  )
}
