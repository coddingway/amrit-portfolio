import { useEffect, useRef } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import TransitionLink from '../components/TransitionLink'
import { getProject, getAdjacentProjects } from '../data/projects'

gsap.registerPlugin(ScrollTrigger)

// Re-use the same visual components from Work.tsx inline
function ProjectVisual({ visual, style }: { visual: string; style?: React.CSSProperties }) {
  const base: React.CSSProperties = { position: 'absolute', inset: 0, ...style }

  switch (visual) {
    case 'ponds':
      return (
        <div style={{ ...base, background: 'linear-gradient(135deg, oklch(0.18 0.06 350) 0%, oklch(0.28 0.10 340) 100%)' }}>
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.13 }} viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
            {[0,1,2,3,4,5].map(i => <ellipse key={i} cx="400" cy="200" rx={80+i*55} ry={60+i*38} fill="none" stroke="white" strokeWidth="1.2"/>)}
          </svg>
        </div>
      )
    case 'liqca':
      return (
        <div style={{ ...base, background: 'linear-gradient(135deg, oklch(0.12 0.08 255) 0%, oklch(0.22 0.12 245) 100%)' }}>
          <svg style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-55%)', opacity:0.08 }} width="220" height="220" viewBox="0 0 140 140">
            <path d="M70 10 L80 40 L95 40 L83 58 L88 88 L70 72 L52 88 L57 58 L45 40 L60 40 Z" fill="white"/>
          </svg>
        </div>
      )
    case 'liqau':
      return (
        <div style={{ ...base, background: 'linear-gradient(135deg, oklch(0.15 0.08 195) 0%, oklch(0.25 0.10 175) 100%)' }}>
          <svg style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', opacity:0.10 }} width="180" height="180" viewBox="0 0 120 120">
            {[[60,20],[80,55],[55,75],[35,55],[45,35]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r="7" fill="white"/>)}
          </svg>
        </div>
      )
    case 'hal':
      return (
        <div style={{ ...base, background: 'linear-gradient(135deg, oklch(0.10 0.04 240) 0%, oklch(0.18 0.06 230) 100%)' }}>
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.10 }} viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
            <path d="M100 320 L400 100 L700 320" fill="none" stroke="white" strokeWidth="2.5"/>
            <path d="M240 320 L400 140 L560 320 Z" fill="white" opacity="0.10"/>
          </svg>
        </div>
      )
    case 'bel':
      return (
        <div style={{ ...base, background: 'linear-gradient(135deg, oklch(0.10 0.05 160) 0%, oklch(0.17 0.07 148) 100%)' }}>
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.07 }} viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
            {Array.from({length:10}).map((_,i) => <line key={i} x1={i*88} y1="0" x2={i*88} y2="400" stroke="white" strokeWidth="1"/>)}
            {Array.from({length:6}).map((_,i) => <line key={i} x1="0" y1={i*80} x2="800" y2={i*80} stroke="white" strokeWidth="1"/>)}
          </svg>
        </div>
      )
    case 'webar':
      return (
        <div style={{ ...base, background: 'linear-gradient(135deg, oklch(0.12 0.08 300) 0%, oklch(0.20 0.12 280) 100%)' }}>
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.10 }} viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
            <path d="M100 380 L400 40 L700 380 Z" fill="none" stroke="white" strokeWidth="2"/>
            <path d="M100 380 L700 380" stroke="white" strokeWidth="2"/>
          </svg>
        </div>
      )
    case 'fintech':
      return (
        <div style={{ ...base, background: 'linear-gradient(135deg, oklch(0.11 0.03 230) 0%, oklch(0.18 0.05 220) 100%)' }}>
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.12 }} viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
            <polyline points="60,340 160,240 260,280 360,140 460,190 560,90 660,120 760,50" fill="none" stroke="white" strokeWidth="2.5"/>
          </svg>
        </div>
      )
    case 'netbramha':
      return (
        <div style={{ ...base, background: `linear-gradient(135deg, oklch(0.12 0.04 50) 0%, oklch(0.20 0.08 48) 100%)` }}>
          <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.08 }} viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">
            {[0,1,2].map(r => [0,1,2,3,4].map(c => <rect key={`${r}${c}`} x={60+c*150} y={40+r*120} width="120" height="100" rx="10" fill="none" stroke="white" strokeWidth="1.2"/>))}
          </svg>
        </div>
      )
    default:
      return <div style={{ ...base, background: 'oklch(0.10 0 0)' }}/>
  }
}

// ─── Glass card ───────────────────────────────────────────────────────────────
const GLASS: React.CSSProperties = {
  background:     'oklch(0.10 0.005 50 / 0.55)',
  border:         '1px solid oklch(0.20 0 0 / 0.6)',
  backdropFilter: 'blur(14px)',
  boxShadow:      'inset 0 1px 0 oklch(1 0 0 / 0.04)',
}

