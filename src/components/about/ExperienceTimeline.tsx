import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const EXPERIENCE = [
  {
    period:   'Feb 2026 – Present',
    role:     'Frontend Lead',
    company:  'NetBramha Studio',
    location: 'Bengaluru',
    type:     'Full-time',
    current:  true,
    bullets: [
      'Leading frontend architecture for global UX projects',
      'Setting engineering standards across cross-functional teams',
      'Driving design-to-code workflows with Figma token pipelines',
    ],
    tags: ['React', 'Next.js', 'TypeScript', 'GSAP'],
  },
  {
    period:   'Mar 2021 – Jan 2026',
    role:     'Frontend Developer',
    company:  'Langoor',
    location: 'Bengaluru',
    type:     'Full-time · 5 yrs',
    current:  false,
    bullets: [
      'Led 40+ high-performance WordPress & Shopify stores, +25% conversion rates',
      'Shopify Liquid templates driving +35% checkout uplift',
      'REST/SOAP + Storefront API integrations — 40% less manual workload',
      'Mentored 8+ junior developers, managed projects up to $100K',
    ],
    tags: ['Shopify', 'WordPress', 'React', 'PHP', 'GSAP'],
  },
  {
    period:   'Nov 2018 – Mar 2021',
    role:     'Senior Frontend Developer',
    company:  'JJJ I-TECH PVT LTD',
    location: 'Bengaluru',
    type:     'Full-time · 2.5 yrs',
    current:  false,
    bullets: [
      'Custom HTML web apps for Hindustan Aeronautics Limited (HAL) and Bharat Electronics Limited (BEL)',
      'Wireframes & prototypes translated into responsive production products',
      'WordPress CMS landing pages and custom themes',
    ],
    tags: ['HTML5', 'CSS3', 'JavaScript', 'WordPress'],
  },
  {
    period:   'Nov 2016 – May 2018',
    role:     'UI Developer',
    company:  'Nexval Group',
    location: 'Kolkata',
    type:     'Full-time',
    current:  false,
    bullets: [
      'Built responsive UI components for fintech web platforms',
      'Collaborated with UX designers on pixel-perfect implementations',
    ],
    tags: ['HTML5', 'CSS3', 'jQuery', 'Bootstrap'],
  },
  {
    period:   'Jan 2015 – Nov 2016',
    role:     'UI Developer / Web Designer',
    company:  'Griebs Websolutions · Sansoft India',
    location: 'Kolkata',
    type:     'Full-time',
    current:  false,
    bullets: [
      'Early career: web design and frontend development across varied client projects',
      'Laid the foundation in UI/UX, HTML, CSS, and CMS platforms',
    ],
    tags: ['HTML5', 'CSS3', 'Photoshop', 'WordPress'],
  },
]

// Glass card styling constants
const GLASS = {
  background:     'oklch(0.10 0.005 50 / 0.55)',
  border:         '1px solid oklch(0.20 0 0 / 0.6)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  boxShadow:      'inset 0 1px 0 oklch(1 0 0 / 0.04), 0 4px 24px oklch(0 0 0 / 0.20)',
} as React.CSSProperties

declare namespace React { interface CSSProperties { WebkitBackdropFilter?: string } }

