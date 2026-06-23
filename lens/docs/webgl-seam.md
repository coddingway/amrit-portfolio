# The WebGL seam — a brief for the renderer work

**Audience:** the developer (Amrit) and their AI agent building the photoreal renderer.
**Goal:** replace the placeholder world with a Three.js panorama + depth-aware blur,
**without changing the physics or the state layer.**

---

## The one rule

> Replace the **internals of [`src/components/Scene.tsx`](../src/components/Scene.tsx)** and add 3D deps.
> You **may** add new scenes/props to `src/config/modes.ts` and new **pure selectors** to
> `src/state/store.ts`. You **do not** change anything in `src/optics/`, the existing state
> logic, or the HUD wiring.

If `pnpm test` (the optics suite) passes untouched and `pnpm build` is clean after your
change, you've stayed inside the seam.

---

## Architecture in 30 seconds

**One optics model, rendered two ways.** The physics is pure TypeScript in `src/optics/`
(no UI imports, unit-tested). The Zustand store in `src/state/store.ts` is the single source
of truth. Two things render from it: the **first-person world** (`Scene.tsx` ← you're
replacing this) and the **corner eye diagram** (`EyeInstrument.tsx` — leave it).

```
 Eye + lens stack ──▶ optics engine ──┬──▶ Scene.tsx      ← YOU: panorama + depth blur
   (state/store)      (optics/)        └──▶ EyeInstrument  ← unchanged
```

Today `Scene.tsx` draws stacked `<div>` layers, each blurred by a CSS `filter: blur()` whose
radius comes from the model at that layer's real distance:

```ts
// src/components/Scene.tsx — current placeholder
const eye   = useLens((s) => s.eye)         // { errorD, accommodationMaxD }
const net   = useLens(selectNetLensD)       // summed lens power (0 if glasses off)
const acc   = useLens(selectAccommodationD) // accommodation for the gaze target
const pupil = pupilDiameterMm(lighting)     // 3mm day, 6mm night
const blurFor = (d) => blurPxFromDefocus(defocusAt(d, eye, net, acc), pupil)
```

---

## ⚠️ CPU vs GPU — read this before you write a shader

The physics in `src/optics/` is **CPU-side TypeScript**. Your depth blur runs **per-fragment
in GLSL**, which *cannot call a TypeScript function*. So you do **not** "call `defocusAt`
per pixel." Instead, split it:

The governing equation is `defocus(d) = errorD + L + A − 1/d`. Everything except `1/d` is the
same for every pixel in a frame. Collapse the per-frame part into one scalar:

```
defocus(d) = focusVergence − 1/d        where  focusVergence = errorD + L + A   (one number/frame)
```

**Add this single pure selector** (this is the allowed kind of store edit) so the per-frame
scalar stays derived from the engine — never hand-rolled:

```ts
// src/state/store.ts  — add alongside the other selectors
export const selectFocusVergenceD = (s: LensState): number =>
  s.eye.errorD + selectNetLensD(s) + selectAccommodationD(s)
```

Then the shader is exact and trivial — pass `focusVergence` and `pupilMm` as float uniforms:

```glsl
float defocusD = uFocusVergence - 1.0 / dMetres;   // dioptres; 0 = sharp
float coc      = cocFromDefocus(abs(defocusD) * uPupilMm);  // your mapping (below)
```

Three things to get right:

- **Accommodation is ONE frame-global scalar**, not per-fragment. The eye accommodates to a
  single gaze distance (`selectGazeDistanceM`) — that's the lesson. **Do not** recompute
  `accommodationFor()` from each fragment's depth; if you do, everything goes sharp and the
  lesson dies. Only `1/d` varies per fragment.
