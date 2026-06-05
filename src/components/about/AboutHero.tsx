import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

// ─── Typewriter hook ──────────────────────────────────────────────────────────
const ROLES = ['Frontend Lead', 'Design Engineer', 'Shopify Expert', 'Problem Solver', 'React Developer']

function useTypewriter(phrases: string[], typingSpeed = 75, pauseMs = 1600) {
  const [text, setText]           = useState('')
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [deleting, setDeleting]   = useState(false)

  useEffect(() => {
    const current = phrases[phraseIdx]
    const delay   = deleting ? typingSpeed / 2 : typingSpeed

    const t = setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, text.length + 1)
        setText(next)
        if (next === current) setTimeout(() => setDeleting(true), pauseMs)
      } else {
        const next = current.slice(0, text.length - 1)
        setText(next)
        if (next === '') {
          setDeleting(false)
          setPhraseIdx(i => (i + 1) % phrases.length)
        }
      }
    }, delay)

    return () => clearTimeout(t)
  }, [text, deleting, phraseIdx, phrases, typingSpeed, pauseMs])

  return text
}

// ─── Quick stats ──────────────────────────────────────────────────────────────
const STATS = [
  { value: '8+',  label: 'Years exp.' },
  { value: '50+', label: 'Projects' },
  { value: '15+', label: 'Brands' },
  { value: '3',   label: 'Countries' },
]

