import { describe, it, expect } from 'vitest'
import { crossProduct, scalarTripleProduct, triangleArea3D, tetrahedronVolume, cuboidDiagonal, faceDiagonal, planeParametricPoint, axialBisectorPlane, verifyParallelEdges, verifyPerpendicularEdges, lengthViaDot, verifyPointOnFace } from './geometryShapes'
import { planeFromThreePoints } from './planes'

describe('geometryShapes', () => {
  it('cross', () => {
    expect(crossProduct({x:1,y:0,z:0},{x:0,y:1,z:0})).toEqual({x:0,y:0,z:1})
    expect(crossProduct({x:0,y:0,z:0},{x:1,y:0,z:0})).toEqual({x:0,y:0,z:0})
  })
  it('triple', () => {
    expect(scalarTripleProduct({x:2,y:0,z:0},{x:0,y:2,z:0},{x:0,y:0,z:2})).toBe(8)
    expect(scalarTripleProduct({x:1,y:0,z:0},{x:0,y:1,z:0},{x:0,y:0,z:0})).toBe(0)
  })
  it('triangle area', () => {
    expect(triangleArea3D({x:0,y:0,z:0},{x:2,y:0,z:0},{x:0,y:2,z:0})).toBe(2)
    expect(triangleArea3D({x:0,y:0,z:0},{x:1,y:0,z:0},{x:2,y:0,z:0})).toBe(0) // collinear
  })
  it('tetrahedron volume', () => {
    expect(tetrahedronVolume({x:0,y:0,z:0},{x:2,y:0,z:0},{x:0,y:2,z:0},{x:0,y:0,z:2})).toBeCloseTo(1.333,2)
    expect(tetrahedronVolume({x:0,y:0,z:0},{x:1,y:0,z:0},{x:0,y:1,z:0},{x:0,y:0,z:0})).toBe(0) // degenerate
  })
  it('cuboid diagonal', () => {
    expect(cuboidDiagonal(2,2,2)).toBeCloseTo(2*Math.sqrt(3))
    expect(cuboidDiagonal(1,1,0)).toBeCloseTo(Math.sqrt(2))
    expect(cuboidDiagonal(0,0,0)).toBe(0)
  })
  it('face diagonal', () => {
    expect(faceDiagonal(3,4)).toBe(5)
  })
  it('parametric plane', () => {
    const P={x:0,y:0,z:0}, u={x:1,y:0,z:0}, v={x:0,y:1,z:0}
    expect(planeParametricPoint(P,u,v,0.5,0.5)).toEqual({x:0.5,y:0.5,z:0})
    expect(planeParametricPoint(P,u,v,-1,-1)).toEqual({x:-1,y:-1,z:0})
  })
  it('axial bisector', () => {
    const pl = axialBisectorPlane({x:0,y:0,z:0},{x:2,y:0,z:0})!
    expect(pl.a).toBe(2); expect(pl.d).toBe(-2) // x=1
    expect(axialBisectorPlane({x:0,y:0,z:0},{x:0,y:0,z:0})).toBeNull()
  })
  it('parallel edges', () => {
    expect(verifyParallelEdges({x:2,y:0,z:0},{x:4,y:0,z:0}).parallel).toBe(true)
    expect(verifyParallelEdges({x:2,y:0,z:0},{x:0,y:2,z:0}).parallel).toBe(false)
    expect(verifyParallelEdges({x:0,y:0,z:0},{x:1,y:0,z:0}).parallel).toBe(false)
    // zero component case
    expect(verifyParallelEdges({x:0,y:2,z:0},{x:0,y:4,z:0}).parallel).toBe(true)
  })
  it('perpendicular', () => {
    expect(verifyPerpendicularEdges({x:2,y:0,z:0},{x:0,y:3,z:0})).toBe(true)
    expect(verifyPerpendicularEdges({x:1,y:0,z:0},{x:1,y:0,z:0})).toBe(false)
    expect(verifyPerpendicularEdges({x:0,y:0,z:0},{x:1,y:0,z:0})).toBe(false)
  })
  it('length via dot', () => {
    const a={x:2,y:3,z:6}
    expect(lengthViaDot(a)).toBeCloseTo(7)
    expect(lengthViaDot({x:0,y:0,z:0})).toBe(0)
  })
  it('point on face', () => {
    const plane = planeFromThreePoints({x:0,y:0,z:0},{x:1,y:0,z:0},{x:0,y:1,z:0})!
    expect(verifyPointOnFace({x:0.5,y:0.5,z:0}, plane)).toBe(true)
    expect(verifyPointOnFace({x:0,y:0,z:1}, plane)).toBe(false)
  })
  it('EPS', () => {
    expect(verifyParallelEdges({x:1,y:0,z:0},{x:1+1e-10,y:0,z:0}).parallel).toBe(true)
  })
  it('negative dimensions', () => {
    expect(cuboidDiagonal(-2,2,2)).toBeCloseTo(Math.sqrt(12))
  })
})
