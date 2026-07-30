/**
 * The optics engine — pure functions over the model in `types.ts`.
 *
 * Everything is in dioptres and metres. There is exactly one governing equation:
 *
 *     defocus(d) = errorD + L + A − 1/d
 *
 * where L is the summed lens power, A the eye's accommodation, and d the object
 * distance in metres. defocus = 0 means a sharp retinal image; the magnitude of
 * the defocus (scaled by pupil size) is the blur.
 */

import type { EyeModel, Lens, Lighting } from './types'

/** Pixels of blur per (dioptre × mm of pupil). Tuned for the placeholder scene. */
export const BLUR_PX_PER_DIOPTRE_MM = 3.1
/** Cap so extreme defocus doesn't blur the whole screen into mush. */
export const MAX_BLUR_PX = 42
/** Within this many dioptres of perfect, a correction counts as solved. */
export const SOLVE_TOLERANCE_D = 0.25

export const clamp = (x: number, lo: number, hi: number): number =>
  Math.min(hi, Math.max(lo, x))

/** Summed power of a lens stack, in dioptres. Empty stack = 0. */
export function netLensPower(lenses: readonly Lens[]): number {
  return lenses.reduce((sum, l) => sum + l.powerD, 0)
}

/** Pupil diameter (mm) for the ambient lighting — it dilates in the dark. */
export function pupilDiameterMm(lighting: Lighting): number {
  return lighting === 'night' ? 6 : 3
}

/**
 * The accommodation (≥ 0) the eye applies to best-focus an object at
 * `gazeDistanceM`, given its error and the lenses in front of it. The eye can
 * only *add* plus power, and only up to its maximum.
 */
export function accommodationFor(
  gazeDistanceM: number,
  eye: EyeModel,
  netLensD: number,
): number {
  const ideal = 1 / gazeDistanceM - eye.errorD - netLensD
  return clamp(ideal, 0, eye.accommodationMaxD)
}

/** Dioptric defocus at distance `d` for a fixed accommodation. 0 = sharp. */
export function defocusAt(
  distanceM: number,
  eye: EyeModel,
  netLensD: number,
  accommodationD: number,
): number {
  return eye.errorD + netLensD + accommodationD - 1 / distanceM
}

/** Convert a dioptric defocus into a CSS blur radius in pixels. */
export function blurPxFromDefocus(defocusD: number, pupilMm: number): number {
  return clamp(Math.abs(defocusD) * pupilMm * BLUR_PX_PER_DIOPTRE_MM, 0, MAX_BLUR_PX)
}

/** The distance-vision correction that fixes this eye's far point. */
export function idealCorrectionD(eye: EyeModel): number {
  return -eye.errorD
}

/**
 * How far the current correction is from perfect, in dioptres. Zero is ideal.
 * Symmetric: being +1 D too strong is as wrong as −1 D too weak.
 */
export function residualD(eye: EyeModel, netLensD: number): number {
  return netLensD + eye.errorD
}

/**
 * Hot/cold closeness in [0, 1] — 1 at a perfect correction, falling off
 * smoothly as the residual grows in *either* direction.
 */
export function closeness01(residual: number): number {
  const scale = 0.6 // dioptres; smaller = a tighter, twitchier meter
  return 1 / (1 + (residual / scale) ** 2)
}

export type Temperature = 'cold' | 'cool' | 'warm' | 'hot' | 'perfect'

/** A coarse band for the hot/cold meter's label and colour. */
export function temperature(residual: number): Temperature {
  const r = Math.abs(residual)
  if (r <= SOLVE_TOLERANCE_D) return 'perfect'
  if (r <= 0.75) return 'hot'
  if (r <= 1.5) return 'warm'
  if (r <= 3) return 'cool'
  return 'cold'
}

/** Is this correction within tolerance of perfect? */
export function isSolved(residual: number): boolean {
  return Math.abs(residual) <= SOLVE_TOLERANCE_D
}
