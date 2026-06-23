import { selectCloseness, selectResidualD, useLens } from '@/state/store'
import { temperature } from '@/optics/engine'

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

/** Game-mode-only gauge: how close the correction is, hot (top) to cold (bottom). */
export default function HotColdMeter() {
  const closeness = useLens(selectCloseness)
  const residual = useLens(selectResidualD)
  const solved = useLens((s) => s.solved)

  const temp = temperature(residual)
  const fillPct = Math.max(4, Math.min(96, closeness * 100))

  return (
    <div className="hud-panel hotcold">
      <div className="hc-cap hot">hot</div>
      <div className="hc-track">
        <div className="hc-fill" style={{ height: `${fillPct}%` }} />
        <div className="hc-marker" style={{ bottom: `${fillPct}%` }} />
      </div>
      <div className="hc-cap cold">cold</div>
      <div className={`hc-readout ${temp}`}>{solved ? '✓ Perfect' : cap(temp)}</div>
    </div>
  )
}
