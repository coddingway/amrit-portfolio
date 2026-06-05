import { useEffect, useRef } from 'react'
import { registerOverlay } from '../lib/transition'

/**
 * PageTransition — a full-viewport dark curtain that slides in/out
 * on every route change. Registered as a module-level singleton so
 * TransitionLink can drive it without React context.
 *
 * Sits at z-[9990] — above everything except the custom cursor (9997+).
 * The overlay itself carries a subtle accent-coloured progress line
 * at the bottom edge so the wipe feels branded, not just a black flash.
 */
export default function PageTransition() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    registerOverlay(ref.current)
    return () => registerOverlay(null)
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position:        'fixed',
        inset:           0,
        zIndex:          9990,
        background:      '#080808',
        transform:       'translateY(-100%)',
        willChange:      'transform',
        pointerEvents:   'none',
      }}
    >
      {/* Accent line at the leading edge (bottom of curtain as it sweeps down) */}
      <div
        style={{
          position:   'absolute',
          bottom:     0,
          left:       0,
          right:      0,
          height:     '2px',
          background: 'linear-gradient(90deg, var(--accent) 0%, var(--accent-dim) 100%)',
          boxShadow:  '0 0 12px var(--accent-glow)',
          opacity:    0.8,
        }}
      />

      {/* Faint AP logo watermark centred on the curtain */}
      <div
        style={{
          position:   'absolute',
          inset:      0,
          display:    'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity:    0.04,
        }}
      >
        <svg
          viewBox="0 0 108 118"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: 96, height: 96, color: 'var(--accent)' }}
        >
          <line x1="54" y1="5"  x2="5"  y2="112" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
          <line x1="54" y1="5"  x2="74" y2="70"  stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
          <circle cx="70" cy="44" r="27" stroke="currentColor" strokeWidth="10" fill="none" />
          <line x1="22" y1="66" x2="98" y2="66"  stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
          <line x1="5"  y1="112" x2="18" y2="112" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}
