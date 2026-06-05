import { useEffect, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'

/**
 * SplashCursor — sitewide custom cursor (pointer-fine devices only).
 *
 * Layers:
 *  • Dot  (7px)  — snaps instantly to mouse position
 *  • Ring (36px) — follows with GSAP quickSetter lerp (smooth lag)
 *  • Blob (80px) — heavy lerp, blurred — active on /photography only
 *
 * Behaviours:
 *  • Click      → splash particles burst from cursor position
 *  • Hover link/button → ring expands, dot hides (magnetic feel)
 *  • All colours driven by var(--accent) → auto-switches to Bayern red on /football
 */
export default function SplashCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const blobRef = useRef<HTMLDivElement>(null)

  const { pathname } = useLocation()
  const isPhoto = pathname === '/photography'

  // ── Splash particles ────────────────────────────────────────────────────────
  const splash = useCallback((x: number, y: number) => {
    const COUNT  = 10
    const accent = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent').trim() || '#c41ed4'

    for (let i = 0; i < COUNT; i++) {
      const p    = document.createElement('div')
      const size = 3 + Math.random() * 3.5
      Object.assign(p.style, {
        position:      'fixed',
        left:          `${x}px`,
        top:           `${y}px`,
        width:         `${size}px`,
        height:        `${size}px`,
        borderRadius:  '50%',
        background:    accent,
        pointerEvents: 'none',
        zIndex:        '9996',
        transform:     'translate(-50%, -50%)',
        boxShadow:     `0 0 4px ${accent}`,
      })
      document.body.appendChild(p)

      const angle    = (i / COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.5
      const dist     = 20 + Math.random() * 38

      gsap.to(p, {
        x:        Math.cos(angle) * dist,
        y:        Math.sin(angle) * dist,
        opacity:  0,
        scale:    0,
        duration: 0.5 + Math.random() * 0.25,
        ease:     'power2.out',
        onComplete: () => p.remove(),
      })
    }
  }, [])

  // ── Main effect ─────────────────────────────────────────────────────────────
  useEffect(() => {
    // Only run on real pointer (mouse) devices
    if (!window.matchMedia('(pointer: fine)').matches) return

    const dot  = dotRef.current
    const ring = ringRef.current
    const blob = blobRef.current
    if (!dot || !ring || !blob) return

    // quickSetters — fastest way to update x/y without creating new tweens
    const setRingX = gsap.quickSetter(ring, 'x', 'px')
    const setRingY = gsap.quickSetter(ring, 'y', 'px')
    const setBlobX = gsap.quickSetter(blob, 'x', 'px')
    const setBlobY = gsap.quickSetter(blob, 'y', 'px')

    let mouseX = -200, mouseY = -200
    let ringX  = -200, ringY  = -200
    let blobX  = -200, blobY  = -200

    const RING_LERP = 0.13
    const BLOB_LERP = 0.07

    // ── RAF ticker ──────────────────────────────────────────────────────────
    const tick = () => {
      // Ring — medium lag
      ringX += (mouseX - ringX) * RING_LERP
      ringY += (mouseY - ringY) * RING_LERP
      setRingX(ringX)
      setRingY(ringY)

      // Blob — heavy lag (photography page only)
      blobX += (mouseX - blobX) * BLOB_LERP
      blobY += (mouseY - blobY) * BLOB_LERP
      setBlobX(blobX)
      setBlobY(blobY)
    }
    gsap.ticker.add(tick)

    // ── Mouse move ──────────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      // Dot is instant — use gsap.set for transform
      gsap.set(dot, { x: mouseX, y: mouseY, opacity: 1 })
    }

    // ── Click — splash burst ────────────────────────────────────────────────
    const onClick = (e: MouseEvent) => {
      splash(e.clientX, e.clientY)
      if (!isPhoto) {
        gsap.timeline()
          .to(ring, { scale: 2.4, opacity: 0.25, duration: 0.22, ease: 'power2.out' })
          .to(ring, { scale: 1,   opacity: 0.7,  duration: 0.5,  ease: 'elastic.out(1, 0.5)' })
      }
    }

    // ── Hover interactive elements ──────────────────────────────────────────
    const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label'

    const onOver = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(INTERACTIVE)) return
      gsap.to(ring, { scale: 1.8, opacity: 0.45, duration: 0.25, ease: 'power2.out' })
      gsap.to(dot,  { scale: 0,                  duration: 0.2  })
      gsap.to(blob, { scale: 1.5, opacity: 0.12, duration: 0.3  })
    }

    const onOut = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest(INTERACTIVE)) return
      gsap.to(ring, { scale: 1,   opacity: 0.7,  duration: 0.3, ease: 'power2.out' })
      gsap.to(dot,  { scale: 1,                  duration: 0.2 })
      gsap.to(blob, { scale: 1,   opacity: 0.08, duration: 0.3 })
    }

    // ── Hide/show when cursor leaves/enters window ──────────────────────────
    const onLeave = () => gsap.to([dot, ring, blob], { opacity: 0, duration: 0.3 })
    const onEnter = () => gsap.to(ring, { opacity: isPhoto ? 0 : 0.7, duration: 0.3 })

    document.addEventListener('mousemove',   onMove)
    document.addEventListener('click',       onClick)
    document.addEventListener('mouseover',   onOver)
    document.addEventListener('mouseout',    onOut)
    document.addEventListener('mouseleave',  onLeave)
    document.addEventListener('mouseenter',  onEnter)

    return () => {
      gsap.ticker.remove(tick)
      document.removeEventListener('mousemove',  onMove)
      document.removeEventListener('click',      onClick)
      document.removeEventListener('mouseover',  onOver)
      document.removeEventListener('mouseout',   onOut)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
    }
  }, [isPhoto, splash])

  // ── Update cursor appearance when page changes ───────────────────────────
  useEffect(() => {
    const ring = ringRef.current
    const blob = blobRef.current
    if (!ring || !blob) return

    if (isPhoto) {
      gsap.to(ring, { opacity: 0,    scale: 1, duration: 0.3 })
      gsap.to(blob, { opacity: 0.08, scale: 1, duration: 0.3 })
    } else {
      gsap.to(ring, { opacity: 0.7,  scale: 1, duration: 0.3 })
      gsap.to(blob, { opacity: 0,    scale: 1, duration: 0.3 })
    }
  }, [isPhoto])

  return (
    <>
      {/* ── Dot — instant ── */}
      <div
        ref={dotRef}
        aria-hidden
        className="fixed pointer-events-none rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          zIndex:     9999,
          width:      '7px',
          height:     '7px',
          background: 'var(--accent)',
          boxShadow:  '0 0 6px var(--accent)',
          opacity:    0,
        }}
      />

      {/* ── Ring — lerp ── */}
      <div
        ref={ringRef}
        aria-hidden
        className="fixed pointer-events-none rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          zIndex:      9998,
          width:       '36px',
          height:      '36px',
          border:      '1px solid var(--accent)',
          opacity:     isPhoto ? 0 : 0.7,
          transition:  'border-color 0.3s ease',
        }}
      />

      {/* ── Blob — heavy lerp, photography only ── */}
      <div
        ref={blobRef}
        aria-hidden
        className="fixed pointer-events-none rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          zIndex:     9997,
          width:      '80px',
          height:     '80px',
          background: 'var(--accent)',
          opacity:    isPhoto ? 0.08 : 0,
          filter:     'blur(22px)',
          transition: 'background 0.3s ease',
        }}
      />
    </>
  )
}
