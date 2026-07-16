import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function AiStance() {
  const sectionRef = useRef<HTMLElement>(null)
  const linesRef   = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(linesRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start:   'top 78%',
            once:    true,
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{ padding: 'clamp(5rem, 10vw, 9rem) 0', borderTop: '1px solid oklch(0.14 0 0)' }}
    >
      <div className="px-6 md:px-14 lg:px-24">
        <div style={{ maxWidth: '780px' }}>

          <p
            ref={el => { linesRef.current[0] = el }}
            style={{
              fontSize:      '0.65rem',
              fontWeight:    600,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color:         'var(--accent)',
              marginBottom:  '1.6rem',
              opacity:       0,
            }}
          >
            On AI &amp; craft
          </p>

          <h2
            ref={el => { linesRef.current[1] = el }}
            style={{
              fontFamily:    "'Inter', sans-serif",
              fontWeight:    800,
              fontSize:      'clamp(2rem, 6vw, 4rem)',
              letterSpacing: '-0.03em',
              lineHeight:    1.05,
              color:         'var(--color-text-primary)',
              marginBottom:  '0.3rem',
              opacity:       0,
            }}
          >
            I vibe code.
          </h2>

          <h2
            ref={el => { linesRef.current[2] = el }}
            style={{
              fontFamily:    "'Inter', sans-serif",
              fontWeight:    800,
              fontSize:      'clamp(2rem, 6vw, 4rem)',
              letterSpacing: '-0.03em',
              lineHeight:    1.05,
              color:         'oklch(0.42 0 0)',
              marginBottom:  'clamp(2rem, 5vw, 3.5rem)',
              opacity:       0,
            }}
          >
            I also know why the vibe was wrong.
          </h2>

          <div
            style={{
              display:             'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap:                 '2rem',
            }}
          >
            {[
              {
                heading: 'AI accelerates. It doesn\'t replace judgement.',
                body:    'I use Claude, Cursor, and agent pipelines daily. I also read the diff, understand the output, and know when to push back.',
              },
              {
                heading: 'The web I build converts.',
                body:    'Not because an LLM suggested it. Because 8 years of shipping taught me what makes users stay, trust, and buy.',
              },
              {
                heading: 'Still learning.',
                body:    'From Notepad to AI agents. The tools change. The curiosity doesn\'t. That\'s the only constant.',
              },
            ].map((card, i) => (
              <div
                key={card.heading}
                ref={el => { linesRef.current[3 + i] = el }}
                style={{ opacity: 0 }}
              >
                <p style={{
                  fontWeight:   600,
                  fontSize:     '0.88rem',
                  color:        'oklch(0.88 0 0)',
                  lineHeight:   1.4,
                  marginBottom: '0.5rem',
                }}>
                  {card.heading}
                </p>
                <p style={{
                  fontSize:  '0.80rem',
                  color:     'oklch(0.52 0 0)',
                  lineHeight: 1.7,
                }}>
                  {card.body}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
