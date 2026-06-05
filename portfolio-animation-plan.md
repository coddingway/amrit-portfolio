# Animation & Interaction Library Plan
## Amrit Podder Portfolio

---

## Libraries

| Library | Purpose | Install |
|---------|---------|---------|
| Three.js | 3D canvas scenes, particle fields, interactive geometry | already installed |
| GSAP + ScrollTrigger | Scroll-driven animations, pinning, scrub, timelines | already installed |
| GSAP DrawSVG | SVG path trace animations on scroll or load | GSAP Club plugin* |
| Lenis | Buttery smooth scroll, replaces native scroll | `npm install lenis` |
| Lottie | JSON-based micro-animations, icons, transitions | `npm install lottie-react` |

> *DrawSVG note: GSAP Club plugin (requires GreenSock membership). Can be replicated
> with native `strokeDasharray` / `strokeDashoffset` + GSAP tween at no cost — identical result.
> Will implement the free approach unless user has Club license.

---

## Lenis + GSAP ScrollTrigger Integration (Global Setup)

```ts
// src/lib/scroll.ts
import Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'

export function initLenis() {
  const lenis = new Lenis({ lerp: 0.08, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}
```

Called once in `App.tsx`, lives for the entire session.

---

## Page-by-Page Library Mapping

---

### Loading Screen
| Library | Usage | Detail |
|---------|-------|--------|
| **DrawSVG** | "hello." handwriting animation | SVG path of cursive "hello." traces stroke from 0→full length over 1.8s, ease: power2.inOut |
| **GSAP** | Entrance + exit timeline | After draw completes: 400ms hold → scale up + fade out entire screen |

**Technical approach:**
- Single continuous SVG `<path>` of cursive "hello." (hand-traced or generated from a script font)
- `strokeDasharray = path.getTotalLength()`
- `strokeDashoffset` animates from `totalLength → 0`
- White stroke on `bg-bg` dark background
- Subtle glow: `filter: drop-shadow(0 0 8px rgba(255,255,255,0.4))`

---

### Landing — Hero Section
| Library | Usage | Detail |
|---------|-------|--------|
| **Three.js** | Interactive particle field background | 800–1200 floating particles, subtle drift, mouse parallax shifts the field |
| **GSAP** | Sequential 5-line reveal | Name → WHO → WHAT → IMPACT → YEARS → WHERE, staggered 0.2s each |
| **Lenis** | Smooth scroll active | Global, smooth entry into next section |
| **Lottie** | Scroll indicator arrow | Animated bouncing arrow at bottom of hero |

**Three.js Hero Scene:**
- `BufferGeometry` with random points
- `ShaderMaterial` or `PointsMaterial` — small white/blue dots
- `requestAnimationFrame` slow drift rotation
- `mousemove` shifts camera position slightly (parallax feel)
- Renders behind all content on a `<canvas>` with `position: absolute`

---

### Landing — Stats Strip
| Library | Usage | Detail |
|---------|-------|--------|
| **GSAP + ScrollTrigger** | Number counter animation | 0 → 8, 0 → 40, 0 → 98 etc., triggered when strip enters viewport |
| **DrawSVG** | Decorative SVG line under section | Horizontal rule SVG that draws left→right on scroll |

---

### Landing — Featured Projects Teaser
| Library | Usage | Detail |
|---------|-------|--------|
| **GSAP + ScrollTrigger** | Cards stagger up on scroll | `scrub: false`, `once: true`, stagger 0.15s |
| **Lottie** | Hover "view project" micro-animation | Animated arrow icon on each card hover |

---

### About Page `/about` — Glassmorphism
| Library | Usage | Detail |
|---------|-------|--------|
| **Three.js** | Floating 3D skills cloud | Skill name tags floating in 3D space, slow rotation, click to highlight |
| **GSAP + ScrollTrigger** | Section reveals | Each section (bio, skills, timeline) animates in as it enters viewport |
| **DrawSVG** | Career timeline vertical line | SVG vertical line draws downward as user scrolls through timeline |
| **Lottie** | Certification badge icons | Animated badge/stamp reveal for each certification |
| **Lenis** | Extra smooth for long page | Lerp: 0.07 for slower, more tactile feel on this content-heavy page |

**Three.js Skills Cloud:**
- `TextGeometry` or HTML labels in 3D space using `CSS3DRenderer`
- Skills orbit slowly around a center point
- Hover: skill card expands with frosted glass panel
- Groups: Frontend (blue cluster) · Backend (purple) · Tools (green)

**DrawSVG Timeline:**
- Vertical SVG path running down the left side of the career timeline
- Draws progressively as user scrolls, triggering each role card to animate in
- Small circle markers at each role junction — fill animates from empty to solid

---

