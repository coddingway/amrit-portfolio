import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import ScrollProgress from './ScrollProgress'
import SplashCursor from './cursor/SplashCursor'
import PageTransition from './PageTransition'
import { scrollToTop, refreshTriggers, getLenis, LERP } from '../lib/scroll'

// Maps routes to data-page attribute values (drives CSS theme switching)
const PAGE_MAP: Record<string, string> = {
  '/':            'landing',
  '/about':       'about',
  '/work':        'work',
  '/football':    'football',
  '/photography': 'photography',
  '/contact':     'contact',
}

// Maps page names to Lenis lerp values
const PAGE_LERP: Record<string, number> = {
  about:       LERP.about,
  photography: LERP.photography,
}

export default function Layout() {
  const { pathname } = useLocation()

  const page = pathname.startsWith('/work/')
    ? 'work-detail'
    : (PAGE_MAP[pathname] ?? 'landing')

  useEffect(() => {
    // 1. Jump to top immediately on every route change
    scrollToTop(true)

    // 2. Apply per-page Lenis lerp
    const lenis = getLenis()
    if (lenis) {
      lenis.options.lerp = PAGE_LERP[page] ?? LERP.default
    }

    // 3. Give the new page one frame to render, then refresh
    //    ScrollTrigger so it recalculates all trigger positions
    const id = requestAnimationFrame(() => {
      refreshTriggers()
    })

    return () => cancelAnimationFrame(id)
  }, [pathname, page])

  return (
    <div data-page={page}>
      {/* 2px scroll progress line — very top */}
      <ScrollProgress />

      {/* Custom cursor — all pages, pointer devices only */}
      <SplashCursor />

      {/* Persistent navbar */}
      <Navbar />

      {/* Page content */}
      <Outlet />

      {/* Page transition curtain — sits above everything except cursor */}
      <PageTransition />
    </div>
  )
}
