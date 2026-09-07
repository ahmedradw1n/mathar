import { describe, it, expect } from 'vitest'
import { planeFromPointAndNormal, planeFromThreePoints, distancePointPlane, projectPointOnPlane, intersectPlanes, bisectorPlane } from './planes'

describe('planes', () => {
  it('planeFromPointAndNormal', () => {
    const p = planeFromPointAndNormal({x:1,y:2,z:3},{x:0,y:0,z:1})!
    expect(p.a).toBe(0); expect(p.b).toBe(0); expect(p.c).toBe(1); expect(p.d).toBe(-3)
  })
  it('planeFromThreePoints', () => {
    const pl = planeFromThreePoints({x:0,y:0,z:0},{x:1,y:0,z:0},{x:0,y:1,z:0})
    expect(pl).not.toBeNull()
    expect(pl!.c).not.toBe(0)
    // z=0
    expect(Math.abs(pl!.d)).toBeCloseTo(0)
  })
  it('distancePointPlane', () => {
    const pl = {a:0,b:0,c:1,d:-2} // z=2
    expect(distancePointPlane({x:0,y:0,z:5}, pl)).toBeCloseTo(3)
  })
  it('distancePointPlane invalid normal → null', () => {
    const pl = {a:0,b:0,c:0,d:0}
    expect(distancePointPlane({x:0,y:0,z:5}, pl)).toBeNull()
  })
  it('projectPointOnPlane', () => {
    const pl = {a:0,b:0,c:1,d:0} // z=0
    const h = projectPointOnPlane({x:1,y:2,z:5}, pl)!
    expect(h).toEqual({x:1,y:2,z:0})
  })
  it('projectPointOnPlane invalid → null', () => {
    const pl = {a:0,b:0,c:0,d:0}
    expect(projectPointOnPlane({x:1,y:2,z:5}, pl)).toBeNull()
  })
  it('intersectPlanes', () => {
    const p1 = {a:1,b:0,c:0,d:0} // x=0
    const p2 = {a:0,b:1,c:0,d:0} // y=0
    const line = intersectPlanes(p1,p2)
    expect(line).not.toBeNull()
    // تقاطع x=0 و y=0 هو محور z
    expect(line!.direction.x).toBeCloseTo(0)
    expect(line!.direction.y).toBeCloseTo(0)
  })
  it('bisectorPlane', () => {
    const bp = bisectorPlane({x:0,y:0,z:0},{x:2,y:0,z:0})!
    // منتصف (1,0,0) وناظم (2,0,0) => x=1 => 1*x -1 =0
    expect(bp.a).toBe(2); expect(bp.d).toBeCloseTo(-2)
  })
})
