import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TransitionLink from '../TransitionLink'

gsap.registerPlugin(ScrollTrigger)

/**
 * PhotographyTeaser — landing section teaser for /photography.
 *
 * Layout:
 *  Left (1/3)  : eyebrow · headline · description · shot count · CTA
 *  Right (2/3) : 2-column CSS masonry grid — 6 photo placeholders
 *                (replace gradients with <img> once real photos are ready)
 *
 * Animations (ScrollTrigger, once):
 *  - Left column: opacity 0 + y 30 → visible, stagger
 *  - Photo cards: opacity 0 + y 20 → visible, stagger 0.07s
 *  - Photo hover: category label slides up, subtle dark overlay
 */

// Photo placeholder data — swap `gradient` for `src` once real photos are ready.
// aspect-ratio controls card height in the masonry grid.
const PHOTOS = [
  {
    id:          1,
    label:       'Travel',
    location:    'Khardungla Pass, Ladakh',
    src:         '/467396551_18431837173072205_1821448297073574512_n.jpg',
    aspectRatio: '3/4',
    instagram:   'https://www.instagram.com/p/CxTn-7pSBca/',
  },
  {
    id:          2,
    label:       'Landscape',
    location:    'Heaven on Earth, Ladakh',
    src:         '/620984110_18055025588666241_8251869929875168696_n.webp',
    aspectRatio: '1080/565',
    instagram:   'https://www.instagram.com/p/CgKKoA-vIYI/',
  },
  {
    id:          3,
    label:       'Travel',
    location:    'Khardung La, Ladakh',
    src:         '/photography/sticker-board-ladakh.jpg',
    aspectRatio: '3/4',
    instagram:   'https://www.instagram.com/p/C3cZiG9rA4M/',
  },
  {
    id:          4,
    label:       'Landscape',
    location:    'Kashmir & Ladakh',
    src:         '/photography/kashmir-aerial.jpg',
    aspectRatio: '2/3',
    instagram:   'https://www.instagram.com/p/Cs3j1oAN5Gl/',
  },
  {
    id:          5,
    label:       'Travel',
    location:    'Somewhere in Himalayas',
    src:         '/photography/himalayas-mug.jpg',
    aspectRatio: '3/4',
    instagram:   'https://www.instagram.com/p/DLZg4J8T8Z-/',
  },
  {
    id:          6,
    label:       'Nature',
    location:    'Karnataka, Western Ghats',
    src:         '/photography/karnataka-sign.jpg',
    aspectRatio: '3/4',
    instagram:   'https://www.instagram.com/p/CqJGoJayo04/',
  },
]

