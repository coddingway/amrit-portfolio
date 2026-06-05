import { useRef } from 'react'
import gsap from 'gsap'

/**
 * BorderGlow — React Bits-style mouse-following border glow.
 *
 * How it works:
 *  1. A radial gradient is positioned at the cursor using CSS custom
 *     properties (--x, --y) updated on every mousemove.
 *  2. The gradient layer sits just outside the card (inset: -borderWidth).
 *  3. A CSS mask technique clips it so ONLY the border-width strip is
 *     visible — the interior is fully masked out.
 *     mask: content-box (hides inner) XOR full-box (shows all) = border only.
 *  4. On mouse-enter: GSAP fades the glow layer in.
 *     On mouse-leave: GSAP fades it back out.
 *  5. A permanent low-opacity base border sits beneath so the card edge
 *     is always subtly visible (not just on hover).
 *
 * Usage:
 *   <BorderGlow glowColor="var(--accent)" borderRadius="1.25rem">
 *     <YourCard />
 *   </BorderGlow>
 */

interface BorderGlowProps {
  children:      React.ReactNode
  glowColor?:    string   // CSS color — default var(--accent)
  glowSize?:     number   // px radius of the spotlight — must exceed half card diagonal to be visible from centre
  borderWidth?:  number   // px strip visible through the mask — wider = more glow shows
  borderRadius?: string   // CSS value, default '1.25rem'
  className?:    string
  style?:        React.CSSProperties
}

export default function BorderGlow({
  children,
  glowColor    = 'var(--accent)',
  glowSize     = 480,   // large enough to reach edges from centre of most cards
  borderWidth  = 4,     // wider strip → glow is clearly visible, not a hairline
  borderRadius = '1.25rem',
  className,
  style,
}: BorderGlowProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const glowRef      = useRef<HTMLDivElement>(null)

  // Track cursor relative to card bounds
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    el.style.setProperty('--bx', `${x}px`)
    el.style.setProperty('--by', `${y}px`)
  }

  const onMouseEnter = () => {
    if (glowRef.current) {
      gsap.to(glowRef.current, { opacity: 1, duration: 0.35, ease: 'power2.out' })
    }
  }

  const onMouseLeave = () => {
    if (glowRef.current) {
      gsap.to(glowRef.current, { opacity: 0, duration: 0.55, ease: 'power2.out' })
    }
  }

  // The glow layer extends slightly beyond the card so the gradient
  // centred at the cursor-relative position hits the border correctly.
  const outerRadius = `calc(${borderRadius} + ${borderWidth}px)`

  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={className}
      style={{ position: 'relative', borderRadius, ...style }}
    >
      {children}

      {/* ── Static base border — very faint, just enough to define the edge ── */}
      {/* Low opacity so the hover glow is the dominant visual signal        */}
      <div
        aria-hidden
        style={{
          position:      'absolute',
          inset:         0,
          borderRadius,
          border:        `1px solid oklch(1 0 0 / 0.05)`,
          pointerEvents: 'none',
          zIndex:        1,
        }}
      />

      {/* ── Animated glow border ─────────────────────────────────────────────
        padding: borderWidth  →  the strip visible through the mask
        gradient stops:
          full color  0%→15%  →  stays bright right at the cursor
          slow fade  15%→80%  →  gradient is still warm at ~300px from cursor
          transparent 80%→100% →  clean falloff at the very edge of radius
        With glowSize=480 and a card ~600px wide, hovering in the centre
        puts the edges ~300px away — at 62% of radius — which is still
        solidly within the 80% fade zone, so the border lights up.
      ── */}
      <div
        ref={glowRef}
        aria-hidden
        style={{
          position:      'absolute',
          inset:         `-${borderWidth}px`,
          borderRadius:  outerRadius,
          padding:       `${borderWidth}px`,
          background:    `radial-gradient(${glowSize}px circle at var(--bx, 50%) var(--by, 50%), ${glowColor} 0%, ${glowColor} 15%, transparent 80%)`,
          WebkitMask:          'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          mask:                'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite:       'exclude',
          opacity:       0,
          pointerEvents: 'none',
          zIndex:        2,
        }}
      />
    </div>
  )
}
