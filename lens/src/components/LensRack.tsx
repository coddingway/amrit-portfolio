import { LENS_STEP_D, MAX_LENSES, useLens } from '@/state/store'
import { netLensPower } from '@/optics/engine'
import { formatDioptres } from '@/lib/format'

/** The lens action-bar: the stacked lenses, plus a power dial for the selected one. */
export default function LensRack() {
  const lenses = useLens((s) => s.lenses)
  const selectedId = useLens((s) => s.selectedLensId)
  const selectLens = useLens((s) => s.selectLens)
  const removeLens = useLens((s) => s.removeLens)
  const nudge = useLens((s) => s.nudgeSelectedPower)

  const total = netLensPower(lenses)
  const selected = lenses.find((l) => l.id === selectedId) ?? null
  const emptyCount = MAX_LENSES - lenses.length

  return (
    <div className="hud-panel lens-rack">
      <div className="rack-slots">
        {lenses.map((l) => (
          <div
            key={l.id}
            className={`slot filled ${l.id === selectedId ? 'selected' : ''} ${l.kind}`}
            onClick={() => selectLens(l.id)}
            role="button"
            tabIndex={0}
          >
            <span className="slot-power">{formatDioptres(l.powerD, false)}</span>
            <button
              className="slot-remove"
              onClick={(e) => {
                e.stopPropagation()
                removeLens(l.id)
              }}
              title="Remove this lens"
              aria-label="Remove lens"
            >
              ✕
            </button>
          </div>
        ))}
        {Array.from({ length: emptyCount }).map((_, i) => (
          <div key={`empty-${i}`} className="slot empty" />
        ))}
      </div>

      <div className="rack-divider" />

      <div className="rack-dial">
        <button
          className="dial-btn"
          disabled={!selected}
          onClick={() => nudge(-LENS_STEP_D)}
          aria-label="Decrease power"
        >
          −
        </button>
        <div className="dial-readout">
          <div className="dial-total">{formatDioptres(total)}</div>
          <div className="dial-label">
            {selected ? `editing ${formatDioptres(selected.powerD, false)}` : 'total power'}
          </div>
        </div>
        <button
          className="dial-btn"
          disabled={!selected}
          onClick={() => nudge(LENS_STEP_D)}
          aria-label="Increase power"
        >
          +
        </button>
      </div>
    </div>
  )
}
