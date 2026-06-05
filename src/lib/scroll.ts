import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register once globally — safe to call multiple times (GSAP no-ops duplicates)
gsap.registerPlugin(ScrollTrigger)

// ── Module-level instance ─────────────────────────────────────────────────────
// Stored here so any component can access it without prop-drilling or context.
let _lenis: Lenis | null = null
let _tickerAdded = false

// ── Init ─────────────────────────────────────────────────────────────────────
export function initLenis(): Lenis {
  // Destroy any previous instance before creating a new one
  _lenis?.destroy()

  _lenis = new Lenis({
    lerp:        0.08,
    smoothWheel: true,
  })

  // Feed Lenis scroll events into ScrollTrigger
  _lenis.on('scroll', ScrollTrigger.update)

  // Connect Lenis RAF loop to GSAP ticker (do once)
  if (!_tickerAdded) {
    gsap.ticker.add((time) => _lenis?.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
    _tickerAdded = true
  }

  return _lenis
}

// ── Accessors & utilities ─────────────────────────────────────────────────────

/** Get the active Lenis instance (may be null before initLenis is called). */
export const getLenis = () => _lenis

/**
 * Instantly jump to top (immediate = true) or smooth-scroll (immediate = false).
 * Safe to call even if Lenis hasn't been initialised yet.
 */
export function scrollToTop(immediate = false) {
  if (!_lenis) return
  _lenis.scrollTo(0, { immediate, duration: immediate ? 0 : 0.8 })
}

/**
 * Tell ScrollTrigger to recalculate all trigger positions.
 * Call this after route changes, dynamic content loads, or layout shifts.
 */
export function refreshTriggers() {
  ScrollTrigger.refresh()
}

// ── Per-page lerp presets ─────────────────────────────────────────────────────
export const LERP = {
  default:     0.08,
  about:       0.07, // slightly slower for long content
  photography: 0.06, // gallery pace — more deliberate
} as const
