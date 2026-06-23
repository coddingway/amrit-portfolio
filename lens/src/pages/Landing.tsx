import { MODES, type ModeId } from '@/config/modes'
import { useLens } from '@/state/store'

const ORDER: ModeId[] = ['nearsighted', 'farsighted', 'game']

export default function Landing() {
  const openMode = useLens((s) => s.openMode)

  return (
    <main className="landing">
      <div className="landing-inner">
        <header className="hero">
          <div className="hero-badge">Lens · a physics experiment</div>
          <h1>See how you see.</h1>
          <p className="hero-lede">
            Put on a pair of imperfect eyes, drag lenses in front of them, and watch the world
            snap into focus — with the physics drawn live beside you.
          </p>
        </header>

        <section className="mode-cards">
          {ORDER.map((id) => {
            const m = MODES[id]
            return (
              <button
                key={id}
                className={`mode-card ${id === 'game' ? 'is-game' : ''}`}
                onClick={() => openMode(id)}
              >
                <LensGlyph id={id} />
                <h2>{m.cardTitle}</h2>
                <p>{m.cardBlurb}</p>
                <span className="card-cta">{id === 'game' ? 'Play →' : 'Explore →'}</span>
              </button>
            )
          })}
        </section>

        <footer className="landing-foot">
          Rebuilt from a Class 12 physics project · best on a big screen.
        </footer>
      </div>
    </main>
  )
}

function LensGlyph({ id }: { id: ModeId }) {
  return (
    <span className="card-glyph" aria-hidden="true">
      <svg viewBox="0 0 56 56">
        <circle cx="28" cy="28" r="26" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        {id === 'nearsighted' && (
          <path d="M18 12 L38 12 Q26 28 38 44 L18 44 Q30 28 18 12 Z" fill="rgba(45,127,249,0.22)" stroke="#8FBFFF" strokeWidth="1.4" />
        )}
        {id === 'farsighted' && (
          <path d="M28 8 Q12 28 28 48 Q44 28 28 8 Z" fill="rgba(45,127,249,0.28)" stroke="#8FBFFF" strokeWidth="1.4" />
        )}
        {id === 'game' && (
          <text x="28" y="38" textAnchor="middle" fontSize="28" fontWeight="600" fill="#E8A33D">
            ?
          </text>
        )}
      </svg>
    </span>
  )
}
