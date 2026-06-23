/**
 * The single source of truth. Raw state + actions live here; everything the UI
 * shows (blur, accommodation, hot/cold) is *derived* from this via the selector
 * helpers at the bottom, so the world and the eye diagram can never disagree.
 */

import { create } from 'zustand'
import type { EyeModel, Lens, LensKind, Lighting } from '@/optics/types'
import {
  accommodationFor,
  blurPxFromDefocus,
  closeness01,
  defocusAt,
  isSolved,
  netLensPower,
  pupilDiameterMm,
  residualD,
} from '@/optics/engine'
import { MODES, makeGamePatient, type ModeConfig, type ModeId } from '@/config/modes'

export const MAX_LENSES = 5
const LENS_MIN_D = -8
const LENS_MAX_D = 8
export const LENS_STEP_D = 0.25
const CONVEX_DEFAULT_D = 0.5
const CONCAVE_DEFAULT_D = -0.5

type View = 'landing' | 'experience'

export interface LensState {
  view: View
  modeId: ModeId | null
  eye: EyeModel
  lenses: Lens[]
  selectedLensId: string | null
  /** When false, the correction is lifted ("take the glasses off"). */
  glassesOn: boolean
  lighting: Lighting
  /** Game: has the diagnosis been revealed? (Explore: always true.) */
  revealed: boolean
  /** Game: has the patient been corrected within tolerance? */
  solved: boolean
  /** Advances each patient so a run is reproducible but varied. */
  gameSeed: number

  openMode: (id: ModeId) => void
  goLanding: () => void
  addLens: (kind: LensKind) => void
  removeLens: (id: string) => void
  selectLens: (id: string) => void
  nudgeSelectedPower: (deltaD: number) => void
  toggleGlasses: () => void
  setLighting: (lighting: Lighting) => void
  newPatient: () => void
  reveal: () => void
}

const clampPower = (d: number): number => Math.min(LENS_MAX_D, Math.max(LENS_MIN_D, d))

export const useLens = create<LensState>((set, get) => {
  /** After any change to lenses/glasses, latch a game win. */
  const settleWin = () => {
    const s = get()
    if (s.modeId !== 'game' || s.solved) return
    const net = s.glassesOn ? netLensPower(s.lenses) : 0
    if (isSolved(residualD(s.eye, net))) set({ solved: true, revealed: true })
  }

  return {
    view: 'landing',
    modeId: null,
    eye: { errorD: 0, accommodationMaxD: 3.5 },
    lenses: [],
    selectedLensId: null,
    glassesOn: true,
    lighting: 'day',
    revealed: true,
    solved: false,
    gameSeed: 1,

    openMode: (id) => {
      const mode = MODES[id]
      const isGame = id === 'game'
      const seed = get().gameSeed
      set({
        view: 'experience',
        modeId: id,
        eye: isGame ? makeGamePatient(seed) : mode.defaultEye,
        lenses: [],
        selectedLensId: null,
        glassesOn: true,
        lighting: mode.scene.lighting,
        revealed: mode.revealEye,
        solved: false,
        gameSeed: isGame ? seed + 1 : seed,
      })
    },

    goLanding: () => set({ view: 'landing', modeId: null }),

    addLens: (kind) => {
      const { lenses } = get()
      if (lenses.length >= MAX_LENSES) return
      const lens: Lens = {
        id: crypto.randomUUID(),
        kind,
        powerD: kind === 'convex' ? CONVEX_DEFAULT_D : CONCAVE_DEFAULT_D,
      }
      set({ lenses: [...lenses, lens], selectedLensId: lens.id })
      settleWin()
    },

    removeLens: (id) => {
      const { lenses, selectedLensId } = get()
      const next = lenses.filter((l) => l.id !== id)
      set({
        lenses: next,
        selectedLensId:
          selectedLensId === id ? (next[next.length - 1]?.id ?? null) : selectedLensId,
      })
      settleWin()
    },

    selectLens: (id) => set({ selectedLensId: id }),

    nudgeSelectedPower: (deltaD) => {
      const { lenses, selectedLensId } = get()
      if (!selectedLensId) return
      set({
        lenses: lenses.map((l) =>
          l.id === selectedLensId ? { ...l, powerD: clampPower(l.powerD + deltaD) } : l,
        ),
      })
      settleWin()
    },

    toggleGlasses: () => {
      set({ glassesOn: !get().glassesOn })
      settleWin()
    },

    setLighting: (lighting) => set({ lighting }),

    newPatient: () => {
      const seed = get().gameSeed
      set({
        eye: makeGamePatient(seed),
        lenses: [],
        selectedLensId: null,
        glassesOn: true,
        revealed: false,
        solved: false,
        gameSeed: seed + 1,
      })
    },

    reveal: () => set({ revealed: true }),
  }
})

// ---- derived selectors (pure; pass them to useLens) ------------------------

export const selectActiveMode = (s: LensState): ModeConfig | null =>
  s.modeId ? MODES[s.modeId] : null

export const selectGazeDistanceM = (s: LensState): number => {
  const mode = selectActiveMode(s)
  if (!mode) return 6
  const layer = mode.scene.layers.find((l) => l.id === mode.scene.gazeLayerId)
  return layer?.distanceM ?? 6
}

export const selectNetLensD = (s: LensState): number =>
  s.glassesOn ? netLensPower(s.lenses) : 0

export const selectAccommodationD = (s: LensState): number =>
  accommodationFor(selectGazeDistanceM(s), s.eye, selectNetLensD(s))

export const selectResidualD = (s: LensState): number => residualD(s.eye, selectNetLensD(s))

export const selectCloseness = (s: LensState): number => closeness01(selectResidualD(s))

/** Blur in px for a scene layer at the given distance, under current state. */
export const selectLayerBlurPx = (s: LensState, distanceM: number): number => {
  const net = selectNetLensD(s)
  const acc = selectAccommodationD(s)
  const d = defocusAt(distanceM, s.eye, net, acc)
  return blurPxFromDefocus(d, pupilDiameterMm(s.lighting))
}
