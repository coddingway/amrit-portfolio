import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TransitionLink from '../TransitionLink'

gsap.registerPlugin(ScrollTrigger)

/**
 * FootballTeaser — landing section teaser for /football.
 *
 * Layout (top → bottom):
 *  1. Scrolling marquee ticker — red accent text on very-dark-red strip
 *  2. Main panel — two-column layout:
 *     Left : big typographic headline + stat chips + CTA
 *     Right: top-down SVG football pitch with DrawSVG reveal
 *
 * Bayern red is hardcoded here as `oklch(0.47 0.22 28)` rather than
 * var(--accent) because the landing page doesn't have [data-page="football"]
 * and the global --accent is Ember (oklch 50 hue, not 28).
 *
 * Animations (ScrollTrigger, once):
 *  - Left column stagger: opacity 0 + y 30 → visible
 *  - Pitch SVG paths: stroke-dashoffset reveal (DrawSVG substitute)
 *  - Stat chips: scale 0.8 → 1, stagger
 */

// ── Bayern Red palette (hardcoded — can't rely on CSS var on landing page) ──
const R     = 'oklch(0.47 0.22 28)'      // main red
const R_DIM = 'oklch(0.30 0.18 28)'      // dim red
const R_GLO = 'oklch(0.47 0.22 28 / 0.20)' // red glow
const R_SUB = 'oklch(0.47 0.22 28 / 0.06)' // very faint red tint

// Marquee ticker text items
const TICKER_ITEMS = [
  'FC Bayern München',
  'Die Mannschaft',
  'Bundesliga',
  'Champions League',
  'Fußball ist Leben',
  'Mia San Mia',
  'Since 2002',
  'Allianz Arena',
]

// Stat chips displayed below the headline
const CHIPS = [
  { label: 'Since', value: '2002' },
  { label: 'Club', value: 'Bayern Munich' },
  { label: 'National', value: 'Die Mannschaft' },
  { label: 'Leagues', value: 'Bundesliga · UCL' },
]

// ── Bayern Munich Crest ───────────────────────────────────────────────────────
// Uses the official PNG placed at /public/fcb-crest.png
function BayernCrest({ size = 110 }: { size?: number }) {
  return (
    <img
      src="/fcb-crest.png"
      alt="FC Bayern München crest"
      width={size}
      height={size}
      style={{ display: 'block', objectFit: 'contain' }}
    />
  )
}

