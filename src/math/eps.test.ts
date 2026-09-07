import { describe, it, expect } from 'vitest'
import { approxEqual, isZero, EPS } from './eps'
import { areOrthogonal, areParallel } from './vectors'

describe('eps', () => {
  it('approxEqual', () => {
    expect(approxEqual(1,1+EPS/2)).toBe(true)
    expect(approxEqual(1,1+EPS*2)).toBe(false)
  })
  it('isZero', () => {
    expect(isZero(0)).toBe(true)
    expect(isZero(1e-10)).toBe(true)
    expect(isZero(1e-8)).toBe(false)
  })
  it('orthogonal uses EPS', () => {
    // جداء قريب من الصفر
    expect(areOrthogonal({x:1,y:0,z:0},{x:1e-10,y:1,z:0},1e-9)).toBe(true)
    expect(areOrthogonal({x:1,y:0,z:0},{x:0.001,y:1,z:0},1e-9)).toBe(false)
  })
  it('parallel uses cross', () => {
    expect(areParallel({x:2,y:0,z:0},{x:4,y:0,z:0})).toBe(true)
    expect(areParallel({x:1,y:0,z:0},{x:0,y:1,z:0})).toBe(false)
  })
})
