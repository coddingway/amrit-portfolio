/** Shown only on narrow viewports (see styles.css). Mobile is a later phase. */
export default function SmallScreenGate() {
  return (
    <div className="small-screen-gate">
      <div className="ssg-card">
        <div className="ssg-emoji">🔬</div>
        <h2>Built for a bigger screen</h2>
        <p>
          Lens uses precise dragging and a wide heads-up display. Open it on a desktop or laptop
          for the full experiment.
        </p>
      </div>
    </div>
  )
}
