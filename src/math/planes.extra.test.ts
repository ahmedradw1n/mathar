import { describe, it, expect } from 'vitest'
import { planeFromPointAndNormal, planeFromThreePoints, planeFromPointAndTwoVectors, planeInterceptForm, isPointOnPlane } from './planes'

describe('planes extra', () => {
  it('zero normal → null', () => {
    expect(planeFromPointAndNormal({x:0,y:0,z:0},{x:0,y:0,z:0})).toBeNull()
  })
  it('collinear points → null', () => {
    expect(planeFromThreePoints({x:0,y:0,z:0},{x:1,y:0,z:0},{x:2,y:0,z:0})).toBeNull()
  })
  it('valid three points', () => {
    const p = planeFromThreePoints({x:0,y:0,z:0},{x:1,y:0,z:0},{x:0,y:1,z:0})!
    expect(isPointOnPlane({x:0,y:0,z:0}, p)).toBe(true)
    expect(isPointOnPlane({x:1,y:0,z:0}, p)).toBe(true)
  })
  it('two vectors parallel → null', () => {
    expect(planeFromPointAndTwoVectors({x:0,y:0,z:0},{x:1,y:0,z:0},{x:2,y:0,z:0})).toBeNull()
  })
  it('two vectors non-parallel → plane', () => {
    const p = planeFromPointAndTwoVectors({x:0,y:0,z:0},{x:1,y:0,z:0},{x:0,y:1,z:0})!
    expect(p.c).not.toBe(0)
  })
  it('intercept form', () => {
    const plane = {a:1,b:1,c:1,d:-1} // x+y+z=1 → a=1,b=1,c=1
    expect(planeInterceptForm(plane)).toEqual({a:1,b:1,c:1})
    expect(planeInterceptForm({a:0,b:1,c:1,d:-1})).toBeNull()
  })
  it('isPointOnPlane EPS', () => {
    const plane = {a:0,b:0,c:1,d:0}
    expect(isPointOnPlane({x:0,y:0,z:1e-10}, plane)).toBe(true)
    expect(isPointOnPlane({x:0,y:0,z:0.001}, plane)).toBe(false)
  })
})
