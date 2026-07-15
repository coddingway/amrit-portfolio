import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

// ── Photo data ─────────────────────────────────────────────────────────────────
interface Photo {
  id:       number
  seed:     string
  w:        number
  h:        number
  title:    string
  location: string
  cat:      string
}

const ALL_PHOTOS: Photo[] = [
  // Street (5)
  { id:1,  seed:'street-kol-1', w:800, h:1100, title:'Monsoon Alley',    location:'Kolkata, India',    cat:'Street' },
  { id:2,  seed:'street-kol-2', w:800, h:600,  title:'Chai Break',       location:'Howrah, India',     cat:'Street' },
  { id:3,  seed:'street-kol-3', w:800, h:800,  title:'Yellow Cab',       location:'Kolkata, India',    cat:'Street' },
  { id:4,  seed:'street-del-1', w:800, h:1100, title:'Market Shadows',   location:'Old Delhi, India',  cat:'Street' },
  { id:5,  seed:'street-kol-4', w:800, h:533,  title:'Tram Lines',       location:'Kolkata, India',    cat:'Street' },
  // Nature (5)
  { id:6,  seed:'nature-sun-1', w:800, h:533,  title:'Morning Mist',     location:'Sundarbans, India', cat:'Nature' },
  { id:7,  seed:'nature-ker-1', w:800, h:1100, title:'Monsoon',          location:'Kerala, India',     cat:'Nature' },
  { id:8,  seed:'nature-meg-1', w:800, h:1000, title:'Sacred Falls',     location:'Meghalaya, India',  cat:'Nature' },
  { id:9,  seed:'nature-ass-1', w:800, h:800,  title:'Bamboo Forest',    location:'Assam, India',      cat:'Nature' },
  { id:10, seed:'nature-raj-1', w:800, h:533,  title:'Golden Hour',      location:'Rajasthan, India',  cat:'Nature' },
  // Architecture (5)
  { id:11, seed:'arch-mum-1',   w:800, h:1000, title:'Glass & Steel',    location:'Mumbai, India',     cat:'Architecture' },
  { id:12, seed:'arch-blr-1',   w:800, h:533,  title:'Symmetry',         location:'Bangalore, India',  cat:'Architecture' },
  { id:13, seed:'arch-chd-1',   w:800, h:1100, title:'Brutalist Block',  location:'Chandigarh, India', cat:'Architecture' },
  { id:14, seed:'arch-odi-1',   w:800, h:533,  title:'Temple Spire',     location:'Odisha, India',     cat:'Architecture' },
  { id:15, seed:'arch-kol-1',   w:800, h:800,  title:'Colonial Column',  location:'Kolkata, India',    cat:'Architecture' },
  // Travel (3)
  { id:16, seed:'travel-goa-1', w:800, h:1100, title:'Fishing Boats',    location:'Goa, India',        cat:'Travel' },
  { id:17, seed:'travel-ker-1', w:800, h:533,  title:'Backwaters',       location:'Kerala, India',     cat:'Travel' },
  { id:18, seed:'travel-ben-1', w:800, h:800,  title:'Night Train',      location:'Bengal, India',     cat:'Travel' },
]

const FILTERS = ['All', 'Street', 'Nature', 'Architecture', 'Travel']

function countsByFilter(f: string) {
  return f === 'All' ? ALL_PHOTOS.length : ALL_PHOTOS.filter(p => p.cat === f).length
}

// ── Lightbox ───────────────────────────────────────────────────────────────────
interface LightboxProps {
  photos:     Photo[]
  index:      number
  onClose:    () => void
  onNavigate: (idx: number) => void
}

