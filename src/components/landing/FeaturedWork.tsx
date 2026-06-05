import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TiltedCard from '../reactbits/TiltedCard'
import BorderGlow from '../reactbits/BorderGlow'
import TransitionLink from '../TransitionLink'

gsap.registerPlugin(ScrollTrigger)

/**
 * FeaturedWork — Card Swap + Tilted Card effects (React Bits).
 *
 * Card Swap:
 *   3 project cards are physically stacked. Clicking prev/next (or dots) flies
 *   the active card off to the left while the next card springs into the front
 *   position. The third card advances one step in the stack simultaneously.
 *   Auto-advances every 5 s; pauses on hover.
 *
 * Tilted Card:
 *   The active (front) card responds to mouse movement with a 3D perspective
 *   tilt + holographic glare overlay. Back cards have pointer-events:none.
 *
 * Stack positions (3 cards, circular):
 *   [0] front  — scale 1,    x 0,   y 0,   zIndex 3
 *   [1] middle — scale 0.95, x 18,  y 14,  zIndex 2
 *   [2] back   — scale 0.90, x 36,  y 28,  zIndex 1
 */

// ── Stack geometry ─────────────────────────────────────────────────────────────
const STACK = [
  { scale: 1.00, x: 0,  y: 0,  zIndex: 3 },
  { scale: 0.95, x: 18, y: 14, zIndex: 2 },
  { scale: 0.90, x: 36, y: 28, zIndex: 1 },
] as const

// ── Project data ───────────────────────────────────────────────────────────────
interface Project {
  slug:        string
  index:       string
  name:        string
  category:    string
  year:        string
  description: string
  tags:        string[]
  Visual:      () => React.ReactElement
  highlight:   string
}

// Brand visual panels — stylised, CSS/SVG only (no external images)
function PondsVisual() {
  return (
    <div
      style={{
        width: '100%', height: '100%',
        background: 'linear-gradient(145deg, oklch(0.18 0.05 0) 0%, oklch(0.34 0.12 350) 100%)',
        borderRadius: 'inherit',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        padding: '2rem',
      }}
    >
      {/* Concentric ripple rings */}
      {[120, 85, 52].map((r, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: r * 2, height: r * 2,
          borderRadius: '50%',
          border: '1px solid oklch(0.80 0.10 350 / 0.12)',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
        }} />
      ))}

      {/* Brand name */}
      <p style={{
        fontFamily: "'Instrument Serif', serif",
        fontStyle: 'italic',
        fontSize: 'clamp(2.2rem, 4vw, 3rem)',
        color: 'oklch(0.85 0.12 350)',
        letterSpacing: '0.12em',
        textAlign: 'center',
        position: 'relative',
        margin: 0,
      }}>
        POND'S
      </p>
      <p style={{
        fontSize: '0.625rem',
        letterSpacing: '0.35em',
        color: 'oklch(0.55 0.06 350)',
        marginTop: '0.5rem',
        textTransform: 'uppercase',
        position: 'relative',
      }}>
        India · Skincare
      </p>

      {/* Corner badge */}
      <span style={{
        position: 'absolute', top: '1rem', right: '1rem',
        fontSize: '0.6rem', letterSpacing: '0.2em',
        color: 'oklch(0.50 0.06 350)',
        textTransform: 'uppercase',
      }}>
        IN
      </span>
    </div>
  )
}

