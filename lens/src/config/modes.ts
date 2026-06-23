/**
 * The three modes are *data*, not code paths. Each one configures the same
 * screen with an eye, a scene, and which HUD pieces show. Add a mode by adding
 * an entry here — don't branch the components.
 */

import type { EyeModel, SceneConfig } from '@/optics/types'

export type ModeId = 'nearsighted' | 'farsighted' | 'game'

/** Shared park scene. One readable far target (the sign) plus a near prop, so
 *  the "you can't focus both at once" lesson is reachable. */
export const PARK_SCENE: SceneConfig = {
  id: 'park-day',
  lighting: 'day',
  gazeLayerId: 'sign',
  layers: [
    { id: 'sky', label: 'Sky', distanceM: 60, kind: 'sky' },
    { id: 'treeline', label: 'Treeline', distanceM: 30, kind: 'backdrop' },
    { id: 'sign', label: 'Park sign', distanceM: 6, kind: 'sign' },
    { id: 'bench', label: 'Bench (near)', distanceM: 0.6, kind: 'prop' },
  ],
}

export interface ModeConfig {
  id: ModeId
  /** Card title on the landing page. */
  cardTitle: string
  /** Card blurb on the landing page. */
  cardBlurb: string
  /** Objective shown in the HUD while playing. */
  objective: string
  /** Eye used by default (the game overwrites this with a random patient). */
  defaultEye: EyeModel
  /** Whether the diagnosis is shown up front (explore) or hidden (game). */
  revealEye: boolean
  /** Whether the hot/cold meter is shown. */
  showMeter: boolean
  scene: SceneConfig
}

export const MODES: Record<ModeId, ModeConfig> = {
  nearsighted: {
    id: 'nearsighted',
    cardTitle: 'Explore Nearsightedness',
    cardBlurb: 'A myopic eye — the far world is soft. Find the lens that sharpens it.',
    objective: 'Nearsightedness · sharpen the distance',
    defaultEye: { errorD: 2.5, accommodationMaxD: 3.5 },
    revealEye: true,
    showMeter: false,
    scene: PARK_SCENE,
  },
  farsighted: {
    id: 'farsighted',
    cardTitle: 'Explore Farsightedness',
    cardBlurb: 'A hyperopic eye straining to focus. A converging lens does the work for it.',
    objective: 'Farsightedness · ease the strain',
    defaultEye: { errorD: -2.5, accommodationMaxD: 2 },
    revealEye: true,
    showMeter: false,
    scene: PARK_SCENE,
  },
  game: {
    id: 'game',
    cardTitle: 'Game mode',
    cardBlurb: "An unknown prescription. No label — just a hot/cold meter. Diagnose the patient.",
    objective: 'Diagnose the patient',
    defaultEye: { errorD: 0, accommodationMaxD: 3.5 },
    revealEye: false,
    showMeter: true,
    scene: PARK_SCENE,
  },
}

/** Easy patients — all solvable with one or two lenses; near-zero errors allowed. */
const EASY_ERRORS = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2]

/** Deterministic patient from a seed, so a run is reproducible. */
export function makeGamePatient(seed: number): EyeModel {
  const errorD = EASY_ERRORS[Math.abs(Math.trunc(seed)) % EASY_ERRORS.length]
  return { errorD, accommodationMaxD: 3.5 }
}