function Lightbox({ photos, index, onClose, onNavigate }: LightboxProps) {
  const overlayRef  = useRef<HTMLDialogElement>(null)
  const contentRef  = useRef<HTMLDivElement>(null)
  const photo = photos[index]

  // Animate in on mount
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set([overlayRef.current, contentRef.current], { opacity: 1, scale: 1, y: 0 })
        return
      }
      gsap.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' },
      )
      gsap.fromTo(contentRef.current,
        { opacity: 0, scale: 0.93, y: 18 },
        { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'power3.out', delay: 0.06 },
      )
    })
    return () => ctx.revert()
  }, [])

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft'  && index > 0)              onNavigate(index - 1)
      if (e.key === 'ArrowRight' && index < photos.length - 1) onNavigate(index + 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [index, photos.length, onClose, onNavigate])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const imgUrl = `https://picsum.photos/seed/${photo.seed}/${photo.w}/${photo.h}`

  return (
    <dialog
      ref={overlayRef}
      open
      aria-label={photo.title}
      className="fixed inset-0 z-[9998] flex items-center justify-center px-4 py-10 border-none m-0 max-w-none max-h-none w-full h-full p-8"
      style={{ background: 'oklch(0.02 0 0 / 0.94)', backdropFilter: 'blur(14px)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div ref={contentRef} className="relative w-full max-w-5xl flex flex-col items-center">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-2 right-0 flex items-center justify-center w-10 h-10 rounded-full text-muted hover:text-text-primary transition-colors"
          style={{ border: '1px solid oklch(1 0 0 / 0.12)' }}
        >
          ✕
        </button>

        {/* Image */}
        <div className="overflow-hidden rounded-sm max-h-[76vh] w-full flex justify-center">
          <img
            key={photo.id}
            src={imgUrl}
            alt={photo.title}
            className="max-h-[76vh] max-w-full object-contain block"
            style={{ borderRadius: '2px' }}
          />
        </div>

        {/* Caption bar */}
        <div className="mt-4 w-full flex items-center justify-between gap-4 px-1">
          <div>
            <div className="text-text-primary font-medium text-sm">{photo.title}</div>
            <div className="text-faint text-xs mt-0.5">{photo.location}</div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span
              className="text-xs px-2.5 py-0.5 rounded-full"
              style={{
                background: 'var(--accent-subtle)',
                color:      'var(--accent)',
                border:     '1px solid var(--accent-dim)',
              }}
            >
              {photo.cat}
            </span>
            <span className="text-faint text-xs tabular-nums">
              {index + 1}&thinsp;/&thinsp;{photos.length}
            </span>
          </div>
        </div>
      </div>

      {/* Prev */}
      {index > 0 && (
        <button
          type="button"
          onClick={() => onNavigate(index - 1)}
          aria-label="Previous photo"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full text-text-primary transition-opacity"
          style={{ background: 'oklch(1 0 0 / 0.07)', border: '1px solid oklch(1 0 0 / 0.12)' }}
          onMouseEnter={e => gsap.to(e.currentTarget, { x: -3, duration: 0.2 })}
          onMouseLeave={e => gsap.to(e.currentTarget, { x:  0, duration: 0.2 })}
        >
          ←
        </button>
      )}

      {/* Next */}
      {index < photos.length - 1 && (
        <button
          type="button"
          onClick={() => onNavigate(index + 1)}
          aria-label="Next photo"
          className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full text-text-primary transition-opacity"
          style={{ background: 'oklch(1 0 0 / 0.07)', border: '1px solid oklch(1 0 0 / 0.12)' }}
          onMouseEnter={e => gsap.to(e.currentTarget, { x:  3, duration: 0.2 })}
          onMouseLeave={e => gsap.to(e.currentTarget, { x:  0, duration: 0.2 })}
        >
          →
        </button>
      )}
    </dialog>
  )
}

// ── Photo Card ─────────────────────────────────────────────────────────────────
interface CardProps {
  photo:   Photo
  onClick: () => void
}

function PhotoCard({ photo, onClick }: CardProps) {
  const imgRef     = useRef<HTMLImageElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const handleEnter = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.to(imgRef.current,     { scale: 1.05, filter: 'grayscale(0%)',   duration: 0.55, ease: 'power2.out' })
    gsap.to(overlayRef.current, { opacity: 1,                             duration: 0.30 })
  }
  const handleLeave = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.to(imgRef.current,     { scale: 1,    filter: 'grayscale(22%)',  duration: 0.55, ease: 'power2.out' })
    gsap.to(overlayRef.current, { opacity: 0,                             duration: 0.30 })
  }

  return (
    <button
      type="button"
      data-photo-card
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="relative overflow-hidden cursor-pointer mb-4 rounded-[2px] w-full text-left"
      style={{ breakInside: 'avoid', border: 'none', padding: 0, background: 'none', display: 'block' }}
    >
      {/* Image */}
      <img
        ref={imgRef}
        src={`https://picsum.photos/seed/${photo.seed}/${photo.w}/${photo.h}`}
        alt={photo.title}
        loading="lazy"
        width={photo.w}
        height={photo.h}
        decoding="async"
        className="w-full h-auto block"
        style={{ filter: 'grayscale(22%)', transformOrigin: 'center center' }}
      />

      {/* Hover overlay — info reveal */}
      <div
        ref={overlayRef}
        className="absolute inset-0 flex flex-col justify-end p-3.5"
        style={{
          opacity: 0,
          background: 'linear-gradient(to top, oklch(0.03 0 0 / 0.88) 0%, oklch(0.03 0 0 / 0.3) 45%, transparent 100%)',
        }}
      >
        <div
          className="inline-flex self-start mb-1.5 text-[11px] px-2 py-0.5 rounded-full font-medium"
          style={{
            background: 'var(--accent-subtle)',
            color:      'var(--accent)',
            border:     '1px solid var(--accent-dim)',
          }}
        >
          {photo.cat}
        </div>
        <div className="text-text-primary font-semibold text-sm leading-tight">
          {photo.title}
        </div>
        <div className="text-muted text-xs mt-0.5">{photo.location}</div>
      </div>
    </button>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function PhotoMasonry() {
  const [activeFilter,  setActiveFilter]  = useState('All')
  const [lightboxIdx,   setLightboxIdx]   = useState<number | null>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  const filtered = activeFilter === 'All'
    ? ALL_PHOTOS
    : ALL_PHOTOS.filter(p => p.cat === activeFilter)

  // Stagger-entrance every time the filter (and therefore the DOM) changes
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const cards = galleryRef.current?.querySelectorAll<HTMLElement>('[data-photo-card]')
      if (!cards || cards.length === 0) return
      gsap.fromTo(
        Array.from(cards),
        { opacity: 0, y: 28, scale: 0.97 },
        { opacity: 1, y: 0,  scale: 1, stagger: 0.048, duration: 0.68, ease: 'power2.out' },
      )
    })
    return () => cancelAnimationFrame(raf)
  }, [activeFilter])

  // Filter: animate out → change state
  const handleFilter = useCallback((f: string) => {
    if (f === activeFilter) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setActiveFilter(f); return }
    const cards = galleryRef.current?.querySelectorAll<HTMLElement>('[data-photo-card]')
    if (cards && cards.length > 0) {
      gsap.to(Array.from(cards), {
        opacity: 0, y: -14, scale: 0.97,
        stagger: 0.025, duration: 0.22, ease: 'power2.in',
        onComplete: () => setActiveFilter(f),
      })
    } else {
      setActiveFilter(f)
    }
  }, [activeFilter])

  return (
    <section
      className="px-6 md:px-14 lg:px-24 pb-28 pt-12"
      style={{ background: 'oklch(0.04 0.002 50)' }}
    >
      {/* ── Filter bar ── */}
      <div className="flex flex-wrap items-center gap-2 mb-10">
        {FILTERS.map(f => {
          const active = f === activeFilter
          return (
            <button
              key={f}
              type="button"
              onClick={() => handleFilter(f)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-250 flex items-center gap-1.5"
              style={
                active
                  ? { background: 'var(--accent)', color: 'oklch(0.05 0 0)' }
                  : {
                      background: 'oklch(1 0 0 / 0.04)',
                      color:      'oklch(0.72 0 0)',
                      border:     '1px solid oklch(1 0 0 / 0.08)',
                    }
              }
            >
              {f}
              <span
                className="text-xs tabular-nums opacity-60"
              >
                {countsByFilter(f)}
              </span>
            </button>
          )
        })}

        <div className="ml-auto text-faint text-sm tabular-nums">
          {filtered.length} photo{filtered.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* ── Masonry grid ── */}
      {/* columns: 3 280px = auto-collapse to 2 col at ~840px, 1 col at ~560px */}
      <div
        ref={galleryRef}
        style={{
          columns:    '3 280px',
          columnGap: '16px',
        }}
      >
        {filtered.map((photo, idx) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onClick={() => setLightboxIdx(idx)}
          />
        ))}
      </div>

      {/* ── Placeholder notice ── */}
      <p
        className="mt-12 text-center text-faint text-xs tracking-[0.18em] uppercase"
      >
        Placeholder imagery — real photographs coming soon
      </p>

      {/* ── Lightbox ── */}
      {lightboxIdx !== null && (
        <Lightbox
          photos={filtered}
          index={lightboxIdx}
          onClose={() => setLightboxIdx(null)}
          onNavigate={(idx) => setLightboxIdx(idx)}
        />
      )}
    </section>
  )
}
