import { describe, it, expect } from 'vitest'
import { distanceBetweenPoints } from './points'
import { projectionPointOnLine, distancePointLine, projectionPointOnPlane, distancePointPlane, verifyProjectionOnLine, verifyProjectionOnPlane } from './distances'
import type { Line3, Plane } from './types'

describe('distances extra', () => {
  // نقطة-نقطة
  it('point-point', () => {
    expect(distanceBetweenPoints({x:0,y:0,z:0},{x:1,y:2,z:2})).toBe(3)
    expect(distanceBetweenPoints({x:-1,y:-2,z:-3},{x:1,y:2,z:3})).toBeCloseTo(Math.sqrt(4+16+36))
  })
  // نقطة-مستقيم
  it('on line', () => {
    const line: Line3 = { point:{x:0,y:0,z:0}, direction:{x:1,y:0,z:0} }
    const p = {x:2,y:0,z:0}
    expect(projectionPointOnLine(p, line)).toEqual({x:2,y:0,z:0})
    expect(distancePointLine(p, line)).toBeCloseTo(0)
  })
  it('off line', () => {
    const line: Line3 = { point:{x:0,y:0,z:0}, direction:{x:1,y:0,z:0} }
    const p = {x:0,y:3,z:4}
    expect(distancePointLine(p, line)).toBeCloseTo(5)
  })
  it('negative direction', () => {
    const line: Line3 = { point:{x:0,y:0,z:0}, direction:{x:-1,y:0,z:0} }
    expect(distancePointLine({x:0,y:1,z:0}, line)).toBeCloseTo(1)
  })
  it('non-unit direction', () => {
    const line: Line3 = { point:{x:0,y:0,z:0}, direction:{x:2,y:0,z:0} }
    expect(distancePointLine({x:0,y:3,z:4}, line)).toBeCloseTo(5)
  })
  it('zero direction → null', () => {
    const line: Line3 = { point:{x:0,y:0,z:0}, direction:{x:0,y:0,z:0} }
    expect(projectionPointOnLine({x:1,y:0,z:0}, line)).toBeNull()
    expect(distancePointLine({x:1,y:0,z:0}, line)).toBeNull()
  })
  it('near EPS', () => {
    const line: Line3 = { point:{x:0,y:0,z:0}, direction:{x:1,y:0,z:0} }
    const p = {x:0,y:1e-10,z:0}
    expect(distancePointLine(p, line)!).toBeCloseTo(0, 8)
  })
  it('verify on line', () => {
    const line: Line3 = { point:{x:0,y:0,z:0}, direction:{x:1,y:0,z:0} }
    const a = {x:2,y:3,z:0}
    const h = projectionPointOnLine(a, line)!
    const v = verifyProjectionOnLine(a, h, line)
    expect(v.onLine).toBe(true)
    expect(v.perpendicular).toBe(true)
  })
  // نقطة-مستوى
  it('on plane', () => {
    const plane: Plane = {a:0,b:0,c:1,d:0}
    const p = {x:1,y:2,z:0}
    expect(projectionPointOnPlane(p, plane)).toEqual({x:1,y:2,z:0})
    expect(distancePointPlane(p, plane)).toBeCloseTo(0)
  })
  it('off plane', () => {
    const plane: Plane = {a:0,b:0,c:1,d:0}
    expect(distancePointPlane({x:0,y:0,z:5}, plane)).toBeCloseTo(5)
  })
  it('inclined plane', () => {
    const plane: Plane = {a:1,b:1,c:1,d:-3} // x+y+z=3
    expect(distancePointPlane({x:0,y:0,z:0}, plane)).toBeCloseTo(3/Math.sqrt(3))
  })
  it('negative coefficients', () => {
    const plane: Plane = {a:-1,b:0,c:0,d:0}
    expect(distancePointPlane({x:2,y:0,z:0}, plane)).toBeCloseTo(2)
  })
  it('both sides', () => {
    const plane: Plane = {a:0,b:0,c:1,d:0}
    expect(distancePointPlane({x:0,y:0,z:2}, plane)).toBeCloseTo(2)
    expect(distancePointPlane({x:0,y:0,z:-2}, plane)).toBeCloseTo(2)
  })
  it('zero normal → null', () => {
    const plane: Plane = {a:0,b:0,c:0,d:0}
    expect(projectionPointOnPlane({x:1,y:2,z:3}, plane)).toBeNull()
    expect(distancePointPlane({x:1,y:2,z:3}, plane)).toBeNull()
  })
  it('near EPS plane', () => {
    const plane: Plane = {a:0,b:0,c:1,d:0}
    expect(distancePointPlane({x:0,y:0,z:1e-10}, plane)!).toBeCloseTo(0, 8)
  })
  it('verify on plane', () => {
    const plane: Plane = {a:0,b:0,c:1,d:0}
    const a = {x:1,y:2,z:5}
    const h = projectionPointOnPlane(a, plane)!
    const v = verifyProjectionOnPlane(a, h, plane)
    expect(v.onPlane).toBe(true)
    expect(v.parallel).toBe(true)
  })
})
