import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const MILESTONES = [
  {
    year:  '2015',
    title: 'Notepad on Windows XP',
    desc:  'First line of HTML. No IDE. No syntax highlighting. Just a text file and a browser refresh. That was enough to get hooked.',
  },
  {
    year:  '2016',
    title: 'Chemistry grad turns coder',
    desc:  'BASc Chemistry. Learned UI/UX at Arena Animation, Kolkata. A weird pivot. Best decision I ever made.',
  },
  {
    year:  '2018',
    title: 'Fintech and firsts',
    desc:  'Nexval Group — building mortgage and loan-servicing UIs in Kolkata. First component library. First time shipping something real people depended on.',
  },
  {
    year:  '2021',
    title: 'Scale, at Langoor',
    desc:  '5 years. 40+ products. HUL, Infosys, Wipro. Learned what shipping at scale actually means — across India, Canada, and Australia.',
  },
  {
    year:  '2026',
    title: 'Frontend Lead · NetBramha',
    desc:  'Architecture decisions, design systems, engineering standards. The work behind the work — building the foundation other engineers build on.',
  },
  {
    year:  'Now',
    title: 'AI agents and beyond',
    desc:  'Same curiosity as the Windows XP days. Different tools. Orchestrating agents, shipping AI-native products. From Notepad to Node.js — and everything that came after.',
  },
]

export default function TransformationStory() {
  const sectionRef = useRef<HTMLElement>(null)
  const rowRefs    = useRef<(HTMLDivElement | null)[]>([])
  const lineRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Line grows down as user scrolls through the section
      gsap.fromTo(lineRef.current,
        { scaleY: 0, transformOrigin: 'top center' },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start:   'top 70%',
            end:     'bottom 60%',
            scrub:   1,
          },
        },
      )

      // Each row fades + slides in
      rowRefs.current.forEach((row, i) => {
        if (!row) return
        gsap.fromTo(row,
          { opacity: 0, x: -24 },
          {
            opacity: 1,
            x: 0,
            duration: 0.65,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: row,
              start:   'top 82%',
              once:    true,
            },
            delay: i * 0.04,
          },
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{ padding: 'clamp(5rem, 10vw, 9rem) 0' }}
    >
      <div className="px-6 md:px-14 lg:px-24">

        {/* Header */}
        <div className="mb-14 md:mb-20">
          <p style={{
            fontSize:      '0.65rem',
            fontWeight:    600,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color:         'var(--accent)',
            marginBottom:  '0.9rem',
          }}>
            The journey
          </p>
          <h2 style={{
            fontFamily:    "'Inter', sans-serif",
            fontWeight:    800,
            fontSize:      'clamp(1.8rem, 5vw, 3.5rem)',
            letterSpacing: '-0.03em',
            lineHeight:    1.05,
            color:         'var(--color-text-primary)',
            maxWidth:      '640px',
          }}>
            From Notepad to Node.js —{' '}
            <span style={{ color: 'var(--accent)' }}>and everything that came after.</span>
          </h2>
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative', display: 'flex', gap: '2.5rem' }}>

          {/* Vertical line */}
          <div style={{ position: 'relative', width: '1px', flexShrink: 0, marginTop: '0.6rem' }}>
            <div
              ref={lineRef}
              style={{
                position:   'absolute',
                top:        0,
                bottom:     0,
                left:       0,
                width:      '1px',
                background: 'linear-gradient(to bottom, var(--accent), oklch(0.45 0.14 280 / 0.3))',
              }}
            />
          </div>

          {/* Rows */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0' }}>
            {MILESTONES.map((m, i) => (
              <div
                key={m.year}
                ref={el => { rowRefs.current[i] = el }}
                style={{
                  display:      'grid',
                  gridTemplateColumns: 'clamp(2.8rem, 6vw, 4.5rem) 1fr',
                  gap:          '1.5rem',
                  paddingBottom: i < MILESTONES.length - 1 ? 'clamp(2rem, 4vw, 3.5rem)' : 0,
                  position:     'relative',
                }}
              >
                {/* Dot on the line */}
                <div style={{ position: 'relative' }}>
                  <span style={{
                    display:     'block',
                    fontSize:    '0.62rem',
                    fontWeight:  700,
                    letterSpacing: '0.05em',
                    color:       i === MILESTONES.length - 1 ? 'var(--accent)' : 'oklch(0.48 0 0)',
                    lineHeight:  1,
                    paddingTop:  '0.35rem',
                    textAlign:   'right',
                  }}>
                    {m.year}
                  </span>
                  {/* Dot */}
                  <div style={{
                    position:    'absolute',
                    top:         '0.35rem',
                    right:       '-2.65rem',
                    width:       '7px',
                    height:      '7px',
                    borderRadius:'50%',
                    background:  i === MILESTONES.length - 1 ? 'var(--accent)' : 'oklch(0.30 0 0)',
                    border:      `1px solid ${i === MILESTONES.length - 1 ? 'var(--accent)' : 'oklch(0.38 0 0)'}`,
                    boxShadow:   i === MILESTONES.length - 1 ? '0 0 10px var(--accent)' : 'none',
                  }} />
                </div>

                {/* Content */}
                <div>
                  <p style={{
                    fontFamily:  "'Inter', sans-serif",
                    fontWeight:  600,
                    fontSize:    'clamp(0.9rem, 1.8vw, 1.05rem)',
                    color:       i === MILESTONES.length - 1 ? 'oklch(0.96 0 0)' : 'oklch(0.82 0 0)',
                    marginBottom:'0.35rem',
                    lineHeight:  1.3,
                  }}>
                    {m.title}
                  </p>
                  <p style={{
                    fontSize:  '0.82rem',
                    color:     'oklch(0.55 0 0)',
                    lineHeight: 1.65,
                    maxWidth:  '520px',
                  }}>
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
