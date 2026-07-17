import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TransitionLink from '../TransitionLink'

gsap.registerPlugin(ScrollTrigger)

// ─── Calendly config ────────────────────────────────────────────────────────
// Replace with your own Calendly URL once your account is set up:
// https://calendly.com/your-username
const CALENDLY_URL = 'https://calendly.com/amritpodder'

const CURRENT_YEAR = new Date().getFullYear()

function openCalendlyPopup() {
  const w = window as Window & { Calendly?: { initPopupWidget: (o: { url: string }) => void } }
  if (w.Calendly) {
    w.Calendly.initPopupWidget({ url: CALENDLY_URL })
  } else {
    window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer')
  }
}

// ─── Social links ────────────────────────────────────────────────────────────
const SOCIALS = [
  {
    label: 'LinkedIn',
    href:  'https://www.linkedin.com/in/amritpodder',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: 'Email',
    href:  'mailto:design2code93@gmail.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href:  'https://github.com/coddingway',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
  },
]

const NAV_LINKS = [
  { label: 'About',       to: '/about' },
  { label: 'Work',        to: '/work' },
  { label: 'Football',    to: '/football' },
  { label: 'Contact',     to: '/contact' },
]

// ─── Calendly loader ─────────────────────────────────────────────────────────
function useCalendly() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Inject Calendly widget CSS once
    if (!document.getElementById('calendly-css')) {
      const link = document.createElement('link')
      link.id   = 'calendly-css'
      link.rel  = 'stylesheet'
      link.href = 'https://assets.calendly.com/assets/external/widget.css'
      document.head.appendChild(link)
    }

    // Inject Calendly widget JS once
    if (!document.getElementById('calendly-js')) {
      const script = document.createElement('script')
      script.id  = 'calendly-js'
      script.src = 'https://assets.calendly.com/assets/external/widget.js'
      script.async = true
      script.onload = () => setReady(true)
      document.head.appendChild(script)
    } else {
      // Already loaded
      if ((window as Window & { Calendly?: unknown }).Calendly) setReady(true)
    }
  }, [])

  return { ready }
}

