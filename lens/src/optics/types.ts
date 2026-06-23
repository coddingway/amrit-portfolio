/**
 * Core optics types. Pure data — no UI, no rendering.
 */

/** Converging (convex, +D) or diverging (concave, −D). */
export type LensKind = 'convex' | 'concave'

/** A single trial lens in the stack. */
export interface Lens {
  id: string
  kind: LensKind
  /** Power in dioptres. Convex > 0, concave < 0. */
  powerD: number
}

/**
 * A reduced (single-lens) eye.
 *
 * `errorD` is the refractive error in dioptres:
 *   > 0  too much power  → myopia    (near is fine, far is blurry)
 *   < 0  too little power → hyperopia (far needs effort, near is hard)
 *   = 0  emmetropia
 *
 * The distance correction that fixes the far point is exactly `-errorD`.
 */
export interface EyeModel {
  errorD: number
  /** Maximum accommodation the eye can add, in dioptres (drops with age). */
  accommodationMaxD: number
}

export type Lighting = 'day' | 'night'

/** A renderable layer of the placeholder world, tagged with its real distance. */
export interface SceneLayer {
  id: string
  label: string
  /** Distance from the eye, in metres. Use a large value for "far". */
  distanceM: number
  kind: 'sky' | 'backdrop' | 'sign' | 'prop'
}

export interface SceneConfig {
  id: string
  lighting: Lighting
  layers: SceneLayer[]
  /** Which layer the eye fixates on (and accommodates for) by default. */
  gazeLayerId: string
}
