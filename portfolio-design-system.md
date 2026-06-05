# Amrit Podder Portfolio — Design System
## Final Specification

---

## Logo

- AP monogram — geometric overlap of A and P
- File: `src/assets/logo.svg` (to be placed)
- Primary color: `#c41ed4`
- Navbar: 28×28px with glow on hover
- Loading screen: appears after "hello." fades out
- Footer: larger, 60% opacity
- Favicon: logo SVG on transparent bg

---

## Color Palettes

### Global Palette (all pages except Football)

```css
/* Backgrounds */
--bg:           #080808;   /* near-black base */
--surface:      #111111;   /* card / panel */
--surface-high: #1a1a1a;   /* elevated surface */

/* Borders */
--stroke:       #222222;   /* subtle dividers */
--stroke-high:  #333333;   /* visible borders */

/* Accent — Purple */
--accent:       #c41ed4;
--accent-dim:   #7a0d84;
--accent-glow:  rgba(196, 30, 212, 0.30);
--accent-subtle:rgba(196, 30, 212, 0.08);

/* Text */
--text:         #f5f5f5;   /* primary */
--text-muted:   #a0a0a0;   /* secondary labels */
--text-faint:   #555555;   /* very subtle */
```

### Gradients — Global

```css
.accent-gradient {
  background: linear-gradient(90deg, #c41ed4 0%, #7a0d84 100%);
}
.accent-gradient-reverse {
  background: linear-gradient(270deg, #c41ed4 0%, #7a0d84 100%);
}
.accent-gradient-glow {
  background: linear-gradient(90deg, #c41ed4 0%, #9b15a8 50%, #c41ed4 100%);
  background-size: 200% 200%;
  animation: gradient-shift 6s ease infinite;
}
```

### Logo Glow

```css
.logo-glow {
  filter: drop-shadow(0 0 8px rgba(196, 30, 212, 0.5));
}
.logo-glow:hover {
  filter: drop-shadow(0 0 14px rgba(196, 30, 212, 0.75));
}
```

---

### Football Page Palette — Bayern Red

Scoped to `[data-page="football"]` or `.football-theme` wrapper.
Overrides global accent tokens only — backgrounds stay dark.

```css
[data-page="football"] {
  --accent:        #DC052D;   /* Bayern red — official */
  --accent-dim:    #8B0016;   /* deep Bayern red */
  --accent-glow:   rgba(220, 5, 45, 0.30);
  --accent-subtle: rgba(220, 5, 45, 0.08);

  /* Bayern secondary */
  --bayern-white:  #FFFFFF;
  --bayern-gold:   #0066B2;   /* Bayern blue — used sparingly */
}

[data-page="football"] .accent-gradient {
  background: linear-gradient(90deg, #DC052D 0%, #8B0016 100%);
}
[data-page="football"] .accent-gradient-reverse {
  background: linear-gradient(270deg, #DC052D 0%, #8B0016 100%);
}
```

**What changes on Football page:**
- Navbar accent ring → red
- All hover borders → red
- Progress bars / DrawSVG lines → red
- Three.js football glow → red
- ScrollTrigger line markers → red
- StarBorder, Magnet pull rings → red
- Threads background → red/dark red
- Spotlight Card torch colour → red tint

---

## Typography

```css
/* Fonts — same import as demo */
@import url('https://fonts.googleapis.com/css2?
  family=Instrument+Serif:ital@1
  &family=Inter:wght@300;400;500;600;700
  &display=swap');

--font-body:    'Inter', sans-serif;
--font-display: 'Instrument Serif', serif;
```

| Role | Font | Weight | Style |
|------|------|--------|-------|
| Hero name | Instrument Serif | 400 | Italic |
| Section headings | Inter | 300 | Normal |
| Italic accent word | Instrument Serif | 400 | Italic |
| Body copy | Inter | 400 | Normal |
| Labels / eyebrows | Inter | 500 | Normal, uppercase, tracked |
| Navbar links | Inter | 400 | Normal |
| Stats numbers | Instrument Serif | 400 | Italic |
| Code snippets | JetBrains Mono (add if needed) | 400 | Normal |