function LiquidIVCaVisual() {
  return (
    <div
      style={{
        width: '100%', height: '100%',
        background: 'linear-gradient(145deg, oklch(0.16 0.06 240) 0%, oklch(0.32 0.16 240) 100%)',
        borderRadius: 'inherit',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        padding: '2rem',
      }}
    >
      {/* Water drop SVG */}
      <svg
        viewBox="0 0 80 100"
        style={{ width: 52, height: 64, marginBottom: '1rem', position: 'relative' }}
        fill="none"
      >
        <path
          d="M40 6 C40 6 8 44 8 64 C8 83 22 96 40 96 C58 96 72 83 72 64 C72 44 40 6 40 6Z"
          stroke="oklch(0.70 0.16 220)"
          strokeWidth="2"
          fill="oklch(0.70 0.16 220 / 0.10)"
        />
        {/* IV monogram inside drop */}
        <text
          x="40" y="69"
          textAnchor="middle"
          fill="oklch(0.70 0.16 220)"
          fontSize="18"
          fontFamily="Inter, sans-serif"
          fontWeight="700"
          letterSpacing="1"
        >
          IV
        </text>
      </svg>

      <p style={{
        fontSize: '0.7rem',
        letterSpacing: '0.30em',
        color: 'oklch(0.55 0.08 240)',
        textTransform: 'uppercase',
        textAlign: 'center',
        margin: 0,
        position: 'relative',
      }}>
        LIQUID I.V.
      </p>

      {/* Maple leaf detail */}
      <span style={{
        position: 'absolute', bottom: '1rem',
        fontSize: '0.9rem',
        color: 'oklch(0.55 0.12 40)',
        opacity: 0.8,
      }}>
        🍁
      </span>

      {/* Corner badge */}
      <span style={{
        position: 'absolute', top: '1rem', right: '1rem',
        fontSize: '0.6rem', letterSpacing: '0.2em',
        color: 'oklch(0.45 0.06 240)',
        textTransform: 'uppercase',
      }}>
        CA
      </span>
    </div>
  )
}

function LiquidIVAuVisual() {
  return (
    <div
      style={{
        width: '100%', height: '100%',
        background: 'linear-gradient(145deg, oklch(0.16 0.06 180) 0%, oklch(0.30 0.13 175) 100%)',
        borderRadius: 'inherit',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        padding: '2rem',
      }}
    >
      {/* Wave SVG */}
      <svg
        viewBox="0 0 100 40"
        style={{ width: 90, height: 36, marginBottom: '1rem', position: 'relative' }}
        fill="none"
        overflow="visible"
      >
        <path
          d="M0 20 C12 6 24 34 36 20 C48 6 60 34 72 20 C84 6 96 34 100 20"
          stroke="oklch(0.65 0.14 175)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M0 28 C12 14 24 42 36 28 C48 14 60 42 72 28 C84 14 96 42 100 28"
          stroke="oklch(0.65 0.14 175 / 0.40)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      <p style={{
        fontSize: '0.7rem',
        letterSpacing: '0.30em',
        color: 'oklch(0.50 0.08 175)',
        textTransform: 'uppercase',
        textAlign: 'center',
        margin: 0,
        position: 'relative',
      }}>
        LIQUID I.V.
      </p>

      {/* Southern Cross dots */}
      <div style={{
        position: 'absolute', bottom: '1.2rem', left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', gap: '5px', alignItems: 'center',
      }}>
        {[4, 3, 4, 3, 3].map((size, i) => (
          <div key={i} style={{
            width: size, height: size, borderRadius: '50%',
            background: 'oklch(0.55 0.08 175)',
            opacity: 0.6,
          }} />
        ))}
      </div>

      {/* Corner badge */}
      <span style={{
        position: 'absolute', top: '1rem', right: '1rem',
        fontSize: '0.6rem', letterSpacing: '0.2em',
        color: 'oklch(0.45 0.06 175)',
        textTransform: 'uppercase',
      }}>
        AU
      </span>
    </div>
  )
}

const PROJECTS: Project[] = [
  {
    slug:        'ponds-india',
    index:       '01',
    name:        "Pond's India",
    category:    'Brand · E-commerce',
    year:        '2023',
    description: "Complete digital redesign for one of India's most iconic skincare brands — from a new design system to pixel-perfect, production-ready frontend.",
    tags:        ['React', 'GSAP', 'Design System', 'Next.js'],
    Visual:      PondsVisual,
    highlight:   'oklch(0.75 0.10 350)',
  },
  {
    slug:        'liquid-iv-ca',
    index:       '02',
    name:        'Liquid IV Canada',
    category:    'E-commerce · Shopify',
    year:        '2022',
    description: "Market-entry storefront for Liquid IV's Canadian launch — built for conversion, optimised for sub-2s load across four provinces.",
    tags:        ['Shopify', 'Liquid', 'Performance', 'A/B Testing'],
    Visual:      LiquidIVCaVisual,
    highlight:   'oklch(0.68 0.16 220)',
  },
  {
    slug:        'liquid-iv-au',
    index:       '03',
    name:        'Liquid IV Australia',
    category:    'E-commerce · Shopify',
    year:        '2023',
    description: "Extended the Liquid IV design system to the Australian market with local payment rails, full i18n, and AU-specific UX patterns.",
    tags:        ['Shopify', 'i18n', 'Liquid', 'UX'],
    Visual:      LiquidIVAuVisual,
    highlight:   'oklch(0.68 0.14 175)',
  },
]

