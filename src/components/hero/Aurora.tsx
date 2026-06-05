import { useEffect, useRef } from 'react'

/**
 * Aurora — animated soft-blob background inspired by React Bits Aurora.
 * Renders colour blobs (radial gradients) on a canvas via requestAnimationFrame.
 * Extremely subtle (max opacity ~0.12) so hero text remains crisp.
 */

interface Blob {
  cx: number   // 0–1 normalised centre x
  cy: number   // 0–1 normalised centre y
  r:  number   // 0–1 normalised radius
  freqX: number
  freqY: number
  phaseX: number
  phaseY: number
  color: string
}

// Ember palette — oklch(0.72 0.18 50) family
// Canvas supports oklch() in all modern browsers (Chrome 111+, Firefox 116+, Safari 16.4+)
const BLOBS: Blob[] = [
  { cx: 0.25, cy: 0.38, r: 0.48, freqX: 0.18, freqY: 0.13, phaseX: 0.0,  phaseY: 1.2, color: 'oklch(0.72 0.18 50 / 0.12)' },
  { cx: 0.72, cy: 0.28, r: 0.42, freqX: 0.14, freqY: 0.19, phaseX: 2.1,  phaseY: 0.5, color: 'oklch(0.48 0.14 50 / 0.09)' },
  { cx: 0.55, cy: 0.72, r: 0.52, freqX: 0.22, freqY: 0.11, phaseX: 4.4,  phaseY: 3.1, color: 'oklch(0.35 0.10 50 / 0.07)' },
  { cx: 0.18, cy: 0.65, r: 0.36, freqX: 0.16, freqY: 0.24, phaseX: 1.7,  phaseY: 5.2, color: 'oklch(0.72 0.18 50 / 0.06)' },
  { cx: 0.82, cy: 0.70, r: 0.40, freqX: 0.10, freqY: 0.17, phaseX: 3.3,  phaseY: 2.6, color: 'oklch(0.60 0.16 48 / 0.08)' },
]

export default function Aurora() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = 0
    let H = 0
    let raf = 0

    const resize = () => {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const draw = (timestamp: number) => {
      const t = timestamp * 0.001 // seconds

      ctx.clearRect(0, 0, W, H)

      for (const b of BLOBS) {
        // Gently oscillate each blob's position
        const bx = (b.cx + Math.sin(t * b.freqX + b.phaseX) * 0.18) * W
        const by = (b.cy + Math.cos(t * b.freqY + b.phaseY) * 0.14) * H
        const br = b.r * Math.min(W, H)

        const grad = ctx.createRadialGradient(bx, by, 0, bx, by, br)
        grad.addColorStop(0, b.color)
        grad.addColorStop(1, 'rgba(0,0,0,0)')

        ctx.globalCompositeOperation = 'screen'
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(bx, by, br, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalCompositeOperation = 'source-over'
      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position:      'absolute',
        inset:         0,
        width:         '100%',
        height:        '100%',
        pointerEvents: 'none',
        zIndex:        0,
      }}
    />
  )
}