export default function WorkDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project  = slug ? getProject(slug) : null
  const { prev, next } = slug ? getAdjacentProjects(slug) : { prev: null, next: null }

  const heroRef    = useRef<HTMLDivElement>(null)
  const metaRef    = useRef<HTMLDivElement>(null)
  const bodyRef    = useRef<HTMLDivElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  useEffect(() => {
    if (!project) return
    const ctx = gsap.context(() => {
      gsap.fromTo(heroRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.05 },
      )
      gsap.fromTo(metaRef.current,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.2 },
      )

      // Body sections stagger on scroll
      ScrollTrigger.batch('[data-section]', {
        start:   'top 82%',
        once:    true,
        onEnter: batch => {
          gsap.fromTo(batch,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, ease: 'power3.out' },
          )
        },
      })

      // Results counter
      if (resultsRef.current) {
        ScrollTrigger.create({
          trigger: resultsRef.current,
          start:   'top 80%',
          once:    true,
          onEnter: () => {
            gsap.fromTo(
              resultsRef.current!.querySelectorAll('[data-result]'),
              { opacity: 0, scale: 0.88, y: 16 },
              { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(1.4)' },
            )
          },
        })
      }
    })
    return () => ctx.revert()
  }, [project])

  if (!project) {
    return <Navigate to="/work" replace />
  }

  return (
    <main
      style={{
        minHeight:  '100vh',
        background: `radial-gradient(ellipse 80% 50% at 50% 0%,
                       oklch(0.72 0.18 50 / 0.06), transparent 60%),
                     oklch(0.06 0.005 50)`,
      }}
    >
      {/* ── Hero visual ──────────────────────────────────────────────────── */}
      <div
        ref={heroRef}
        style={{
          position:   'relative',
          height:     'clamp(300px, 45vw, 520px)',
          overflow:   'hidden',
          marginTop:  0,
        }}
      >
        <ProjectVisual visual={project.visual} />

        {/* Dark bottom gradient */}
        <div style={{
          position:   'absolute',
          bottom:     0, left: 0, right: 0,
          height:     '65%',
          background: 'linear-gradient(to top, oklch(0.06 0.005 50) 0%, transparent 100%)',
          zIndex:     2,
        }} />

        {/* Back arrow */}
        <TransitionLink
          to="/work"
          style={{
            position:       'absolute',
            top:            'clamp(4.5rem, 8vw, 6rem)',
            left:           'clamp(1.5rem, 7.5vw, 6rem)',
            zIndex:         3,
            display:        'inline-flex',
            alignItems:     'center',
            gap:            '0.5rem',
            padding:        '0.5rem 1rem',
            borderRadius:   '999px',
            background:     'oklch(0 0 0 / 0.45)',
            border:         '1px solid oklch(0.28 0 0 / 0.5)',
            backdropFilter: 'blur(8px)',
            color:          'oklch(0.72 0 0)',
            fontSize:       '0.75rem',
            fontWeight:     600,
            textDecoration: 'none',
            letterSpacing:  '0.04em',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path d="M13 7H1M6 2L1 7l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          All projects
        </TransitionLink>

        {/* Hero text overlay */}
        <div style={{
          position: 'absolute',
          bottom:   'clamp(1.5rem, 3vw, 2.5rem)',
          left:     'clamp(1.5rem, 7.5vw, 6rem)',
          right:    'clamp(1.5rem, 7.5vw, 6rem)',
          zIndex:   3,
        }}>
          <span style={{
            display:       'inline-block',
            fontSize:      '0.65rem',
            fontWeight:    700,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color:         'var(--accent)',
            marginBottom:  '0.6rem',
          }}>
            {project.category} · {project.year}
          </span>
          <h1 style={{
            fontFamily:    "'Inter', sans-serif",
            fontWeight:    800,
            fontSize:      'clamp(2rem, 5vw, 4rem)',
            letterSpacing: '-0.04em',
            lineHeight:    0.92,
            color:         'oklch(0.96 0 0)',
          }}>
            {project.title}
          </h1>
        </div>
      </div>

      {/* ── Meta strip ───────────────────────────────────────────────────── */}
      <div
        ref={metaRef}
        style={{
          display:    'flex',
          flexWrap:   'wrap',
          gap:        '0',
          borderBottom: '1px solid oklch(0.14 0 0)',
        }}
      >
        {[
          { label: 'Client',   value: project.client   },
          { label: 'Role',     value: project.role     },
          { label: 'Duration', value: project.duration },
          { label: 'Stack',    value: project.tags.slice(0,3).join(' · ') },
        ].map((item, i, arr) => (
          <div
            key={item.label}
            style={{
              flex:        '1 1 180px',
              padding:     'clamp(1rem, 2.5vw, 1.5rem) clamp(1.5rem, 7.5vw, 6rem)',
              borderRight: i < arr.length - 1 ? '1px solid oklch(0.14 0 0)' : 'none',
            }}
          >
            <p style={{ fontSize:'0.60rem', fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:'oklch(0.38 0 0)', marginBottom:'0.35rem' }}>
              {item.label}
            </p>
            <p style={{ fontSize:'0.85rem', fontWeight:600, color:'oklch(0.80 0 0)', lineHeight:1.3 }}>
              {item.value}
            </p>
          </div>
        ))}
        {project.url && (
          <div style={{ padding:'clamp(1rem,2.5vw,1.5rem) clamp(1.5rem,5vw,5rem)', display:'flex', alignItems:'center' }}>
            <a
              href={project.url} target="_blank" rel="noopener noreferrer"
              style={{
                display:'inline-flex', alignItems:'center', gap:'0.4rem',
                fontSize:'0.78rem', fontWeight:700, color:'var(--accent)',
                textDecoration:'none', letterSpacing:'0.04em',
              }}
            >
              Live site ↗
            </a>
          </div>
        )}
      </div>

      {/* ── Content body ─────────────────────────────────────────────────── */}
      <div
        ref={bodyRef}
        style={{
          maxWidth: '920px',
          margin:   '0 auto',
          padding:  'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 3rem)',
          display:  'flex',
          flexDirection: 'column',
          gap:      'clamp(3rem, 6vw, 4.5rem)',
        }}
      >
        {/* Overview */}
        <div data-section>
          <p style={{ fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.22em', textTransform:'uppercase', color:'oklch(0.35 0 0)', marginBottom:'1.2rem' }}>Overview</p>
          <p style={{ fontSize:'clamp(1rem,2vw,1.15rem)', color:'oklch(0.62 0 0)', lineHeight:1.8 }}>
            {project.overview}
          </p>
        </div>

        {/* Challenge + Solution 2-col */}
        <div data-section className="grid md:grid-cols-2 gap-6">
          <div style={{ ...GLASS, borderRadius:'1rem', padding:'clamp(1.2rem,2.5vw,1.8rem)' }}>
            <p style={{ fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.20em', textTransform:'uppercase', color:'oklch(0.38 0 0)', marginBottom:'0.9rem' }}>The challenge</p>
            <p style={{ fontSize:'0.88rem', color:'oklch(0.56 0 0)', lineHeight:1.72 }}>
              {project.challenge}
            </p>
          </div>
          <div style={{ ...GLASS, borderRadius:'1rem', padding:'clamp(1.2rem,2.5vw,1.8rem)', borderColor:'oklch(0.72 0.18 50 / 0.20)' }}>
            <p style={{ fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.20em', textTransform:'uppercase', color:'var(--accent)', opacity:0.8, marginBottom:'0.9rem' }}>The solution</p>
            <p style={{ fontSize:'0.88rem', color:'oklch(0.56 0 0)', lineHeight:1.72 }}>
              {project.solution}
            </p>
          </div>
        </div>

        {/* Key results */}
        <div data-section>
          <p style={{ fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.22em', textTransform:'uppercase', color:'oklch(0.35 0 0)', marginBottom:'1.5rem' }}>Key results</p>
          <div
            ref={resultsRef}
            style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:'1rem' }}
          >
            {project.results.map((r) => (
              <div
                key={r.label}
                data-result
                style={{
                  ...GLASS,
                  borderRadius: '0.9rem',
                  padding:      '1.4rem 1.2rem',
                  textAlign:    'center',
                }}
              >
                <p style={{
                  fontFamily:    "'Inter', sans-serif",
                  fontWeight:    800,
                  fontSize:      'clamp(1.6rem, 4vw, 2.2rem)',
                  letterSpacing: '-0.03em',
                  color:         'var(--accent)',
                  lineHeight:    1,
                  marginBottom:  '0.4rem',
                }}>
                  {r.value}
                </p>
                <p style={{ fontSize:'0.68rem', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color:'oklch(0.42 0 0)' }}>
                  {r.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div data-section>
          <p style={{ fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.22em', textTransform:'uppercase', color:'oklch(0.35 0 0)', marginBottom:'1rem' }}>Tech stack</p>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem' }}>
            {project.tags.map(tag => (
              <span
                key={tag}
                style={{
                  fontSize:'0.75rem', fontWeight:600, letterSpacing:'0.04em',
                  color:'oklch(0.62 0 0)', background:'oklch(0.10 0.005 50 / 0.7)',
                  border:'1px solid oklch(0.22 0 0)', borderRadius:'999px',
                  padding:'0.35rem 0.9rem',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Screenshot placeholder — swap with real images */}
        {project.screens && project.screens.length > 0 ? (
          <div data-section style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <p style={{ fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.22em', textTransform:'uppercase', color:'oklch(0.35 0 0)' }}>Screenshots</p>
            {project.screens.map((src, i) => (
              <img key={i} src={src} alt={`${project.title} screenshot ${i+1}`}
                style={{ width:'100%', borderRadius:'0.75rem', border:'1px solid oklch(0.18 0 0)' }}/>
            ))}
          </div>
        ) : (
          <div data-section style={{
            ...GLASS,
            borderRadius:'1rem',
            padding:'2.5rem',
            textAlign:'center',
            borderStyle:'dashed',
          }}>
            <p style={{ fontSize:'0.70rem', fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'oklch(0.30 0 0)' }}>
              Project screenshots coming soon
            </p>
          </div>
        )}
      </div>

      {/* ── Next / Prev navigation ────────────────────────────────────────── */}
      <div style={{
        borderTop: '1px solid oklch(0.14 0 0)',
        display:   'grid',
        gridTemplateColumns: prev && next ? '1fr 1fr' : '1fr',
      }}>
        {prev && (
          <TransitionLink
            to={`/work/${prev.slug}`}
            style={{
              padding:        'clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 7.5vw, 6rem)',
              borderRight:    next ? '1px solid oklch(0.14 0 0)' : 'none',
              textDecoration: 'none',
              display:        'block',
              transition:     'background 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'oklch(0.72 0.18 50 / 0.03)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}
          >
            <p style={{ fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:'oklch(0.35 0 0)', marginBottom:'0.5rem' }}>← Previous</p>
            <p style={{ fontSize:'clamp(0.95rem,2vw,1.1rem)', fontWeight:700, color:'oklch(0.80 0 0)', letterSpacing:'-0.01em' }}>{prev.title}</p>
            <p style={{ fontSize:'0.72rem', color:'oklch(0.42 0 0)', marginTop:'0.2rem' }}>{prev.client}</p>
          </TransitionLink>
        )}
        {next && (
          <TransitionLink
            to={`/work/${next.slug}`}
            style={{
              padding:        'clamp(1.5rem, 3vw, 2.5rem) clamp(1.5rem, 7.5vw, 6rem)',
              textDecoration: 'none',
              display:        'block',
              textAlign:      prev ? 'right' : 'left',
              transition:     'background 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'oklch(0.72 0.18 50 / 0.03)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}
          >
            <p style={{ fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:'oklch(0.35 0 0)', marginBottom:'0.5rem' }}>Next →</p>
            <p style={{ fontSize:'clamp(0.95rem,2vw,1.1rem)', fontWeight:700, color:'oklch(0.80 0 0)', letterSpacing:'-0.01em' }}>{next.title}</p>
            <p style={{ fontSize:'0.72rem', color:'oklch(0.42 0 0)', marginTop:'0.2rem' }}>{next.client}</p>
          </TransitionLink>
        )}
      </div>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <div style={{
        borderTop:  '1px solid oklch(0.14 0 0)',
        padding:    'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 7.5vw, 6rem)',
        display:    'flex',
        flexWrap:   'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap:        '1rem',
        background: `radial-gradient(ellipse 60% 80% at 50% 50%, oklch(0.72 0.18 50 / 0.04), transparent 70%)`,
      }}>
        <div>
          <p style={{ fontSize:'clamp(1rem,2vw,1.2rem)', fontWeight:700, color:'oklch(0.88 0 0)', letterSpacing:'-0.02em' }}>
            Like what you see?
          </p>
          <p style={{ fontSize:'0.80rem', color:'oklch(0.42 0 0)', marginTop:'0.25rem' }}>
            Let's build something together.
          </p>
        </div>
        <div style={{ display:'flex', gap:'0.8rem', flexWrap:'wrap' }}>
          <TransitionLink
            to="/work"
            style={{
              display:'inline-flex', alignItems:'center', gap:'0.4rem',
              padding:'0.7rem 1.4rem', borderRadius:'0.5rem',
              background:'transparent', border:'1.5px solid oklch(0.22 0 0)',
              color:'oklch(0.65 0 0)', fontWeight:600, fontSize:'0.82rem',
              textDecoration:'none', transition:'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor='oklch(0.40 0 0)'; el.style.color='oklch(0.88 0 0)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor='oklch(0.22 0 0)'; el.style.color='oklch(0.65 0 0)' }}
          >
            ← All projects
          </TransitionLink>
          <TransitionLink
            to="/contact"
            style={{
              display:'inline-flex', alignItems:'center', gap:'0.4rem',
              padding:'0.7rem 1.4rem', borderRadius:'0.5rem',
              background:'var(--accent)', color:'oklch(0.08 0 0)',
              fontWeight:700, fontSize:'0.82rem',
              textDecoration:'none',
            }}
          >
            Get in touch →
          </TransitionLink>
        </div>
      </div>
    </main>
  )
}