const N = PROJECTS.length

export default function FeaturedWork() {
  const sectionRef  = useRef<HTMLElement>(null)
  const headerRef   = useRef<HTMLDivElement>(null)
  const cardRefs    = useRef<(HTMLDivElement | null)[]>([])
  const activeRef   = useRef(0)       // card index — no state to avoid rerender
  const lockRef     = useRef(false)   // prevent concurrent swaps
  const hoverRef    = useRef(false)   // pause auto-advance on hover

  // Only used for the dot indicator (minimal re-render)
  const [dotIdx, setDotIdx] = useState(0)

  // ── Stack position setter ──────────────────────────────────────────────────
  // Given an active index, set every card's stack position instantly (no animation)
  const setStack = useCallback((active: number) => {
    cardRefs.current.forEach((el, i) => {
      if (!el) return
      const pos = (i - active + N) % N
      const s = STACK[pos]
      gsap.set(el, {
        scale:         s.scale,
        x:             s.x,
        y:             s.y,
        zIndex:        s.zIndex,
        opacity:       1,
        rotate:        0,
        filter:        'blur(0px)',
        pointerEvents: pos === 0 ? 'auto' : 'none',
      })
    })
  }, [])

  // ── Swap animation ─────────────────────────────────────────────────────────
  const swapTo = useCallback((nextIdx: number) => {
    if (lockRef.current || nextIdx === activeRef.current) return
    lockRef.current = true

    const curr     = activeRef.current
    const thirdIdx = (nextIdx + 1) % N  // the card that advances from back→middle

    const currEl  = cardRefs.current[curr]
    const nextEl  = cardRefs.current[nextIdx]
    const thirdEl = cardRefs.current[thirdIdx]

    if (!currEl || !nextEl || !thirdEl) {
      lockRef.current = false
      return
    }

    const tl = gsap.timeline({
      onComplete: () => {
        // Snap outgoing card to back-stack position (invisible during flight)
        gsap.set(currEl, {
          x:             STACK[2].x,
          y:             STACK[2].y,
          scale:         STACK[2].scale,
          zIndex:        STACK[2].zIndex,
          opacity:       1,
          rotate:        0,
          filter:        'blur(0px)',
          pointerEvents: 'none',
        })
        activeRef.current = nextIdx
        setDotIdx(nextIdx)
        lockRef.current = false

        // Make the new front card interactive
        gsap.set(nextEl,  { pointerEvents: 'auto' })
        gsap.set(currEl,  { pointerEvents: 'none' })
        gsap.set(thirdEl, { pointerEvents: 'none' })
      },
    })

    // 1. Active card flies left with a slight clockwise rotation
    tl.to(currEl, {
      x:       '-112%',
      rotate:  -10,
      opacity: 0,
      scale:   0.92,
      filter:  'blur(2px)',
      duration:0.40,
      ease:    'power2.in',
    }, 0)

    // 2. Next card (was middle) springs to front
    tl.to(nextEl, {
      ...STACK[0],
      duration: 0.52,
      ease:     'power3.out',
    }, 0.08)

    // 3. Third card (was back) advances to middle
    tl.to(thirdEl, {
      ...STACK[1],
      duration: 0.45,
      ease:     'power2.out',
    }, 0.08)
  }, [])

  const swapNext = useCallback(() => swapTo((activeRef.current + 1) % N), [swapTo])
  const swapPrev = useCallback(() => swapTo((activeRef.current - 1 + N) % N), [swapTo])

  // ── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    setStack(0)

    // Header reveal
    gsap.fromTo(headerRef.current,
      { opacity: 0, y: 24 },
      {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 78%',
          once: true,
        },
      },
    )

    // Auto-advance every 5 s
    const id = setInterval(() => {
      if (!hoverRef.current) swapNext()
    }, 5000)

    return () => clearInterval(id)
  }, [setStack, swapNext])

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 px-6 md:px-14 lg:px-24 overflow-hidden"
      style={{
        // Faint ember warmth distinguishes this section from the pure-black bg
        background: 'radial-gradient(ellipse 90% 70% at 35% 55%, oklch(0.09 0.02 50) 0%, oklch(0.05 0 0) 70%)',
      }}
      onMouseEnter={() => { hoverRef.current = true  }}
      onMouseLeave={() => { hoverRef.current = false }}
    >
      {/* ── Section header ────────────────────────────────────────────────── */}
      <div
        ref={headerRef}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-14"
        style={{ opacity: 0 }}
      >
        <div>
          <p className="text-xs uppercase tracking-[0.25em] mb-2" style={{ color: 'var(--accent)' }}>
            Selected Work
          </p>
          <h2
            className="font-bold leading-none"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'oklch(0.96 0 0)', letterSpacing: '-0.02em' }}
          >
            Projects I'm proud of
          </h2>
        </div>

        <TransitionLink
          to="/work"
          className="group inline-flex items-center gap-2 text-sm self-start sm:self-auto"
          style={{ color: 'oklch(0.66 0 0)' }}
        >
          <span className="group-hover:text-text-primary transition-colors duration-200">See all work</span>
          <span
            className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            style={{ color: 'var(--accent)' }}
          >↗</span>
        </TransitionLink>
      </div>

      {/* ── Card stack + navigation ────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

        {/* ── Card stack area ─────────────────────────────────────────────── */}
        <div
          style={{ position: 'relative', flex: '1 1 auto', height: 'clamp(360px, 48vh, 500px)' }}
        >
          {PROJECTS.map((project, i) => (
            <div
              key={project.slug}
              ref={el => { cardRefs.current[i] = el }}
              style={{
                position:     'absolute',
                inset:        0,
                borderRadius: '1.25rem',
                willChange:   'transform, opacity',
                transformOrigin: 'top center',
              }}
            >
              {/* TiltedCard wraps each card — only active card has enabled=true */}
              <TiltedCard
                enabled={i === dotIdx}
                maxTilt={8}
                style={{ width: '100%', height: '100%', borderRadius: '1.25rem' }}
              >
                {/* BorderGlow — mouse-following glow traces the card border */}
                <BorderGlow
                  glowColor={project.highlight}
                  borderRadius="1.25rem"
                  style={{ width: '100%', height: '100%' }}
                >
                {/* Card shell — border removed (BorderGlow owns it) */}
                <div
                  style={{
                    width:        '100%',
                    height:       '100%',
                    borderRadius: '1.25rem',
                    background:   'oklch(0.14 0 0)',
                    boxShadow:    '0 8px 40px oklch(0 0 0 / 0.70), 0 1px 0 oklch(1 0 0 / 0.08) inset',
                    overflow:     'hidden',
                    display:      'flex',
                    flexDirection:'column',
                    position:     'relative',
                  }}
                >
                  {/* ── Brand visual strip (top) ── */}
                  <div style={{ height: '42%', position: 'relative', flexShrink: 0 }}>
                    <project.Visual />
                  </div>

                  {/* ── Divider ── */}
                  <div style={{ height: '1px', background: 'oklch(1 0 0 / 0.12)', flexShrink: 0 }} />

                  {/* ── Text content (bottom) ── */}
                  <div
                    className="flex flex-col justify-between flex-1 p-5 md:p-6"
                  >
                    {/* Top meta row */}
                    <div className="flex items-center justify-between mb-3">
                      <span style={{ fontSize: '0.65rem', color: project.highlight, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                        {project.category}
                      </span>
                      <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: 'oklch(0.50 0 0)' }}>
                        {project.index} / {String(N).padStart(2, '0')} · {project.year}
                      </span>
                    </div>

                    {/* Project name */}
                    <div>
                      <h3
                        className="font-bold mb-2 leading-tight"
                        style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.65rem)', color: 'oklch(0.96 0 0)', letterSpacing: '-0.02em' }}
                      >
                        {project.name}
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: 'oklch(0.68 0 0)', lineHeight: 1.6, marginBottom: '1rem' }}>
                        {project.description}
                      </p>
                    </div>

                    {/* Tags + CTA */}
                    <div className="flex flex-wrap items-center gap-2">
                      {project.tags.map(tag => (
                        <span
                          key={tag}
                          style={{
                            fontSize:   '0.65rem',
                            borderRadius: '999px',
                            padding:    '2px 10px',
                            background: 'oklch(1 0 0 / 0.07)',
                            border:     '1px solid oklch(1 0 0 / 0.15)',
                            color:      'oklch(0.70 0 0)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                      <TransitionLink
                        to={`/work/${project.slug}`}
                        className="group ml-auto inline-flex items-center gap-1 text-xs font-medium rounded-full px-3 py-1 transition-all duration-200"
                        style={{
                          background: `${project.highlight}18`,
                          border:     `1px solid ${project.highlight}40`,
                          color:      project.highlight,
                        }}
                      >
                        Case study
                        <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                      </TransitionLink>
                    </div>
                  </div>
                </div>
                </BorderGlow>
              </TiltedCard>
            </div>
          ))}
        </div>

        {/* ── Right panel: navigation + project list ─────────────────────── */}
        <div
          className="flex flex-col justify-between"
          style={{ width: '100%', maxWidth: '260px', alignSelf: 'stretch', flexShrink: 0 }}
        >
          {/* Project index list */}
          <div className="flex flex-col gap-4">
            {PROJECTS.map((project, i) => (
              <button
                key={project.slug}
                onClick={() => swapTo(i)}
                className="group flex items-start gap-3 text-left transition-all duration-200"
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              >
                {/* Active indicator line */}
                <div
                  style={{
                    width:      '2px',
                    height:     '100%',
                    minHeight:  '40px',
                    background: i === dotIdx ? 'var(--accent)' : 'oklch(0.18 0 0)',
                    borderRadius:'2px',
                    flexShrink: 0,
                    transition: 'background 0.3s ease',
                  }}
                />
                <div>
                  <p
                    style={{
                      fontSize:   '0.75rem',
                      fontWeight: i === dotIdx ? 600 : 400,
                      color:      i === dotIdx ? 'oklch(0.96 0 0)' : 'oklch(0.60 0 0)',
                      transition: 'color 0.3s ease',
                      marginBottom:'2px',
                    }}
                  >
                    {project.name}
                  </p>
                  <p style={{ fontSize: '0.65rem', color: 'oklch(0.50 0 0)' }}>
                    {project.category} · {project.year}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Prev / Next arrows */}
          <div className="flex items-center gap-3 mt-8 lg:mt-0">
            <button
              onClick={swapPrev}
              aria-label="Previous project"
              className="group flex items-center justify-center rounded-full transition-all duration-200"
              style={{
                width: 40, height: 40,
                background: 'oklch(0.17 0 0)',
                border:     '1px solid oklch(0.28 0 0)',
                color:      'oklch(0.75 0 0)',
                cursor:     'pointer',
              }}
              onMouseEnter={e => gsap.to(e.currentTarget, { borderColor: 'var(--accent)', color: 'var(--accent)', duration: 0.2 })}
              onMouseLeave={e => gsap.to(e.currentTarget, { borderColor: 'oklch(0.28 0 0)', color: 'oklch(0.75 0 0)', duration: 0.2 })}
            >
              ←
            </button>
            <button
              onClick={swapNext}
              aria-label="Next project"
              className="group flex items-center justify-center rounded-full transition-all duration-200"
              style={{
                width: 40, height: 40,
                background: 'var(--accent)',
                border:     '1px solid transparent',
                color:      '#fff',
                cursor:     'pointer',
              }}
              onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.08, duration: 0.2 })}
              onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1,    duration: 0.2 })}
            >
              →
            </button>

            {/* Auto-advance progress dots */}
            <div className="flex items-center gap-1.5 ml-2">
              {PROJECTS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => swapTo(i)}
                  aria-label={`Go to project ${i + 1}`}
                  style={{
                    width:        i === dotIdx ? 18 : 5,
                    height:       5,
                    borderRadius: '999px',
                    background:   i === dotIdx ? 'var(--accent)' : 'oklch(0.25 0 0)',
                    border:       'none',
                    cursor:       'pointer',
                    padding:      0,
                    transition:   'width 0.3s ease, background 0.3s ease',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
