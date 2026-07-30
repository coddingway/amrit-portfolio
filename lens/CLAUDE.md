# Lens — working guide for Claude

Interactive web experience for understanding lenses and vision (concave/convex,
near/far-sightedness, correction). Originally a Class 12 physics project; being
rebuilt as a polished, portfolio-grade web app.

## The one principle

**One optics model, rendered two ways, configured three ways.**

- The physics lives in `src/optics/` as **pure TypeScript with no UI imports**.
  Keep it that way — it's unit-tested and renderer-agnostic.
- The Zustand store (`src/state/store.ts`) is the single source of truth. The
  first-person world and the corner ray diagram are both just views of it.
- The three modes (nearsighted / farsighted / game) are **data**, not code
  paths — they're entries in `src/config/modes.ts` that configure one screen.
  Add a mode by adding config, not by branching components.

## The optics model (memorise this)

Reduced single-lens eye. `errorD` in dioptres: **+ = myopia** (too much power,
far is blurry), **− = hyperopia**, 0 = emmetropia.

```
defocus(d) = errorD + L + A − 1/d        // d in metres, L = summed lens power, A = accommodation
```

- `defocus = 0` → sharp. Blur ∝ `|defocus| × pupilMm`.
- Distance correction that fixes the far point: `L = −errorD`.
- Hot/cold meter reads `residual = L + errorD` (symmetric in ±).
- The eye accommodates `A ∈ [0, accommodationMaxD]` to best-focus the gaze
  target → only one distance is sharp at a time (the accommodation lesson).

Convex lens = converging = **positive** dioptres. Concave = diverging =
**negative**. Optics depth is **spherical only** (no astigmatism — deliberate).

## The WebGL seam

`src/components/Scene.tsx` renders the world as layered `<div>`s blurred by CSS
filters from the optics model. The real renderer (Three.js + r3f + postprocessing,
a panorama + depth props + a depth-aware blur pass) replaces the *internals* of
`Scene` only. **Do not** push rendering concerns into `optics/` or `state/`.

## Product decisions already locked

- Platform: **web / desktop-first**. Mobile is a later landscape-only pass; a
  small-screen gate is shown meanwhile.
- UI is a **floating game HUD**, not a dashboard: full-bleed world, glassy
  panels, lens "action-bar", corner eye instrument.
- Lenses are **dragged** from a convex/concave tray on the right into the frame.
  Up to 5; fine-tuned with a power dial. The eye diagram is **never** draggable.
- Game mode: random easy patient (solvable with 1–2 lenses, near-zero errors
  allowed), hidden diagnosis, hot/cold guide, reveal on win.

## Commands

```bash
pnpm dev     # dev server
pnpm test    # vitest (optics engine)
pnpm build   # tsc -b && vite build  — run before claiming a change compiles
```

Strict TypeScript (`noUnusedLocals`/`noUnusedParameters` on). Prettier config in
`.prettierrc` (no semicolons, single quotes). Path alias `@/` → `src/`.
