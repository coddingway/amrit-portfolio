import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TransitionLink from '../components/TransitionLink'

gsap.registerPlugin(ScrollTrigger)

// ─── Bayern red constants ─────────────────────────────────────────────────────
const R  = 'oklch(0.47 0.22 28)'   // Bayern red
const RD = 'oklch(0.30 0.18 28)'   // dark red
const RL = 'oklch(0.62 0.20 28)'   // light red
const BG = 'oklch(0.05 0.015 28)'  // near-black red tint

// ─── Neobrutalism helpers ─────────────────────────────────────────────────────
const neo = (color = R): React.CSSProperties => ({
  border:    `2.5px solid ${color}`,
  boxShadow: `4px 4px 0 ${color}`,
})
const neoWhite = (): React.CSSProperties => ({
  border:    '2.5px solid oklch(0.96 0 0)',
  boxShadow: '4px 4px 0 oklch(0.96 0 0)',
})

// ─── Marquee strip ────────────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  'FCB', '⚽', 'DIE MANNSCHAFT', '★', 'BUNDESLIGA',
  'FCB', '⚽', 'CHAMPIONS LEAGUE', '★', 'ALLIANZ ARENA',
  'FCB', '⚽', 'SINCE 2002', '★', 'MIA SAN MIA',
]

const MARQUEE_DOUBLED = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]