export default function LandingFooter() {
  const sectionRef   = useRef<HTMLElement>(null)
  const badgeRef     = useRef<HTMLDivElement>(null)
  const headRef      = useRef<HTMLDivElement>(null)
  const subRef       = useRef<HTMLParagraphElement>(null)
  const ctasRef      = useRef<HTMLDivElement>(null)
  const socialsRef   = useRef<HTMLDivElement>(null)
  const dividerRef   = useRef<HTMLDivElement>(null)
  const bottomRef    = useRef<HTMLDivElement>(null)

  const { ready: _calendlyReady } = useCalendly()

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    gsap.set(
      [badgeRef.current, headRef.current, subRef.current,
       ctasRef.current, socialsRef.current],
      { opacity: 0, y: 28 },
    )
    gsap.set([dividerRef.current, bottomRef.current], { opacity: 0 })

    const st = ScrollTrigger.create({
      trigger: section,
      start:   'top 80%',
      once:    true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.to(badgeRef.current,   { opacity: 1, y: 0, duration: 0.45 })
          .to(headRef.current,    { opacity: 1, y: 0, duration: 0.65 }, '-=0.28')
          .to(subRef.current,     { opacity: 1, y: 0, duration: 0.50 }, '-=0.38')
          .to(ctasRef.current,    { opacity: 1, y: 0, duration: 0.45 }, '-=0.32')
          .to(socialsRef.current, { opacity: 1, y: 0, duration: 0.45 }, '-=0.28')
          .to([dividerRef.current, bottomRef.current], {
            opacity: 1, duration: 0.5, stagger: 0.1,
          }, '-=0.2')
      },
    })

    return () => st.kill()
  }, [])

  return (
    <footer
      ref={sectionRef}
      aria-label="Site footer"
      style={{
        position:   'relative',
        overflow:   'hidden',
        background: `radial-gradient(ellipse 70% 60% at 50% 0%,
                       oklch(0.72 0.18 50 / 0.07), transparent 65%),
                     oklch(0.05 0.005 50)`,
      }}
    >
      {/* top border */}
      <div style={{
        height:     '1px',
        background: 'linear-gradient(90deg, transparent 0%, oklch(0.18 0 0) 20%, oklch(0.18 0 0) 80%, transparent 100%)',
      }} />

      {/* ── Main CTA block ─────────────────────────────────────────────────── */}
      <div style={{
        maxWidth:   '760px',
        margin:     '0 auto',
        padding:    'clamp(4rem, 9vw, 7.5rem) clamp(1.5rem, 5vw, 3rem) clamp(3rem, 6vw, 5rem)',
        textAlign:  'center',
      }}>

        {/* Availability badge */}
        <div
          ref={badgeRef}
          style={{
            display:        'inline-flex',
            alignItems:     'center',
            gap:            '0.5rem',
            padding:        '0.35rem 0.9rem',
            borderRadius:   '999px',
            border:         '1px solid oklch(0.55 0.18 148 / 0.35)',
            background:     'oklch(0.55 0.18 148 / 0.08)',
            marginBottom:   '1.8rem',
          }}
        >
          {/* Pulsing green dot */}
          <span style={{ position: 'relative', display: 'inline-flex', width: '8px', height: '8px' }}>
            <span style={{
              position:   'absolute',
              inset:      0,
              borderRadius: '50%',
              background: 'oklch(0.72 0.20 148)',
              animation:  'ping 1.6s cubic-bezier(0,0,0.2,1) infinite',
              opacity:    0.6,
            }} />
            <span style={{
              position:   'relative',
              display:    'inline-flex',
              width:      '8px',
              height:     '8px',
              borderRadius: '50%',
              background: 'oklch(0.72 0.20 148)',
            }} />
          </span>
          <span style={{
            fontSize:      '0.70rem',
            fontWeight:    600,
            letterSpacing: '0.1em',
            color:         'oklch(0.72 0.20 148)',
          }}>
            Available for new projects
          </span>
        </div>

        {/* Headline */}
        <div ref={headRef} style={{ marginBottom: '1.2rem' }}>
          <h2 style={{
            fontFamily:    "'Inter', sans-serif",
            fontWeight:    800,
            fontSize:      'clamp(2.6rem, 6.5vw, 5.2rem)',
            lineHeight:    0.90,
            letterSpacing: '-0.04em',
            color:         'oklch(0.96 0 0)',
            marginBottom:  '0.08em',
          }}>
            Let's build
          </h2>
          <h2 style={{
            fontFamily:    "'Instrument Serif', serif",
            fontWeight:    400,
            fontStyle:     'italic',
            fontSize:      'clamp(2.6rem, 6.5vw, 5.2rem)',
            lineHeight:    0.95,
            letterSpacing: '-0.02em',
            color:         'var(--accent)',
          }}>
            something great.
          </h2>
        </div>

        {/* Subtext */}
        <p
          ref={subRef}
          style={{
            fontSize:     'clamp(0.9rem, 1.8vw, 1.05rem)',
            color:        'oklch(0.52 0 0)',
            lineHeight:   1.70,
            maxWidth:     '48ch',
            margin:       '0 auto 2.8rem',
          }}
        >
          Frontend Lead with 8+ years turning complex ideas into fast,
          polished products. Open to freelance builds, collaborations, and
          full-time opportunities.
        </p>

        {/* CTA buttons */}
        <div
          ref={ctasRef}
          style={{
            display:        'flex',
            flexWrap:       'wrap',
            gap:            '1rem',
            justifyContent: 'center',
            marginBottom:   '2.8rem',
          }}
        >
          {/* Book a call — Calendly popup */}
          <button
            type="button"
            onClick={openCalendlyPopup}
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              gap:            '0.6rem',
              padding:        '0.82rem 1.8rem',
              borderRadius:   '0.5rem',
              background:     'var(--accent)',
              border:         'none',
              color:          'oklch(0.08 0 0)',
              fontWeight:     700,
              fontSize:       '0.88rem',
              letterSpacing:  '0.03em',
              cursor:         'pointer',
              boxShadow:      '0 0 28px oklch(0.72 0.18 50 / 0.35)',
              transition:     'box-shadow 0.2s, transform 0.15s',
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
            {/* Calendar icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <path d="M16 2v4M8 2v4M3 10h18"/>
              <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
            </svg>
            Book a call
          </button>

          {/* View work */}
          <TransitionLink
            to="/work"
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
            View my work
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </TransitionLink>
        </div>

        {/* Social icons */}
        <div
          ref={socialsRef}
          style={{
            display:        'flex',
            justifyContent: 'center',
            gap:            '0.8rem',
          }}
        >
          {SOCIALS.map(s => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              aria-label={s.label}
              title={s.label}
              style={{
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
                width:           '42px',
                height:          '42px',
                borderRadius:    '50%',
                border:          '1px solid oklch(0.20 0 0)',
                background:      'oklch(0.09 0.004 50)',
                color:           'oklch(0.50 0 0)',
                textDecoration:  'none',
                transition:      'border-color 0.2s, color 0.2s, background 0.2s',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.borderColor = 'oklch(0.72 0.18 50 / 0.6)'
                el.style.color       = 'var(--accent)'
                el.style.background  = 'oklch(0.72 0.18 50 / 0.07)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.borderColor = 'oklch(0.20 0 0)'
                el.style.color       = 'oklch(0.50 0 0)'
                el.style.background  = 'oklch(0.09 0.004 50)'
              }}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      {/* ── Divider ───────────────────────────────────────────────────────────── */}
      <div
        ref={dividerRef}
        style={{
          height:     '1px',
          background: 'linear-gradient(90deg, transparent 0%, oklch(0.14 0 0) 20%, oklch(0.14 0 0) 80%, transparent 100%)',
          margin:     '0 clamp(1.5rem, 5vw, 4rem)',
        }}
      />

      {/* ── Tools credit ─────────────────────────────────────────────────────── */}
      <div
        ref={bottomRef}
        style={{ padding: '0 clamp(1.5rem, 7.5vw, 6rem)', textAlign: 'center' }}
      >
        <p style={{ fontSize: '0.68rem', color: '--color-muted', lineHeight: 1.6 }}>
          Built with{' '}
          {['React', 'Vite', 'GSAP ScrollTrigger', 'Three.js', 'Lenis', 'Tailwind v4'].map((tool, i, arr) => (
            <span key={tool}>
              <span style={{ color: 'var(--accent)' }}>{tool}</span>
              {i < arr.length - 1 ? ', ' : ''}
            </span>
          ))}
          {' '}· crafted in collaboration with{' '}
          <span style={{ color: 'var(--accent)' }}>Claude Code</span>
        </p>
      </div>

      {/* ── Giant name ────────────────────────────────────────────────────────── */}
      <div
        style={{
          padding:    '0 clamp(0.25rem, 1vw, 1rem)',
          marginTop:  'clamp(1.5rem, 4vw, 3rem)',
          overflow:   'hidden',
          lineHeight: 0.82,
        }}
        aria-hidden
      >
        <p style={{
          fontFamily:    "'Inter', sans-serif",
          fontWeight:    800,
          fontSize:      'clamp(3rem, 16.5vw, 18rem)',
          letterSpacing: '-0.04em',
          color:         'oklch(1 0 0)',
          whiteSpace:    'nowrap',
          userSelect:    'none',
          textAlign:      'center',
        }}>
          Amrit Podder
        </p>
      </div>

      {/* ── Copyright line ─────────────────────────────────────────────────────── */}
      <div style={{
        padding:        '2.6rem clamp(1.5rem, 7.5vw, 6rem) clamp(1.2rem, 3vw, 1.8rem)',
        display:        'flex',
        justifyContent: 'space-between',
        flexWrap:       'wrap',
        gap:            '0.5rem',
      }}>
        <p style={{ fontSize: '0.75rem' }}>
          © {CURRENT_YEAR} Amrit Podder · All rights reserved.
        </p>
        <nav style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap' }}>
          {NAV_LINKS.map(l => (
            <TransitionLink
              key={l.to}
              to={l.to}
              style={{
                fontSize:       '0.75rem',
                textDecoration: 'none',
                letterSpacing:  '0.02em',
                transition:     'color 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text-primary)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-muted)' }}
            >
              {l.label}
            </TransitionLink>
          ))}
        </nav>
      </div>

      {/* Ping animation keyframe */}
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
      `}</style>
    </footer>
  )
}
