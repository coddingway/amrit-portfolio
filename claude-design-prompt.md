# Claude Design — Portfolio Landing Page

## Project Prompt

Build a single-page dark portfolio landing page using React + Vite + Tailwind CSS + TypeScript + GSAP + Framer Motion + hls.js.

---

## Global Design System

### Fonts
Google Fonts import: Inter (300–700) and Instrument Serif (italic, 400).
- --font-body: 'Inter', sans-serif → Tailwind font-body
- --font-display: 'Instrument Serif', serif → Tailwind font-display

### CSS Custom Properties (HSL, no hsl() wrapper — Tailwind adds it)
--bg: 0 0% 4%;
--surface: 0 0% 8%;
--text: 0 0% 96%;
--muted: 0 0% 53%;
--stroke: 0 0% 12%;
--accent: 0 0% 96%;

### Tailwind Custom Colors
bg: "hsl(var(--bg))",
surface: "hsl(var(--surface))",
"text-primary": "hsl(var(--text))",
muted: "hsl(var(--muted))",
stroke: "hsl(var(--stroke))",

### Accent Gradient
linear-gradient(90deg, #89AACC 0%, #4E85BF 100%) — used on logo ring, hover borders, progress bars. CSS utility class .accent-gradient.

### Custom Animations (in index.css)
- @keyframes scroll-down — translateY(-100%) → translateY(200%), 1.5s ease-in-out infinite
- @keyframes role-fade-in — opacity 0 + translateY(8px) → opacity 1 + translateY(0), 0.4s ease-out
- @keyframes gradient-shift — background-position 0% 50% → 100% 50% → 0% 50%, 6s ease infinite (for animated gradient borders)

### Forced dark theme — no light mode toggle. body gets bg-bg text-text-primary.

---

## Page Structure (Index.tsx)
{isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

---

## Section 1: Loading Screen
Full-screen overlay (fixed inset-0 z-[9999] bg-bg). Uses requestAnimationFrame counter from 000→100 over 2700ms.
- Top-left: "Portfolio" label — text-xs text-muted uppercase tracking-[0.3em]. Animates y:-20→0, opacity 0→1.
- Center: Rotating words ["Design", "Create", "Inspire"] cycling every 900ms. AnimatePresence mode="wait" with y:20→0→-20 transitions. text-4xl md:text-6xl lg:text-7xl font-display italic text-text-primary/80.
- Bottom-right: Counter display — text-6xl md:text-8xl lg:text-9xl font-display text-text-primary tabular-nums. Shows String(count).padStart(3, "0").
- Bottom progress bar: h-[3px] bg-stroke/50, inner div with .accent-gradient, scaleX(count/100) transform, box-shadow: 0 0 8px rgba(137, 170, 204, 0.35).
- On complete (count reaches 100): 400ms delay then calls onComplete.

---

## Section 2: Hero
Full-viewport section with background HLS video and centered content.

### Background Video
- HLS source: https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8
- Uses hls.js — if Hls.isSupported(), create HLS instance; else if native HLS support, set video.src directly.
- Video: autoPlay muted loop playsInline, absolutely positioned and centered with min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2.
- Dark overlay: bg-black/20
- Bottom fade: h-48 bg-gradient-to-t from-bg to-transparent

### Navbar (fixed, floats at top center)
fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4.
Inner pill: inline-flex items-center rounded-full backdrop-blur-md border border-white/10 bg-surface px-2 py-2. Gets shadow-md shadow-black/10 when scrollY > 100.
Contents (left to right):
1. Logo: 9×9 circle with accent gradient border (reverses direction on hover). Inner bg-bg circle with "JA" in font-display italic text-[13px]. Scales 110% on hover.
2. Divider: w-px h-5 bg-stroke mx-1 (hidden on mobile)
3. Nav links: ["Home", "Work", "Resume"] — text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2. Active: text-text-primary bg-stroke/50. Inactive: text-muted hover:text-text-primary hover:bg-stroke/50.
4. Divider
5. "Say hi" button: Same size as nav links. On hover, shows accent gradient border behind (using absolute span with inset: -2px). Inner content wrapped in bg-surface rounded-full backdrop-blur-md. Includes "↗" arrow.

### Hero Content (centered, z-10)
- Eyebrow: text-xs text-muted uppercase tracking-[0.3em] mb-8 — "COLLECTION '26". Class blur-in.
- Name: text-6xl md:text-8xl lg:text-9xl font-display italic leading-[0.9] tracking-tight text-text-primary mb-6 — "Michael Smith". Class name-reveal.
- Role line: "A {role} lives in Chicago." — roles cycle every 2s through ["Creative", "Fullstack", "Founder", "Scholar"]. Role word uses font-display italic text-text-primary animate-role-fade-in inline-block with key={roleIndex} for re-triggering animation.
- Description: text-sm md:text-base text-muted max-w-md mb-12 — "Designing seamless digital interactions by focusing on the unique nuances which bring systems to life."
- CTA Buttons (inline-flex gap-4):
  - "See Works": Solid button. Default: bg-text-primary text-bg. Hover: bg-bg text-text-primary with accent gradient border ring.
  - "Reach out...": Outlined button. Default: border-2 border-stroke bg-bg text-text-primary. Hover: border-transparent with accent gradient border ring.
  - Both: rounded-full text-sm px-7 py-3.5 hover:scale-105.

### GSAP Entrance
Timeline with ease: "power3.out":
- .name-reveal: opacity 0→1, y 50→0, duration 1.2s, delay 0.1s
- .blur-in: opacity 0→1, filter blur(10px)→blur(0px), y 20→0, duration 1s, stagger 0.1, delay 0.3s

### Scroll Indicator
Bottom-center, text-xs text-muted uppercase tracking-[0.2em] "SCROLL" label above a w-px h-10 bg-stroke line with animated highlight using .animate-scroll-down.

---

## Section 3: Selected Works
bg-bg py-12 md:py-16. Inner: max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16.

### Header
Framer Motion whileInView — opacity 0→1, y 30→0, duration 1s, ease [0.25,0.1,0.25,1], viewport once margin "-100px".
- Eyebrow: w-8 h-px bg-stroke + "Selected Work" text-xs text-muted uppercase tracking-[0.3em]
- Heading: "Featured *projects*" — italic word in font-display italic
- Subtext: "A selection of projects I've worked on, from concept to launch."
- "View all work" button (desktop only, hidden md:inline-flex) — rounded-full with gradient hover border ring + right arrow

### Bento Grid
grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6. Column spans alternate: 7/5/5/7.
4 project cards with titles: Automotive Motion, Urban Architecture, Human Perspective, Brand Identity.
Each card: bg-surface border border-stroke rounded-3xl with aspect ratios. Contains:
- Background image with object-cover group-hover:scale-105
- Halftone overlay: radial-gradient(circle, #000 1px, transparent 1px) at 4×4px, opacity-20 mix-blend-multiply
- Hover: bg-bg/70 opacity-0→1 + backdrop-blur-lg
- Hover label: pill with animated gradient border, white bg, "View — *Title*" (title in font-display italic)

---

## Section 4: Journal
bg-bg py-16 md:py-24. Same header pattern (eyebrow + "Recent *thoughts*" + subtext + "View all" button).
4 journal entries displayed as horizontal pills (rounded-[40px] sm:rounded-full) with titles, images, read times, and dates.
Each entry: flex items-center gap-6 p-4 bg-surface/30 hover:bg-surface border border-stroke.

---

## Section 5: Explorations (Parallax Gallery)
min-h-[300vh] section for scroll-driven parallax.

### Layer 1: Pinned Center (z-10)
h-screen div pinned with GSAP ScrollTrigger.create({ pin: contentRef, pinSpacing: false }).
- Eyebrow: "Explorations"
- Heading: "Visual *playground*"
- Subtext + Dribbble button

### Layer 2: Parallax Columns (z-20, absolute)
grid grid-cols-2 gap-12 md:gap-40 inside max-w-[1400px].
6 items split into 2 columns with GSAP scroll-driven parallax movement.
Cards: aspect-square max-w-[320px], with rotation and lightbox on click.

---

## Section 6: Stats
bg-bg py-16 md:py-24. 3-column grid with stats: 20+ Years Experience, 95+ Projects Done, 200% Satisfied Clients.

---

## Section 7: Contact / Footer
bg-bg pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden.

### Background Video
Same HLS source as hero, but flipped vertically (scale-y-[-1]). Heavier overlay: bg-black/60.

### GSAP Marquee
"BUILDING THE FUTURE • " repeated 10×. GSAP xPercent: -50, duration 40, ease "none", repeat -1.

### CTA
Email button: mailto:hello@michaelsmith.com with gradient hover border ring.

### Footer Bar
Social links [Twitter, LinkedIn, Dribbble, GitHub] + Green pulsing dot + "Available for projects"

---

## Dependencies
gsap, framer-motion, hls.js, react-router-dom, tailwindcss-animate, @tailwindcss/vite, tailwindcss

---

## Project Setup Commands

```bash
npm create vite@latest claude-design -- --template react-ts
cd claude-design
npm install
npm install gsap framer-motion hls.js react-router-dom tailwindcss-animate @tailwindcss/vite tailwindcss
```

---

## File: vite.config.ts

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

---

## File: index.html

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Michael Smith — Portfolio</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## File: src/index.css

```css
@import "tailwindcss";

/* ── Design Tokens ── */
@theme {
  --color-bg: hsl(0 0% 4%);
  --color-surface: hsl(0 0% 8%);
  --color-text-primary: hsl(0 0% 96%);
  --color-muted: hsl(0 0% 53%);
  --color-stroke: hsl(0 0% 12%);
  --color-accent: hsl(0 0% 96%);

  --font-body: 'Inter', sans-serif;
  --font-display: 'Instrument Serif', serif;
}

/* ── Base ── */
html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background-color: var(--color-bg);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  width: 100%;
  max-width: 100%;
}

/* ── Accent Gradient Utility ── */
.accent-gradient {
  background: linear-gradient(90deg, #89AACC 0%, #4E85BF 100%);
}

.accent-gradient-reverse {
  background: linear-gradient(270deg, #89AACC 0%, #4E85BF 100%);
}

/* ── Custom Animations ── */
@keyframes scroll-down {
  0% { transform: translateY(-100%); opacity: 0; }
  30% { opacity: 1; }
  70% { opacity: 1; }
  100% { transform: translateY(200%); opacity: 0; }
}

@keyframes role-fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-scroll-down {
  animation: scroll-down 1.5s ease-in-out infinite;
}

.animate-role-fade-in {
  animation: role-fade-in 0.4s ease-out;
}

.animate-gradient-shift {
  background-size: 200% 200%;
  animation: gradient-shift 6s ease infinite;
}

/* ── Halftone overlay ── */
.halftone-overlay {
  background-image: radial-gradient(circle, #000 1px, transparent 1px);
  background-size: 4px 4px;
}

/* ── Selection ── */
::selection {
  background-color: hsl(0 0% 96% / 0.15);
  color: hsl(0 0% 96%);
}

/* ── Scrollbar ── */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: hsl(0 0% 4%);
}
::-webkit-scrollbar-thumb {
  background: hsl(0 0% 20%);
  border-radius: 3px;
}
```

---

## File: src/main.tsx

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

---

## File: src/App.tsx

```tsx
import { useState } from 'react'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import SelectedWorks from './components/SelectedWorks'
import Journal from './components/Journal'
import Explorations from './components/Explorations'
import Stats from './components/Stats'
import Contact from './components/Contact'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      {isLoading && (
        <LoadingScreen onComplete={() => setIsLoading(false)} />
      )}
      {!isLoading && (
        <>
          <Navbar />
          <Hero />
          <SelectedWorks />
          <Journal />
          <Explorations />
          <Stats />
          <Contact />
        </>
      )}
    </>
  )
}

export default App
```

---

## File: src/components/LoadingScreen.tsx

```tsx
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const WORDS = ['Design', 'Create', 'Inspire']
const DURATION = 2700
const WORD_CYCLE = 900

interface LoadingScreenProps {
  onComplete: () => void
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [count, setCount] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)
  const startRef = useRef<number | null>(null)
  const rafRef = useRef<number>(0)

  const animate = useCallback((timestamp: number) => {
    if (!startRef.current) startRef.current = timestamp
    const elapsed = timestamp - startRef.current
    const progress = Math.min(Math.floor((elapsed / DURATION) * 100), 100)
    setCount(progress)
    if (progress < 100) {
      rafRef.current = requestAnimationFrame(animate)
    }
  }, [])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [animate])

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex(i => (i + 1) % WORDS.length)
    }, WORD_CYCLE)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (count >= 100) {
      const timer = setTimeout(onComplete, 400)
      return () => clearTimeout(timer)
    }
  }, [count, onComplete])

  return (
    <div className="fixed inset-0 z-[9999] bg-bg flex flex-col justify-between">
      {/* Top-left label */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="p-8 md:p-12"
      >
        <span className="text-xs text-muted uppercase tracking-[0.3em]">
          Portfolio
        </span>
      </motion.div>

      {/* Center rotating words */}
      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="text-4xl md:text-6xl lg:text-7xl font-display italic text-text-primary/80"
          >
            {WORDS[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Bottom section */}
      <div className="p-8 md:p-12">
        {/* Counter - bottom right */}
        <div className="flex justify-end mb-6">
          <span className="text-6xl md:text-8xl lg:text-9xl font-display text-text-primary tabular-nums leading-none">
            {String(count).padStart(3, '0')}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-[3px] bg-stroke/50 rounded-full overflow-hidden">
          <div
            className="h-full accent-gradient rounded-full transition-transform duration-75 origin-left"
            style={{
              transform: `scaleX(${count / 100})`,
              boxShadow: '0 0 8px rgba(137, 170, 204, 0.35)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
```

---

## File: src/components/Navbar.tsx

```tsx
import { useState, useEffect } from 'react'

const NAV_LINKS = ['Home', 'Work', 'Resume']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('Home')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4">
      <div
        className={`inline-flex items-center rounded-full backdrop-blur-md border border-white/10 bg-surface px-2 py-2 transition-shadow duration-300 ${
          scrolled ? 'shadow-md shadow-black/10' : ''
        }`}
      >
        {/* Logo */}
        <a
          href="#"
          className="group relative w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        >
          <span className="absolute inset-0 rounded-full accent-gradient group-hover:accent-gradient-reverse transition-all duration-300" />
          <span className="absolute inset-[2px] rounded-full bg-bg flex items-center justify-center">
            <span className="font-display italic text-[13px] text-text-primary group-hover:scale-110 transition-transform duration-300">
              JA
            </span>
          </span>
        </a>

        {/* Divider */}
        <span className="w-px h-5 bg-stroke mx-1 hidden sm:block" />

        {/* Nav Links */}
        {NAV_LINKS.map(link => (
          <button
            key={link}
            onClick={() => setActive(link)}
            className={`text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 transition-all duration-200 ${
              active === link
                ? 'text-text-primary bg-stroke/50'
                : 'text-muted hover:text-text-primary hover:bg-stroke/50'
            }`}
          >
            {link}
          </button>
        ))}

        {/* Divider */}
        <span className="w-px h-5 bg-stroke mx-1 hidden sm:block" />

        {/* Say hi button */}
        <a
          href="mailto:hello@michaelsmith.com"
          className="group relative text-xs sm:text-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2"
        >
          <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative flex items-center gap-1 rounded-full bg-surface backdrop-blur-md text-text-primary">
            Say hi <span className="text-xs">↗</span>
          </span>
        </a>
      </div>
    </nav>
  )
}
```

---

## File: src/components/HlsVideo.tsx

```tsx
import { useEffect, useRef } from 'react'
import Hls from 'hls.js'

const HLS_SRC = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8'

interface HlsVideoProps {
  className?: string
  flip?: boolean
}

export default function HlsVideo({ className = '', flip = false }: HlsVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let hls: Hls | null = null

    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true })
      hls.loadSource(HLS_SRC)
      hls.attachMedia(video)
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = HLS_SRC
    }

    return () => {
      if (hls) {
        hls.destroy()
      }
    }
  }, [])

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      className={`absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 ${
        flip ? 'scale-y-[-1]' : ''
      } ${className}`}
    />
  )
}
```

---

## File: src/components/Hero.tsx

```tsx
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import HlsVideo from './HlsVideo'

const ROLES = ['Creative', 'Fullstack', 'Founder', 'Scholar']

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const [roleIndex, setRoleIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex(i => (i + 1) % ROLES.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(
        '.name-reveal',
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.1 }
      )

      tl.fromTo(
        '.blur-in',
        { opacity: 0, filter: 'blur(10px)', y: 20 },
        { opacity: 1, filter: 'blur(0px)', y: 0, duration: 1, stagger: 0.1 },
        '-=0.9'
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative w-full h-screen overflow-hidden flex items-center justify-center"
    >
      {/* Background Video */}
      <div className="absolute inset-0">
        <HlsVideo />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p className="blur-in text-xs text-muted uppercase tracking-[0.3em] mb-8">
          COLLECTION '26
        </p>

        <h1 className="name-reveal text-6xl md:text-8xl lg:text-9xl font-display italic leading-[0.9] tracking-tight text-text-primary mb-6">
          Michael Smith
        </h1>

        <p className="blur-in text-base md:text-lg text-muted mb-4">
          A{' '}
          <span
            key={roleIndex}
            className="font-display italic text-text-primary animate-role-fade-in inline-block"
          >
            {ROLES[roleIndex]}
          </span>{' '}
          lives in Chicago.
        </p>

        <p className="blur-in text-sm md:text-base text-muted max-w-md mx-auto mb-12">
          Designing seamless digital interactions by focusing on the unique
          nuances which bring systems to life.
        </p>

        {/* CTA Buttons */}
        <div className="blur-in inline-flex flex-wrap justify-center gap-4">
          <a
            href="#work"
            className="group relative rounded-full text-sm px-7 py-3.5 bg-text-primary text-bg hover:bg-bg hover:text-text-primary transition-all duration-300 hover:scale-105"
          >
            <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative bg-bg rounded-full">See Works</span>
          </a>
          <a
            href="mailto:hello@michaelsmith.com"
            className="group relative rounded-full text-sm px-7 py-3.5 border-2 border-stroke bg-bg text-text-primary hover:border-transparent transition-all duration-300 hover:scale-105"
          >
            <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative flex items-center gap-2">
              Reach out...
            </span>
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
        <span className="text-xs text-muted uppercase tracking-[0.2em]">
          Scroll
        </span>
        <div className="w-px h-10 bg-stroke relative overflow-hidden">
          <div className="w-full h-3 accent-gradient animate-scroll-down absolute" />
        </div>
      </div>
    </section>
  )
}
```

---

## File: src/components/SectionHeader.tsx

```tsx
import { motion } from 'framer-motion'

interface SectionHeaderProps {
  eyebrow: string
  heading: string
  italicWord: string
  subtext: string
  buttonText?: string
  buttonHref?: string
}

export default function SectionHeader({
  eyebrow,
  heading,
  italicWord,
  subtext,
  buttonText,
  buttonHref = '#',
}: SectionHeaderProps) {
  const headingParts = heading.split(`{italic}`)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      viewport={{ once: true, margin: '-100px' }}
      className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 md:mb-16 gap-6"
    >
      <div>
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-px bg-stroke" />
          <span className="text-xs text-muted uppercase tracking-[0.3em]">
            {eyebrow}
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-body font-light text-text-primary mb-3">
          {headingParts[0]}
          <span className="font-display italic">{italicWord}</span>
          {headingParts[1] || ''}
        </h2>
        <p className="text-sm md:text-base text-muted max-w-md">{subtext}</p>
      </div>

      {buttonText && (
        <a
          href={buttonHref}
          className="group relative hidden md:inline-flex items-center gap-2 rounded-full text-sm px-6 py-3 text-text-primary border border-stroke hover:border-transparent transition-all duration-300 shrink-0"
        >
          <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
          <span className="relative flex items-center gap-2 bg-surface rounded-full px-6 py-3 -mx-6 -my-3">
            {buttonText}
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </span>
        </a>
      )}
    </motion.div>
  )
}
```

---

## File: src/components/SelectedWorks.tsx

```tsx
import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'

const PROJECTS = [
  {
    title: 'Automotive Motion',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
    span: 'md:col-span-7',
    aspect: 'aspect-[4/3]',
  },
  {
    title: 'Urban Architecture',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
    span: 'md:col-span-5',
    aspect: 'aspect-[3/4]',
  },
  {
    title: 'Human Perspective',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80',
    span: 'md:col-span-5',
    aspect: 'aspect-[3/4]',
  },
  {
    title: 'Brand Identity',
    image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80',
    span: 'md:col-span-7',
    aspect: 'aspect-[4/3]',
  },
]

export default function SelectedWorks() {
  return (
    <section id="work" className="bg-bg py-12 md:py-16">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Selected Work"
          heading="Featured {italic}"
          italicWord="projects"
          subtext="A selection of projects I've worked on, from concept to launch."
          buttonText="View all work"
          buttonHref="#"
        />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: i * 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              viewport={{ once: true, margin: '-50px' }}
              className={`${project.span} group cursor-pointer`}
            >
              <div
                className={`relative ${project.aspect} bg-surface border border-stroke rounded-3xl overflow-hidden`}
              >
                {/* Background image */}
                <img
                  src={project.image}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Halftone overlay */}
                <div className="absolute inset-0 halftone-overlay opacity-20 mix-blend-multiply" />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-bg/70 backdrop-blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                  <span className="relative inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm">
                    <span className="absolute inset-[-2px] rounded-full accent-gradient animate-gradient-shift" />
                    <span className="relative bg-white text-bg rounded-full px-5 py-2.5 flex items-center gap-2">
                      View —{' '}
                      <span className="font-display italic">
                        {project.title}
                      </span>
                    </span>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

## File: src/components/Journal.tsx

```tsx
import { motion } from 'framer-motion'
import SectionHeader from './SectionHeader'

const ENTRIES = [
  {
    title: 'The Future of Design Systems in 2026',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=200&q=80',
    readTime: '5 min read',
    date: 'Mar 15, 2026',
  },
  {
    title: 'Building with Motion: A GSAP Deep Dive',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200&q=80',
    readTime: '8 min read',
    date: 'Feb 28, 2026',
  },
  {
    title: 'Why Typography Matters More Than Ever',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=200&q=80',
    readTime: '4 min read',
    date: 'Feb 10, 2026',
  },
  {
    title: 'Rethinking Navigation for Modern Interfaces',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    readTime: '6 min read',
    date: 'Jan 22, 2026',
  },
]

export default function Journal() {
  return (
    <section className="bg-bg py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <SectionHeader
          eyebrow="Journal"
          heading="Recent {italic}"
          italicWord="thoughts"
          subtext="Writings on design, development, and the creative process."
          buttonText="View all"
          buttonHref="#"
        />

        <div className="flex flex-col gap-4">
          {ENTRIES.map((entry, i) => (
            <motion.a
              key={entry.title}
              href="#"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              viewport={{ once: true, margin: '-50px' }}
              className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 rounded-[40px] sm:rounded-full bg-surface/30 hover:bg-surface border border-stroke transition-all duration-300"
            >
              <img
                src={entry.image}
                alt=""
                className="w-12 h-12 rounded-full object-cover shrink-0"
              />
              <span className="flex-1 text-sm md:text-base text-text-primary group-hover:text-white transition-colors">
                {entry.title}
              </span>
              <span className="flex items-center gap-4 text-xs text-muted shrink-0">
                <span>{entry.readTime}</span>
                <span className="w-1 h-1 rounded-full bg-stroke" />
                <span>{entry.date}</span>
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

## File: src/components/Explorations.tsx

```tsx
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ITEMS = [
  {
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80',
    title: 'Abstract Flow',
  },
  {
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80',
    title: 'Color Study',
  },
  {
    image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&q=80',
    title: 'Geometric',
  },
  {
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80',
    title: 'Texture Play',
  },
  {
    image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&q=80',
    title: 'Light Study',
  },
  {
    image: 'https://images.unsplash.com/photo-1482160549825-59d1b23cb208?w=600&q=80',
    title: 'Organic Forms',
  },
]

export default function Explorations() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const col1Ref = useRef<HTMLDivElement>(null)
  const col2Ref = useRef<HTMLDivElement>(null)
  const [lightbox, setLightbox] = useState<string | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the center content
      if (contentRef.current) {
        ScrollTrigger.create({
          trigger: contentRef.current,
          start: 'top center',
          end: 'bottom center',
          pin: true,
          pinSpacing: false,
        })
      }

      // Parallax columns
      if (col1Ref.current) {
        gsap.to(col1Ref.current, {
          y: -200,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        })
      }

      if (col2Ref.current) {
        gsap.to(col2Ref.current, {
          y: -400,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const leftItems = ITEMS.slice(0, 3)
  const rightItems = ITEMS.slice(3, 6)

  return (
    <>
      <section ref={sectionRef} className="relative min-h-[300vh] bg-bg">
        {/* Pinned center content */}
        <div ref={contentRef} className="relative z-10 h-screen flex items-center justify-center">
          <div className="text-center px-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-8 h-px bg-stroke" />
              <span className="text-xs text-muted uppercase tracking-[0.3em]">
                Explorations
              </span>
              <span className="w-8 h-px bg-stroke" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-body font-light text-text-primary mb-3">
              Visual <span className="font-display italic">playground</span>
            </h2>
            <p className="text-sm md:text-base text-muted max-w-md mx-auto mb-8">
              Experimental work exploring form, color, and motion.
            </p>
            <a
              href="#"
              className="group relative inline-flex items-center gap-2 rounded-full text-sm px-6 py-3 text-text-primary border border-stroke hover:border-transparent transition-all duration-300"
            >
              <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              <span className="relative flex items-center gap-2 bg-bg rounded-full px-6 py-3 -mx-6 -my-3">
                Dribbble
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  ↗
                </span>
              </span>
            </a>
          </div>
        </div>

        {/* Parallax columns */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="max-w-[1400px] mx-auto h-full px-6 md:px-16">
            <div className="grid grid-cols-2 gap-12 md:gap-40 h-full">
              {/* Left column */}
              <div ref={col1Ref} className="flex flex-col gap-8 pt-[20vh]">
                {leftItems.map(item => (
                  <div
                    key={item.title}
                    onClick={() => setLightbox(item.image)}
                    className="pointer-events-auto cursor-pointer aspect-square max-w-[320px] rounded-2xl overflow-hidden border border-stroke bg-surface hover:rotate-1 transition-transform duration-500"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Right column */}
              <div
                ref={col2Ref}
                className="flex flex-col gap-8 pt-[40vh] items-end"
              >
                {rightItems.map(item => (
                  <div
                    key={item.title}
                    onClick={() => setLightbox(item.image)}
                    className="pointer-events-auto cursor-pointer aspect-square max-w-[320px] rounded-2xl overflow-hidden border border-stroke bg-surface hover:-rotate-1 transition-transform duration-500"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-8 cursor-pointer"
        >
          <img
            src={lightbox}
            alt=""
            className="max-w-full max-h-full object-contain rounded-2xl"
          />
        </div>
      )}
    </>
  )
}
```

---

## File: src/components/Stats.tsx

```tsx
import { motion } from 'framer-motion'

const STATS = [
  { value: '20+', label: 'Years Experience' },
  { value: '95+', label: 'Projects Done' },
  { value: '200%', label: 'Satisfied Clients' },
]

export default function Stats() {
  return (
    <section className="bg-bg py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: i * 0.15,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              viewport={{ once: true, margin: '-50px' }}
              className="text-center md:text-left"
            >
              <span className="block text-5xl md:text-6xl lg:text-7xl font-display italic text-text-primary mb-2">
                {stat.value}
              </span>
              <span className="text-sm text-muted uppercase tracking-[0.2em]">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

---

## File: src/components/Contact.tsx

```tsx
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import HlsVideo from './HlsVideo'

const MARQUEE_TEXT = 'BUILDING THE FUTURE \u2022 '
const SOCIALS = [
  { name: 'Twitter', href: '#' },
  { name: 'LinkedIn', href: '#' },
  { name: 'Dribbble', href: '#' },
  { name: 'GitHub', href: '#' },
]

export default function Contact() {
  const marqueeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!marqueeRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(marqueeRef.current, {
        xPercent: -50,
        duration: 40,
        ease: 'none',
        repeat: -1,
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <footer className="relative bg-bg pt-16 md:pt-20 pb-8 md:pb-12 overflow-hidden">
      {/* Background Video (flipped) */}
      <div className="absolute inset-0">
        <HlsVideo flip />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10">
        {/* Marquee */}
        <div className="overflow-hidden mb-16 md:mb-24">
          <div
            ref={marqueeRef}
            className="whitespace-nowrap text-5xl md:text-7xl lg:text-8xl font-display italic text-text-primary/10"
          >
            {Array.from({ length: 10 })
              .map(() => MARQUEE_TEXT)
              .join('')}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mb-16 md:mb-24 px-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-body font-light text-text-primary mb-4">
            Let's work <span className="font-display italic">together</span>
          </h2>
          <p className="text-sm md:text-base text-muted max-w-md mx-auto mb-8">
            Have a project in mind? Let's create something extraordinary.
          </p>
          <a
            href="mailto:hello@michaelsmith.com"
            className="group relative inline-flex items-center gap-2 rounded-full text-sm px-8 py-4 text-text-primary border border-stroke hover:border-transparent transition-all duration-300"
          >
            <span className="absolute inset-[-2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            <span className="relative flex items-center gap-2 bg-bg rounded-full px-8 py-4 -mx-8 -my-4">
              hello@michaelsmith.com
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                ↗
              </span>
            </span>
          </a>
        </div>

        {/* Footer Bar */}
        <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-16">
          <div className="border-t border-stroke pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-6">
              {SOCIALS.map(social => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-xs text-muted hover:text-text-primary uppercase tracking-[0.15em] transition-colors duration-300"
                >
                  {social.name}
                </a>
              ))}
            </div>

            {/* Available */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              <span className="text-xs text-muted">
                Available for projects
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
```

---

## Running the Project

```bash
cd claude-design
npm install
npm run dev
```

Build compiles successfully with `npm run build`. TypeScript passes with zero errors.
