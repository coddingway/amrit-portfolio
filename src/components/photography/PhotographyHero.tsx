import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function PhotographyHero() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-ph]',
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, stagger: 0.10, duration: 1.0, ease: 'power3.out', delay: 0.2 },
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden noise-overlay"
      style={{ background: 'oklch(0.03 0.004 50)' }}
    >
      {/* ── Ambient gradient blobs ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 80% 20%, oklch(0.72 0.18 50 / 0.04) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 10% 80%, oklch(0.72 0.18 50 / 0.03) 0%, transparent 50%)
          `,
        }}
      />

      {/* ── Vertical accent rule ── */}
      <div
        data-ph
        className="absolute left-8 md:left-16 top-0 bottom-0 w-px pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, transparent 5%, var(--accent) 25%, var(--accent) 75%, transparent 95%)',
          opacity: 0.45,
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 px-8 md:px-16 lg:px-24 max-w-7xl w-full">
        {/* Label row */}
        <div data-ph className="mb-8 inline-flex items-center gap-3">
          <div className="w-8 h-px" style={{ background: 'var(--accent)' }} />
          <span
            className="text-xs font-medium tracking-[0.28em] uppercase"
            style={{ color: 'var(--accent)' }}
          >
            Personal Work
          </span>
        </div>

        {/* Headline */}
        <h1 data-ph className="mb-10 leading-[0.86]" aria-label="Through the lens.">
          <span
            className="block text-text-primary select-none"
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(4.5rem, 13vw, 12rem)',
              lineHeight: 0.86,
            }}
          >
            Through
          </span>
          <span
            className="block select-none"
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: 'italic',
              fontSize: 'clamp(4.5rem, 13vw, 12rem)',
              lineHeight: 0.88,
              color: 'var(--accent)',
            }}
          >
            the lens.
          </span>
        </h1>

        {/* Divider */}
        <div
          data-ph
          className="mb-8 h-px"
          style={{ maxWidth: '36rem', background: 'oklch(1 0 0 / 0.09)' }}
        />

        {/* Sub + counter row */}
        <div
          data-ph
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
          style={{ maxWidth: '52rem' }}
        >
          <p className="text-muted text-base md:text-lg leading-relaxed" style={{ maxWidth: '34rem' }}>
            What's in focus? What's not? Why?<br/>
            Streets, nature &amp; fleeting moments — captured across India and beyond.
            Photography is how I practice the same deliberate eye I bring to UI work:
            noticing what belongs and what doesn't.
          </p>
          <div className="flex-shrink-0 sm:text-right">
            <div
              className="text-5xl font-bold tabular-nums leading-none"
              style={{ color: 'var(--accent)', fontFamily: "'Inter', sans-serif" }}
            >
              18
            </div>
            <div className="text-xs tracking-[0.22em] uppercase text-faint mt-1">frames below</div>
          </div>
        </div>
      </div>

      {/* ── Scroll cue ── */}
      <div
        data-ph
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs tracking-[0.22em] uppercase text-faint">scroll</span>
        <div
          className="w-px h-12 overflow-hidden relative"
          style={{ background: 'oklch(1 0 0 / 0.12)' }}
        >
          <div
            className="absolute top-0 left-0 w-full animate-scroll-down"
            style={{ height: '50%', background: 'var(--accent)' }}
          />
        </div>
      </div>
    </section>
  )
}
