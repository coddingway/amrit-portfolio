import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * StatsStrip — 4 key career numbers beneath the hero.
 *
 * On scroll-enter:
 *  1. Section slides up from 20px below opacity 0 → visible
 *  2. Each stat's number counts up (GSAP proxy + snap)
 *  3. Each label's SVG underline draws left → right (stroke-dashoffset trick,
 *     equivalent to GSAP DrawSVG without the paid plugin)
 *
 * The wavy SVG path under each label is hand-crafted so every stat has a
 * slightly different rhythm — feels organic rather than mechanical.
 */

interface Stat {
  value:    number
  suffix:   string
  label:    string
  sublabel: string
  path:     string // SVG path d="" for the underline squiggle
  pathLen:  number // approximate path length for dasharray/dashoffset
}

// Wavy underline paths — each unique, width normalised to 100 units
const STATS: Stat[] = [
  {
    value:    8,
    suffix:   '+',
    label:    'Years',
    sublabel: 'of experience',
    path:     'M0 4 Q12 1 25 4 Q38 7 50 4 Q62 1 75 4 Q88 7 100 4',
    pathLen:  102,
  },
  {
    value:    50,
    suffix:   '+',
    label:    'Projects',
    sublabel: 'shipped globally',
    path:     'M0 5 C16 1 34 7 50 4 C66 1 84 7 100 4',
    pathLen:  104,
  },
  {
    value:    15,
    suffix:   '+',
    label:    'Brands',
    sublabel: 'worked with',
    path:     'M0 4 Q25 2 50 5 Q75 8 100 4',
    pathLen:  103,
  },
  {
    value:    3,
    suffix:   '',
    label:    'Countries',
    sublabel: 'India · Canada · Australia',
    path:     'M0 3 C20 7 40 1 60 5 C80 9 90 2 100 4',
    pathLen:  105,
  },
]

export default function StatsStrip() {
  const sectionRef  = useRef<HTMLElement>(null)
  // Refs per stat: [numberEl, pathEl]
  const numRefs  = useRef<(HTMLSpanElement | null)[]>([])
  const pathRefs = useRef<(SVGPathElement | null)[]>([])
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // ── Initial hidden state ─────────────────────────────────────────────────
    gsap.set(cardRefs.current, { opacity: 0, y: 20 })
    pathRefs.current.forEach((p, i) => {
      if (!p) return
      gsap.set(p, {
        strokeDasharray:  STATS[i].pathLen,
        strokeDashoffset: STATS[i].pathLen, // fully hidden
      })
    })

    // ── ScrollTrigger — fires once when 60% of section enters viewport ───────
    const st = ScrollTrigger.create({
      trigger: section,
      start:   'top 80%',
      once:    true,
      onEnter: () => {
        const tl = gsap.timeline()

        // 1. Cards stagger in
        tl.to(cardRefs.current, {
          opacity:  1,
          y:        0,
          duration: 0.55,
          stagger:  0.10,
          ease:     'power3.out',
        })

        // 2. Count-up + underline draw — runs concurrently with card reveal
        STATS.forEach((stat, i) => {
          const numEl  = numRefs.current[i]
          const pathEl = pathRefs.current[i]
          if (!numEl || !pathEl) return

          const delay = i * 0.10

          // Count-up via GSAP proxy object
          const counter = { val: 0 }
          gsap.to(counter, {
            val:      stat.value,
            duration: 1.8,
            delay,
            ease:     'power2.out',
            snap:     { val: 1 },
            onUpdate: () => {
              numEl.textContent = Math.round(counter.val) + stat.suffix
            },
          })

          // SVG underline draw (DrawSVG equivalent)
          gsap.to(pathEl, {
            strokeDashoffset: 0,
            duration:         1.0,
            delay:            delay + 0.55, // starts after number begins
            ease:             'power2.inOut',
          })
        })
      },
    })

    return () => st.kill()
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-label="Career highlights"
    >
      {/* ── Top rule ────────────────────────────────────────────────────────── */}
      <div
        style={{
          height:     '1px',
          background: 'linear-gradient(90deg, transparent 0%, oklch(0.18 0 0) 20%, oklch(0.18 0 0) 80%, transparent 100%)',
        }}
      />

      {/* ── Stats grid ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            ref={el => { cardRefs.current[i] = el }}
            className="relative flex flex-col items-start px-6 py-10 md:px-10 md:py-12 group"
            style={{
              // Vertical dividers between columns (not after last)
              borderRight: i < STATS.length - 1
                ? '1px solid oklch(0.18 0 0)'
                : 'none',
              // Hide right border on mobile for right column cards
              ...(i % 2 === 1 && { borderRight: 'none' }),
            }}
          >
            {/* Subtle hover glow */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ background: 'radial-gradient(ellipse 60% 60% at 30% 50%, oklch(0.72 0.18 50 / 0.04), transparent)' }}
            />

            {/* ── Number ── */}
            <div className="relative flex items-end gap-0 leading-none mb-3">
              <span
                ref={el => { numRefs.current[i] = el }}
                className="font-bold tabular-nums"
                style={{
                  fontSize:    'clamp(3rem, 7vw, 5.5rem)',
                  color:       'var(--accent)',
                  lineHeight:  1,
                  fontFamily:  "'Inter', sans-serif",
                  letterSpacing: '-0.03em',
                }}
              >
                0{stat.suffix}
              </span>
            </div>

            {/* ── Label + DrawSVG underline ── */}
            <div className="relative mb-1">
              <span
                className="text-sm font-semibold uppercase tracking-widest"
                style={{ color: 'oklch(0.96 0 0)' }}
              >
                {stat.label}
              </span>

              {/* SVG wavy underline — stroke-dashoffset reveal */}
              <svg
                viewBox="0 0 100 8"
                preserveAspectRatio="none"
                aria-hidden
                style={{
                  display:  'block',
                  width:    '100%',
                  height:   '6px',
                  marginTop:'3px',
                  overflow: 'visible',
                }}
              >
                <path
                  ref={el => { pathRefs.current[i] = el }}
                  d={stat.path}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ strokeDashoffset: stat.pathLen }}
                />
              </svg>
            </div>

            {/* ── Sub-label ── */}
            <p
              className="text-xs font-light mt-1"
              style={{ color: 'oklch(0.55 0 0)' }}
            >
              {stat.sublabel}
            </p>
          </div>
        ))}
      </div>

      {/* ── Bottom rule ─────────────────────────────────────────────────────── */}
      <div
        style={{
          height:     '1px',
          background: 'linear-gradient(90deg, transparent 0%, oklch(0.18 0 0) 20%, oklch(0.18 0 0) 80%, transparent 100%)',
        }}
      />
    </section>
  )
}
