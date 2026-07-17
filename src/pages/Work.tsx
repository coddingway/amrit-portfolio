import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TransitionLink from '../components/TransitionLink'
import { PROJECTS } from '../data/projects'

gsap.registerPlugin(ScrollTrigger)

const FILTERS = ['All', 'E-Commerce', 'WordPress', 'Headless', 'Enterprise', 'WebAR', 'UI Dev']

// ─── Visual backgrounds per project ──────────────────────────────────────────
function ProjectVisual({ visual, coverImage }: { visual: string; coverImage?: string }) {
  if (coverImage) {
    return (
      <img
        src={coverImage}
        alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
      />
    )
  }
  switch (visual) {
    case 'ponds':
      return (
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, oklch(0.18 0.06 350) 0%, oklch(0.28 0.10 340) 100%)' }}>
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.12 }} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
            {[0,1,2,3,4].map(i => <ellipse key={i} cx="200" cy="150" rx={60+i*28} ry={45+i*20} fill="none" stroke="white" strokeWidth="1"/>)}
          </svg>
          <div style={{ position:'absolute', bottom:'1.5rem', left:'1.5rem', right:'1.5rem' }}>
            <p style={{ fontFamily:"'Instrument Serif',serif", fontStyle:'italic', fontSize:'clamp(2rem,5vw,3rem)', color:'oklch(0.92 0.08 350)', lineHeight:1, opacity:0.4 }}>POND'S</p>
          </div>
        </div>
      )
    case 'liqca':
      return (
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, oklch(0.12 0.08 255) 0%, oklch(0.22 0.12 245) 100%)' }}>
          <svg style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', opacity:0.10 }} width="140" height="140" viewBox="0 0 140 140">
            <path d="M70 10 L80 40 L95 40 L83 58 L88 88 L70 72 L52 88 L57 58 L45 40 L60 40 Z" fill="white"/>
          </svg>
          <div style={{ position:'absolute', top:'1.5rem', right:'1.5rem', fontSize:'2rem', opacity:0.25 }}>🍁</div>
        </div>
      )
    case 'liqau':
      return (
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, oklch(0.15 0.08 195) 0%, oklch(0.25 0.10 175) 100%)' }}>
          <svg style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', opacity:0.12 }} width="120" height="120" viewBox="0 0 120 120">
            {[[60,20],[80,55],[55,75],[35,55],[45,35]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r="5" fill="white"/>)}
          </svg>
        </div>
      )
    case 'hal':
      return (
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, oklch(0.10 0.04 240) 0%, oklch(0.18 0.06 230) 100%)' }}>
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.09 }} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
            <path d="M50 180 L200 80 L350 180" fill="none" stroke="white" strokeWidth="2"/>
            <path d="M130 180 L200 100 L270 180 Z" fill="white" opacity="0.15"/>
            <ellipse cx="200" cy="185" rx="60" ry="10" fill="none" stroke="white" strokeWidth="1" opacity="0.4"/>
          </svg>
        </div>
      )
    case 'bel':
      return (
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, oklch(0.10 0.05 160) 0%, oklch(0.17 0.07 148) 100%)' }}>
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.08 }} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
            {Array.from({length:8}).map((_,i) => <line key={i} x1={i*55} y1="0" x2={i*55} y2="300" stroke="white" strokeWidth="1"/>)}
            {Array.from({length:6}).map((_,i) => <line key={i} x1="0" y1={i*55} x2="400" y2={i*55} stroke="white" strokeWidth="1"/>)}
            <circle cx="200" cy="150" r="30" fill="none" stroke="white" strokeWidth="2"/>
            <circle cx="200" cy="150" r="8" fill="white" opacity="0.4"/>
          </svg>
        </div>
      )
    case 'webar':
      return (
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, oklch(0.12 0.08 300) 0%, oklch(0.20 0.12 280) 100%)' }}>
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.12 }} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
            <path d="M50 240 L200 40 L350 240 Z" fill="none" stroke="white" strokeWidth="1.5"/>
            <path d="M50 240 L350 240" stroke="white" strokeWidth="1.5"/>
            {[1,2,3].map(t => <line key={t} x1={50+t*75} y1="240" x2={200-t*25} y2={40+t*66} stroke="white" strokeWidth="0.7" opacity="0.6"/>)}
          </svg>
          <div style={{ position:'absolute', top:'1.5rem', right:'1.5rem' }}>
            <div style={{ width:'36px', height:'20px', borderRadius:'10px', border:'2px solid rgba(255,255,255,0.2)', display:'flex', alignItems:'center', gap:'3px', padding:'0 5px' }}>
              <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'rgba(255,255,255,0.2)' }}/>
              <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'rgba(255,255,255,0.2)' }}/>
            </div>
          </div>
        </div>
      )
    case 'fintech':
      return (
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg, oklch(0.11 0.03 230) 0%, oklch(0.18 0.05 220) 100%)' }}>
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.12 }} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
            <polyline points="30,220 80,160 130,185 180,100 230,130 280,70 330,90 380,40" fill="none" stroke="white" strokeWidth="2"/>
            <polyline points="30,250 80,240 130,245 180,230 230,235 280,220 330,225 380,210" fill="none" stroke="white" strokeWidth="1" opacity="0.5"/>
          </svg>
        </div>
      )
    case 'netbramha':
      return (
        <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg, oklch(0.12 0.04 50) 0%, oklch(0.20 0.08 48) 100%)` }}>
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.10 }} viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
            {[0,1,2].map(r => [0,1,2,3].map(c => <rect key={`${r}${c}`} x={50+c*90} y={40+r*90} width="70" height="70" rx="8" fill="none" stroke="white" strokeWidth="1"/>))}
          </svg>
          <div style={{ position:'absolute', bottom:'1rem', left:'1.5rem', fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:'oklch(0.72 0.18 50)', opacity:0.5 }}>NET BRAMHA</div>
        </div>
      )
    default:
      return <div style={{ position:'absolute', inset:0, background:'oklch(0.12 0 0)' }}/>
  }
}

// ─── Single bento card ────────────────────────────────────────────────────────
function ProjectCard({ project }: { project: typeof PROJECTS[0] }) {
  const cardRef  = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const handleEnter = () => {
    gsap.to(overlayRef.current, { opacity: 1, duration: 0.28, ease: 'power2.out' })
  }
  const handleLeave = () => {
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.22, ease: 'power2.in' })
  }

  const isLarge  = project.size === 'large'
  const isMedium = project.size === 'medium'
  const isSmall  = !isLarge && !isMedium

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        position:    'relative',
        borderRadius:'1rem',
        overflow:    'hidden',
        border:      '1px solid oklch(0.18 0 0)',
        cursor:      'default',
        height:      isLarge ? '460px' : isMedium ? '280px' : '220px',
        width:       '100%',
      }}
    >
      {/* Visual background */}
      <ProjectVisual visual={project.visual} coverImage={project.coverImage} />

      {/* Always-visible bottom label */}
      <div style={{
        position:   'absolute',
        bottom:     0,
        left:       0,
        right:      0,
        padding:    '1.2rem',
        background: 'linear-gradient(to top, oklch(0 0 0 / 0.75) 0%, transparent 100%)',
        zIndex:     2,
      }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.3rem' }}>
          <span style={{
            fontSize:'0.58rem', fontWeight:700, letterSpacing:'0.15em',
            textTransform:'uppercase', color:'var(--accent)', opacity:0.9,
          }}>
            {project.category}
          </span>
          <span style={{ fontSize:'0.58rem', color:'oklch(0.45 0 0)' }}>{project.year}</span>
        </div>
        <h3 style={{
          fontFamily:    "'Inter', sans-serif",
          fontWeight:    700,
          fontSize:      'clamp(0.88rem, 2vw, 1.05rem)',
          letterSpacing: '-0.01em',
          color:         'oklch(0.94 0 0)',
          lineHeight:    1.2,
        }}>
          {project.title}
        </h3>
      </div>

      {/* Hover overlay */}
      <div
        ref={overlayRef}
        style={{
          position:       'absolute',
          inset:          0,
          opacity:        0,
          zIndex:         3,
          display:        'flex',
          flexDirection:  'column',
          justifyContent: 'flex-end',
          padding:        '1.5rem',
          background:     'linear-gradient(to top, oklch(0 0 0 / 0.92) 40%, oklch(0 0 0 / 0.50) 100%)',
          backdropFilter: 'blur(2px)',
        }}
      >
        <p style={{
          fontSize:      '0.58rem',
          fontWeight:    700,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color:         'var(--accent)',
          marginBottom:  '0.4rem',
        }}>
          {project.client} · {project.year}
        </p>
        <h3 style={{
          fontFamily:    "'Inter', sans-serif",
          fontWeight:    700,
          fontSize:      'clamp(1rem, 2.2vw, 1.2rem)',
          color:         'oklch(0.96 0 0)',
          marginBottom:  '0.55rem',
          letterSpacing: '-0.02em',
        }}>
          {project.title}
        </h3>
        <p style={{
          fontSize:     '0.82rem',
          color:        'oklch(0.80 0 0)',
          lineHeight:   1.6,
          marginBottom: '0.75rem',
          display:      '-webkit-box',
          WebkitLineClamp: isLarge ? 4 : isMedium ? 3 : 2,
          WebkitBoxOrient: 'vertical',
          overflow:     'hidden',
        }}>
          {project.desc}
        </p>

        {/* Tags — hidden on small cards to save space */}
        {!isSmall && (
          <div style={{ display:'flex', flexWrap:'wrap', gap:'0.35rem', marginBottom:'0.75rem' }}>
            {project.tags.slice(0, isMedium ? 3 : 5).map(t => (
              <span key={t} style={{
                fontSize:'0.60rem', fontWeight:600, letterSpacing:'0.04em',
                color:'oklch(0.55 0 0)', background:'oklch(0.12 0 0)',
                border:'1px solid oklch(0.22 0 0)', borderRadius:'999px',
                padding:'0.18rem 0.55rem',
              }}>{t}</span>
            ))}
          </div>
        )}

        {/* CTA row */}
        <div style={{ display:'flex', gap:'0.6rem', alignItems:'center' }}>
          <TransitionLink
            to={`/work/${project.slug}`}
            style={{
              display:'inline-flex', alignItems:'center', gap:'0.4rem',
              padding:'0.5rem 1rem', borderRadius:'0.4rem',
              background:'var(--accent)', color:'oklch(0.08 0 0)',
              fontWeight:700, fontSize:'0.75rem', textDecoration:'none',
              letterSpacing:'0.03em',
            }}
          >
            Case study
            <svg width="11" height="11" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </TransitionLink>
          {project.url && (
            <a
              href={project.url} target="_blank" rel="noopener noreferrer"
              style={{
                display:'inline-flex', alignItems:'center', gap:'0.4rem',
                padding:'0.5rem 0.9rem', borderRadius:'0.4rem',
                background:'transparent', border:'1px solid oklch(0.30 0 0)',
                color:'oklch(0.65 0 0)', fontWeight:600, fontSize:'0.75rem',
                textDecoration:'none',
              }}
            >
              Live site ↗
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Main Work page ───────────────────────────────────────────────────────────
export default function Work() {
  const [activeFilter, setActiveFilter] = useState('All')
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef   = useRef<HTMLDivElement>(null)

  const filtered = activeFilter === 'All'
    ? PROJECTS
    : PROJECTS.filter(p => p.category === activeFilter)

  // Hero entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.1 },
      )
    })
    return () => ctx.revert()
  }, [])

  // Grid stagger on filter change
  useEffect(() => {
    if (!gridRef.current) return
    const cards = gridRef.current.querySelectorAll('[data-card]')
    gsap.fromTo(
      cards,
      { opacity: 0, y: 22, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.06, ease: 'power2.out' },
    )
  }, [filtered.length, activeFilter])

  return (
    <main
      style={{
        minHeight:  '100vh',
        background: `radial-gradient(ellipse 70% 50% at 50% 0%,
                       oklch(0.72 0.18 50 / 0.05), transparent 60%),
                     oklch(0.06 0.005 50)`,
        paddingTop: 'clamp(5rem, 10vw, 8rem)',
      }}
    >
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div
        ref={headerRef}
        style={{ padding: 'clamp(1rem, 3vw, 2rem) clamp(1.5rem, 7.5vw, 6rem) clamp(2rem, 4vw, 3rem)' }}
      >
        <p style={{
          fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.25em',
          textTransform:'uppercase', color:'var(--accent)', marginBottom:'1rem',
        }}>
          Selected work
        </p>

        <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'space-between', alignItems:'flex-end', gap:'1.5rem', marginBottom:'2.5rem' }}>
          <div>
            <h1 style={{ lineHeight:0.92, marginBottom:'0.5rem' }}>
              <span style={{
                display:'block', fontFamily:"'Inter',sans-serif",
                fontWeight:800, fontSize:'clamp(2.6rem,6vw,5rem)',
                letterSpacing:'-0.04em', color:'oklch(0.96 0 0)',
              }}>
                Projects &amp;
              </span>
              <span style={{
                display:'block', fontFamily:"'Instrument Serif',serif",
                fontWeight:400, fontStyle:'italic',
                fontSize:'clamp(2.6rem,6vw,5rem)',
                letterSpacing:'-0.02em', color:'var(--accent)',
              }}>
                case studies.
              </span>
            </h1>
            <p style={{ fontSize:'clamp(0.85rem,1.5vw,0.95rem)', color:'oklch(0.45 0 0)', maxWidth:'52ch' }}>
              8 featured builds from 40+ delivered — e-commerce, enterprise, WebAR and beyond.
            </p>
          </div>

          {/* Filter tabs */}
          <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
            {FILTERS.map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFilter(f)}
                style={{
                  padding:       '0.42rem 1rem',
                  borderRadius:  '999px',
                  border:        `1px solid ${activeFilter === f ? 'var(--accent)' : 'oklch(0.22 0 0)'}`,
                  background:    activeFilter === f ? 'oklch(0.72 0.18 50 / 0.12)' : 'transparent',
                  color:         activeFilter === f ? 'var(--accent)' : 'oklch(0.45 0 0)',
                  fontSize:      '0.72rem',
                  fontWeight:    600,
                  letterSpacing: '0.04em',
                  cursor:        'pointer',
                  transition:    'border-color 0.18s, background 0.18s, color 0.18s',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bento grid ───────────────────────────────────────────────────── */}
      <div
        ref={gridRef}
        style={{
          padding:               '0 clamp(1.5rem, 7.5vw, 6rem) clamp(4rem, 8vw, 6rem)',
          display:               'grid',
          gridTemplateColumns:   'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
          gap:                   '1rem',
        }}
      >
        {filtered.map(p => (
          <div
            key={p.slug}
            data-card
          >
            <ProjectCard project={p} />
          </div>
        ))}
      </div>

      {/* ── CTA strip ────────────────────────────────────────────────────── */}
      <div style={{
        borderTop:  '1px solid oklch(0.14 0 0)',
        padding:    'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 7.5vw, 6rem)',
        display:    'flex',
        flexWrap:   'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap:        '1rem',
      }}>
        <div>
          <p style={{ fontSize:'0.75rem', color:'oklch(0.40 0 0)', marginBottom:'0.3rem' }}>
            40+ projects delivered across 8 years
          </p>
          <p style={{ fontSize:'clamp(1rem,2vw,1.15rem)', fontWeight:700, color:'oklch(0.88 0 0)', letterSpacing:'-0.02em' }}>
            Want to see more or discuss a project?
          </p>
        </div>
        <TransitionLink
          to="/contact"
          style={{
            display:'inline-flex', alignItems:'center', gap:'0.5rem',
            padding:'0.75rem 1.6rem', borderRadius:'0.5rem',
            background:'var(--accent)', color:'oklch(0.08 0 0)',
            fontWeight:700, fontSize:'0.85rem', letterSpacing:'0.03em',
            textDecoration:'none',
          }}
        >
          Get in touch
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </TransitionLink>
      </div>
    </main>
  )
}