export default function PhotographyTeaser() {
  const sectionRef  = useRef<HTMLElement>(null)
  const eyebrowRef  = useRef<HTMLParagraphElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const descRef     = useRef<HTMLParagraphElement>(null)
  const countRef    = useRef<HTMLDivElement>(null)
  const ctaRef      = useRef<HTMLDivElement>(null)
  const photoRefs   = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // ── Initial hidden state ─────────────────────────────────────────────────
    gsap.set(
      [eyebrowRef.current, headlineRef.current, descRef.current,
       countRef.current, ctaRef.current],
      { opacity: 0, y: 28 },
    )
    gsap.set(photoRefs.current, { opacity: 0, y: 22 })

    // ── ScrollTrigger — fires once ───────────────────────────────────────────
    const st = ScrollTrigger.create({
      trigger: section,
      start:   'top 78%',
      once:    true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        // Left column stagger
        tl.to(eyebrowRef.current,  { opacity: 1, y: 0, duration: 0.5 })
          .to(headlineRef.current, { opacity: 1, y: 0, duration: 0.65 }, '-=0.35')
          .to(descRef.current,     { opacity: 1, y: 0, duration: 0.55 }, '-=0.40')
          .to(countRef.current,    { opacity: 1, y: 0, duration: 0.45 }, '-=0.35')
          .to(ctaRef.current,      { opacity: 1, y: 0, duration: 0.45 }, '-=0.30')

        // Photo cards stagger — overlaps with left column
        tl.to(photoRefs.current, {
          opacity:  1,
          y:        0,
          duration: 0.55,
          stagger:  0.08,
          ease:     'power2.out',
        }, '-=0.70')
      },
    })

    return () => st.kill()
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-label="Photography portfolio teaser"
      style={{
        position:   'relative',
        overflow:   'hidden',
        background: `radial-gradient(ellipse 55% 70% at 75% 50%,
                       oklch(0.72 0.18 50 / 0.04), transparent 65%),
                     oklch(0.06 0.005 50)`,
      }}
    >
      {/* ── Top border ──────────────────────────────────────────────────────── */}
      <div style={{
        height:     '1px',
        background: 'linear-gradient(90deg, transparent 0%, oklch(0.18 0 0) 20%, oklch(0.18 0 0) 80%, transparent 100%)',
      }} />

      {/* ── Main panel ──────────────────────────────────────────────────────── */}
      <div
        className="grid md:grid-cols-3 gap-0"
        style={{ minHeight: '540px' }}
      >
        {/* ── Left — Text + CTA ─────────────────────────────────────────────── */}
        <div
          className="flex flex-col justify-center"
          style={{
            padding:     'clamp(2.5rem, 6vw, 5rem) clamp(1.5rem, 7.5vw, 6rem)',
            borderRight: '1px solid oklch(0.14 0 0)',
          }}
        >
          {/* Eyebrow */}
          <p
            ref={eyebrowRef}
            style={{
              fontSize:      '0.68rem',
              fontWeight:    700,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color:         'var(--accent)',
              marginBottom:  '1.2rem',
            }}
          >
            Through the lens
          </p>

          {/* Headline */}
          <div ref={headlineRef} style={{ marginBottom: '1rem' }}>
            <h2 style={{
              fontFamily:    "'Inter', sans-serif",
              fontWeight:    800,
              fontSize:      'clamp(2.4rem, 5.5vw, 4.8rem)',
              lineHeight:    0.90,
              letterSpacing: '-0.04em',
              color:         'oklch(0.96 0 0)',
              marginBottom:  '0.1em',
            }}>
              Moments
            </h2>
            <h2 style={{
              fontFamily:    "'Instrument Serif', serif",
              fontWeight:    400,
              fontStyle:     'italic',
              fontSize:      'clamp(2.4rem, 5.5vw, 4.8rem)',
              lineHeight:    0.95,
              letterSpacing: '-0.02em',
              color:         'var(--accent)',
            }}>
              captured.
            </h2>
          </div>

          {/* Description */}
          <p
            ref={descRef}
            style={{
              fontSize:     'clamp(0.88rem, 1.6vw, 1rem)',
              color:        'oklch(0.58 0 0)',
              lineHeight:   1.70,
              maxWidth:     '32ch',
              marginBottom: '1.8rem',
            }}
          >
            Street corners, golden hours, quiet architecture — a collection
            of stills from cities and landscapes across India, Canada, and
            Australia.
          </p>

          {/* Shot count badge */}
          <div
            ref={countRef}
            style={{
              display:      'inline-flex',
              alignItems:   'center',
              gap:          '0.5rem',
              marginBottom: '2rem',
            }}
          >
            {/* Camera icon */}
            <svg
              width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="var(--accent)" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            <span style={{
              fontSize:      '0.75rem',
              fontWeight:    600,
              color:         'oklch(0.65 0 0)',
              letterSpacing: '0.05em',
            }}>
              42+ shots · growing collection
            </span>
          </div>

          {/* CTA */}
          <div ref={ctaRef}>
            <TransitionLink
              to="/photography"
              style={{
                display:        'inline-flex',
                alignItems:     'center',
                gap:            '0.55rem',
                padding:        '0.72rem 1.5rem',
                borderRadius:   '0.5rem',
                background:     'transparent',
                border:         '1.5px solid var(--accent)',
                color:          'var(--accent)',
                fontWeight:     700,
                fontSize:       '0.83rem',
                letterSpacing:  '0.04em',
                textDecoration: 'none',
                transition:     'background 0.2s, color 0.2s',
              }}
            >
              View gallery
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </TransitionLink>
          </div>
        </div>

        {/* ── Right — Masonry photo grid ────────────────────────────────────── */}
        <div
          className="md:col-span-2"
          style={{
            padding:  'clamp(1.5rem, 3vw, 2.5rem)',
            position: 'relative',
          }}
        >
          {/* 2-column CSS masonry */}
          <div
            style={{
              columns:    '2',
              columnGap:  '10px',
            }}
          >
            {PHOTOS.map((photo, i) => {
              const instagramUrl = (photo as { instagram?: string }).instagram
              return (
              <button
                key={photo.id}
                type="button"
                ref={el => { photoRefs.current[i] = el }}
                className="group"
                onClick={instagramUrl ? () => window.open(instagramUrl, '_blank', 'noopener,noreferrer') : undefined}
                onKeyDown={instagramUrl ? (e) => { if (e.key === 'Enter' || e.key === ' ') window.open(instagramUrl, '_blank', 'noopener,noreferrer') } : undefined}
                style={{
                  position:    'relative',
                  breakInside: 'avoid',
                  marginBottom:'10px',
                  borderRadius:'0.6rem',
                  overflow:    'hidden',
                  background:  (photo as { gradient?: string }).gradient ?? 'oklch(0.12 0 0)',
                  aspectRatio: photo.aspectRatio,
                  cursor:      instagramUrl ? 'pointer' : 'default',
                  border:      'none',
                  padding:     0,
                  display:     'block',
                  width:       '100%',
                  textAlign:   'left',
                }}
              >
                {/* Real photo — shown when src is provided */}
                {(photo as { src?: string }).src && (
                  <img
                    src={(photo as { src?: string }).src}
                    alt={`${photo.label} · ${photo.location}`}
                    style={{
                      position:   'absolute',
                      inset:      0,
                      width:      '100%',
                      height:     '100%',
                      objectFit:  'cover',
                      objectPosition: 'center',
                    }}
                  />
                )}

                {/* Placeholder camera icon — only shown when no real photo */}
                {!(photo as { src?: string }).src && (
                  <div style={{
                    position:       'absolute',
                    inset:          0,
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    opacity:        0.12,
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                      stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                  </div>
                )}

                {/* Hover: dark scrim */}
                <div
                  aria-hidden
                  className="absolute inset-0 transition-opacity duration-300"
                  style={{
                    background: 'oklch(0 0 0 / 0.40)',
                    opacity:    0,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.opacity = '1' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.opacity = '0' }}
                />

                {/* Category + location label — slides up on hover */}
                <div
                  aria-hidden
                  className="absolute bottom-0 left-0 right-0"
                  style={{
                    padding:    '0.6rem 0.75rem',
                    background: 'linear-gradient(0deg, oklch(0 0 0 / 0.70) 0%, transparent 100%)',
                    transform:  'translateY(100%)',
                    transition: 'transform 0.30s cubic-bezier(0.22,1,0.36,1)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(100%)'
                  }}
                >
                  <p style={{
                    fontSize:      '0.65rem',
                    fontWeight:    700,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color:         'oklch(0.96 0 0)',
                    marginBottom:  '0.1rem',
                  }}>
                    {photo.label}
                  </p>
                  <p style={{
                    fontSize: '0.6rem',
                    color:    'oklch(0.72 0 0)',
                  }}>
                    {photo.location}
                  </p>
                </div>

                {/* Subtle noise grain */}
                <div
                  aria-hidden
                  style={{
                    position:        'absolute',
                    inset:           0,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
                    opacity:         0.5,
                    pointerEvents:   'none',
                  }}
                />
              </button>
            )})}
          </div>
        </div>
      </div>

      {/* ── Bottom border ────────────────────────────────────────────────────── */}
      <div style={{
        height:     '1px',
        background: 'linear-gradient(90deg, transparent 0%, oklch(0.18 0 0) 20%, oklch(0.18 0 0) 80%, transparent 100%)',
      }} />
    </section>
  )
}
