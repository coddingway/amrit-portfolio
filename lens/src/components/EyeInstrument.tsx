import {
  selectAccommodationD,
  selectGazeDistanceM,
  selectNetLensD,
  useLens,
} from '@/state/store'
import { clamp, defocusAt, SOLVE_TOLERANCE_D } from '@/optics/engine'

/**
 * The always-on corner ray diagram. Never interactive — it just mirrors where
 * the gaze target's image lands relative to the retina, live.
 */
export default function EyeInstrument() {
  const eye = useLens((s) => s.eye)
  const net = useLens(selectNetLensD)
  const acc = useLens(selectAccommodationD)
  const gaze = useLens(selectGazeDistanceM)

  const focusError = defocusAt(gaze, eye, net, acc)
  const sharp = Math.abs(focusError) <= SOLVE_TOLERANCE_D

  const retinaX = 118
  const offset = clamp(focusError * 9, -26, 26) // +error focuses short (toward the lens)
  const focusX = sharp ? retinaX : retinaX - offset
  const spread = clamp(Math.abs(focusError) * 5, 0, 12)

  const status = sharp ? 'in focus' : focusError > 0 ? 'focuses short' : 'focuses long'
  const focusColor = sharp ? '#4FD08A' : '#E8A33D'

  return (
    <div className="hud-panel eye-instrument">
      <div className="eye-head">Eye · live</div>
      <svg viewBox="0 0 152 96" role="img" aria-label={`Eye diagram: ${status}`}>
        <line x1="40" y1="48" x2="132" y2="48" stroke="rgba(255,255,255,0.25)" strokeWidth="0.5" strokeDasharray="4 4" />
        <circle cx="88" cy="48" r="32" fill="none" stroke="#C9D2DB" strokeWidth="1" />
        <path d="M88 16 A32 32 0 0 1 88 80" fill="none" stroke="#E0654F" strokeWidth="2.5" />
        <path d="M62 28 Q51 48 62 68 Q73 48 62 28 Z" fill="rgba(45,127,249,0.3)" stroke="#8FBFFF" strokeWidth="0.8" />
        <g stroke="#E8A33D" strokeWidth="1.5" fill="none">
          <polyline points={`44,38 62,38 ${focusX},48`} />
          <polyline points={`44,58 62,58 ${focusX},48`} />
          {!sharp && (
            <>
              <line x1={focusX} y1="48" x2="118" y2={48 - spread} />
              <line x1={focusX} y1="48" x2="118" y2={48 + spread} />
            </>
          )}
        </g>
        {!sharp && (
          <line x1="118" y1={48 - spread} x2="118" y2={48 + spread} stroke="#E0654F" strokeWidth="3" strokeOpacity="0.4" strokeLinecap="round" />
        )}
        <circle cx={focusX} cy="48" r="3" fill={focusColor} />
      </svg>
      <div className="eye-status" style={{ color: focusColor }}>
        {status}
      </div>
    </div>
  )
}
