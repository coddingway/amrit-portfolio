import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import Aurora from './Aurora'
import Particles from './Particles'
import TransitionLink from '../TransitionLink'

export default function HeroSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const greetRef    = useRef<HTMLSpanElement>(null)
  const name1Ref    = useRef<HTMLSpanElement>(null)
  const name2Ref    = useRef<HTMLSpanElement>(null)
  const role1Ref    = useRef<HTMLSpanElement>(null)
  const role2Ref    = useRef<HTMLSpanElement>(null)
  const badgeRef    = useRef<HTMLDivElement>(null)
  const descRef     = useRef<HTMLParagraphElement>(null)
  const ctaRef      = useRef<HTMLDivElement>(null)
  const scrollRef   = useRef<HTMLDivElement>(null)
  const photoColRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 })

      tl
        .fromTo(greetRef.current,
          { y: '115%' },
          { y: '0%', duration: 0.75, ease: 'power4.out' },
        )
        .fromTo(name1Ref.current,
          { y: '115%' },
          { y: '0%', duration: 0.95, ease: 'power4.out' },
          '-=0.50',
        )
        .fromTo(name2Ref.current,
          { y: '115%' },
          { y: '0%', duration: 0.95, ease: 'power4.out' },
          '-=0.80',
        )
        .fromTo(role1Ref.current,
          { y: '115%' },
          { y: '0%', duration: 0.75, ease: 'power4.out' },
          '-=0.60',
        )
        .fromTo(role2Ref.current,
          { y: '115%' },
          { y: '0%', duration: 0.75, ease: 'power4.out' },
          '-=0.65',
        )
        .fromTo(
          [badgeRef.current, descRef.current, ctaRef.current],
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.65, stagger: 0.12, ease: 'power2.out' },
          '-=0.40',
        )
        .fromTo(photoColRef.current,
          { opacity: 0, x: 40, scale: 0.96 },
          { opacity: 1, x: 0, scale: 1, duration: 0.9, ease: 'power3.out' },
          '-=0.80',
        )
        .fromTo(scrollRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' },
          '-=0.30',
        )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex flex-col overflow-hidden"
    >
      {/* Background layers */}
      <Aurora />
      <Particles />

      <div
        aria-hidden
        className="noise-overlay"
        style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}
      />
      <div
        aria-hidden
        style={{
          position:      'absolute',
          inset:         0,
          zIndex:        2,
          background:    'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 20%, rgba(8,8,8,0.65) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Two-column content */}
      <div
        className="relative flex flex-col lg:flex-row items-center justify-between flex-1 px-6 md:px-14 lg:px-24 pt-32 pb-28 gap-10 lg:gap-16"
        style={{ zIndex: 3 }}
      >
        {/* ── Left — Text ────────────────────────────────────────────────── */}
        <div className="flex flex-col justify-center flex-1 w-full">

          {/* Eyebrow */}
          <div className="overflow-hidden mb-4">
            <span
              ref={greetRef}
              style={{
                display:       'block',
                fontFamily:    "'Inter', sans-serif",
                fontWeight:    500,
                fontSize:      'clamp(0.62rem, 1.1vw, 0.72rem)',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color:         'var(--accent)',
                lineHeight:    1,
              }}
            >
              From Notepad to AI agents
            </span>
          </div>

          {/* Name */}
          <div className="overflow-hidden">
            <span
              ref={name1Ref}
              style={{
                display:       'block',
                fontFamily:    "'Inter', sans-serif",
                fontWeight:    800,
                fontSize:      'clamp(3.8rem, 11.5vw, 9.5rem)',
                lineHeight:    0.9,
                letterSpacing: '-0.03em',
                color:         'var(--color-text-primary)',
              }}
            >
              Amrit
            </span>
          </div>

          <div className="overflow-hidden mb-8 md:mb-10">
            <span
              ref={name2Ref}
              style={{
                display:       'block',
                fontFamily:    "'Inter', sans-serif",
                fontWeight:    800,
                fontSize:      'clamp(3.8rem, 11.5vw, 9.5rem)',
                lineHeight:    0.9,
                letterSpacing: '-0.03em',
                color:         'var(--accent)',
              }}
            >
              Podder.
            </span>
          </div>

          {/* Role */}
          <div className="overflow-hidden">
            <span
              ref={role1Ref}
              style={{
                display:       'block',
                fontFamily:    "'Inter', sans-serif",
                fontWeight:    300,
                fontSize:      'clamp(1.15rem, 3.2vw, 2.4rem)',
                letterSpacing: '0.01em',
                color:         'var(--color-muted)',
                lineHeight:    1.2,
              }}
            >
              Frontend Lead &amp;
            </span>
          </div>

          <div className="overflow-hidden mb-10 md:mb-12">
            <span
              ref={role2Ref}
              style={{
                display:       'block',
                fontFamily:    "'Inter', sans-serif",
                fontWeight:    300,
                fontSize:      'clamp(1.15rem, 3.2vw, 2.4rem)',
                letterSpacing: '0.01em',
                color:         'var(--color-muted)',
                lineHeight:    1.2,
              }}
            >
              Design Engineer
            </span>
          </div>

          {/* Badge row */}
          <div
            ref={badgeRef}
            className="flex flex-wrap items-center gap-3 mb-5"
            style={{ opacity: 0 }}
          >
            <span
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-medium border"
              style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: 'var(--accent)' }}
              />
              NetBramha Studios
            </span>
            <span style={{ color: 'var(--color-faint)' }} className="text-xs hidden sm:block">·</span>
            <span style={{ color: 'var(--color-faint)' }} className="text-xs hidden sm:block">Bangalore, India</span>
          </div>

          {/* Descriptor */}
          <p
            ref={descRef}
            className="max-w-sm md:max-w-md text-sm md:text-base font-light mb-10"
            style={{ color: 'var(--color-muted)', lineHeight: 1.75, opacity: 0 }}
          >
            From Notepad to AI agents. 8 years shipping products for HUL,
            Infosys, and Wipro — across India, Canada, and Australia.
            The web I build converts.{' '}
            <span style={{ fontStyle: 'italic', color: 'oklch(0.50 0 0)' }}>Still learning.</span>
          </p>

          {/* CTA */}
          <div
            ref={ctaRef}
            className="flex flex-wrap items-center gap-4"
            style={{ opacity: 0 }}
          >
            <TransitionLink
              to="/work"
              className="group relative inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium overflow-hidden"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              <span
                className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }}
              />
              <span className="relative">View my work</span>
              <span className="relative text-xs transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
            </TransitionLink>

            <TransitionLink
              to="/about"
              className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium border transition-colors duration-200"
              style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'var(--color-muted)' }}
            >
              About me
            </TransitionLink>
          </div>
        </div>

        {/* ── Right — Photo card ─────────────────────────────────────────── */}
        <div
          ref={photoColRef}
          className="flex items-center justify-start flex-shrink-0 w-full lg:w-auto"
          style={{ opacity: 0 }}
        >
          <PhotoCard />
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ zIndex: 3, opacity: 0 }}
        aria-hidden
      >
        <span
          className="uppercase tracking-[0.25em] text-[9px]"
          style={{ color: 'var(--color-faint)' }}
        >
          Scroll
        </span>
        <div
          style={{
            position:   'relative',
            width:      '1px',
            height:     '48px',
            background: 'rgba(255,255,255,0.06)',
            overflow:   'hidden',
          }}
        >
          <div
            className="animate-scroll-down"
            style={{
              position:   'absolute',
              inset:      '0',
              background: 'linear-gradient(to bottom, transparent, var(--accent), transparent)',
            }}
          />
        </div>
      </div>

      {/* Decorative corner accent */}
      <div
        aria-hidden
        style={{
          position:      'absolute',
          top:           '6rem',
          right:         '1.5rem',
          zIndex:        3,
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'flex-end',
          gap:           '0.25rem',
          opacity:       0.18,
          pointerEvents: 'none',
        }}
      >
        {[80, 56, 36, 20].map((w, i) => (
          <div
            key={i}
            style={{ width: `${w}px`, height: '1px', background: 'var(--accent)' }}
          />
        ))}
      </div>
    </section>
  )
}