export default function ExperienceTimeline() {
  const sectionRef = useRef<HTMLElement>(null)
  const eyebrowRef = useRef<HTMLParagraphElement>(null)
  const headRef    = useRef<HTMLDivElement>(null)
  const lineRef    = useRef<HTMLDivElement>(null)
  const cardsRef   = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    gsap.set([eyebrowRef.current, headRef.current], { opacity: 0, y: 24 })
    gsap.set(lineRef.current, { scaleY: 0, transformOrigin: 'top center' })
    gsap.set(cardsRef.current, { opacity: 0, x: -24 })

    const st = ScrollTrigger.create({
      trigger: section,
      start:   'top 75%',
      once:    true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.45 })
          .to(headRef.current,    { opacity: 1, y: 0, duration: 0.6 }, '-=0.28')
          .to(lineRef.current,    { scaleY: 1, duration: 1.2, ease: 'power2.inOut' }, '-=0.3')
          .to(cardsRef.current,   {
            opacity:  1,
            x:        0,
            duration: 0.55,
            stagger:  0.12,
            ease:     'power2.out',
          }, '-=0.9')
      },
    })

    return () => st.kill()
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-label="Work experience"
      style={{
        padding:    'clamp(4rem, 8vw, 6.5rem) clamp(1.5rem, 7.5vw, 6rem)',
        background: `radial-gradient(ellipse 50% 60% at 20% 50%,
                       oklch(0.72 0.18 50 / 0.04), transparent 70%),
                     oklch(0.06 0.005 50)`,
        position:   'relative',
        overflow:   'hidden',
      }}
    >
      {/* Section header */}
      <div style={{ marginBottom: 'clamp(2.5rem, 5vw, 4rem)' }}>
        <p
          ref={eyebrowRef}
          style={{
            fontSize:      '0.68rem',
            fontWeight:    700,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color:         'var(--accent)',
            marginBottom:  '1rem',
          }}
        >
          Career
        </p>
        <div ref={headRef}>
          <h2 style={{
            fontFamily:    "'Inter', sans-serif",
            fontWeight:    800,
            fontSize:      'clamp(2rem, 4vw, 3.5rem)',
            letterSpacing: '-0.04em',
            lineHeight:    0.92,
            color:         'oklch(0.96 0 0)',
          }}>
            Work{' '}
            <span style={{
              fontFamily:  "'Instrument Serif', serif",
              fontWeight:  400,
              fontStyle:   'italic',
              letterSpacing: '-0.02em',
              color:       'var(--accent)',
            }}>
              experience.
            </span>
          </h2>
        </div>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative', maxWidth: '860px' }}>
        {/* Vertical line */}
        <div
          ref={lineRef}
          style={{
            position:   'absolute',
            left:       '11px',
            top:        '6px',
            bottom:     '6px',
            width:      '1px',
            background: 'linear-gradient(to bottom, var(--accent), oklch(0.72 0.18 50 / 0.15))',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem', paddingLeft: '2.6rem' }}>
          {EXPERIENCE.map((exp, i) => (
            <div
              key={exp.company}
              ref={el => { cardsRef.current[i] = el }}
              style={{ position: 'relative' }}
            >
              {/* Timeline dot */}
              <div style={{
                position:     'absolute',
                left:         '-2.05rem',
                top:          '1.1rem',
                width:        '10px',
                height:       '10px',
                borderRadius: '50%',
                background:   exp.current ? 'var(--accent)' : 'oklch(0.25 0 0)',
                border:       exp.current ? '2px solid oklch(0.72 0.18 50 / 0.4)' : '2px solid oklch(0.22 0 0)',
                boxShadow:    exp.current ? '0 0 10px oklch(0.72 0.18 50 / 0.5)' : 'none',
                zIndex:       2,
              }} />

              {/* Glass card */}
              <div
                style={{
                  ...GLASS,
                  borderRadius: '1rem',
                  padding:      'clamp(1.2rem, 2.5vw, 1.8rem)',
                  transition:   'border-color 0.25s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'oklch(0.72 0.18 50 / 0.30)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'oklch(0.20 0 0 / 0.6)'
                }}
              >
                {/* Header row */}
                <div style={{
                  display:        'flex',
                  flexWrap:       'wrap',
                  justifyContent: 'space-between',
                  alignItems:     'flex-start',
                  gap:            '0.5rem',
                  marginBottom:   '0.8rem',
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                      <h3 style={{
                        fontFamily:    "'Inter', sans-serif",
                        fontWeight:    700,
                        fontSize:      'clamp(0.95rem, 1.8vw, 1.1rem)',
                        color:         'oklch(0.94 0 0)',
                        letterSpacing: '-0.01em',
                      }}>
                        {exp.role}
                      </h3>
                      {exp.current && (
                        <span style={{
                          fontSize:      '0.58rem',
                          fontWeight:    700,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color:         'oklch(0.72 0.20 148)',
                          background:    'oklch(0.55 0.18 148 / 0.12)',
                          border:        '1px solid oklch(0.55 0.18 148 / 0.3)',
                          borderRadius:  '999px',
                          padding:       '0.18rem 0.5rem',
                        }}>
                          Current
                        </span>
                      )}
                    </div>
                    <p style={{
                      fontSize:  '0.82rem',
                      color:     'var(--accent)',
                      fontWeight: 500,
                    }}>
                      {exp.company}
                      <span style={{ color: 'oklch(0.38 0 0)', margin: '0 0.4rem' }}>·</span>
                      <span style={{ color: 'oklch(0.45 0 0)' }}>{exp.location}</span>
                    </p>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <p style={{
                      fontSize:      '0.68rem',
                      fontWeight:    600,
                      color:         'oklch(0.42 0 0)',
                      letterSpacing: '0.04em',
                    }}>
                      {exp.period}
                    </p>
                    <p style={{
                      fontSize: '0.62rem',
                      color:    'oklch(0.33 0 0)',
                      marginTop: '0.15rem',
                    }}>
                      {exp.type}
                    </p>
                  </div>
                </div>

                {/* Bullets */}
                <ul style={{
                  listStyle:   'none',
                  padding:     0,
                  margin:      '0 0 1rem',
                  display:     'flex',
                  flexDirection: 'column',
                  gap:         '0.35rem',
                }}>
                  {exp.bullets.map((b, j) => (
                    <li key={j} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                      <span style={{ color: 'var(--accent)', fontSize: '0.6rem', marginTop: '0.38rem', flexShrink: 0 }}>▸</span>
                      <span style={{ fontSize: '0.82rem', color: 'oklch(0.55 0 0)', lineHeight: 1.6 }}>{b}</span>
                    </li>
                  ))}
                </ul>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {exp.tags.map(tag => (
                    <span
                      key={tag}
                      style={{
                        fontSize:      '0.62rem',
                        fontWeight:    600,
                        letterSpacing: '0.05em',
                        color:         'oklch(0.50 0 0)',
                        background:    'oklch(0.14 0 0)',
                        border:        '1px solid oklch(0.20 0 0)',
                        borderRadius:  '999px',
                        padding:       '0.2rem 0.6rem',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