export default function FootballTeaser() {
  const sectionRef  = useRef<HTMLElement>(null)
  const tickerRef   = useRef<HTMLDivElement>(null)
  const leftRef     = useRef<HTMLDivElement>(null)
  const pitchRef    = useRef<SVGSVGElement>(null)
  const chipRefs    = useRef<(HTMLDivElement | null)[]>([])
  const headlineRef = useRef<HTMLDivElement>(null)
  const taglineRef  = useRef<HTMLParagraphElement>(null)
  const ctaRef      = useRef<HTMLDivElement>(null)
  const logoRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section  = sectionRef.current
    const ticker   = tickerRef.current
    const pitch    = pitchRef.current

    if (!section || !ticker || !pitch) return

    // ── 1. Ticker marquee ───────────────────────────────────────────────────
    // Duplicate children already exist in JSX. Animate the inner wrapper
    // from x: 0 → x: -50% for seamless loop.
    const tickerInner = ticker.querySelector<HTMLDivElement>('[data-ticker-inner]')
    if (tickerInner) {
      gsap.to(tickerInner, {
        xPercent: -50,
        duration: 28,
        ease:     'none',
        repeat:   -1,
      })
    }

    // ── 2. Pitch paths DrawSVG reveal ───────────────────────────────────────
    const paths = Array.from(pitch.querySelectorAll<SVGPathElement | SVGCircleElement | SVGRectElement>('[data-draw]'))
    paths.forEach(el => {
      // SVGGeometryElement.getTotalLength() works on path, circle, rect
      const len = (el as SVGGeometryElement).getTotalLength?.() ?? 200
      gsap.set(el, { strokeDasharray: len, strokeDashoffset: len })
    })

    // ── 3. Set initial hidden state for content ─────────────────────────────
    gsap.set([headlineRef.current, taglineRef.current, ctaRef.current], {
      opacity: 0, y: 30,
    })
    gsap.set(chipRefs.current, { opacity: 0, scale: 0.85 })
    gsap.set(logoRef.current,  { opacity: 0, scale: 0.80, y: 10 })

    // ── 4. ScrollTrigger — fire once ────────────────────────────────────────
    const st = ScrollTrigger.create({
      trigger: section,
      start:   'top 75%',
      once:    true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        // Logo badge — leads the right-column entrance
        tl.to(logoRef.current, {
          opacity: 1, scale: 1, y: 0,
          duration: 0.65, ease: 'back.out(1.6)',
        })

        // Left column cascade — runs concurrently with logo
        tl.to(headlineRef.current, { opacity: 1, y: 0, duration: 0.7 }, '-=0.50')
          .to(taglineRef.current,  { opacity: 1, y: 0, duration: 0.55 }, '-=0.45')
          .to(chipRefs.current,    {
            opacity: 1, scale: 1, duration: 0.5,
            stagger: 0.08,
          }, '-=0.35')
          .to(ctaRef.current,      { opacity: 1, y: 0, duration: 0.45 }, '-=0.20')

        // Pitch lines — staggered draw after logo settles
        tl.to(paths, {
          strokeDashoffset: 0,
          duration:         1.6,
          stagger:          0.06,
          ease:             'power2.inOut',
        }, '-=0.70')
      },
    })

    return () => st.kill()
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-label="Football passion"
      style={{
        position:   'relative',
        overflow:   'hidden',
        background: `radial-gradient(ellipse 80% 60% at 60% 50%, ${R_SUB}, transparent 70%),
                     oklch(0.07 0.01 28)`,
      }}
    >
      {/* ── Top border rule ─────────────────────────────────────────────────── */}
      <div style={{
        height:     '1px',
        background: `linear-gradient(90deg, transparent 0%, ${R_DIM} 30%, ${R_DIM} 70%, transparent 100%)`,
        opacity: 1,
      }} />

      {/* ── Ticker marquee ──────────────────────────────────────────────────── */}
      <div
        ref={tickerRef}
        aria-hidden
        style={{
          overflow:   'hidden',
          background: `oklch(0.10 0.04 28)`,
          borderBottom: `1px solid oklch(0.3 0.18 28 / 0.75)`,
          padding:    '10px 0',
        }}
      >
        {/* data-ticker-inner — we'll move this with GSAP xPercent: -50 */}
        <div
          data-ticker-inner
          style={{
            display:    'flex',
            whiteSpace: 'nowrap',
            width:      'max-content',
          }}
        >
          {/* Two identical sets = seamless loop */}
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span
              key={i}
              style={{
                fontSize:      '0.7rem',
                fontWeight:    700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color:         R,
                padding:       '0 2.5rem',
              }}
            >
              {item}
              {/* diamond separator */}
              <span style={{ marginLeft: '2.5rem', opacity: 0.4 }}>◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Main panel ──────────────────────────────────────────────────────── */}
      <div
        className="grid md:grid-cols-2 gap-0"
        style={{ minHeight: '480px' }}
      >
        {/* ── Left — Typography + stats + CTA ─────────────────────────────── */}
        <div
          ref={leftRef}
          className="flex flex-col justify-center"
          style={{ padding: 'clamp(2.5rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)' }}
        >
          {/* Eyebrow */}
          <p style={{
            fontSize:      '0.68rem',
            fontWeight:    700,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color:         R,
            marginBottom:  '1.2rem',
            opacity:       0.85,
          }}>
            Beyond the screen
          </p>

          {/* Headline */}
          <div ref={headlineRef}>
            <h2
              style={{
                fontFamily:    "'Inter', sans-serif",
                fontWeight:    800,
                fontSize:      'clamp(2.6rem, 6vw, 5.2rem)',
                lineHeight:    0.92,
                letterSpacing: '-0.04em',
                color:         'oklch(0.96 0 0)',
                marginBottom:  '0.15em',
              }}
            >
              Football
            </h2>
            <h2
              style={{
                fontFamily:    "'Inter', sans-serif",
                fontWeight:    800,
                fontSize:      'clamp(2.6rem, 6vw, 5.2rem)',
                lineHeight:    0.92,
                letterSpacing: '-0.04em',
                color:         R,
                marginBottom:  '0.8rem',
              }}
            >
              is my religion.
            </h2>
          </div>

          {/* Tagline */}
          <p
            ref={taglineRef}
            style={{
              fontSize:     'clamp(0.9rem, 1.8vw, 1.05rem)',
              color:        'oklch(0.60 0 0)',
              lineHeight:   1.65,
              maxWidth:     '38ch',
              marginBottom: '2rem',
            }}
          >
            From watching the Bundesliga as a kid to tracking every pass map and
            set-piece routine — football shapes the way I think about systems,
            patterns, and the beauty of a well-executed plan.
          </p>

          {/* Stat chips */}
          <div
            style={{
              display:   'flex',
              flexWrap:  'wrap',
              gap:       '0.6rem',
              marginBottom: '2.2rem',
            }}
          >
            {CHIPS.map((chip, i) => (
              <div
                key={chip.label}
                ref={el => { chipRefs.current[i] = el }}
                style={{
                  display:      'flex',
                  flexDirection:'column',
                  padding:      '0.55rem 1rem',
                  borderRadius: '0.5rem',
                  background:   `oklch(0.47 0.22 28 / 0.08)`,
                  border:       `1px solid oklch(0.47 0.22 28 / 0.18)`,
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span style={{
                  fontSize:      '0.6rem',
                  fontWeight:    700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color:         R,
                  opacity:       1,
                  marginBottom:  '0.15rem',
                }}>
                  {chip.label}
                </span>
                <span style={{
                  fontSize:   '0.82rem',
                  fontWeight: 600,
                  color:      'oklch(0.88 0 0)',
                  letterSpacing: '-0.01em',
                }}>
                  {chip.value}
                </span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div ref={ctaRef}>
            <TransitionLink
              to="/football"
              style={{
                display:       'inline-flex',
                alignItems:    'center',
                gap:           '0.6rem',
                padding:       '0.75rem 1.6rem',
                borderRadius:  '0.5rem',
                background:    R,
                color:         'oklch(0.96 0 0)',
                fontWeight:    700,
                fontSize:      '0.85rem',
                letterSpacing: '0.04em',
                textDecoration:'none',
                boxShadow:     `0 0 24px ${R_GLO}`,
                transition:    'opacity 0.2s',
              }}
            >
              Explore football page
              {/* Arrow */}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </TransitionLink>
          </div>
        </div>

        {/* ── Right — Crest + Top-down football pitch SVG ─────────────────── */}
        <div
          className="flex flex-col items-center justify-center"
          style={{
            padding:  'clamp(2rem, 4vw, 3.5rem)',
            position: 'relative',
            gap:      '1.8rem',
          }}
        >
          {/* Ambient glow behind pitch */}
          <div
            aria-hidden
            style={{
              position:   'absolute',
              inset:      0,
              background: `radial-gradient(ellipse 70% 60% at 50% 50%, ${R_GLO}, transparent 70%)`,
              pointerEvents: 'none',
            }}
          />

          {/* ── Bayern Munich Crest ────────────────────────────────────────── */}
          <div
            ref={logoRef}
            style={{
              position:  'relative',
              zIndex:    2,
              filter:    `drop-shadow(0 0 22px oklch(0.47 0.22 28 / 0.45))
                          drop-shadow(0 4px 12px oklch(0 0 0 / 0.60))`,
            }}
          >
            <BayernCrest size={110} />
          </div>

          {/* Top-down pitch SVG */}
          {/* ViewBox 220×320 — portrait orientation (width × height) */}
          <svg
            ref={pitchRef}
            viewBox="0 0 220 320"
            style={{
              width:    '100%',
              maxWidth: '320px',
              height:   'auto',
              filter:   `drop-shadow(0 0 18px ${R_GLO})`,
            }}
            aria-label="Top-down football pitch diagram"
          >
            {/* Pitch fill */}
            <rect
              x="0" y="0" width="220" height="320"
              fill="oklch(0.10 0.04 28)"
              rx="4"
            />

            {/* Grass stripes — alternating subtle bands */}
            {Array.from({ length: 8 }, (_, i) => (
              <rect
                key={i}
                x="0" y={i * 40} width="220" height="20"
                fill={i % 2 === 0
                  ? 'oklch(0.12 0.02 150 / 0.25)'
                  : 'oklch(0.09 0.02 150 / 0.25)'}
              />
            ))}

            {/* ── Pitch outline ── */}
            <rect
              data-draw
              x="10" y="10" width="200" height="300"
              fill="none"
              stroke={R}
              strokeWidth="1.8"
              rx="2"
            />

            {/* ── Halfway line ── */}
            <path
              data-draw
              d="M10 160 H210"
              stroke={R}
              strokeWidth="1.2"
              fill="none"
            />

            {/* ── Centre circle ── */}
            <circle
              data-draw
              cx="110" cy="160" r="28"
              fill="none"
              stroke={R}
              strokeWidth="1.2"
            />
            {/* Centre dot */}
            <circle
              cx="110" cy="160" r="2"
              fill={R}
            />

            {/* ── Top penalty box ── */}
            <rect
              data-draw
              x="55" y="10" width="110" height="52"
              fill="none"
              stroke={R}
              strokeWidth="1.2"
            />

            {/* ── Top 6-yard box ── */}
            <rect
              data-draw
              x="83" y="10" width="54" height="22"
              fill="none"
              stroke={R}
              strokeWidth="1.0"
            />

            {/* ── Top penalty arc ── */}
            <path
              data-draw
              d="M83 62 A28 28 0 0 1 137 62"
              fill="none"
              stroke={R}
              strokeWidth="1.2"
            />

            {/* ── Top penalty spot ── */}
            <circle
              cx="110" cy="48" r="1.8"
              fill={R}
            />

            {/* ── Top goal ── */}
            <rect
              data-draw
              x="93" y="4" width="34" height="8"
              fill="none"
              stroke={R}
              strokeWidth="1.2"
            />

            {/* ── Bottom penalty box ── */}
            <rect
              data-draw
              x="55" y="258" width="110" height="52"
              fill="none"
              stroke={R}
              strokeWidth="1.2"
            />

            {/* ── Bottom 6-yard box ── */}
            <rect
              data-draw
              x="83" y="288" width="54" height="22"
              fill="none"
              stroke={R}
              strokeWidth="1.0"
            />

            {/* ── Bottom penalty arc ── */}
            <path
              data-draw
              d="M83 258 A28 28 0 0 0 137 258"
              fill="none"
              stroke={R}
              strokeWidth="1.2"
            />

            {/* ── Bottom penalty spot ── */}
            <circle
              cx="110" cy="272" r="1.8"
              fill={R}
            />

            {/* ── Bottom goal ── */}
            <rect
              data-draw
              x="93" y="308" width="34" height="8"
              fill="none"
              stroke={R}
              strokeWidth="1.2"
            />

            {/* ── Corner arcs ── */}
            <path data-draw d="M10 22 A12 12 0 0 1 22 10" fill="none" stroke={R} strokeWidth="1.0" />
            <path data-draw d="M198 10 A12 12 0 0 1 210 22" fill="none" stroke={R} strokeWidth="1.0" />
            <path data-draw d="M210 298 A12 12 0 0 1 198 310" fill="none" stroke={R} strokeWidth="1.0" />
            <path data-draw d="M22 310 A12 12 0 0 1 10 298" fill="none" stroke={R} strokeWidth="1.0" />

            {/* ── Corner dots ── */}
            <circle cx="10"  cy="10"  r="2" fill={R} opacity="0.6" />
            <circle cx="210" cy="10"  r="2" fill={R} opacity="0.6" />
            <circle cx="210" cy="310" r="2" fill={R} opacity="0.6" />
            <circle cx="10"  cy="310" r="2" fill={R} opacity="0.6" />

            {/* Centre dot only — crest above the pitch is the identity marker */}
            {/* (no duplicate FCB text needed here) */}
          </svg>
        </div>
      </div>

      {/* ── Bottom border rule ───────────────────────────────────────────────── */}
      <div style={{
        height:     '1px',
        background: `linear-gradient(90deg, transparent 0%, ${R_DIM} 30%, ${R_DIM} 70%, transparent 100%)`,
        opacity:    0.35,
      }} />
    </section>
  )
}