function MarqueeStrip() {
  const trackRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const tween = gsap.to(trackRef.current, {
      xPercent: -50, duration: 22, ease: 'none', repeat: -1,
    })
    return () => { tween.kill() }
  }, [])
  return (
    <div style={{
      overflow:   'hidden',
      background: R,
      borderTop:  '2.5px solid oklch(0.96 0 0)',
      borderBottom: '2.5px solid oklch(0.96 0 0)',
      padding:    '0.7rem 0',
    }}>
      <div ref={trackRef} style={{ display:'flex', width:'max-content', gap: '2rem' }}>
        {MARQUEE_DOUBLED.map((item, i) => (
          <span key={i} style={{
            fontSize:      '0.72rem',
            fontWeight:    800,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color:         'oklch(0.96 0 0)',
            whiteSpace:    'nowrap',
          }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Stat chip ────────────────────────────────────────────────────────────────
function StatChip({ value, label }: { value: string; label: string }) {
  return (
    <div style={{
      ...neo(),
      background:  BG,
      padding:     '1rem 1.4rem',
      display:     'flex',
      flexDirection:'column',
      gap:         '0.3rem',
    }}>
      <span style={{
        fontFamily:    "'Inter', sans-serif",
        fontWeight:    900,
        fontSize:      'clamp(1.8rem, 4vw, 2.8rem)',
        letterSpacing: '-0.04em',
        color:         R,
        lineHeight:    1,
      }}>{value}</span>
      <span style={{
        fontSize:      '0.62rem',
        fontWeight:    700,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color:         'oklch(0.55 0 0)',
      }}>{label}</span>
    </div>
  )
}

// ─── Trophy item ─────────────────────────────────────────────────────────────
const TROPHIES = [
  { emoji:'🏆', count:'33×', name:'Bundesliga' },
  { emoji:'🌍', count:'6×',  name:'Champions League' },
  { emoji:'🏅', count:'20×', name:'DFB-Pokal' },
  { emoji:'🌐', count:'2×',  name:'Club World Cup' },
  { emoji:'🌟', count:'6×',  name:'DFL-Supercup' },
]

// ─── Timeline moment ─────────────────────────────────────────────────────────
const TIMELINE = [
  { year:'2002', event:"Watched my first Bayern game — instant obsession." },
  { year:'2006', event:"FIFA World Cup in Germany. Fell in love with Die Mannschaft." },
  { year:'2013', event:"Champions League final vs Dortmund at Wembley. 2–1. Legendary night." },
  { year:'2014', event:"Germany wins the World Cup. 7–1 vs Brazil. History." },
  { year:'2020', event:"Bayern's sextuple season — Champions League, Bundesliga, everything." },
  { year:'2023', event:"Still watching every game. Always will." },
]

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Football() {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance
      const heroChildren = heroRef.current?.querySelectorAll('[data-hero]')
      if (heroChildren) {
        gsap.fromTo(heroChildren,
          { opacity:0, y:40 },
          { opacity:1, y:0, duration:0.6, stagger:0.12, ease:'power3.out', delay:0.1 },
        )
      }

      // Sections scroll-in
      ScrollTrigger.batch('[data-fade]', {
        start:'top 82%', once:true,
        onEnter: batch => gsap.fromTo(batch,
          { opacity:0, y:28 },
          { opacity:1, y:0, duration:0.5, stagger:0.08, ease:'power2.out' },
        ),
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <main style={{ background: BG, minHeight:'100vh', paddingTop:'clamp(4.5rem,9vw,7rem)' }}>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        aria-label="Football hero"
        style={{
          padding:  'clamp(2rem,5vw,4rem) clamp(1.5rem,7.5vw,6rem)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Big background text */}
        <div aria-hidden style={{
          position:      'absolute',
          top:           '-0.1em',
          left:          '-0.02em',
          fontFamily:    "'Inter',sans-serif",
          fontWeight:    900,
          fontSize:      'clamp(8rem,22vw,20rem)',
          letterSpacing: '-0.06em',
          color:         `${R}`,
          opacity:       0.06,
          lineHeight:    1,
          pointerEvents: 'none',
          userSelect:    'none',
          whiteSpace:    'nowrap',
        }}>
          FCB
        </div>

        <div style={{ position:'relative', zIndex:1 }}>
          {/* Eyebrow */}
          <div data-hero style={{
            display:     'inline-flex',
            alignItems:  'center',
            gap:         '0.5rem',
            padding:     '0.35rem 0.8rem',
            ...neo(),
            background:  'transparent',
            marginBottom:'1.5rem',
          }}>
            <span style={{ fontSize:'0.65rem', fontWeight:800, letterSpacing:'0.2em', textTransform:'uppercase', color:R }}>
              Beyond the screen
            </span>
          </div>

          {/* Headline */}
          <div data-hero>
            <h1 style={{
              fontFamily:    "'Inter',sans-serif",
              fontWeight:    900,
              fontSize:      'clamp(3.5rem,9vw,8rem)',
              letterSpacing: '-0.05em',
              lineHeight:    0.88,
              color:         'oklch(0.96 0 0)',
              marginBottom:  '0.04em',
              textTransform: 'uppercase',
            }}>
              Football
            </h1>
            <h1 style={{
              fontFamily:    "'Instrument Serif',serif",
              fontWeight:    400,
              fontStyle:     'italic',
              fontSize:      'clamp(3rem,8vw,7rem)',
              letterSpacing: '-0.02em',
              lineHeight:    0.95,
              color:         R,
            }}>
              is my religion.
            </h1>
          </div>

          {/* Desc + crest row */}
          <div data-hero style={{
            display:'flex', flexWrap:'wrap', alignItems:'flex-end',
            gap:'2rem', marginTop:'2rem',
          }}>
            <div>
              <p style={{
                fontSize:  'clamp(0.88rem,1.6vw,1rem)',
                color:     'oklch(0.52 0 0)',
                lineHeight:1.72,
                maxWidth:  '42ch',
              }}>
                Fan since 2002. Bayern Munich die-hard. German national team faithful.
                I watch football the same way I review code — looking for what's off the
                scoresheet but made the difference. xG. Off-ball movement. Press triggers.
                The unsexy stuff that wins titles.
              </p>
              {/* Stats row */}
              <div style={{ display:'flex', gap:'0.6rem', flexWrap:'wrap', marginTop:'1.5rem' }}>
                {[
                  { v:'20+', l:'Years' },
                  { v:'FCB', l:'Primary club' },
                  { v:'DFB', l:'National team' },
                  { v:'UCL', l:'Favourite comp.' },
                ].map(s => (
                  <div key={s.l} style={{
                    padding:'0.4rem 0.85rem',
                    ...neo(),
                    background:BG,
                  }}>
                    <span style={{ fontSize:'0.82rem', fontWeight:800, color:'oklch(0.92 0 0)', letterSpacing:'-0.01em' }}>{s.v} </span>
                    <span style={{ fontSize:'0.65rem', fontWeight:600, color:'oklch(0.42 0 0)', letterSpacing:'0.06em', textTransform:'uppercase' }}>{s.l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bayern crest */}
            <div style={{
              ...neo(),
              background:  `oklch(0.08 0.03 28)`,
              padding:     '1.2rem',
              flexShrink:  0,
            }}>
              <img
                src="/fcb-crest.png"
                alt="FC Bayern München crest"
                style={{ width:'clamp(80px,14vw,120px)', height:'auto', display:'block' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ─────────────────────────────────────────────────────── */}
      <MarqueeStrip />

      {/* ── STATS WALL ──────────────────────────────────────────────────── */}
      <section
        aria-label="Fan stats"
        style={{ padding:'clamp(3rem,6vw,5rem) clamp(1.5rem,7.5vw,6rem)' }}
      >
        <p data-fade style={{
          fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.22em',
          textTransform:'uppercase', color:'oklch(0.36 0 0)', marginBottom:'1.5rem',
        }}>
          The numbers
        </p>
        <div data-fade style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:'1rem' }}>
          <StatChip value="2002"  label="Fan since"       />
          <StatChip value="20+"   label="Years watching"  />
          <StatChip value="33×"   label="Bundesliga wins" />
          <StatChip value="6×"    label="UCL titles"      />
          <StatChip value="1"     label="Club. Always."   />
        </div>
      </section>

      {/* ── CLUB SECTION ─────────────────────────────────────────────────── */}
      <section
        aria-label="Bayern Munich"
        style={{
          padding:    'clamp(3rem,6vw,5rem) clamp(1.5rem,7.5vw,6rem)',
          borderTop:  `2.5px solid ${RD}`,
        }}
      >
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left — club card */}
          <div data-fade>
            <p style={{
              fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.22em',
              textTransform:'uppercase', color:'oklch(0.36 0 0)', marginBottom:'1.5rem',
            }}>
              My club
            </p>

            <div style={{
              ...neo(),
              background: `oklch(0.08 0.03 28)`,
              padding:    'clamp(1.5rem,3vw,2rem)',
            }}>
              {/* Club header */}
              <div style={{ display:'flex', alignItems:'center', gap:'1.2rem', marginBottom:'1.5rem', paddingBottom:'1.2rem', borderBottom:`1.5px solid ${RD}` }}>
                <img src="/fcb-crest.png" alt="FCB" style={{ width:'56px', height:'auto', flexShrink:0 }}/>
                <div>
                  <h2 style={{
                    fontFamily:    "'Inter',sans-serif",
                    fontWeight:    900,
                    fontSize:      'clamp(1.2rem,3vw,1.6rem)',
                    letterSpacing: '-0.03em',
                    color:         'oklch(0.96 0 0)',
                    textTransform: 'uppercase',
                    marginBottom:  '0.2rem',
                  }}>
                    FC Bayern München
                  </h2>
                  <p style={{ fontSize:'0.72rem', color:R, fontWeight:700, letterSpacing:'0.1em' }}>
                    EST. 1900 · BUNDESLIGA
                  </p>
                </div>
              </div>

              {/* Club details grid */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.8rem', marginBottom:'1.2rem' }}>
                {[
                  { l:'Stadium',  v:'Allianz Arena' },
                  { l:'City',     v:'Munich, Germany' },
                  { l:'Nickname', v:'Der Rekordmeister' },
                  { l:'Fan since',v:'2002 — 20+ years' },
                ].map(item => (
                  <div key={item.l} style={{ padding:'0.7rem 0.9rem', background:`oklch(0.06 0.015 28)`, border:`1px solid ${RD}` }}>
                    <p style={{ fontSize:'0.58rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:'oklch(0.38 0 0)', marginBottom:'0.25rem' }}>{item.l}</p>
                    <p style={{ fontSize:'0.80rem', fontWeight:600, color:'oklch(0.82 0 0)' }}>{item.v}</p>
                  </div>
                ))}
              </div>

              <p style={{ fontSize:'0.85rem', color:'oklch(0.52 0 0)', lineHeight:1.70 }}>
                Not just a club — a way of life. <em style={{ color:RL }}>"Mia san mia"</em> — we are who we are.
                Bayern's obsession with off-ball movement — creating space before the ball
                arrives — is something I've imported into how I build. Good architecture
                creates options before the requirement lands. Same principle.
              </p>
            </div>
          </div>

          {/* Right — trophy cabinet */}
          <div data-fade>
            <p style={{
              fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.22em',
              textTransform:'uppercase', color:'oklch(0.36 0 0)', marginBottom:'1.5rem',
            }}>
              Trophy cabinet
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.7rem' }}>
              {TROPHIES.map((t) => (
                <div key={t.name} style={{
                  display:'flex', alignItems:'center', gap:'1rem',
                  padding:'0.9rem 1.1rem',
                  ...neo(),
                  background:`oklch(0.07 0.02 28)`,
                  transition:'transform 0.15s, box-shadow 0.15s',
                }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.transform = 'translate(-2px,-2px)'
                    el.style.boxShadow = `6px 6px 0 ${R}`
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement
                    el.style.transform = 'translate(0,0)'
                    el.style.boxShadow = `4px 4px 0 ${R}`
                  }}
                >
                  <span style={{ fontSize:'1.5rem', lineHeight:1, flexShrink:0 }}>{t.emoji}</span>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:'0.82rem', fontWeight:700, color:'oklch(0.88 0 0)' }}>{t.name}</p>
                  </div>
                  <span style={{
                    fontFamily:    "'Inter',sans-serif",
                    fontWeight:    900,
                    fontSize:      '1.1rem',
                    letterSpacing: '-0.03em',
                    color:         R,
                  }}>
                    {t.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DIE MANNSCHAFT ───────────────────────────────────────────────── */}
      <section
        aria-label="German national team"
        style={{
          padding:    'clamp(3rem,6vw,5rem) clamp(1.5rem,7.5vw,6rem)',
          borderTop:  `2.5px solid ${RD}`,
          background: `linear-gradient(135deg, oklch(0.06 0.02 28) 0%, oklch(0.05 0.01 28) 100%)`,
        }}
      >
        <p data-fade style={{
          fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.22em',
          textTransform:'uppercase', color:'oklch(0.36 0 0)', marginBottom:'1.5rem',
        }}>
          Die Mannschaft
        </p>

        <div data-fade className="grid md:grid-cols-3 gap-0"
          style={{ ...neo(), overflow:'hidden' }}
        >
          {/* Main text */}
          <div style={{
            gridColumn:'span 2',
            padding:    'clamp(1.5rem,3vw,2.5rem)',
            borderRight:`2.5px solid ${R}`,
          }}>
            <h2 style={{
              fontFamily:    "'Inter',sans-serif",
              fontWeight:    900,
              fontSize:      'clamp(1.8rem,4vw,3rem)',
              letterSpacing: '-0.04em',
              lineHeight:    0.90,
              color:         'oklch(0.96 0 0)',
              textTransform: 'uppercase',
              marginBottom:  '1rem',
            }}>
              Germany.<br/>
              <span style={{ color:R }}>Always.</span>
            </h2>
            <p style={{ fontSize:'0.88rem', color:'oklch(0.52 0 0)', lineHeight:1.72, maxWidth:'48ch', marginBottom:'1.2rem' }}>
              The German national team grabbed me at the 2006 World Cup on home soil.
              The 2014 Brazil campaign — that 7–1 semi-final — is the greatest football
              moment I've ever witnessed. Pure, clinical, historic. But what I remember
              most isn't the goals. It's the pressing shape that made Brazil's midfield
              invisible before halftime. That's xG thinking before the term existed.
            </p>
            <div style={{ display:'flex', gap:'0.6rem', flexWrap:'wrap' }}>
              {['World Cup 2014 🏆','7–1 Brazil','Lahm · Müller · Kroos','Bundesliga pipeline'].map(tag => (
                <span key={tag} style={{
                  fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.06em',
                  color:R, border:`1.5px solid ${RD}`,
                  padding:'0.25rem 0.65rem',
                  background:'transparent',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right column — flag + stats */}
          <div style={{ padding:'clamp(1.2rem,2.5vw,2rem)', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
            {/* German flag */}
            <div style={{ overflow:'hidden', marginBottom:'1rem' }}>
              <div style={{ height:'8px', background:'oklch(0.10 0 0)' }}/>
              <div style={{ height:'8px', background:'oklch(0.55 0.22 28)' }}/>
              <div style={{ height:'8px', background:'oklch(0.82 0.14 88)' }}/>
            </div>

            {[
              { v:'4×',   l:'World Cups' },
              { v:'3×',   l:'Euro titles' },
              { v:'2006', l:'First memory' },
            ].map(s => (
              <div key={s.l} style={{ borderTop:`1px solid ${RD}`, paddingTop:'0.8rem', marginTop:'0.5rem' }}>
                <p style={{ fontFamily:"'Inter',sans-serif", fontWeight:900, fontSize:'1.6rem', letterSpacing:'-0.04em', color:R, lineHeight:1 }}>{s.v}</p>
                <p style={{ fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'oklch(0.38 0 0)' }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ─────────────────────────────────────────────────────── */}
      <section
        aria-label="Football timeline"
        style={{
          padding:   'clamp(3rem,6vw,5rem) clamp(1.5rem,7.5vw,6rem)',
          borderTop: `2.5px solid ${RD}`,
        }}
      >
        <p data-fade style={{
          fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.22em',
          textTransform:'uppercase', color:'oklch(0.36 0 0)', marginBottom:'1.5rem',
        }}>
          My football timeline
        </p>

        <div style={{ position:'relative', maxWidth:'680px' }}>
          {/* Vertical line */}
          <div style={{
            position:'absolute', left:'52px', top:0, bottom:0,
            width:'2.5px', background:`linear-gradient(to bottom, ${R}, ${RD})`,
          }}/>

          <div style={{ display:'flex', flexDirection:'column', gap:'0' }}>
            {TIMELINE.map((item) => (
              <div
                key={item.year}
                data-fade
                style={{
                  display:   'flex',
                  gap:       '1.5rem',
                  alignItems:'flex-start',
                  paddingBottom:'1.5rem',
                }}
              >
                {/* Year stamp */}
                <div style={{
                  flexShrink:  0,
                  width:       '48px',
                  textAlign:   'right',
                  paddingTop:  '0.35rem',
                }}>
                  <span style={{
                    fontFamily:    "'Inter',sans-serif",
                    fontWeight:    900,
                    fontSize:      '0.72rem',
                    letterSpacing: '0.04em',
                    color:         R,
                  }}>
                    {item.year}
                  </span>
                </div>

                {/* Dot */}
                <div style={{
                  flexShrink:   0,
                  width:        '11px',
                  height:       '11px',
                  borderRadius: '50%',
                  background:   R,
                  border:       `2px solid ${BG}`,
                  marginTop:    '0.38rem',
                  boxShadow:    `0 0 8px ${R}60`,
                  zIndex:       1,
                }}/>

                {/* Text */}
                <p style={{
                  fontSize:  '0.88rem',
                  color:     'oklch(0.58 0 0)',
                  lineHeight:1.6,
                  paddingTop:'0.28rem',
                }}>
                  {item.event}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE 2 ────────────────────────────────────────────────────── */}
      <MarqueeStrip />

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section
        aria-label="Football CTA"
        style={{
          padding:    'clamp(3rem,6vw,5rem) clamp(1.5rem,7.5vw,6rem)',
          borderTop:  `2.5px solid ${RD}`,
          display:    'flex',
          flexWrap:   'wrap',
          alignItems: 'center',
          justifyContent:'space-between',
          gap:        '1.5rem',
        }}
      >
        <div data-fade>
          <h2 style={{
            fontFamily:    "'Inter',sans-serif",
            fontWeight:    900,
            fontSize:      'clamp(1.6rem,4vw,2.8rem)',
            letterSpacing: '-0.04em',
            lineHeight:    0.92,
            color:         'oklch(0.96 0 0)',
            textTransform: 'uppercase',
            marginBottom:  '0.6rem',
          }}>
            Want to talk<br/>
            <span style={{ color:R }}>football?</span>
          </h2>
          <p style={{ fontSize:'0.85rem', color:'oklch(0.45 0 0)', maxWidth:'38ch' }}>
            Always down for a match, a debate, or just talking about the 2014 World Cup.
          </p>
        </div>

        <div data-fade style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
          <a
            href="mailto:design2code93@gmail.com?subject=Football%20chat"
            style={{
              display:       'inline-flex',
              alignItems:    'center',
              gap:           '0.5rem',
              padding:       '0.85rem 1.8rem',
              ...neo(),
              background:    R,
              color:         'oklch(0.96 0 0)',
              fontWeight:    800,
              fontSize:      '0.85rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              textDecoration:'none',
              transition:    'transform 0.12s, box-shadow 0.12s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.transform = 'translate(-2px,-2px)'
              el.style.boxShadow = `6px 6px 0 ${R}`
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.transform = 'translate(0,0)'
              el.style.boxShadow = `4px 4px 0 ${R}`
            }}
          >
            ⚽ Drop a message
          </a>
          <TransitionLink
            to="/contact"
            style={{
              display:       'inline-flex',
              alignItems:    'center',
              gap:           '0.5rem',
              padding:       '0.85rem 1.8rem',
              ...neoWhite(),
              background:    'transparent',
              color:         'oklch(0.80 0 0)',
              fontWeight:    700,
              fontSize:      '0.85rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              textDecoration:'none',
              transition:    'transform 0.12s, box-shadow 0.12s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.transform = 'translate(-2px,-2px)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.transform = 'translate(0,0)'
            }}
          >
            Contact page →
          </TransitionLink>
        </div>
      </section>
    </main>
  )
}
