import { describe, it, expect } from 'vitest'
import { add, sub, scale, dot, cross, length, angleBetweenDeg, areParallel, areOrthogonal, vectorBetweenPoints, normalize } from './vectors'

describe('vectors', () => {
  it('add/sub/scale', () => {
    expect(add({x:1,y:2,z:3},{x:4,y:5,z:6})).toEqual({x:5,y:7,z:9})
    expect(sub({x:4,y:5,z:6},{x:1,y:2,z:3})).toEqual({x:3,y:3,z:3})
    expect(scale({x:1,y:2,z:3},2)).toEqual({x:2,y:4,z:6})
  })
  it('dot', () => {
    expect(dot({x:1,y:2,z:3},{x:4,y:5,z:6})).toBe(32)
    expect(dot({x:1,y:0,z:0},{x:0,y:1,z:0})).toBe(0)
  })
  it('cross', () => {
    const c = cross({x:1,y:0,z:0},{x:0,y:1,z:0})
    expect(c).toEqual({x:0,y:0,z:1})
  })
  it('length', () => {
    expect(length({x:2,y:3,z:6})).toBe(7)
  })
  it('angle', () => {
    expect(angleBetweenDeg({x:1,y:0,z:0},{x:0,y:1,z:0})).toBeCloseTo(90)
    expect(angleBetweenDeg({x:1,y:0,z:0},{x:1,y:0,z:0})).toBeCloseTo(0)
    expect(angleBetweenDeg({x:1,y:0,z:0},{x:-1,y:0,z:0})).toBeCloseTo(180)
  })
  it('orthogonal/parallel', () => {
    expect(areOrthogonal({x:1,y:0,z:0},{x:0,y:1,z:0})).toBe(true)
    expect(areOrthogonal({x:1,y:0,z:0},{x:1,y:0,z:0})).toBe(false)
    expect(areParallel({x:2,y:0,z:0},{x:4,y:0,z:0})).toBe(true)
    expect(areParallel({x:1,y:0,z:0},{x:0,y:1,z:0})).toBe(false)
  })
  it('vectorBetweenPoints', () => {
    expect(vectorBetweenPoints({x:1,y:2,z:1},{x:4,y:5,z:3})).toEqual({x:3,y:3,z:2})
  })
  it('normalize', () => {
    const v = normalize({x:3,y:0,z:0})
    expect(v.x).toBeCloseTo(1)
    expect(length(v)).toBeCloseTo(1)
  })
})