### Work Grid `/work` — Bento
| Library | Usage | Detail |
|---------|-------|--------|
| **GSAP + ScrollTrigger** | Staggered card entrance | Cards scrub in with slight Y offset, stagger 0.1s |
| **Lottie** | "View project" icon on hover | Animated external link / arrow icon |
| **Three.js** | (optional) — subtle grid background | Low-opacity wireframe grid that shifts on scroll |

---

### Project Detail `/work/:slug` — Clean/Editorial
| Library | Usage | Detail |
|---------|-------|--------|
| **GSAP + ScrollTrigger** | Pinned cover → scroll into content | Cover image stays pinned while content scrolls over it |
| **GSAP + ScrollTrigger** | Horizontal image gallery scrub | "Process" screenshots scroll horizontally while page scrolls vertically |
| **DrawSVG** | Process step connectors | SVG dashed lines between step numbers draw on scroll |
| **Lottie** | Stats number reveals | Impact metrics animate in (e.g. "35%" counter with Lottie arc) |
| **Lenis** | Smooth long-form reading | Slow lerp makes case study feel like a magazine |

---

### Football Page `/football` — Neobrutalism
| Library | Usage | Detail |
|---------|-------|--------|
| **Three.js** | 3D rotating football / Bayern crest | Hero centerpiece — a football or Bayern badge rendered in 3D, mouse-interactive |
| **GSAP + ScrollTrigger** | Pinned "My Story" section | Text reveal while pitch graphic stays pinned |
| **GSAP + ScrollTrigger** | Stat counters | "Matches watched: 0 → 500+", "Years supporting: 0 → 22" |
| **DrawSVG** | Football pitch lines | Top-down SVG pitch diagram — lines draw themselves on page load |
| **Lottie** | Goal celebration | Trophy/football animations in the moments section |

**Three.js Football:**
- `SphereGeometry` with football texture map (or procedural black-white pattern)
- Slow auto-rotation on Y axis
- `mousemove`: tilts slightly toward cursor
- Bayern red atmospheric glow behind it

**DrawSVG Pitch:**
- Full-size SVG football pitch (top-down view)
- All lines (centre circle, penalty boxes, halfway line) draw sequentially
- Used as background/decorative element in the hero area

---

### Photography Page `/photography` — Artistic
| Library | Usage | Detail |
|---------|-------|--------|
| **GSAP + ScrollTrigger** | Masonry parallax | Each column scrolls at different speeds (scrub) |
| **Three.js** | 3D card tilt on hover | Photos tilt in 3D space toward cursor (subtle perspective shift) |
| **Lenis** | Slow, gallery-pace scroll | Lerp: 0.06 — intentionally slower, feels like browsing a physical portfolio |
| **GSAP** | Lightbox open/close animation | Photo expands from card position to fullscreen (FLIP animation) |

---

### Contact Page `/contact` — Paper
| Library | Usage | Detail |
|---------|-------|--------|
| **DrawSVG** | Animated "AP" signature | Cursive SVG signature draws itself on page load |
| **Lottie** | Send button animation | Paper plane / arrow animates on hover |
| **Lottie** | Availability pulse | Green dot with animated radar/ripple rings |
| **GSAP** | Entrance animations | Elements fade up on load |

---

## Summary Matrix

| Page | Three.js | GSAP+ST | DrawSVG | Lenis | Lottie |
|------|----------|---------|---------|-------|--------|
| Loading | — | ✅ | ✅ hello | — | — |
| Hero | ✅ particles | ✅ reveal | ✅ rule | ✅ global | ✅ scroll arrow |
| Stats strip | — | ✅ counters | ✅ line | ✅ | — |
| Work teaser | — | ✅ stagger | — | ✅ | ✅ hover |
| About | ✅ skills cloud | ✅ reveals | ✅ timeline | ✅ slow | ✅ badges |
| Work Grid | optional | ✅ stagger | — | ✅ | ✅ hover |
| Project Detail | — | ✅ pin+scrub | ✅ steps | ✅ slow | ✅ stats |
| Football | ✅ football/crest | ✅ pin+counter | ✅ pitch | ✅ | ✅ goal |
| Photography | ✅ tilt | ✅ parallax | — | ✅ slow | — |
| Contact | — | ✅ entrance | ✅ signature | ✅ | ✅ send |

---

## Dependencies to Add

```bash
npm install lenis lottie-react
```

GSAP, Three.js, Framer Motion already in package.json.

DrawSVG → implemented via native strokeDashoffset (free, same result).

---

## Global Architecture Notes

1. **Lenis** wraps the entire app in `App.tsx`, feeds into ScrollTrigger via RAF loop
2. **Three.js scenes** are isolated per component, `dispose()` called on unmount to prevent memory leaks
3. **GSAP contexts** (`gsap.context()`) used in every component for clean cleanup on unmount
4. **Lottie** files stored in `src/assets/lottie/*.json`
5. **DrawSVG paths** inlined as React SVG components in `src/components/svg/`
