import { selectActiveMode, useLens } from '@/state/store'
import { describeEye } from '@/lib/format'

export default function TopBar() {
  const goLanding = useLens((s) => s.goLanding)
  const lighting = useLens((s) => s.lighting)
  const setLighting = useLens((s) => s.setLighting)
  const mode = useLens(selectActiveMode)
  const eye = useLens((s) => s.eye)
  const revealed = useLens((s) => s.revealed)

  if (!mode) return null

  const title = revealed ? describeEye(eye) : mode.objective
  const subtitle = mode.showMeter
    ? revealed
      ? 'diagnosis revealed'
      : 'patient · find the fix'
    : 'drag a lens into view'

  return (
    <header className="topbar">
      <button className="hud-pill" onClick={goLanding}>
        ← Home
      </button>

      <div className="objective hud-panel">
        <div className="objective-title">{title}</div>
        <div className="objective-sub">{subtitle}</div>
      </div>

      <button
        className="hud-pill"
        onClick={() => setLighting(lighting === 'day' ? 'night' : 'day')}
        title="Toggle daylight — the dark dilates the pupil and worsens blur"
      >
        {lighting === 'day' ? '☀ Day' : '☾ Night'}
      </button>
    </header>
  )
}
