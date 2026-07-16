import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CLIENTS = [
  { name: 'Unilever',  src: '/logo-unilever.svg',  invert: true  },
  { name: 'HAL',       src: '/logo-hal.png',        invert: true  },
  { name: 'BEL',       src: '/logo-bel.png',        invert: true  },
  { name: 'Langoor',   src: '/logo-langoor.png',    invert: true  },
]

// Duplicate for seamless marquee loop
const TICKER = [...CLIENTS, ...CLIENTS, ...CLIENTS]

export default function ClientLogoStrip() {
  const sectionRef = useRef<HTMLElement>(null)
  const labelRef   = useRef<HTMLParagraphElement>(null)
  const trackRef   = useRef<HTMLDivElement>(null)

  // Entrance animation
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    gsap.set([labelRef.current, trackRef.current], { opacity: 0, y: 16 })

    const st = ScrollTrigger.create({
      trigger: section,
      start:   'top 85%',
      once:    true,
      onEnter: () => {
        gsap.to(labelRef.current,  { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' })
        gsap.to(trackRef.current,  { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.15 })
      },
    })

    return () => st.kill()
  }, [])

  // Infinite marquee
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    track.style.willChange = 'transform'
    const totalWidth = track.scrollWidth / 3   // 3 copies
    const tween = gsap.to(track, {
      x:        -totalWidth,
      duration: 28,
      ease:     'none',
      repeat:   -1,
    })

    // Pause on hover
    const pause  = () => tween.pause()
    const resume = () => tween.resume()
    track.addEventListener('mouseenter', pause)
    track.addEventListener('mouseleave', resume)

    return () => {
      tween.kill()
      track.style.willChange = 'auto'
      track.removeEventListener('mouseenter', pause)
      track.removeEventListener('mouseleave', resume)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-label="Clients and brands"
      style={{
        padding:    'clamp(2.5rem, 5vw, 4rem) 0',
        position:   'relative',
        overflow:   'hidden',
        borderTop:  '1px solid oklch(0.14 0 0)',
        borderBottom: '1px solid oklch(0.14 0 0)',
        background: 'oklch(0.055 0.005 50)',
      }}
    >
      {/* Label */}
      <p
        ref={labelRef}
        style={{
          textAlign:     'center',
          fontSize:      '0.62rem',
          fontWeight:    700,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color:         'oklch(0.32 0 0)',
          marginBottom:  'clamp(1.5rem, 3vw, 2.2rem)',
        }}
      >
        Trusted by leading brands
      </p>

      {/* Fade edges */}
      <div style={{
        position:   'absolute',
        top:        0, bottom: 0, left: 0,
        width:      'clamp(3rem, 8vw, 6rem)',
        background: 'linear-gradient(to right, oklch(0.055 0.005 50), transparent)',
        zIndex:     2,
        pointerEvents: 'none',
      }} />
      <div style={{
        position:   'absolute',
        top:        0, bottom: 0, right: 0,
        width:      'clamp(3rem, 8vw, 6rem)',
        background: 'linear-gradient(to left, oklch(0.055 0.005 50), transparent)',
        zIndex:     2,
        pointerEvents: 'none',
      }} />

      {/* Marquee track */}
      <div style={{ overflow: 'hidden' }}>
        <div
          ref={trackRef}
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:        'clamp(3rem, 6vw, 5rem)',
            width:      'max-content',
          }}
        >
          {TICKER.map((c, i) => (
            <div
              key={i}
              style={{
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                flexShrink:     0,
                height:         'clamp(28px, 3.5vw, 44px)',
                opacity:        0.35,
                transition:     'opacity 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.opacity = '0.85' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.opacity = '0.35' }}
            >
              <img
                src={c.src}
                alt={c.name}
                style={{
                  height:   '100%',
                  width:    'auto',
                  maxWidth: 'clamp(80px, 10vw, 140px)',
                  objectFit: 'contain',
                  filter:   c.invert ? 'brightness(0) invert(1)' : 'none',
                  userSelect: 'none',
                  pointerEvents: 'none',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
