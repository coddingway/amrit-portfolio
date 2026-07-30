import { describe, it, expect } from 'vitest'
import type { EyeModel, Lens } from './types'
import {
  accommodationFor,
  blurPxFromDefocus,
  closeness01,
  defocusAt,
  idealCorrectionD,
  isSolved,
  netLensPower,
  pupilDiameterMm,
  residualD,
  temperature,
} from './engine'

const myope: EyeModel = { errorD: 2, accommodationMaxD: 3.5 }
const hyperope: EyeModel = { errorD: -2, accommodationMaxD: 3.5 }
const lens = (powerD: number): Lens => ({ id: 'x', kind: powerD >= 0 ? 'convex' : 'concave', powerD })

describe('netLensPower', () => {
  it('sums the stack and is 0 when empty', () => {
    expect(netLensPower([])).toBe(0)
    expect(netLensPower([lens(-1), lens(-0.5)])).toBeCloseTo(-1.5)
  })
})

describe('defocus', () => {
  it('a relaxed myope sees their far point sharply but not infinity', () => {
    // far point of a +2 D myope is 1/2 = 0.5 m, relaxed (A = 0)
    expect(defocusAt(0.5, myope, 0, 0)).toBeCloseTo(0)
    expect(defocusAt(1000, myope, 0, 0)).toBeCloseTo(2, 1) // ~infinity → blurry
  })

  it('the ideal correction brings infinity into focus', () => {
    const L = idealCorrectionD(myope) // -2
    expect(L).toBe(-2)
    expect(defocusAt(1000, myope, L, 0)).toBeCloseTo(0, 1)
  })

  it('hyperopia is corrected by a positive lens', () => {
    expect(idealCorrectionD(hyperope)).toBe(2)
    expect(defocusAt(1000, hyperope, 2, 0)).toBeCloseTo(0, 1)
  })
})

describe('accommodation', () => {
  it('is never negative and is capped at the eye maximum', () => {
    expect(accommodationFor(1000, myope, 0)).toBe(0) // would want negative → clamped
    expect(accommodationFor(0.1, hyperope, 0)).toBe(hyperope.accommodationMaxD)
  })

  it('lets a corrected eye focus the gaze target exactly', () => {
    const L = idealCorrectionD(myope)
    const A = accommodationFor(6, myope, L)
    expect(defocusAt(6, myope, L, A)).toBeCloseTo(0)
  })
})

describe('blur', () => {
  it('is zero at perfect focus and grows with the pupil', () => {
    expect(blurPxFromDefocus(0, 3)).toBe(0)
    expect(blurPxFromDefocus(1, 6)).toBeGreaterThan(blurPxFromDefocus(1, 3))
  })

  it('dilates the pupil at night', () => {
    expect(pupilDiameterMm('night')).toBeGreaterThan(pupilDiameterMm('day'))
  })
})

describe('residual / hot-cold', () => {
  it('is zero at the ideal correction, for both signs', () => {
    expect(residualD(myope, idealCorrectionD(myope))).toBeCloseTo(0)
    expect(residualD(hyperope, idealCorrectionD(hyperope))).toBeCloseTo(0)
  })

  it('closeness peaks at the ideal and is symmetric', () => {
    expect(closeness01(0)).toBeCloseTo(1)
    expect(closeness01(1)).toBeCloseTo(closeness01(-1))
    expect(closeness01(0.5)).toBeGreaterThan(closeness01(2))
  })

  it('marks within-tolerance corrections as solved', () => {
    expect(isSolved(0.2)).toBe(true)
    expect(isSolved(-0.2)).toBe(true)
    expect(isSolved(0.5)).toBe(false)
    expect(temperature(0.1)).toBe('perfect')
    expect(temperature(5)).toBe('cold')
  })
})
