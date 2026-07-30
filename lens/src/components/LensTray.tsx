import { MAX_LENSES, useLens } from '@/state/store'
import type { LensKind } from '@/optics/types'

/** The convex/concave lenses resting off the right edge. Drag one into the
 *  frame to add it — or click, as a fallback. */
export default function LensTray() {
  const addLens = useLens((s) => s.addLens)
  const count = useLens((s) => s.lenses.length)
  const full = count >= MAX_LENSES

  const onDragStart = (e: React.DragEvent, kind: LensKind) => {
    e.dataTransfer.setData('application/lens-kind', kind)
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <div className="lens-tray" aria-hidden={full}>
      <div className="tray-hint">drag in →</div>
      <button
        className="tray-lens convex"
        draggable={!full}
        onDragStart={(e) => onDragStart(e, 'convex')}
        onClick={() => addLens('convex')}
        disabled={full}
        title="Convex (converging, +) lens"
      >
        <svg viewBox="0 0 40 56" aria-hidden="true">
          <path d="M20 4 Q6 28 20 52 Q34 28 20 4 Z" fill="rgba(45,127,249,0.28)" stroke="#8FBFFF" strokeWidth="1.2" />
        </svg>
        <span>Convex +</span>
      </button>
      <button
        className="tray-lens concave"
        draggable={!full}
        onDragStart={(e) => onDragStart(e, 'concave')}
        onClick={() => addLens('concave')}
        disabled={full}
        title="Concave (diverging, −) lens"
      >
        <svg viewBox="0 0 40 56" aria-hidden="true">
          <path d="M8 4 L32 4 Q22 28 32 52 L8 52 Q18 28 8 4 Z" fill="rgba(45,127,249,0.22)" stroke="#8FBFFF" strokeWidth="1.2" />
        </svg>
        <span>Concave −</span>
      </button>
    </div>
  )
}
