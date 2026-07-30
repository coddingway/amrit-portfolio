# Lens

An interactive, first-person way to *feel* how lenses shape sight.

You look at a world through a pair of imperfect eyes, drag corrective lenses in
front of them, and watch the scene snap into focus — while a live ray diagram in
the corner shows you *why*. Three ways in:

- **Explore Nearsightedness** — wear a myopic eye, see the world go soft, and
  discover that a diverging (concave) lens brings it back.
- **Explore Farsightedness** — the same, for a hyperopic eye and a converging
  (convex) lens.
- **Game mode** — you're handed a patient with an unknown refractive error. No
  label. A hot/cold meter is your only guide. Diagnose and correct them.

It started life as a Class 12 physics project (originally written in C++). This
is that idea rebuilt as a polished, web-native experience.

> **Status:** early foundation. The optics engine and the full interaction loop
> work today against a lightweight **CSS/DOM placeholder world**. The
> photoreal panorama + WebGL post-processing is a planned drop-in — see
> [The WebGL seam](#the-webgl-seam).

---

## The idea in one diagram

```
 Eye model ─┐
            ├──▶  Optics engine  ──┬──▶  First-person view  (the lifelike world)
 Lens stack ┘   (one shared model) └──▶  Ray diagram        (the physics, live)
```

One optics model is the single source of truth. Both the world you see and the
eye diagram in the corner are just two renderings of it. Change a lens and they
both react in the same frame.

---

## Tech stack

| Concern        | Choice                                  |
| -------------- | --------------------------------------- |
| Package manager| **pnpm**                                |
| Build / dev    | **Vite**                                |
| UI             | **React 18 + TypeScript**               |
| State          | **Zustand** (the shared optics store)   |
| Tests          | **Vitest** (the optics engine)          |
| 3D *(planned)* | Three.js · react-three-fiber · drei · postprocessing |

The optics engine is **pure TypeScript with zero rendering dependencies**, so it
is fully unit-tested and renderer-agnostic. The current renderer is plain DOM +
CSS; swapping in WebGL changes how pixels are drawn, not the physics.

---

## Getting started

```bash
pnpm install
pnpm dev          # start the dev server
pnpm test         # run the optics-engine tests
pnpm build        # type-check + production build
```

Then open the local URL Vite prints. **Built for a desktop / large screen** — a
small-screen gate appears on narrow viewports (mobile is a deliberate later
phase; see the roadmap).

---

## Project structure

```
src/
  optics/        # the physics — pure TypeScript, no UI
    types.ts     # Lens, EyeModel, scene types
    engine.ts    # dioptre math: defocus, blur, accommodation, hot/cold
    engine.test.ts
  config/
    modes.ts     # the config that drives all three modes + the shared scene
  state/
    store.ts     # Zustand store + selectors (the single source of truth)
  components/    # the floating HUD + the placeholder world
    Scene.tsx        # layered CSS world; each layer blurs from the optics model
    EyeInstrument.tsx# the live corner ray diagram
    LensRack.tsx     # the lens action-bar + the draggable convex/concave tray
    HotColdMeter.tsx # the game-mode gauge
    TopBar.tsx
    GlassesToggle.tsx
    SmallScreenGate.tsx
  pages/
    Landing.tsx
    Experience.tsx   # composes the world + HUD for the active mode
  App.tsx
  main.tsx
```

## How the optics model works

A reduced (single-lens) eye. The eye's refractive error is one number, `errorD`
(dioptres): **positive = too much power = myopia**, **negative = too little =
hyperopia**, zero = emmetropia. The dioptric defocus seen for an object at
distance `d` metres, with stacked lenses summing to `L` and accommodation `A`, is

```
defocus(d) = errorD + L + A − 1/d
```

`defocus = 0` is sharp; blur grows with `|defocus|` and with pupil size (so the
dark scene blurs more — night dilates the pupil). The eye picks its accommodation
`A` to best focus whatever it's looking at, which is exactly why you can't make
*every* distance sharp at once with a fixed lens. The distance correction that
fixes the far point is simply `L = −errorD`, and the hot/cold meter reads how
close `L + errorD` is to zero — symmetric for plus and minus.

See [`src/optics/engine.ts`](src/optics/engine.ts) for the implementation and
[`engine.test.ts`](src/optics/engine.test.ts) for worked cases.

## The WebGL seam

The world is currently a stack of `<div>` layers in
[`Scene.tsx`](src/components/Scene.tsx), each blurred by a CSS filter whose radius
comes from the optics model. To go photoreal, replace the *internals* of `Scene`
with a Three.js / react-three-fiber view (a panorama backdrop + a few real depth
props) and move the per-pixel blur into a depth-aware post-processing pass driven
by the same `defocus()` function. **Nothing in `optics/` or `state/` needs to
change** — that boundary is the whole point of the architecture.

## Roadmap

- **Phase 0 — spike (done):** optics engine + the full interaction loop against a
  CSS placeholder world.
- **Phase 1 — MVP:** the three modes, the draggable lens rack, the live eye
  instrument, the hot/cold game loop. *(in progress)*
- **Phase 2 — WebGL:** panorama + depth props + post-processing; day/night;
  sound design; the lens-slotting animation.
- **Phase 3 — beyond:** more scenes, presbyopia/accommodation lessons, a
  dedicated mobile (landscape) pass. Astigmatism if we're feeling brave.

## License

[MIT](LICENSE).
