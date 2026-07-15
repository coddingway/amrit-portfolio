import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface Props {
  onComplete: () => void
}

function APLogo({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 108 118"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-16 h-16 md:w-20 md:h-20"
      style={style}
    >
      <line x1="54" y1="5" x2="5" y2="112" stroke="currentColor" strokeWidth="7.5" strokeLinecap="round" />
      <line x1="54" y1="5" x2="74" y2="70" stroke="currentColor" strokeWidth="7.5" strokeLinecap="round" />
      <circle cx="70" cy="44" r="27" stroke="currentColor" strokeWidth="7.5" fill="none" />
      <line x1="22" y1="66" x2="98" y2="66" stroke="currentColor" strokeWidth="7.5" strokeLinecap="round" />
      <line x1="5" y1="112" x2="18" y2="112" stroke="currentColor" strokeWidth="7.5" strokeLinecap="round" />
    </svg>
  )
}

export default function LoadingScreen({ onComplete }: Props) {
  const containerRef  = useRef<HTMLDivElement>(null)
  const textWrapRef   = useRef<HTMLDivElement>(null)
  const textRef       = useRef<HTMLDivElement>(null)
  const penRef        = useRef<HTMLDivElement>(null)
  const logoRef       = useRef<HTMLDivElement>(null)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => { onCompleteRef.current = onComplete }, [onComplete])

  useEffect(() => {
    let ctx: gsap.Context
    let mounted = true

    // Hard cap — always exits after 3.5s regardless of GSAP / font state
    const hardCap = setTimeout(() => {
      if (mounted) onCompleteRef.current()
    }, 3500)

    document.fonts.ready.then(() => {
      if (!mounted) return

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => onCompleteRef.current(),
        })

        // ── Initial states ──────────────────────────────────────
        gsap.set(textRef.current,   { clipPath: 'inset(0 100% 0 0)' })
        gsap.set(penRef.current,    { left: '0%', opacity: 0 })
        gsap.set(logoRef.current,   { opacity: 0, scale: 0.82, y: 14 })

        // ── Phase 1: brief pause ─────────────────────────────────
        tl.to({}, { duration: 0.1 })

        // ── Phase 2: pen tip appears ─────────────────────────────
        tl.to(penRef.current, { opacity: 1, duration: 0.08 })

        // ── Phase 3: write "hello." ──────────────────────────────
        tl.to(textRef.current, {
          clipPath: 'inset(0 0% 0 0)',
          duration: 0.85,
          ease: 'power2.inOut',
        })
        tl.to(penRef.current, {
          left: '100%',
          duration: 0.85,
          ease: 'power2.inOut',
        }, '<')

        // ── Phase 4: pen tip fades ───────────────────────────────
        tl.to(penRef.current, { opacity: 0, duration: 0.1 })

        // ── Phase 5: hold on "hello." ────────────────────────────
        tl.to({}, { duration: 0.15 })

        // ── Phase 6: "hello." lifts and fades ───────────────────
        tl.to(textWrapRef.current, {
          opacity: 0,
          y: -18,
          duration: 0.28,
          ease: 'power2.in',
        })

        // ── Phase 7: AP logo drops in ────────────────────────────
        tl.to(logoRef.current, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.38,
          ease: 'power3.out',
        })

        // ── Phase 8: hold on logo ────────────────────────────────
        tl.to({}, { duration: 0.18 })

        // ── Phase 9: everything fades out ────────────────────────
        tl.to(containerRef.current, {
          opacity: 0,
          duration: 0.35,
          ease: 'power2.inOut',
        })
      })
    })

    return () => {
      mounted = false
      clearTimeout(hardCap)
      ctx?.revert()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-bg flex items-center justify-center overflow-hidden"
    >
      {/* ── hello. text ── */}
      <div ref={textWrapRef} className="relative inline-flex items-center">
        {/* Text — revealed left-to-right via clip-path */}
        <div
          ref={textRef}
          className="select-none text-text-primary leading-none"
          style={{
            fontFamily:  "'Great Vibes', cursive",
            fontSize:    'clamp(3.5rem, 10vw, 7rem)',
            clipPath:    'inset(0 100% 0 0)',
          }}
        >
          hello.
        </div>

        {/* Pen cursor — thin glowing line that leads the reveal */}
        <div
          ref={penRef}
          className="absolute top-[10%] bottom-[10%] pointer-events-none"
          style={{
            left:       '0%',
            width:      '2px',
            opacity:    0,
            background: 'oklch(0.72 0.18 50)',
            boxShadow:  '0 0 8px 3px oklch(0.72 0.18 50 / 0.45)',
          }}
        />
      </div>

      {/* ── AP Logo — appears after hello. exits ── */}
      <div
        ref={logoRef}
        className="absolute flex items-center justify-center"
        style={{ opacity: 0 }}
      >
        <APLogo
          style={{
            color:  'oklch(0.72 0.18 50)',
            filter: 'drop-shadow(0 0 16px oklch(0.72 0.18 50 / 0.65))',
          }}
        />
      </div>
    </div>
  )
}