// ── Photo card component ──────────────────────────────────────────────────────

function PhotoCard() {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width  - 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    gsap.to(card, {
      rotateY: x * 10,
      rotateX: -y * 10,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 800,
    })
  }

  const handleMouseEnter = () => {
    if (cardRef.current) cardRef.current.style.willChange = 'transform'
  }

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: 'power3.out',
      onComplete: () => { if (cardRef.current) cardRef.current.style.willChange = 'auto' },
    })
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position:        'relative',
        width:           'clamp(200px, 100vw, 380px)',
        aspectRatio:     '3/4',
        borderRadius:    '1.75rem',
        overflow:        'hidden',
        border:          '1px solid oklch(0.22 0 0 / 0.55)',
        background:      'oklch(0.08 0.005 50 / 0.6)',
        backdropFilter:  'blur(16px)',
        boxShadow:       '0 0 80px oklch(0.72 0.18 50 / 0.12), 0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 oklch(1 0 0 / 0.06)',
        transformStyle:  'preserve-3d',
        cursor:          'default',
      }}
    >
      {/* Photo */}
      <img
        src="/amrit-lego.png"
        alt="Amrit Podder — LEGO version"
        style={{
          position:       'absolute',
          inset:          0,
          width:          '100%',
          height:         '100%',
          objectFit:      'cover',
          objectPosition: 'center bottom',
        }}
      />

      {/* Bottom gradient for name tag legibility */}
      <div style={{
        position:   'absolute',
        inset:      0,
        background: 'linear-gradient(to top, oklch(0.04 0.005 50 / 0.92) 0%, transparent 52%)',
      }} />

      {/* Floating stat chips — top left */}
      <div style={{
        position: 'absolute',
        top:      '1.2rem',
        left:     '1.2rem',
        display:  'flex',
        flexDirection: 'column',
        gap:      '0.5rem',
      }}>
        <Chip label="35% conv. lift" />
        <Chip label="98% retention" />
      </div>

      {/* Accent glow — top right */}
      <div style={{
        position:   'absolute',
        top:        0,
        right:      0,
        width:      '80px',
        height:     '80px',
        background: 'radial-gradient(circle at top right, oklch(0.72 0.18 50 / 0.22), transparent 70%)',
      }} />

      {/* Name tag — bottom */}
      <div style={{
        position:       'absolute',
        bottom:         '1.25rem',
        left:           '1.25rem',
        right:          '1.25rem',
        padding:        '0.9rem 1.1rem',
        borderRadius:   '0.85rem',
        background:     'oklch(0.06 0.005 50 / 0.88)',
        border:         '1px solid oklch(0.20 0 0 / 0.5)',
        backdropFilter: 'blur(10px)',
      }}>
        <p style={{
          fontFamily:   "'Inter', sans-serif",
          fontWeight:   700,
          fontSize:     '1rem',
          color:        'oklch(0.94 0 0)',
          marginBottom: '0.2rem',
        }}>
          Amrit Podder
        </p>
        <p style={{
          fontSize:  '0.72rem',
          color:     'var(--accent)',
          fontWeight: 500,
          marginBottom: '0.25rem',
        }}>
          Frontend Lead · Design Engineer
        </p>
        <p style={{ fontSize: '0.65rem', color: '--color-muted' }}>
          📍 Bengaluru, India
        </p>
      </div>
    </div>
  )
}

function Chip({ label }: { label: string }) {
  return (
    <span style={{
      display:       'inline-flex',
      alignItems:    'center',
      padding:       '0.3rem 0.7rem',
      borderRadius:  '999px',
      fontSize:      '0.65rem',
      fontWeight:    600,
      letterSpacing: '0.04em',
      background:    'oklch(0.06 0.005 50 / 0.82)',
      border:        '1px solid oklch(0.22 0 0 / 0.55)',
      color:         'var(--accent)',
      backdropFilter:'blur(8px)',
    }}>
      {label}
    </span>
  )
}