- **Reuse the equation, not the function.** Transcribing `errorD + L + A − 1/d` into GLSL is
  fine (it's a different runtime). Reimplementing *physics in TypeScript* is not. Keep
  `defocusAt()` as the CPU reference and assert your GLSL matches it at a couple of depths.
- `focusVergence` is computed once per frame on the CPU (the selector), so the shader never
  needs `errorD`, `L`, or `A` separately.

---

## The contract — inputs you read (per frame, from the store)

| What | How (non-React, see below) | Type |
| --- | --- | --- |
| Focus vergence `errorD+L+A` | `selectFocusVergenceD(useLens.getState())` *(add this selector)* | number (D) |
| Pupil diameter | `pupilDiameterMm(useLens.getState().lighting)` | number (3 day / 6 night) |
| Net lens power | `selectNetLensD(useLens.getState())` | number (0 when glasses off) |
| Accommodation | `selectAccommodationD(useLens.getState())` | number (frame-global) |
| Gaze distance (m) | `selectGazeDistanceM(useLens.getState())` | number |
| Active scene/layers | `selectActiveMode(useLens.getState())` | `ModeConfig | null` |

### Reading the store inside the `<Canvas>`

`useLens` is a vanilla Zustand store, so `.getState()` and `.subscribe()` are available.

- **Component body** (rare changes — which mode, which assets): the hook form
  `useLens(selectActiveMode)` is fine.
- **Per-frame uniforms:** read with `useLens.getState()` inside `useFrame`, or push via
  `useLens.subscribe(...)`. **Never call `useLens(selector)` (a hook) inside `useFrame`** — it
  throws or captures stale state.

```tsx
useFrame(() => {
  const s = useLens.getState()
  u.current.uFocusVergence.value = selectFocusVergenceD(s)
  u.current.uPupilMm.value = pupilDiameterMm(s.lighting)
})
```

### The physics you reuse (CPU reference — import from `@/optics/engine`)

```ts
defocusAt(distanceM, eye, netLensD, accommodationD): number  // the truth; 0 = sharp
accommodationFor(gazeDistanceM, eye, netLensD): number       // already in selectAccommodationD
pupilDiameterMm(lighting): number                            // 3 (day) / 6 (night)
netLensPower(lenses): number
```

`+errorD = myopia` (focuses short), `−errorD = hyperopia`.

### The mapping you REPLACE (renderer-specific)

`blurPxFromDefocus(defocusD, pupilMm)` returns a **CSS pixel** radius tuned for the DOM scene
(`BLUR_PX_PER_DIOPTRE_MM = 3.1`, `MAX_BLUR_PX = 42`). In WebGL, swap it for a screen-space
circle-of-confusion, still proportional to `|defocus| × pupilMm`. The falloff shape is yours;
the physical defocus is not. **Calibration anchor:** for rough parity with the placeholder,
the default eyes (`errorD ±2.5` looking at the 6 m sign, uncorrected) should read about as
soft as today's DOM version — and **cap the CoC** so extreme defocus doesn't blur to mush
(mirror `MAX_BLUR_PX`).

---

## Depth: from buffer to metres

The depth sampled in a post-pass is the nonlinear `[0,1]` value, **not metres**. You must:

- Pass camera **near/far** as uniforms and **linearize** to view-space distance (standard
  `near*far / (far − z*(far−near))`, or reconstruct via the inverse projection).
- Feed metres to `1/d`. **Guard small `d`** — the `1/d` term blows up near zero; clamp to the
  camera near plane.

## The world (hybrid) and its depth

- Panorama backdrop (drei `<Environment>` / textured sphere) + a few real depth props.
- **A panorama/skybox has no real per-fragment depth** — it sits at the far plane. Don't read
  raw skybox depth as "distance to sky." Treat the far field as the model's far distances
  (`scene.layers`: sky 60 m, treeline 30 m) or as effective infinity (`1/d → 0`). Only the
  **real props carry true per-fragment depth**.
- **Place your 3D props at the SAME metre distances as `scene.layers` in `modes.ts`**
  (the sign at **6 m** is the gaze/accommodation target via `gazeLayerId`). The sharp plane is
  computed from those distances — if your geometry disagrees with the config, the in-focus
  object won't line up. If you re-scene, update `modes.ts` distances and keep them the source
  of truth.

---

## The injection plan

1. **Add deps — React 18 compatible.** These are NOT in `package.json` yet; the project pins
   React `^18.3.1`. `@react-three/fiber@latest` (v9) **requires React 19** — do not pull it.
   Use the fiber-8 generation: `@react-three/fiber@^8`, `@react-three/drei@^9`,
   `@react-three/postprocessing@^2`, plus `three` + `@types/three`. Verify peers, then run
   `pnpm build` / `pnpm test`. *(Heads-up: this machine has a known pnpm/node Homebrew quirk —
   if pnpm dies with a `libsimdjson` dyld error, `brew reinstall pnpm` or run via `npm`.)*
   Moving to React 19 to use fiber 9 is a separate, non-trivial decision (touches `react`,
   `react-dom`, `@types/react`, `@types/react-dom`).
2. **Replace the body of `Scene.tsx`** with an r3f `<Canvas>`. Keep its name, default export,
   and that it reads the store. `Experience.tsx` renders `<Scene />` under
   `<div className="hud">` — **leave that wiring alone**; the HUD stays a DOM overlay on top.
3. **Build the world** — panorama backdrop + real depth props (CC0 assets: Poly Haven, etc.).
4. **Wire the depth-aware blur post-pass** (EffectComposer) per the CPU/GPU split above:
   `defocus = uFocusVergence − 1/d`, CoC from `|defocus| × pupilMm`, depth linearized to metres.
5. **Optional extra effects (your domain, additive):** scale/magnification, barrel/pincushion
   distortion, chromatic aberration, night halos (`pupilDiameterMm('night')` already widens the
   pupil → more blur). The **depth blur is the one that must match the model**; the rest is polish.

---

## Gotchas

- **Depth is in metres** — linearize the depth buffer first; guard small `d`.
- **Glasses-off** already returns net = 0 (`selectNetLensD`). Don't special-case it.
- **Accommodation is one frame-global scalar** (gaze target only). Don't recompute per fragment.
- **HUD is DOM, over the canvas.** `styles.css` already sets `.hud { pointer-events: none }`
  with interactive children re-enabling it — **preserve that**, or the full-bleed canvas will
  eat the lens-drag/dial events (or block camera input).
- **Scope:** spherical optics only (no astigmatism yet), web / desktop-first (mobile is later).

---

## For the AI agent — checklist

- **Edit:** the body of `src/components/Scene.tsx`. **Add** 3D deps to `package.json`. **Add**
  scenes/props to `src/config/modes.ts` (new layers with `distanceM` — keep distances the
  source of truth). **Add** pure selectors to `src/state/store.ts` (e.g. `selectFocusVergenceD`)
  — without changing existing state logic.
- **Reuse the equation, not the function:** the `optics/` functions are CPU references;
  transcribe `defocus = errorD + L + A − 1/d` (= `focusVergence − 1/d`) into GLSL.
- **Never edit:** `src/optics/**`; and don't alter existing logic in `src/state/store.ts`
  (selector additions only).
- **Don't touch:** `Experience.tsx` wiring, `EyeInstrument.tsx`, the HUD components, the
  pointer-events layering.
- **Verify before a PR:** `pnpm test` (optics suite unchanged + green) and `pnpm build` (clean).
  The optics tests are the contract; if they change, you've gone too far.

## File map

| File | Role | Touch? |
| --- | --- | --- |
| `src/optics/engine.ts`, `types.ts` | the physics | ❌ never |
| `src/state/store.ts` | source of truth + selectors | ⚠️ add selectors only |
| `src/config/modes.ts` | modes + scene layer distances | ⚠️ add scenes/props only |
| `src/components/Scene.tsx` | **the world** | ✅ this is the seam |
| `src/pages/Experience.tsx` | composes world + HUD | ❌ leave wiring |
| `src/components/EyeInstrument.tsx` | corner ray diagram | ❌ leave |
| `src/components/` TopBar · LensRack · LensTray · HotColdMeter · GlassesToggle · SmallScreenGate | HUD overlays | ❌ leave |
