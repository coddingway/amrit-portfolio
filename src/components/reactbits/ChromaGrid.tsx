import { useRef } from 'react'
import './ChromaGrid.css'

export interface ChromaItem {
  image?: string
  title: string
  subtitle: string
  handle?: string
  location?: string
  borderColor?: string
  gradient?: string
  url?: string
}

interface Props {
  items: ChromaItem[]
  className?: string
  radius?: number
  columns?: number
  onCardClick?: (url: string) => void
}

export function ChromaGrid({
  items,
  className = '',
  radius = 300,
  columns = 3,
  onCardClick,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLElement | null)[]>([])

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = rootRef.current!.getBoundingClientRect()
    const mx = e.clientX - r.left
    const my = e.clientY - r.top

    cardRefs.current.forEach(card => {
      if (!card) return
      const cr = card.getBoundingClientRect()
      const cx = cr.left - r.left + cr.width / 2
      const cy = cr.top - r.top + cr.height / 2
      const dist = Math.sqrt((mx - cx) ** 2 + (my - cy) ** 2)
      const t = Math.max(0, Math.min(1, (dist - radius * 0.15) / (radius * 0.85)))
      card.style.filter = `grayscale(${t}) brightness(${1 - t * 0.25})`
    })
  }

  const handleLeave = () => {
    cardRefs.current.forEach(card => {
      if (!card) return
      card.style.filter = ''
    })
  }

  const handleCardMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }

  return (
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      style={{ '--cols': columns } as React.CSSProperties}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {items.map((c, i) => (
        <article
          key={i}
          ref={(el: HTMLElement | null) => { cardRefs.current[i] = el }}
          className="chroma-card"
          onMouseMove={handleCardMove}
          onClick={() => c.url && onCardClick?.(c.url)}
          style={{
            '--card-border': c.borderColor ?? 'transparent',
            '--card-gradient': c.gradient ?? 'linear-gradient(145deg, #1a0020, #000)',
            cursor: c.url ? 'pointer' : 'default',
          } as React.CSSProperties}
        >
          <div className="chroma-img-wrapper">
            {c.image ? (
              <img src={c.image} alt={c.title} loading="lazy" />
            ) : (
              <div className="chroma-img-placeholder">
                {c.handle ?? c.title.slice(0, 2)}
              </div>
            )}
          </div>
          <footer className="chroma-info">
            <h3 className="name">{c.title}</h3>
            {c.location && <span className="handle">{c.location}</span>}
            <p className="role">{c.subtitle}</p>
            {c.handle && <span className="location">{c.handle}</span>}
          </footer>
        </article>
      ))}
    </div>
  )
}

export default ChromaGrid