---

## Spacing & Layout

```css
--max-content:  1200px;
--max-wide:     1400px;
--section-py:   clamp(4rem, 8vw, 8rem);
--section-px:   clamp(1.5rem, 5vw, 4rem);
--card-radius:  1.5rem;   /* 24px */
--pill-radius:  9999px;
```

---

## Tailwind v4 @theme Block (index.css)

```css
@theme {
  /* Backgrounds */
  --color-bg:           #080808;
  --color-surface:      #111111;
  --color-surface-high: #1a1a1a;

  /* Borders */
  --color-stroke:       #222222;
  --color-stroke-high:  #333333;

  /* Accent */
  --color-accent:       #c41ed4;
  --color-accent-dim:   #7a0d84;

  /* Text */
  --color-text-primary: #f5f5f5;
  --color-muted:        #a0a0a0;
  --color-faint:        #555555;

  /* Bayern (Football page only — applied via data-page) */
  --color-bayern-red:   #DC052D;
  --color-bayern-dim:   #8B0016;
  --color-bayern-blue:  #0066B2;

  /* Fonts */
  --font-body:          'Inter', sans-serif;
  --font-display:       'Instrument Serif', serif;
}
```

---

## Component Token Map

| Element | Token |
|---------|-------|
| Page background | `bg-bg` |
| Card background | `bg-surface` |
| Elevated card | `bg-surface-high` |
| Divider line | `bg-stroke` |
| Primary text | `text-text-primary` |
| Muted text | `text-muted` |
| Faint text | `text-faint` |
| Accent color | `text-accent` / `bg-accent` |
| Gradient border | `.accent-gradient` |
| Glow shadow | `shadow-[0_0_20px_var(--accent-glow)]` |

---

## Animation Tokens

```css
/* Easings */
--ease-out-expo:  cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-expo:   cubic-bezier(0.7, 0, 0.84, 0);
--ease-bounce:    cubic-bezier(0.34, 1.56, 0.64, 1);

/* Durations */
--dur-fast:   0.2s;
--dur-mid:    0.5s;
--dur-slow:   0.9s;
--dur-crawl:  1.4s;
```

---

## Cursor System

| Page | Cursor Style | Library |
|------|-------------|---------|
| Landing / Hero | Splash Cursor (ink splash on click) | React Bits |
| Photography | Blob Cursor (soft trailing blob) | React Bits |
| Football | Default — neobrutalism doesn't need a custom cursor | — |
| All others | Splash Cursor inherited | React Bits |

---

## Page Theme Summary

| Page | Accent | Background Base | Style |
|------|--------|----------------|-------|
| Loading | `#c41ed4` | `#080808` | Custom |
| Landing | `#c41ed4` | `#080808` | Premium |
| About | `#c41ed4` | `#080808` | Glassmorphism |
| Work Grid | `#c41ed4` | `#080808` | Bento |
| Project Detail | `#c41ed4` | `#080808` | Clean/Editorial |
| **Football** | **`#DC052D`** | **`#080808`** | **Neobrutalism** |
| Photography | `#c41ed4` | `#080808` | Artistic |
| Contact | `#c41ed4` | `#080808` | Paper |

---

## Navbar Adaptation per Page

The navbar pill stays consistent in structure but accent color follows page theme:

```tsx
// NavBar reads from CSS custom property — no prop drilling needed
// Football page sets data-page="football" on <main>
// CSS var(--accent) auto-switches via the scoped override
```

---

## Assets Checklist

| Asset | Status | Notes |
|-------|--------|-------|
| AP Logo SVG | ✅ Have (PNG provided) | Trace to SVG, place in `src/assets/logo.svg` |
| Profile Photo | ⏳ Placeholder | User will provide later |
| Project screenshots | ⏳ Pending | Ponds, Liquid IV, Wipro etc. |
| Lottie JSONs | ⏳ To source | lottiefiles.com — scroll arrow, send, badge, trophy |
| Bayern crest texture | ⏳ To source | For Three.js football scene |
| Football texture map | ⏳ To source | For Three.js sphere |
| Photography images | ⏳ Placeholder | User will provide their own photos |
