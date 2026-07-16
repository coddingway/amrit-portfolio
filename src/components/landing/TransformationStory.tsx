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

        {/* Desktop: 2-col — headline left, timeline right. Mobile: stacked. */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left — sticky headline */}
          <div className="md:sticky md:top-32">
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
              fontSize:      'clamp(1.8rem, 3.5vw, 3rem)',
              letterSpacing: '-0.03em',
              lineHeight:    1.05,
              color:         'var(--color-text-primary)',
              marginBottom:  '1.2rem',
            }}>
              From Notepad to Node.js —{' '}
              <span style={{ color: 'var(--accent)' }}>and everything that came after.</span>
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'oklch(0.48 0 0)', lineHeight: 1.7 }}>
              Started with Notepad on Windows XP. Still learning. That's the whole story
              — 8 years compressed into 6 stops.
            </p>
          </div>

          {/* Right — timeline rows */}
          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div
              ref={lineRef}
              style={{
                position:   'absolute',
                top:        0,
                bottom:     0,
                left:       '3.5rem',
                width:      '1px',
                background: 'linear-gradient(to bottom, var(--accent), oklch(0.30 0 0 / 0))',
                transformOrigin: 'top center',
              }}
            />

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {MILESTONES.map((m, i) => {
                const isLast = i === MILESTONES.length - 1
                return (
                  <div
                    key={m.year}
                    ref={el => { rowRefs.current[i] = el }}
                    style={{
                      display:       'flex',
                      gap:           '1.25rem',
                      alignItems:    'flex-start',
                      paddingBottom: isLast ? 0 : 'clamp(1.8rem, 3.5vw, 2.8rem)',
                    }}
                  >
                    {/* Year + dot */}
                    <div style={{ flexShrink: 0, width: '3.5rem', textAlign: 'right', paddingTop: '0.1rem', position: 'relative' }}>
                      <span style={{
                        fontSize:    '0.60rem',
                        fontWeight:  700,
                        letterSpacing: '0.06em',
                        color:       isLast ? 'var(--accent)' : 'oklch(0.42 0 0)',
                        lineHeight:  1,
                      }}>
                        {m.year}
                      </span>
                      {/* Dot sits on top of the line */}
                      <div style={{
                        position:     'absolute',
                        top:          '0.05rem',
                        right:        '-1.3rem',
                        width:        '8px',
                        height:       '8px',
                        borderRadius: '50%',
                        background:   isLast ? 'var(--accent)' : 'oklch(0.22 0 0)',
                        border:       `1.5px solid ${isLast ? 'var(--accent)' : 'oklch(0.34 0 0)'}`,
                        boxShadow:    isLast ? '0 0 10px var(--accent)' : 'none',
                        zIndex:       1,
                      }} />
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, paddingLeft: '0.75rem' }}>
                      <p style={{
                        fontFamily:   "'Inter', sans-serif",
                        fontWeight:   600,
                        fontSize:     'clamp(0.88rem, 1.6vw, 1rem)',
                        color:        isLast ? 'oklch(0.96 0 0)' : 'oklch(0.80 0 0)',
                        marginBottom: '0.3rem',
                        lineHeight:   1.3,
                      }}>
                        {m.title}
                      </p>
                      <p style={{
                        fontSize:  '0.80rem',
                        color:     'oklch(0.50 0 0)',
                        lineHeight: 1.65,
                      }}>
                        {m.desc}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
