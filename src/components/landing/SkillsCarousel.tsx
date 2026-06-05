import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  SiJavascript, SiTypescript, SiReact, SiNextdotjs, SiTailwindcss,
  SiThreedotjs, SiJquery, SiBootstrap, SiHtml5, SiCss, SiGatsby,
  SiWordpress, SiShopify, SiPhp, SiLaravel, SiNodedotjs,
  SiFigma, SiGit, SiGithub, SiJira, SiBitbucket, SiVite, SiWebgl,
} from 'react-icons/si'
import { FaCode, FaPaintBrush, FaPenNib } from 'react-icons/fa'

gsap.registerPlugin(ScrollTrigger)

type SkillItem = {
  label: string
  Icon: React.ComponentType<{ size?: number; color?: string }>
  iconColor?: string
}

const FRONTEND: SkillItem[] = [
  { label: 'JavaScript',   Icon: SiJavascript,     iconColor: '#F7DF1E' },
  { label: 'TypeScript',   Icon: SiTypescript,      iconColor: '#3178C6' },
  { label: 'React',        Icon: SiReact,           iconColor: '#61DAFB' },
  { label: 'Next.js',      Icon: SiNextdotjs,       iconColor: '#ffffff' },
  { label: 'Tailwind CSS', Icon: SiTailwindcss,     iconColor: '#06B6D4' },
  { label: 'Three.js',     Icon: SiThreedotjs,      iconColor: '#ffffff' },
  { label: 'GSAP',         Icon: FaCode,            iconColor: '#88CE02' },
  { label: 'jQuery',       Icon: SiJquery,          iconColor: '#0769AD' },
  { label: 'Bootstrap',    Icon: SiBootstrap,       iconColor: '#7952B3' },
  { label: 'HTML5',        Icon: SiHtml5,           iconColor: '#E34F26' },
  { label: 'CSS3',         Icon: SiCss,             iconColor: '#1572B6' },
  { label: 'Gatsby',       Icon: SiGatsby,          iconColor: '#663399' },
  { label: 'Vite',         Icon: SiVite,            iconColor: '#646CFF' },
  { label: 'WebGL / WebAR',Icon: SiWebgl,           iconColor: '#990000' },
]

const PLATFORMS: SkillItem[] = [
  { label: 'WordPress',    Icon: SiWordpress,       iconColor: '#21759B' },
  { label: 'Shopify',      Icon: SiShopify,         iconColor: '#96BF48' },
  { label: 'PHP',          Icon: SiPhp,             iconColor: '#777BB4' },
  { label: 'Laravel',      Icon: SiLaravel,         iconColor: '#FF2D20' },
  { label: 'Node.js',      Icon: SiNodedotjs,       iconColor: '#339933' },
  { label: 'REST APIs',    Icon: FaCode,            iconColor: 'oklch(0.72 0.18 50)' },
  { label: 'Shopify Liquid',Icon: SiShopify,        iconColor: '#96BF48' },
  { label: 'AEM',          Icon: FaCode,            iconColor: '#FA0F00' },
  { label: 'Hydrogen',     Icon: SiShopify,         iconColor: '#96BF48' },
  { label: 'SOAP APIs',    Icon: FaCode,            iconColor: 'oklch(0.72 0.18 50)' },
]

const TOOLS: SkillItem[] = [
  { label: 'Figma',        Icon: SiFigma,           iconColor: '#F24E1E' },
  { label: 'Adobe XD',     Icon: FaPenNib,          iconColor: '#FF61F6' },
  { label: 'Photoshop',    Icon: FaPaintBrush,      iconColor: '#31A8FF' },
  { label: 'Git',          Icon: SiGit,             iconColor: '#F05032' },
  { label: 'GitHub',       Icon: SiGithub,          iconColor: '#ffffff' },
  { label: 'Bitbucket',    Icon: SiBitbucket,       iconColor: '#0052CC' },
  { label: 'Jira',         Icon: SiJira,            iconColor: '#0052CC' },
  { label: 'Zeplin',       Icon: FaCode,            iconColor: '#FDBD39' },
  { label: 'VS Code',      Icon: FaCode,            iconColor: '#007ACC' },
]

const ROWS = [
  { id: 'frontend',  label: 'Frontend & Frameworks', items: FRONTEND,  direction: -1, speed: 38 },
  { id: 'platforms', label: 'CMS · Platforms · Backend', items: PLATFORMS, direction: 1,  speed: 48 },
  { id: 'tools',     label: 'Design Tools & Workflow', items: TOOLS,   direction: -1, speed: 30 },
]

function SkillChip({ item }: { item: SkillItem }) {
  return (
    <div
      className="skill-chip"
      style={{
        display:       'inline-flex',
        alignItems:    'center',
        gap:           '0.55rem',
        padding:       '0.52rem 1.05rem',
        borderRadius:  '999px',
        border:        '1px solid oklch(0.20 0 0)',
        background:    'oklch(0.09 0.005 50)',
        marginRight:   '12px',
        whiteSpace:    'nowrap',
        flexShrink:    0,
        cursor:        'default',
        transition:    'border-color 0.2s, background 0.2s',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'oklch(0.72 0.18 50 / 0.55)'
        el.style.background  = 'oklch(0.72 0.18 50 / 0.06)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'oklch(0.20 0 0)'
        el.style.background  = 'oklch(0.09 0.005 50)'
      }}
    >
      <item.Icon size={15} color={item.iconColor ?? 'oklch(0.72 0.18 50)'} />
      <span style={{
        fontSize:      '0.75rem',
        fontWeight:    500,
        letterSpacing: '0.02em',
        color:         'oklch(0.68 0 0)',
      }}>
        {item.label}
      </span>
    </div>
  )
}

