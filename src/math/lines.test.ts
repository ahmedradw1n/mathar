import { describe, it, expect } from 'vitest'
import { lineFromTwoPoints, lineFromPointAndDirection, directionBetweenPoints, isPointOnLine, closestPointOnLine, classifyLineLine, lineIntersection, isPointOnSegment, isPointOnRay, pointOnLine, parametricLineCoordinates } from './lines'

describe('lines', () => {
  it('lineFromTwoPoints valid', () => {
    const l = lineFromTwoPoints({x:0,y:0,z:0},{x:1,y:2,z:3})!
    expect(l.direction).toEqual({x:1,y:2,z:3})
  })
  it('lineFromTwoPoints degenerate A==B → null', () => {
    expect(lineFromTwoPoints({x:1,y:2,z:3},{x:1,y:2,z:3})).toBeNull()
    expect(lineFromTwoPoints({x:0,y:0,z:0},{x:1e-12,y:0,z:0})).toBeNull()
  })
  it('lineFromPointAndDirection', () => {
    expect(lineFromPointAndDirection({x:0,y:0,z:0},{x:1,y:0,z:0})).not.toBeNull()
    expect(lineFromPointAndDirection({x:0,y:0,z:0},{x:0,y:0,z:0})).toBeNull()
  })
  it('directionBetweenPoints', () => {
    expect(directionBetweenPoints({x:1,y:2,z:1},{x:4,y:5,z:3})).toEqual({x:3,y:3,z:2})
    expect(directionBetweenPoints({x:0,y:0,z:0},{x:0,y:0,z:0})).toBeNull()
  })
  it('isPointOnLine', () => {
    const l = lineFromTwoPoints({x:0,y:0,z:0},{x:2,y:0,z:0})!
    expect(isPointOnLine({x:4,y:0,z:0}, l)).toBe(true)
    expect(isPointOnLine({x:0,y:1,z:0}, l)).toBe(false)
  })
  it('pointOnLine at t values', () => {
    const l = lineFromPointAndDirection({x:1,y:2,z:3},{x:2,y:-1,z:4})!
    expect(pointOnLine(l, 0)).toEqual({x:1,y:2,z:3})
    expect(pointOnLine(l, 1)).toEqual({x:3,y:1,z:7})
    expect(pointOnLine(l, -1)).toEqual({x:-1,y:3,z:-1})
    expect(pointOnLine(l, -2)).toEqual({x:-3,y:4,z:-5})
    expect(pointOnLine(l, 2)).toEqual({x:5,y:0,z:11})
  })
  it('parametricLineCoordinates', () => {
    const l = lineFromPointAndDirection({x:1,y:2,z:3},{x:2,y:-1,z:4})!
    const c = parametricLineCoordinates(l)
    expect(c.x).toContain('1')
    expect(c.vector).toContain('⃗x')
  })
  it('closestPointOnLine', () => {
    const l = lineFromTwoPoints({x:0,y:0,z:0},{x:1,y:0,z:0})!
    expect(closestPointOnLine({x:5,y:3,z:4}, l)).toEqual({x:5,y:0,z:0})
  })
  it('isPointOnSegment', () => {
    const a = {x:0,y:0,z:0}, b = {x:2,y:0,z:0}
    expect(isPointOnSegment({x:0,y:0,z:0}, a, b)).toBe(true)
    expect(isPointOnSegment({x:1,y:0,z:0}, a, b)).toBe(true)
    expect(isPointOnSegment({x:2,y:0,z:0}, a, b)).toBe(true)
    expect(isPointOnSegment({x:1,y:0,z:0}, a, b)).toBe(true) // 0.5
    expect(isPointOnSegment({x:3,y:0,z:0}, a, b)).toBe(false) // t>1
    expect(isPointOnSegment({x:-1,y:0,z:0}, a, b)).toBe(false) // t<0
  })
  it('isPointOnRay', () => {
    const o = {x:0,y:0,z:0}, dir = {x:1,y:0,z:0}
    expect(isPointOnRay({x:0,y:0,z:0}, o, dir)).toBe(true) // t=0
    expect(isPointOnRay({x:5,y:0,z:0}, o, dir)).toBe(true) // t>0
    expect(isPointOnRay({x:-1,y:0,z:0}, o, dir)).toBe(false) // t<0
    expect(isPointOnRay({x:0,y:0,z:0}, o, {x:0,y:0,z:0})).toBe(false) // zero dir
  })
  it('classify parallel/coincident/intersecting/skew', () => {
    const l1 = lineFromTwoPoints({x:0,y:0,z:0},{x:1,y:0,z:0})!
    const l2 = lineFromTwoPoints({x:0,y:1,z:0},{x:1,y:1,z:0})!
    expect(classifyLineLine(l1,l2)).toBe('parallel')
    const l3 = lineFromTwoPoints({x:0,y:0,z:0},{x:1,y:0,z:0})!
    const l4 = lineFromTwoPoints({x:2,y:0,z:0},{x:3,y:0,z:0})!
    expect(classifyLineLine(l3,l4)).toBe('coincident')
    const l5 = lineFromTwoPoints({x:0,y:0,z:0},{x:1,y:0,z:0})!
    const l6 = lineFromTwoPoints({x:0,y:0,z:0},{x:0,y:1,z:0})!
    expect(classifyLineLine(l5,l6)).toBe('intersecting')
    const l9 = lineFromTwoPoints({x:0,y:0,z:0},{x:1,y:0,z:0})!
    const l10 = lineFromTwoPoints({x:0,y:1,z:1},{x:0,y:2,z:1})!
    expect(classifyLineLine(l9,l10)).toBe('skew')
  })
  it('lineIntersection', () => {
    const l1 = lineFromTwoPoints({x:0,y:0,z:0},{x:1,y:0,z:0})!
    const l2 = lineFromTwoPoints({x:0,y:0,z:0},{x:0,y:1,z:0})!
    expect(lineIntersection(l1,l2)).toEqual({x:0,y:0,z:0})
  })
})
