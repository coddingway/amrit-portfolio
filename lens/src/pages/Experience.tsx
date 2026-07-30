import { selectActiveMode, useLens } from '@/state/store'
import type { LensKind } from '@/optics/types'
import { describeEye } from '@/lib/format'
import Scene from '@/components/Scene'
import TopBar from '@/components/TopBar'
import EyeInstrument from '@/components/EyeInstrument'
import LensRack from '@/components/LensRack'
import LensTray from '@/components/LensTray'
import HotColdMeter from '@/components/HotColdMeter'
import GlassesToggle from '@/components/GlassesToggle'

export default function Experience() {
  const mode = useLens(selectActiveMode)
  const addLens = useLens((s) => s.addLens)
  const solved = useLens((s) => s.solved)
  const eye = useLens((s) => s.eye)
  const newPatient = useLens((s) => s.newPatient)
  const goLanding = useLens((s) => s.goLanding)

  if (!mode) return null

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const kind = e.dataTransfer.getData('application/lens-kind')
    if (kind === 'convex' || kind === 'concave') addLens(kind as LensKind)
  }

  return (
    <main className="experience" onDrop={onDrop} onDragOver={(e) => e.preventDefault()}>
      <Scene />

      <div className="hud">
        <TopBar />
        <EyeInstrument />
        <GlassesToggle />
        <LensRack />
        <LensTray />
        {mode.showMeter && <HotColdMeter />}

        {mode.showMeter && solved && (
          <div className="win-banner">
            <div className="win-title">Corrected — 20/20.</div>
            <div className="win-sub">{describeEye(eye)}</div>
            <div className="win-actions">
              <button className="hud-pill primary" onClick={newPatient}>
                Next patient →
              </button>
              <button className="hud-pill" onClick={goLanding}>
                Home
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
