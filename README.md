# Amrit Podder — Portfolio

Personal portfolio of **Amrit Podder**, Frontend Lead & Design Engineer with 8+ years of experience building fast, polished digital products at the intersection of design precision and engineering excellence.

Live at → **[amritpodder.dev](https://amritpodder.dev)** *(coming soon)*

---

## What is this?

A fully custom dark-themed portfolio site built from scratch — no templates, no UI kit. Every section, animation, and interaction was designed and engineered specifically to reflect the quality of work Amrit delivers to clients.

It covers:
- **Who I am** — background, experience timeline, education, and certifications
- **What I've built** — case studies for projects at Unilever, HAL, BEL, and global DTC brands
- **What I'm into** — FC Bayern München fandom, photography, and a life beyond code
- **How to reach me** — a contact form wired to Google Sheets with real-time validation

---

## Purpose

Most developer portfolios list skills and paste GitHub links. This one is built to do three things:

1. **Convert visitors into clients** — clear services, real project outcomes, direct contact
2. **Show craft, not just output** — the site itself is the proof of work
3. **Feel alive** — personality-driven sections (football, photography) make it memorable

---

## Tech Stack

### Core
| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS v4 (CSS-first config, OKLCH color tokens) |
| Routing | React Router v6 with custom page transitions |

### Animation backbone
| Tool | Used for |
|------|---------|
| **GSAP + ScrollTrigger** | All entrance animations, scroll-driven effects, page transitions, counter animations |
| **GSAP DrawSVG** | SVG path drawing on the Football page |
| **Lenis** | Smooth scroll across all pages |
| **Three.js** | Particle field on the hero section |

### Other libraries
- `react-icons / simple-icons` — tech stack icon set in Skills carousel
- `Google Apps Script` — serverless backend for contact form → Google Sheets + email notification

---

## Project Structure

```
src/
├── components/
│   ├── hero/           # Aurora, Particles, HeroSection
│   ├── landing/        # StatsStrip, FeaturedWork, SkillsCarousel,
│   │                   # ClientLogoStrip, FootballTeaser,
│   │                   # PhotographyTeaser, LandingFooter
│   ├── about/          # AboutHero, ExperienceTimeline,
│   │                   # EducationSection, AboutCTA
│   └── photography/    # PhotographyHero, PhotoMasonry (lightbox)
├── pages/
│   ├── Landing.tsx     # Home
│   ├── About.tsx
│   ├── Work.tsx        # Project grid
│   ├── WorkDetail.tsx  # Case study template
│   ├── Football.tsx    # Bayern München passion page
│   ├── Photography.tsx # Masonry gallery
│   └── ContactPage.tsx # Form + Google Sheets
├── data/
│   └── projects.ts     # All project data (single source of truth)
└── lib/
    ├── transition.ts   # GSAP page transition helper
    └── scroll.ts       # Lenis smooth scroll setup
```

---

## Running locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

---

## Deployment

Deployed on **Vercel** with SPA routing via `vercel.json`:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

---

## Built with

React · Vite · Tailwind CSS v4 · TypeScript · GSAP ScrollTrigger · Three.js · Lenis · Claude Code

---

*© 2026 Amrit Podder. All rights reserved.*
