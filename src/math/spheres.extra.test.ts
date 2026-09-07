import { describe, it, expect } from 'vitest'
import { sphereFromCenterRadius, sphereFromCenterAndPoint, sphereFromExpandedEquation, sphereToExpandedEquation, pointSphereRelation, spherePlaneIntersectionDetailed, verifyCirclePoint } from './spheres'
import type { Sphere, Plane } from './types'

describe('spheres extra', () => {
  it('center signs', () => {
    expect(sphereFromCenterRadius({x:2,y:-3,z:1},5)!.center).toEqual({x:2,y:-3,z:1})
    expect(sphereFromCenterRadius({x:-2,y:3,z:-1},4)!.center).toEqual({x:-2,y:3,z:-1})
  })
  it('r zero/negative invalid', () => {
    expect(sphereFromCenterRadius({x:0,y:0,z:0},0)).toBeNull()
    expect(sphereFromCenterRadius({x:0,y:0,z:0},-1)).toBeNull()
  })
  it('expanded ↔ standard', () => {
    const s: Sphere = { center: {x:2,y:-3,z:1}, radius:5 }
    const exp = sphereToExpandedEquation(s)
    // exp: -4,6,-2, (4+9+1-25)=-11
    expect(exp.A).toBe(-4); expect(exp.B).toBe(6); expect(exp.C).toBe(-2); expect(exp.D).toBe(-11)
    const rec = sphereFromExpandedEquation(exp.A, exp.B, exp.C, exp.D)
    expect(rec.sphere!.center).toEqual(s.center)
    expect(rec.sphere!.radius).toBeCloseTo(5)
  })
  it('expanded sign', () => {
    // (x+2)^2+(y-3)^2+(z+1)^2=16 → center (-2,3,-1)
    const rec = sphereFromExpandedEquation(4,-6,2, -2) // A=4→ -2, B=-6→3, C=2→-1, D?
    // Compute: center -2,3,-1 → A=4,B=-6,C=2, D= (-2)^2+3^2+(-1)^2 -16 =4+9+1-16=-2
    expect(rec.center).toEqual({x:-2,y:3,z:-1})
    expect(rec.sphere!.radius).toBe(4)
  })
  it('r2 <0 empty', () => {
    // x²+y²+z²+... D كبير → r2 سالب
    const rec = sphereFromExpandedEquation(0,0,0,10)
    expect(rec.kind).toBe('empty')
    expect(rec.sphere).toBeNull()
  })
  it('r2=0 point', () => {
    const rec = sphereFromExpandedEquation(0,0,0,0)
    expect(rec.kind).toBe('point')
  })
  it('point relation', () => {
    const s: Sphere = { center:{x:0,y:0,z:0}, radius:2 }
    expect(pointSphereRelation({x:2,y:0,z:0}, s)).toBe('onSurface')
    expect(pointSphereRelation({x:1,y:0,z:0}, s)).toBe('inside')
    expect(pointSphereRelation({x:3,y:0,z:0}, s)).toBe('outside')
    expect(pointSphereRelation({x:2+1e-10,y:0,z:0}, s)).toBe('onSurface')
  })
  it('center and point', () => {
    const s = sphereFromCenterAndPoint({x:1,y:1,z:1},{x:1,y:1,z:4})!
    expect(s.radius).toBe(3)
  })
  it('sphere-plane disjoint/tangent/intersecting', () => {
    const s: Sphere = { center:{x:0,y:0,z:0}, radius:2 }
    // plane z=0 → delta=0 → intersecting
    expect(spherePlaneIntersectionDetailed(s,{a:0,b:0,c:1,d:0}).kind).toBe('intersecting')
    // z=2 → tangent
    expect(spherePlaneIntersectionDetailed(s,{a:0,b:0,c:1,d:-2}).kind).toBe('tangent')
    // z=3 → disjoint
    expect(spherePlaneIntersectionDetailed(s,{a:0,b:0,c:1,d:-3}).kind).toBe('disjoint')
  })
  it('plane through center rho=r', () => {
    const s: Sphere = { center:{x:0,y:0,z:0}, radius:3 }
    const det = spherePlaneIntersectionDetailed(s,{a:0,b:0,c:1,d:0}) as any
    expect(det.rho).toBeCloseTo(3)
  })
  it('negative plane coefficients', () => {
    const s: Sphere = { center:{x:0,y:0,z:0}, radius:2 }
    const det = spherePlaneIntersectionDetailed(s,{a:0,b:0,c:-1,d:0}) as any
    expect(det.kind).toBe('intersecting')
  })
  it('inclined center negative', () => {
    const s: Sphere = { center:{x:-1,y:-1,z:-1}, radius:2 }
    const plane: Plane = {a:1,b:1,c:1,d:0} // x+y+z=0, delta = |-3|/√3 =1.732 <2 → intersecting
    expect(spherePlaneIntersectionDetailed(s,plane).kind).toBe('intersecting')
  })
  it('non-unit normal', () => {
    const s: Sphere = { center:{x:0,y:0,z:0}, radius:2 }
    // plane 2x=0 same as x=0
    expect(spherePlaneIntersectionDetailed(s,{a:2,b:0,c:0,d:0}).kind).toBe('intersecting')
  })
  it('zero normal invalid', () => {
    const s: Sphere = { center:{x:0,y:0,z:0}, radius:2 }
    expect(spherePlaneIntersectionDetailed(s,{a:0,b:0,c:0,d:0}).kind).toBe('invalid')
    expect(spherePlaneIntersectionDetailed(null as any,{a:0,b:0,c:1,d:0}).kind).toBe('invalid')
  })
  it('near EPS tangent', () => {
    const s: Sphere = { center:{x:0,y:0,z:0}, radius:2 }
    const plane: Plane = {a:0,b:0,c:1,d:-2+1e-10}
    expect(spherePlaneIntersectionDetailed(s,plane).kind).toBe('tangent')
  })
  it('rho formula', () => {
    const s: Sphere = { center:{x:0,y:0,z:0}, radius:5 }
    const plane: Plane = {a:0,b:0,c:1,d:-3} // delta 3
    const det = spherePlaneIntersectionDetailed(s,plane) as any
    expect(det.rho).toBeCloseTo(4) // √(25-9)=4
  })
  it('verify circle point', () => {
    const s: Sphere = { center:{x:0,y:0,z:0}, radius:5 }
    const plane: Plane = {a:0,b:0,c:1,d:0} // z=0, H(0,0,0), rho 5
    const det = spherePlaneIntersectionDetailed(s,plane) as any
    expect(det.kind).toBe('intersecting')
    // نقطة على الدائرة (5,0,0)
    const pt = {x:5,y:0,z:0}
    const v = verifyCirclePoint(pt, s, plane)
    expect(v.onPlane).toBe(true)
    expect(v.onSphere).toBe(true)
    // نقطة (3,4,0) أيضا
    const pt2 = {x:3,y:4,z:0}
    const v2 = verifyCirclePoint(pt2, s, plane)
    expect(v2.onPlane).toBe(true)
    expect(v2.onSphere).toBe(true)
  })
  it('delta>r no circle', () => {
    const s: Sphere = { center:{x:0,y:0,z:0}, radius:2 }
    const plane: Plane = {a:0,b:0,c:1,d:-5}
    const det = spherePlaneIntersectionDetailed(s,plane)
    expect(det.kind).toBe('disjoint')
    // rho not defined
  })
})
