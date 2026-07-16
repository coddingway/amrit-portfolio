import gsap from 'gsap'

/**
 * Page transition system — module-level singleton so any component can
 * trigger a route change and the PageTransition overlay reacts.
 *
 * Flow:
 *  1. transitionTo(path, navigate) called (e.g. from TransitionLink)
 *  2. Curtain slides DOWN from above viewport → covers screen  (0.45 s)
 *  3. navigate(path) fires while screen is hidden
 *  4. Curtain slides DOWN off viewport below               (0.45 s)
 *  5. Reset position above viewport — ready for next nav
 */

// ── Overlay element reference ─────────────────────────────────────────────────
// Registered by <PageTransition /> on mount via registerOverlay().
let _overlay: HTMLElement | null = null

export function registerOverlay(el: HTMLElement | null) {
  _overlay = el
  if (el) {
    // Start position: parked above the viewport
    gsap.set(el, { y: '-100%' })
  }
}

// ── Guard: only one transition at a time ──────────────────────────────────────
let _busy = false

// ── Main transition function ──────────────────────────────────────────────────
export async function transitionTo(
  path: string,
  navigate: (path: string) => void,
) {
  // Same page → no transition
  if (window.location.pathname === path) return
  // Already animating → ignore
  if (_busy) return

  _busy = true

  if (_overlay) {
    await new Promise<void>(resolve => {
      _overlay!.style.willChange = 'transform'
      gsap.timeline({
        onComplete: () => {
          _overlay!.style.willChange = 'auto'
          resolve()
        },
      })
        // Phase 1: curtain drops IN (above → centre)
        .to(_overlay, {
          y:        '0%',
          duration: 0.45,
          ease:     'power3.inOut',
        })
        // Phase 2: navigate while hidden, then pull curtain DOWN out
        .call(() => navigate(path))
        .to(_overlay, {
          y:        '100%',
          duration: 0.45,
          ease:     'power3.inOut',
          delay:    0.05, // one frame for React to commit new page
        })
        // Phase 3: snap back to start position (invisible, above viewport)
        .call(() => {
          gsap.set(_overlay!, { y: '-100%' })
        })
    })
  } else {
    // Fallback — no overlay registered yet, just navigate
    navigate(path)
  }

  _busy = false
}