export default function AboutHero() {
  const wrapRef    = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLParagraphElement>(null)
  const line1Ref   = useRef<HTMLSpanElement>(null)
  const line2Ref   = useRef<HTMLSpanElement>(null)
  const paraRef    = useRef<HTMLParagraphElement>(null)
  const statsRef   = useRef<HTMLDivElement>(null)
  const imageRef   = useRef<HTMLDivElement>(null)

  const role = useTypewriter(ROLES)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(
        [eyebrowRef.current, line1Ref.current, line2Ref.current,
         paraRef.current, statsRef.current],
        { opacity: 0, y: 32 },
      )
      gsap.set(imageRef.current, { opacity: 0, scale: 0.94 })

      const tl = gsap.timeline({ delay: 0.1, defaults: { ease: 'power3.out' } })
      tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.5 })
        .to(line1Ref.current,   { opacity: 1, y: 0, duration: 0.65 }, '-=0.3')
        .to(line2Ref.current,   { opacity: 1, y: 0, duration: 0.65 }, '-=0.5')
        .to(paraRef.current,    { opacity: 1, y: 0, duration: 0.55 }, '-=0.4')
        .to(statsRef.current,   { opacity: 1, y: 0, duration: 0.5  }, '-=0.3')
        .to(imageRef.current,   { opacity: 1, scale: 1, duration: 0.7, ease: 'power2.out' }, '-=0.6')
    }, wrapRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      aria-label="About hero"
      style={{
        position:   'relative',
        overflow:   'hidden',
        background: `radial-gradient(ellipse 65% 55% at 80% 40%,
                       oklch(0.72 0.18 50 / 0.06), transparent 65%),
                     oklch(0.06 0.005 50)`,
        paddingTop: 'clamp(6rem, 12vw, 9rem)',
      }}
    >
      <div
        ref={wrapRef}
        className="grid md:grid-cols-2 gap-12 items-center"
        style={{ padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 5vw, 5rem) clamp(3rem, 7vw, 5rem)' }}
      >
        {/* Left — text */}
        <div>
          <p
            ref={eyebrowRef}
            style={{
              fontSize:      '0.68rem',
              fontWeight:    700,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color:         'var(--accent)',
              marginBottom:  '1.4rem',
            }}
          >
            Who I am
          </p>

          <h1 style={{ marginBottom: '1.1rem', lineHeight: 0.92 }}>
            <span
              ref={line1Ref}
              style={{
                display:       'block',
                fontFamily:    "'Inter', sans-serif",
                fontWeight:    800,
                fontSize:      'clamp(2.8rem, 6vw, 5.5rem)',
                letterSpacing: '-0.04em',
                color:         'oklch(0.96 0 0)',
              }}
            >
              Amrit
            </span>
            <span
              ref={line2Ref}
              style={{
                display:       'block',
                fontFamily:    "'Instrument Serif', serif",
                fontWeight:    400,
                fontStyle:     'italic',
                fontSize:      'clamp(2.8rem, 6vw, 5.5rem)',
                letterSpacing: '-0.02em',
                color:         'var(--accent)',
              }}
            >
              Podder.
            </span>
          </h1>

          {/* Typewriter role */}
          <div style={{
            display:      'inline-flex',
            alignItems:   'center',
            gap:          '0.5rem',
            marginBottom: '1.6rem',
            minHeight:    '1.6rem',
          }}>
            <span style={{
              fontSize:      '0.75rem',
              fontWeight:    700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color:         'oklch(0.36 0 0)',
            }}>
              Currently
            </span>
            <span style={{ color: 'oklch(0.28 0 0)' }}>·</span>
            <span style={{
              fontSize:      '0.78rem',
              fontWeight:    600,
              letterSpacing: '0.08em',
              color:         'oklch(0.78 0 0)',
            }}>
              {role}
              <span style={{
                display:         'inline-block',
                width:           '2px',
                height:          '0.9em',
                background:      'var(--accent)',
                marginLeft:      '2px',
                verticalAlign:   'text-bottom',
                animation:       'blink 0.9s step-end infinite',
              }} />
            </span>
          </div>

          <p
            ref={paraRef}
            style={{
              fontSize:     'clamp(0.92rem, 1.7vw, 1.05rem)',
              color:        'oklch(0.56 0 0)',
              lineHeight:   1.75,
              maxWidth:     '46ch',
              marginBottom: '2.5rem',
            }}
          >
            Results-driven Frontend Lead with 8+ years building fast, polished
            digital products across e-commerce, enterprise, and WebAR. Based
            in Bangalore — working globally.
          </p>

          {/* Mini stats */}
          <div
            ref={statsRef}
            style={{
              display:             'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap:                 '1rem',
            }}
          >
            {STATS.map(s => (
              <div
                key={s.label}
                style={{
                  padding:      '0.9rem 0.6rem',
                  borderRadius: '0.5rem',
                  background:   'oklch(0.10 0.005 50 / 0.7)',
                  border:       '1px solid oklch(0.18 0 0)',
                  textAlign:    'center',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <p style={{
                  fontFamily:    "'Inter', sans-serif",
                  fontWeight:    800,
                  fontSize:      'clamp(1.3rem, 3vw, 1.8rem)',
                  letterSpacing: '-0.03em',
                  color:         'var(--accent)',
                  lineHeight:    1,
                  marginBottom:  '0.25rem',
                }}>
                  {s.value}
                </p>
                <p style={{
                  fontSize:      '0.62rem',
                  fontWeight:    600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color:         'oklch(0.42 0 0)',
                }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — glass avatar card */}
        <div
          ref={imageRef}
          style={{
            display:        'flex',
            justifyContent: 'center',
            alignItems:     'center',
          }}
        >
          <div style={{
            position:       'relative',
            width:          'clamp(240px, 36vw, 380px)',
            aspectRatio:    '4/5',
            borderRadius:   '1.5rem',
            overflow:       'hidden',
            border:         '1px solid oklch(0.22 0 0 / 0.6)',
            background:     'oklch(0.10 0.005 50 / 0.5)',
            backdropFilter: 'blur(12px)',
            boxShadow:      '0 0 60px oklch(0.72 0.18 50 / 0.08), inset 0 1px 0 oklch(1 0 0 / 0.05)',
          }}>
            {/* Headshot photo */}
            <img
              src="/amrit-podder.jpg"
              alt="Amrit Podder"
              style={{
                position:   'absolute',
                inset:      0,
                width:      '100%',
                height:     '100%',
                objectFit:  'cover',
                objectPosition: 'center top',
              }}
            />

            {/* Gradient overlay so name tag is readable */}
            <div style={{
              position:   'absolute',
              inset:      0,
              background: 'linear-gradient(to top, oklch(0.06 0.005 50 / 0.85) 0%, transparent 55%)',
            }} />

            <div style={{
              position:       'absolute',
              inset:          0,
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              justifyContent: 'flex-end',
              padding:        '1.5rem',
            }}>
              {/* Name tag overlay */}
              <div style={{
                width:          '100%',
                padding:        '1rem',
                borderRadius:   '0.75rem',
                background:     'oklch(0.06 0.005 50 / 0.85)',
                border:         '1px solid oklch(0.20 0 0 / 0.5)',
                backdropFilter: 'blur(8px)',
              }}>
                <p style={{
                  fontFamily:    "'Inter', sans-serif",
                  fontWeight:    700,
                  fontSize:      '0.95rem',
                  color:         'oklch(0.92 0 0)',
                  marginBottom:  '0.2rem',
                }}>
                  Amrit Podder
                </p>
                <p style={{
                  fontSize:  '0.72rem',
                  color:     'var(--accent)',
                  fontWeight: 500,
                }}>
                  Frontend Lead · NetBramha Studio
                </p>
                <p style={{
                  fontSize: '0.66rem',
                  color:    'oklch(0.42 0 0)',
                  marginTop: '0.3rem',
                }}>
                  📍 Bengaluru, India
                </p>
              </div>
            </div>

            {/* Subtle corner accent */}
            <div style={{
              position:   'absolute',
              top:        0,
              right:      0,
              width:      '60px',
              height:     '60px',
              background: 'radial-gradient(circle at top right, oklch(0.72 0.18 50 / 0.15), transparent 70%)',
            }} />
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div style={{
        position:   'absolute',
        bottom:     0,
        left:       0,
        right:      0,
        height:     '120px',
        background: 'linear-gradient(to bottom, transparent, oklch(0.06 0.005 50))',
        pointerEvents: 'none',
      }} />

      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </section>
  )
}
