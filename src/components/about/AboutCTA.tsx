import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TransitionLink from '../TransitionLink'

gsap.registerPlugin(ScrollTrigger)

// Calendly URL — same as footer
const CALENDLY_URL = 'https://calendly.com/amritpodder'

function openCalendly() {
  const w = window as Window & { Calendly?: { initPopupWidget: (o: { url: string }) => void } }
  if (w.Calendly) {
    w.Calendly.initPopupWidget({ url: CALENDLY_URL })
  } else {
    window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer')
  }
}

export default function AboutCTA() {
  const sectionRef = useRef<HTMLElement>(null)
  const innerRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    gsap.set(innerRef.current, { opacity: 0, y: 28 })

    const st = ScrollTrigger.create({
      trigger: section,
      start:   'top 80%',
      once:    true,
      onEnter: () => {
        gsap.to(innerRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
      },
    })

    return () => st.kill()
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-label="Contact CTA"
      style={{
        padding:    'clamp(4rem, 8vw, 6rem) clamp(1.5rem, 5vw, 5rem)',
        background: `radial-gradient(ellipse 70% 60% at 50% 50%,
                       oklch(0.72 0.18 50 / 0.06), transparent 70%),
                     oklch(0.05 0.005 50)`,
        position:   'relative',
        overflow:   'hidden',
      }}
    >
      {/* Top border */}
      <div style={{
        position:   'absolute',
        top: 0, left: 0, right: 0,
        height:     '1px',
        background: 'linear-gradient(90deg, transparent 0%, oklch(0.18 0 0) 20%, oklch(0.18 0 0) 80%, transparent 100%)',
      }} />

      <div
        ref={innerRef}
        style={{
          maxWidth:   '680px',
          margin:     '0 auto',
          textAlign:  'center',
        }}
      >
        {/* Eyebrow */}
        <p style={{
          fontSize:      '0.68rem',
          fontWeight:    700,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color:         'var(--accent)',
          marginBottom:  '1.4rem',
        }}>
          Get in touch
        </p>

        {/* Headline */}
        <div style={{ marginBottom: '1.2rem' }}>
          <h2 style={{
            fontFamily:    "'Inter', sans-serif",
            fontWeight:    800,
            fontSize:      'clamp(2.2rem, 5vw, 4.2rem)',
            letterSpacing: '-0.04em',
            lineHeight:    0.92,
            color:         'oklch(0.96 0 0)',
            marginBottom:  '0.08em',
          }}>
            Have a project
          </h2>
          <h2 style={{
            fontFamily:    "'Instrument Serif', serif",
            fontWeight:    400,
            fontStyle:     'italic',
            fontSize:      'clamp(2.2rem, 5vw, 4.2rem)',
            letterSpacing: '-0.02em',
            lineHeight:    0.95,
            color:         'var(--accent)',
          }}>
            in mind?
          </h2>
        </div>

        <p style={{
          fontSize:     'clamp(0.88rem, 1.6vw, 1rem)',
          color:        'oklch(0.50 0 0)',
          lineHeight:   1.72,
          marginBottom: '2.5rem',
        }}>
          Whether it's a new build, a complex migration, or a team you want
          to level up — I'm open to the conversation.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
          <button
            onClick={openCalendly}
            style={{
              display:       'inline-flex',
              alignItems:    'center',
              gap:           '0.55rem',
              padding:       '0.82rem 1.8rem',
              borderRadius:  '0.5rem',
              background:    'var(--accent)',
              border:        'none',
              color:         'oklch(0.08 0 0)',
              fontWeight:    700,
              fontSize:      '0.88rem',
              letterSpacing: '0.03em',
              cursor:        'pointer',
              boxShadow:     '0 0 28px oklch(0.72 0.18 50 / 0.35)',
              transition:    'box-shadow 0.2s, transform 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 42px oklch(0.72 0.18 50 / 0.55)'
              ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 28px oklch(0.72 0.18 50 / 0.35)'
              ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
            Book a call
          </button>

          <TransitionLink
            to="/contact"
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              gap:            '0.5rem',
              padding:        '0.82rem 1.8rem',
              borderRadius:   '0.5rem',
              background:     'transparent',
              border:         '1.5px solid oklch(0.22 0 0)',
              color:          'oklch(0.72 0 0)',
              fontWeight:     600,
              fontSize:       '0.88rem',
              letterSpacing:  '0.03em',
              textDecoration: 'none',
              transition:     'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderColor = 'oklch(0.40 0 0)'
              el.style.color = 'oklch(0.92 0 0)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderColor = 'oklch(0.22 0 0)'
              el.style.color = 'oklch(0.72 0 0)'
            }}
          >
            Send a message
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </TransitionLink>
        </div>
      </div>
    </section>
  )
}
