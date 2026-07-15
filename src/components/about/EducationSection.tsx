import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const EDUCATION = [
  {
    degree:      'BASc Chemistry',
    school:      'Netaji Subhas Open University',
    period:      '2013 – 2016',
    icon: '🎓',
  },
  {
    degree:      'DMP — Digital Media Pro & UI/UX Design',
    school:      'Arena Animation, Park Street',
    period:      '2012 – 2015',
    location:    'Kolkata',
    icon: '🎨',
  },
  {
    degree:      'Digital Marketing',
    school:      'Arena Animation, Park Street',
    period:      '2018',
    location:    'Kolkata',
    icon: '📈',
  },
]

const CERTIFICATIONS = [
  { name: 'HubSpot Inbound',                   icon: '🏅', org: 'HubSpot Academy' },
  { name: 'NSDC World Skill Competition',       icon: '🏆', org: 'NSDC India' },
  { name: 'Google Digital Unlocked',            icon: '🔓', org: 'Google' },
  { name: 'SEMrush SEO Toolkit',                icon: '📊', org: 'SEMrush' },
]

const GLASS: React.CSSProperties = {
  background:           'oklch(0.10 0.005 50 / 0.55)',
  border:               '1px solid oklch(0.20 0 0 / 0.6)',
  backdropFilter:       'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  boxShadow:            'inset 0 1px 0 oklch(1 0 0 / 0.04)',
}

export default function EducationSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const eyebrowRef = useRef<HTMLParagraphElement>(null)
  const headRef    = useRef<HTMLDivElement>(null)
  const eduRef     = useRef<HTMLDivElement>(null)
  const certRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    gsap.set([eyebrowRef.current, headRef.current, eduRef.current, certRef.current], { opacity: 0, y: 24 })

    const st = ScrollTrigger.create({
      trigger: section,
      start:   'top 78%',
      once:    true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.45 })
          .to(headRef.current,    { opacity: 1, y: 0, duration: 0.6 }, '-=0.28')
          .to(eduRef.current,     { opacity: 1, y: 0, duration: 0.55 }, '-=0.3')
          .to(certRef.current,    { opacity: 1, y: 0, duration: 0.55 }, '-=0.35')
      },
    })

    return () => st.kill()
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-label="Education and certifications"
      style={{
        padding:    'clamp(4rem, 8vw, 6.5rem) clamp(1.5rem, 7.5vw, 6rem)',
        background: `radial-gradient(ellipse 60% 55% at 80% 50%,
                       oklch(0.72 0.18 50 / 0.04), transparent 70%),
                     oklch(0.055 0.005 50)`,
        position:   'relative',
      }}
    >
      {/* Border top */}
      <div style={{
        position:   'absolute',
        top:        0, left: 0, right: 0,
        height:     '1px',
        background: 'linear-gradient(90deg, transparent 0%, oklch(0.18 0 0) 20%, oklch(0.18 0 0) 80%, transparent 100%)',
      }} />

      {/* Header */}
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
          Background
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
            Education &{' '}
            <span style={{
              fontFamily:    "'Instrument Serif', serif",
              fontWeight:    400,
              fontStyle:     'italic',
              letterSpacing: '-0.02em',
              color:         'var(--accent)',
            }}>
              certifications.
            </span>
          </h2>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Education column */}
        <div ref={eduRef}>
          <p style={{
            fontSize:      '0.65rem',
            fontWeight:    700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color:         'oklch(0.38 0 0)',
            marginBottom:  '1.2rem',
          }}>
            Education
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {EDUCATION.map((ed) => (
              <div
                key={ed.school + ed.degree}
                style={{
                  ...GLASS,
                  borderRadius: '0.9rem',
                  padding:      '1.1rem 1.3rem',
                  display:      'flex',
                  gap:          '1rem',
                  alignItems:   'flex-start',
                  transition:   'border-color 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'oklch(0.72 0.18 50 / 0.28)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'oklch(0.20 0 0 / 0.6)' }}
              >
                <span style={{ fontSize: '1.4rem', lineHeight: 1, flexShrink: 0 }}>{ed.icon}</span>
                <div>
                  <p style={{
                    fontWeight:    600,
                    fontSize:      '0.88rem',
                    color:         'oklch(0.88 0 0)',
                    marginBottom:  '0.2rem',
                    lineHeight:    1.3,
                  }}>
                    {ed.degree}
                  </p>
                  <p style={{
                    fontSize:  '0.75rem',
                    color:     'var(--accent)',
                    fontWeight: 500,
                    marginBottom: '0.15rem',
                  }}>
                    {ed.school}
                  </p>
                  <p style={{ fontSize: '0.65rem', color: 'oklch(0.38 0 0)' }}>
                    {ed.period}{ed.location ? ` · ${ed.location}` : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications column */}
        <div ref={certRef}>
          <p style={{
            fontSize:      '0.65rem',
            fontWeight:    700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color:         'oklch(0.38 0 0)',
            marginBottom:  '1.2rem',
          }}>
            Certifications
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {CERTIFICATIONS.map((cert) => (
              <div
                key={cert.name}
                style={{
                  ...GLASS,
                  borderRadius: '0.9rem',
                  padding:      '1.1rem 1.3rem',
                  display:      'flex',
                  gap:          '1rem',
                  alignItems:   'center',
                  transition:   'border-color 0.2s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'oklch(0.72 0.18 50 / 0.28)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'oklch(0.20 0 0 / 0.6)' }}
              >
                <span style={{ fontSize: '1.4rem', lineHeight: 1, flexShrink: 0 }}>{cert.icon}</span>
                <div>
                  <p style={{
                    fontWeight:   600,
                    fontSize:     '0.88rem',
                    color:        'oklch(0.88 0 0)',
                    marginBottom: '0.15rem',
                  }}>
                    {cert.name}
                  </p>
                  <p style={{ fontSize: '0.70rem', color: 'oklch(0.42 0 0)' }}>{cert.org}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
