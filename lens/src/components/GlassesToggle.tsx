import { useLens } from '@/state/store'

export default function GlassesToggle() {
  const glassesOn = useLens((s) => s.glassesOn)
  const toggle = useLens((s) => s.toggleGlasses)
  return (
    <button
      className="hud-pill glasses-toggle"
      onClick={toggle}
      aria-pressed={glassesOn}
      title="Lift the correction to see the uncorrected world"
    >
      <span className={`dot ${glassesOn ? 'on' : 'off'}`} />
      Glasses: {glassesOn ? 'On' : 'Off'}
    </button>
  )
}