function MarqueeRow({ rowId, items, direction, speed }: {
  rowId: string
  items: SkillItem[]
  direction: number
  speed: number
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    // direction -1 = left, +1 = right
    const xTarget = direction === -1 ? '-50%' : '0%'
    const xStart  = direction === -1 ? '0%'   : '-50%'

    gsap.set(track, { x: xStart })

    tweenRef.current = gsap.to(track, {
      x:        xTarget,
      duration: speed,
      ease:     'none',
      repeat:   -1,
    })

    return () => { tweenRef.current?.kill() }
  }, [direction, speed])

  // Pause on hover
  const pause  = () => tweenRef.current?.pause()
  const resume = () => tweenRef.current?.play()

  // Duplicate the list for seamless loop
  const doubled = [...items, ...items]

  return (
    <div
      id={rowId}
      style={{ overflow: 'hidden', position: 'relative' }}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      {/* fade edges */}
      <div style={{
        position:   'absolute',
        inset:      0,
        zIndex:     2,
        pointerEvents: 'none',
        background: `linear-gradient(90deg,
          oklch(0.06 0.005 50) 0%,
          transparent 8%,
          transparent 92%,
          oklch(0.06 0.005 50) 100%)`,
      }} />

      <div
        ref={trackRef}
        style={{
          display:    'flex',
          alignItems: 'center',
          width:      'max-content',
          padding:    '6px 0',
        }}
      >
        {doubled.map((item, i) => (
          <SkillChip key={`${item.label}-${i}`} item={item} />
        ))}
      </div>
    </div>
  )
}

export default function SkillsCarousel() {
  const sectionRef  = useRef<HTMLElement>(null)
  const eyebrowRef  = useRef<HTMLParagraphElement>(null)
  const headlineRef = useRef<HTMLDivElement>(null)
  const rowsRef     = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    gsap.set([eyebrowRef.current, headlineRef.current], { opacity: 0, y: 24 })
    gsap.set(rowsRef.current, { opacity: 0, y: 18 })

    const st = ScrollTrigger.create({
      trigger: section,
      start:   'top 78%',
      once:    true,
      onEnter: () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        tl.to(eyebrowRef.current,  { opacity: 1, y: 0, duration: 0.5 })
          .to(headlineRef.current, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
          .to(rowsRef.current, {
            opacity:  1,
            y:        0,
            duration: 0.55,
            stagger:  0.12,
            ease:     'power2.out',
          }, '-=0.35')
      },
    })

    return () => st.kill()
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-label="Skills and technologies"
      style={{
        position:   'relative',
        overflow:   'hidden',
        background: `radial-gradient(ellipse 60% 55% at 50% 50%,
                       oklch(0.72 0.18 50 / 0.035), transparent 70%),
                     oklch(0.06 0.005 50)`,
        padding:    'clamp(3.5rem, 7vw, 6rem) 0 clamp(6rem, 12vw, 10rem)',
      }}
    >
      {/* top border */}
      <div style={{
        position:   'absolute',
        top:        0,
        left:       0,
        right:      0,
        height:     '1px',
        background: 'linear-gradient(90deg, transparent 0%, oklch(0.18 0 0) 20%, oklch(0.18 0 0) 80%, transparent 100%)',
      }} />

      {/* header */}
      <div style={{
        textAlign:    'center',
        marginBottom: 'clamp(2.5rem, 5vw, 4rem)',
        padding:      '0 clamp(1.5rem, 4vw, 3rem)',
      }}>
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
          The stack
        </p>

        <div ref={headlineRef}>
          <span style={{
            fontFamily:    "'Inter', sans-serif",
            fontWeight:    800,
            fontSize:      'clamp(2rem, 4.5vw, 3.8rem)',
            lineHeight:    0.92,
            letterSpacing: '-0.04em',
            color:         'oklch(0.96 0 0)',
          }}>
            Tools I build
          </span>
          {' '}
          <span style={{
            fontFamily:    "'Instrument Serif', serif",
            fontWeight:    400,
            fontStyle:     'italic',
            fontSize:      'clamp(2rem, 4.5vw, 3.8rem)',
            lineHeight:    0.92,
            letterSpacing: '-0.02em',
            color:         'var(--accent)',
          }}>
            with.
          </span>
        </div>
      </div>

      {/* carousel rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.4rem' }}>
        {ROWS.map((row, i) => (
          <div
            key={row.id}
            ref={el => { rowsRef.current[i] = el }}
          >
            {/* row label */}
            <p style={{
              textAlign:     'center',
              fontSize:      '0.65rem',
              fontWeight:    700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color:         'oklch(0.35 0 0)',
              marginBottom:  '0.9rem',
            }}>
              {row.label}
            </p>

            <MarqueeRow
              rowId={row.id}
              items={row.items}
              direction={row.direction}
              speed={row.speed}
            />
          </div>
        ))}
      </div>

      {/* bottom border */}
      <div style={{
        position:   'absolute',
        bottom:     0,
        left:       0,
        right:      0,
        height:     '1px',
        background: 'linear-gradient(90deg, transparent 0%, oklch(0.18 0 0) 20%, oklch(0.18 0 0) 80%, transparent 100%)',
      }} />
    </section>
  )
}
