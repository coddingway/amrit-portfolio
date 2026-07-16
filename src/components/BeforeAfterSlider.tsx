import { useRef, useState, useCallback } from 'react'

interface Props {
  before: string
  after: string
  beforeLabel?: string
  afterLabel?: string
  initialPosition?: number // 0–100
  aspect?: string          // CSS aspect-ratio, e.g. "16/9"
}

export default function BeforeAfterSlider({
  before,
  after,
  beforeLabel = 'Before',
  afterLabel = 'After',
  initialPosition = 50,
  aspect = '16/9',
}: Props) {
  const [pos, setPos] = useState(initialPosition)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const clamp = (v: number) => Math.min(100, Math.max(0, v))

  const updateFromEvent = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const { left, width } = el.getBoundingClientRect()
    setPos(clamp(((clientX - left) / width) * 100))
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    updateFromEvent(e.clientX)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    updateFromEvent(e.clientX)
  }

  const onPointerUp = () => { dragging.current = false }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft')  setPos(p => clamp(p - 2))
    if (e.key === 'ArrowRight') setPos(p => clamp(p + 2))
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: aspect,
        overflow: 'hidden',
        borderRadius: '16px',
        userSelect: 'none',
        cursor: 'col-resize',
        background: '#000',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* After image — full width, always visible */}
      <img
        src={after}
        alt={afterLabel}
        draggable={false}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          pointerEvents: 'none',
        }}
      />

      {/* Before image — clipped to reveal left side */}
      <img
        src={before}
        alt={beforeLabel}
        draggable={false}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          clipPath: `inset(0 ${100 - pos}% 0 0)`,
          pointerEvents: 'none',
        }}
      />

      {/* Labels */}
      <span style={{
        position: 'absolute', top: 14, left: 16,
        fontSize: '0.65rem', fontWeight: 700,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: '#fff', background: 'rgba(0,0,0,0.55)',
        padding: '4px 10px', borderRadius: '999px',
        backdropFilter: 'blur(6px)',
        opacity: pos > 8 ? 1 : 0,
        transition: 'opacity 0.2s',
        pointerEvents: 'none',
      }}>
        {beforeLabel}
      </span>

      <span style={{
        position: 'absolute', top: 14, right: 16,
        fontSize: '0.65rem', fontWeight: 700,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: '#fff', background: 'rgba(0,0,0,0.55)',
        padding: '4px 10px', borderRadius: '999px',
        backdropFilter: 'blur(6px)',
        opacity: pos < 92 ? 1 : 0,
        transition: 'opacity 0.2s',
        pointerEvents: 'none',
      }}>
        {afterLabel}
      </span>

      {/* Handle */}
      <div
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        aria-label="Before/After comparison slider"
        tabIndex={0}
        onKeyDown={onKeyDown}
        style={{
          position: 'absolute',
          top: 0, bottom: 0,
          left: `${pos}%`,
          transform: 'translateX(-50%)',
          width: 2,
          background: 'rgba(255,255,255,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          outline: 'none',
          pointerEvents: 'none',
        }}
      >
        {/* Drag knob */}
        <div style={{
          width: 40, height: 40,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 4,
          flexShrink: 0,
          pointerEvents: 'none',
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M5 8L2 5m0 0l3-3M2 5h12m0 0l-3-3m3 3l-3 3" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  )
}
