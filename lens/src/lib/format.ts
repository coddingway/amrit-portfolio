import type { EyeModel } from '@/optics/types'

/** Format a dioptre value with an explicit sign (uses a true minus glyph). */
export function formatDioptres(d: number, withUnit = true): string {
  const sign = d >= 0 ? '+' : '−'
  const body = `${sign}${Math.abs(d).toFixed(2)}`
  return withUnit ? `${body} D` : body
}

/** Plain-language description of an eye, for the reveal/explore label. */
export function describeEye(eye: EyeModel): string {
  const e = eye.errorD
  if (Math.abs(e) <= 0.25) return 'Emmetropic — needs no correction'
  if (e > 0) return `Nearsighted · ${formatDioptres(-e)} correction`
  return `Farsighted · ${formatDioptres(-e)} correction`
}
