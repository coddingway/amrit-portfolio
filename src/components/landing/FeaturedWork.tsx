import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { ChromaGrid } from '../reactbits/ChromaGrid'
import type { ChromaItem } from '../reactbits/ChromaGrid'
import { PROJECTS } from '../../data/projects'
import TransitionLink from '../TransitionLink'

gsap.registerPlugin(ScrollTrigger)

const PALETTE: Record<string, { borderColor: string; gradient: string }> = {
  'ponds-india':         { borderColor: '#F472B6', gradient: 'linear-gradient(145deg, #4a0920 0%, #0d0005 100%)' },
  'liquid-iv-canada':    { borderColor: '#60A5FA', gradient: 'linear-gradient(180deg, #0d1f5e 0%, #000814 100%)' },
  'liquid-iv-australia': { borderColor: '#2DD4BF', gradient: 'linear-gradient(165deg, #063b38 0%, #000e0d 100%)' },
  'hal-web-app':         { borderColor: '#F87171', gradient: 'linear-gradient(195deg, #4a000f 0%, #090001 100%)' },
  'bel-platform':        { borderColor: '#818CF8', gradient: 'linear-gradient(210deg, #1a1760 0%, #060518 100%)' },
  'webar-experience':    { borderColor: '#FBBF24', gradient: 'linear-gradient(165deg, #3d2000 0%, #0d0700 100%)' },
  'nexval-fintech':      { borderColor: '#34D399', gradient: 'linear-gradient(225deg, #022d1b 0%, #000603 100%)' },
  'netbramha-projects':       { borderColor: '#E879F9', gradient: 'linear-gradient(135deg, #2a0830 0%, #090006 100%)' },
  'wipro-consumer-lighting':  { borderColor: '#FACC15', gradient: 'linear-gradient(145deg, #2a1f00 0%, #080600 100%)' },
  'be-beautiful':             { borderColor: '#F9A8D4', gradient: 'linear-gradient(160deg, #3d0a1e 0%, #0d0007 100%)' },
  'brew-for-you':             { borderColor: '#86EFAC', gradient: 'linear-gradient(150deg, #012810 0%, #000a04 100%)' },
  'edgeverve':                { borderColor: '#7DD3FC', gradient: 'linear-gradient(195deg, #001c3d 0%, #000509 100%)' },
  'celegence':                { borderColor: '#C4B5FD', gradient: 'linear-gradient(210deg, #1a0840 0%, #060010 100%)' },
}

export default function FeaturedWork() {
  const sectionRef = useRef<HTMLElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(sectionRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', once: true },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const FEATURED = ['ponds-india', 'liquid-iv-australia', 'liquid-iv-canada', 'wipro-consumer-lighting', 'be-beautiful', 'brew-for-you', 'edgeverve', 'celegence']

  const items: ChromaItem[] = PROJECTS.filter(p => FEATURED.includes(p.slug)).sort((a, b) => FEATURED.indexOf(a.slug) - FEATURED.indexOf(b.slug)).map(p => ({
    image:       p.screens?.[0],
    title:       p.title,
    subtitle:    p.client,
    handle:      p.category,
    location:    p.year,
    borderColor: PALETTE[p.slug]?.borderColor ?? '#c41ed4',
    gradient:    PALETTE[p.slug]?.gradient ?? 'linear-gradient(145deg, #1a0020, #000)',
    url:         `/work/${p.slug}`,
  }))

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ opacity: 0 }}
    >
      {/* ── Header ── */}
      <div
        className="px-6 md:px-14 lg:px-24 mb-10"
        style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1rem' }}
      >
        <div>
          <p style={{
            fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.25em',
            textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.6rem',
          }}>
            Selected Work
          </p>
          <h2 style={{
            fontFamily: "'Inter', sans-serif", fontWeight: 800,
            fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.03em', lineHeight: 1,
            color: 'var(--color-text-primary)', margin: 0,
          }}>
            Projects &amp;{' '}
            <span style={{ fontFamily: "'Instrument Serif', serif", fontWeight: 400, fontStyle: 'italic', color: 'var(--accent)' }}>
              case studies.
            </span>
          </h2>
        </div>

        <TransitionLink
          to="/work"
          className="group inline-flex items-center gap-1.5 text-sm font-medium rounded-full px-5 py-2 border transition-all duration-200"
          style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'var(--color-muted)' }}
        >
          View all work
          <span className="text-xs transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
        </TransitionLink>
      </div>

      {/* ── ChromaGrid ── */}
      <div className="px-6 md:px-14 lg:px-24">
        <ChromaGrid
          items={items}
          radius={320}
          columns={4}
          damping={0.45}
          fadeOut={0.6}
          onCardClick={url => navigate(url)}
        />
      </div>
    </section>
  )
}
