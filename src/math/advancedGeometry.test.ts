import { describe, it, expect } from 'vitest'
import { planePlaneIntersectionDetailed, sphereThroughPoints, triangleCentroid, tetrahedronCentroid, verifyCentroidOnMedian } from './advancedGeometry'
import { distanceBetweenPoints } from './points'

describe('advancedGeometry', () => {
  // تقاطع مستويين
  it('intersecting', () => {
    const p1 = {a:1,b:1,c:1,d:-3}, p2 = {a:1,b:-1,c:0,d:0}
    const r = planePlaneIntersectionDetailed(p1,p2)
    expect(r.kind).toBe('intersecting')
    if (r.kind==='intersecting') {
      const { line } = r
      // تحقق P∈E1,E2 و u·n≈0
      expect(Math.abs(p1.a*line.point.x + p1.b*line.point.y + p1.c*line.point.z + p1.d) < 1e-9).toBe(true)
      expect(Math.abs(p2.a*line.point.x + p2.b*line.point.y + p2.c*line.point.z + p2.d) < 1e-9).toBe(true)
      expect(Math.abs(r.uDotN1) < 1e-9).toBe(true)
      expect(Math.abs(r.uDotN2) < 1e-9).toBe(true)
    }
  })
  it('parallel', () => {
    expect(planePlaneIntersectionDetailed({a:0,b:0,c:1,d:0},{a:0,b:0,c:1,d:-2}).kind).toBe('parallel')
  })
  it('coincident', () => {
    expect(planePlaneIntersectionDetailed({a:1,b:0,c:0,d:0},{a:2,b:0,c:0,d:0}).kind).toBe('coincident')
  })
  it('zero coeff', () => {
    expect(planePlaneIntersectionDetailed({a:0,b:0,c:0,d:0},{a:0,b:0,c:1,d:0}).kind).toBe('invalid')
  })

  // كرة
  it('known center', () => {
    const pts = [{x:1,y:0,z:0},{x:-1,y:0,z:0},{x:0,y:1,z:0},{x:0,y:0,z:1}]
    const r = sphereThroughPoints(pts)
    expect(r.kind).toBe('unique')
    if (r.kind==='unique') {
      expect(r.center.x).toBeCloseTo(0)
      expect(r.center.y).toBeCloseTo(0)
      expect(r.center.z).toBeCloseTo(0)
      expect(r.radius).toBeCloseTo(1)
      // تحقق تساوي المسافات
      for (const p of pts) expect(distanceBetweenPoints(r.center,p)).toBeCloseTo(1)
    }
  })
  it('negative points', () => {
    const pts = [{x:-2,y:0,z:0},{x:2,y:0,z:0},{x:0,y:-2,z:0},{x:0,y:0,z:-2}]
    const r = sphereThroughPoints(pts)
    expect(r.kind).toBe('unique')
  })
  it('duplicate', () => {
    // 4 مدخلات لكن 2 مكررة → 3 فريدة → غير محدد (دائرة)
    expect(sphereThroughPoints([{x:0,y:0,z:0},{x:0,y:0,z:0},{x:1,y:0,z:0},{x:0,y:1,z:0}]).kind).toBe('indeterminate')
  })
  it('coplanar 4 points', () => {
    const pts = [{x:0,y:0,z:0},{x:1,y:0,z:0},{x:0,y:1,z:0},{x:1,y:1,z:0}]
    expect(sphereThroughPoints(pts).kind).toBe('none')
  })
  it('non-symmetric', () => {
    const pts = [{x:0,y:0,z:0},{x:2,y:0,z:0},{x:0,y:2,z:0},{x:0,y:0,z:2}]
    const r = sphereThroughPoints(pts)
    expect(r.kind).toBe('unique')
    if (r.kind==='unique') expect(r.center).toEqual({x:1,y:1,z:1})
  })
  it('near EPS', () => {
    const pts = [{x:0,y:0,z:0},{x:1,y:0,z:0},{x:0,y:1,z:0},{x:0,y:0,z:1+1e-12}]
    const r = sphereThroughPoints(pts)
    expect(r.kind).toBe('unique')
  })

  // ثقل
  it('triangle centroid simple', () => {
    const G = triangleCentroid({x:0,y:0,z:0},{x:3,y:0,z:0},{x:0,y:3,z:0})
    expect(G).toEqual({x:1,y:1,z:0})
  })
  it('negative triangle', () => {
    const G = triangleCentroid({x:-3,y:0,z:0},{x:0,y:-3,z:0},{x:3,y:3,z:0})
    expect(G.x).toBeCloseTo(0)
  })
  it('random triangle', () => {
    const G = triangleCentroid({x:1,y:2,z:3},{x:4,y:5,z:6},{x:7,y:8,z:9})
    expect(G).toEqual({x:4,y:5,z:6})
  })
  it('tetrahedron', () => {
    const G = tetrahedronCentroid({x:0,y:0,z:0},{x:2,y:0,z:0},{x:0,y:2,z:0},{x:0,y:0,z:2})
    expect(G).toEqual({x:0.5,y:0.5,z:0.5})
  })
  it('verify on median', () => {
    const A={x:0,y:0,z:0}, B={x:3,y:0,z:0}, C={x:0,y:3,z:0}
    const G = triangleCentroid(A,B,C)
    expect(verifyCentroidOnMedian(G,A,B,C)).toBe(true)
  })
})
