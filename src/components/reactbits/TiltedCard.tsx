import { useRef, useCallback } from 'react'
import gsap from 'gsap'

/**
 * TiltedCard — React Bits-style 3D mouse-tracking tilt effect.
 *
 * On mouse move: card rotates on X/Y axes (perspective transform).
 * On mouse leave: springs back to flat with elastic ease.
 * Glare overlay follows the cursor like a holographic sheen.
 *
 * Pointer-fine devices only — touch/mobile gets a no-op wrapper.
 */
interface TiltedCardProps {
  children:   React.ReactNode
  className?: string
  style?:     React.CSSProperties
  maxTilt?:   number   // degrees, default 10
  glare?:     boolean  // holographic sheen overlay, default true
  scale?:     number   // hover scale factor, default 1.03
  enabled?:   boolean  // false = renders children with no effect
}

export default function TiltedCard({
  children,
  className,
  style,
  maxTilt  = 10,
  glare    = true,
  scale    = 1.03,
  enabled  = true,
}: TiltedCardProps) {
  const innerRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled) return
    const card = innerRef.current
    if (!card) return

    const rect  = card.getBoundingClientRect()
    const x     = (e.clientX - rect.left)  / rect.width   // 0 → 1
    const y     = (e.clientY - rect.top)   / rect.height  // 0 → 1
    const rotX  = (0.5 - y) * maxTilt
    const rotY  = (x - 0.5) * maxTilt

    gsap.to(card, {
      rotateX:              rotX,
      rotateY:              rotY,
      scale,
      transformPerspective: 1000,
      duration:             0.35,
      ease:                 'power2.out',
    })

    if (glare && glareRef.current) {
      glareRef.current.style.background =
        `radial-gradient(circle at ${x * 100}% ${y * 100}%, oklch(1 0 0 / 0.10) 0%, transparent 65%)`
      gsap.to(glareRef.current, { opacity: 1, duration: 0.25 })
    }
  }, [enabled, maxTilt, scale, glare])

  const onLeave = useCallback(() => {
    if (!enabled) return
    const card = innerRef.current
    if (!card) return

    gsap.to(card, {
      rotateX:              0,
      rotateY:              0,
      scale:                1,
      transformPerspective: 1000,
      duration:             0.65,
      ease:                 'elastic.out(1, 0.65)',
    })

    if (glare && glareRef.current) {
      gsap.to(glareRef.current, { opacity: 0, duration: 0.35 })
    }
  }, [enabled, glare])

  return (
    // Outer wrapper provides the perspective context
    <div
      className={className}
      style={{ perspective: '1000px', ...style }}
    >
      <div
        ref={innerRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{
          width:          '100%',
          height:         '100%',
          transformStyle: 'preserve-3d',
          position:       'relative',
          borderRadius:   'inherit',
        }}
      >
        {children}

        {/* Holographic glare overlay */}
        {glare && (
          <div
            ref={glareRef}
            aria-hidden
            style={{
              position:      'absolute',
              inset:         0,
              borderRadius:  'inherit',
              opacity:       0,
              pointerEvents: 'none',
              zIndex:        10,
              mixBlendMode:  'overlay',
            }}
          />
        )}
      </div>
    </div>
  )
}
