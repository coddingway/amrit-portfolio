import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Ensure plugin is registered in case this component mounts before scroll.ts runs
gsap.registerPlugin(ScrollTrigger)

/**
 * 2px accent-coloured line pinned to the very top of the viewport.
 * Fills left → right as the user scrolls from top to bottom of the page.
 * Uses ScrollTrigger so it stays in sync with the Lenis-driven scroll position.
 */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    // Set initial state
    gsap.set(bar, { scaleX: 0, transformOrigin: 'left center' })

    const st = ScrollTrigger.create({
      start:    0,
      end:      'max',
      onUpdate: ({ progress }) => {
        gsap.set(bar, { scaleX: progress })
      },
    })

    return () => st.kill()
  }, [])

  return (
    // z-[60] sits above the Navbar (z-50) so the bar is always visible
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] pointer-events-none"
      aria-hidden
    >
      <div
        ref={barRef}
        className="h-full w-full accent-gradient"
        style={{
          transform:       'scaleX(0)',
          transformOrigin: 'left center',
          // Subtle glow so it reads on both dark and video backgrounds
          boxShadow:       '0 0 6px var(--accent-glow)',
        }}
      />
    </div>
  )
}
