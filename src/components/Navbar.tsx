import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { m, AnimatePresence } from 'framer-motion'
import TransitionLink from './TransitionLink'

const NAV_LINKS = [
  { label: 'Work',        path: '/work' },
  { label: 'About',       path: '/about' },
  { label: 'Football',    path: '/football' },
  { label: 'Contact',     path: '/contact' },
]

function APIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 108 118"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <line x1="54" y1="5"  x2="5"  y2="112" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
      <line x1="54" y1="5"  x2="74" y2="70"  stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
      <circle cx="70" cy="44" r="27" stroke="currentColor" strokeWidth="10" fill="none" />
      <line x1="22" y1="66" x2="98" y2="66"  stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
      <line x1="5"  y1="112" x2="18" y2="112" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
    </svg>
  )
}

function Divider() {
  return <span className="hidden md:block w-px h-5 bg-stroke mx-1 shrink-0" />
}

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const { pathname } = useLocation()

  // Shadow on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [pathname])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      {/* ── Pill Navbar ─────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4 pointer-events-none">
        <div
          className={`
            pointer-events-auto inline-flex items-center gap-0.5 rounded-full
            border border-white/[0.08] bg-surface/90 backdrop-blur-xl
            px-2 py-2 transition-all duration-300
            ${scrolled ? 'shadow-[0_8px_32px_rgba(0,0,0,0.5)]' : ''}
          `}
        >
          {/* ── AP Logo ── */}
          <TransitionLink
            to="/"
            aria-label="Home"
            className="group relative w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          >
            {/* Gradient ring */}
            <span className="absolute inset-0 rounded-full accent-gradient transition-opacity duration-300 opacity-90 group-hover:opacity-100" />
            {/* Inner dark circle — creates the ring gap */}
            <span className="absolute inset-[2px] rounded-full bg-bg flex items-center justify-center transition-transform duration-300 group-hover:scale-95">
              <APIcon
                className="w-[17px] h-[17px] transition-all duration-300"
                style={{ color: 'var(--accent)' } as React.CSSProperties}
              />
            </span>
            {/* Glow on hover */}
            <span
              className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ boxShadow: '0 0 16px var(--accent-glow)' }}
            />
          </TransitionLink>

          <Divider />

          {/* ── Desktop Links ── */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map(({ label, path }) => (
              <TransitionLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `text-sm rounded-full px-4 py-1.5 transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'text-text-primary bg-white/[0.07]'
                      : 'text-muted hover:text-text-primary hover:bg-white/[0.04]'
                  }`
                }
              >
                {label}
              </TransitionLink>
            ))}
          </div>

          <Divider />

          {/* ── Resume download — desktop ── */}
          <a
            href="/amrit-podder-resume.pdf"
            download="Amrit-Podder-Resume.pdf"
            className="hidden md:flex items-center gap-1 text-sm rounded-full px-4 py-1.5 transition-colors duration-200 text-muted hover:text-text-primary hover:bg-white/[0.04]"
          >
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
              <path d="M7 1v8M4 7l3 3 3-3M2 12h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Résumé
          </a>

          <Divider />

          {/* ── Say hi — desktop ── */}
          <a
            href="mailto:design2code93@gmail.com"
            className="hidden md:flex group relative items-center gap-1 text-sm rounded-full px-4 py-1.5"
          >
            {/* Gradient border ring on hover */}
            <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-1 bg-surface rounded-full px-4 py-1.5 -mx-4 -my-1.5 text-text-primary transition-colors duration-200">
              Say hi
              <span
                className="text-[10px] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                style={{ color: 'var(--accent)' }}
              >
                ↗
              </span>
            </span>
          </a>

          {/* ── Hamburger — mobile ── */}
          <button
            type="button"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/[0.06] transition-colors duration-200"
          >
            <div className="relative w-5 h-[14px] flex flex-col justify-between">
              <m.span
                animate={mobileOpen
                  ? { rotate: 45, y: 6, width: '100%' }
                  : { rotate: 0,  y: 0, width: '100%' }}
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                className="block h-[1.5px] bg-text-primary origin-center rounded-full"
              />
              <m.span
                animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.18 }}
                className="block h-[1.5px] bg-text-primary rounded-full"
              />
              <m.span
                animate={mobileOpen
                  ? { rotate: -45, y: -6, width: '100%' }
                  : { rotate: 0,   y: 0,  width: '100%' }}
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                className="block h-[1.5px] bg-text-primary origin-center rounded-full"
              />
            </div>
          </button>
        </div>
      </nav>

      {/* ── Mobile Full-Screen Menu ──────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-40 bg-bg/96 backdrop-blur-2xl flex flex-col items-center justify-center md:hidden"
          >
            {/* Decorative large AP logo — faint bg */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
              aria-hidden
            >
              <APIcon
                className="w-64 h-64 opacity-[0.03]"
                style={{ color: 'var(--accent)' } as React.CSSProperties}
              />
            </div>

            {/* Links */}
            <nav className="relative flex flex-col items-center gap-1 w-full px-8">
              {NAV_LINKS.map(({ label, path }, i) => (
                <m.div
                  key={path}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0  }}
                  exit={{    opacity: 0, y: 16  }}
                  transition={{
                    delay:    i * 0.06,
                    duration: 0.28,
                    ease:     [0.25, 0.1, 0.25, 1],
                  }}
                  className="w-full"
                >
                  <TransitionLink
                    to={path}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `block text-center py-3 text-3xl font-light transition-colors duration-200 ${
                        isActive
                          ? 'text-text-primary'
                          : 'text-muted hover:text-text-primary'
                      }`
                    }
                  >
                    {label}
                  </TransitionLink>
                </m.div>
              ))}

              {/* Résumé download */}
              <m.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0  }}
                exit={{    opacity: 0, y: 16  }}
                transition={{
                  delay:    NAV_LINKS.length * 0.06,
                  duration: 0.28,
                  ease:     [0.25, 0.1, 0.25, 1],
                }}
                className="w-full"
              >
                <a
                  href="/amrit-podder-resume.pdf"
                  download="Amrit-Podder-Resume.pdf"
                  className="flex items-center justify-center gap-2 py-3 text-3xl font-light text-muted hover:text-text-primary transition-colors duration-200"
                >
                  <svg width="18" height="18" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M7 1v8M4 7l3 3 3-3M2 12h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Résumé
                </a>
              </m.div>

              {/* Say hi */}
              <m.a
                href="mailto:design2code93@gmail.com"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0  }}
                exit={{    opacity: 0, y: 16  }}
                transition={{
                  delay:    (NAV_LINKS.length + 1) * 0.06,
                  duration: 0.28,
                  ease:     [0.25, 0.1, 0.25, 1],
                }}
                className="group relative mt-6 inline-flex items-center gap-1.5 text-base px-8 py-3 rounded-full border border-stroke-high text-text-primary"
              >
                <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative">
                  Say hi
                  <span className="ml-1 text-xs" style={{ color: 'var(--accent)' }}>↗</span>
                </span>
              </m.a>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}
