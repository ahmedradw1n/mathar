import { describe, it, expect } from 'vitest'
import { classifyLineLineRelation, classifyLinePlaneRelation, classifyPlanePlaneRelation } from './relations'

describe('relations', () => {
  // Line-Line 4 حالات
  it('coincident', () => {
    const l1 = { point: {x:0,y:0,z:0}, direction: {x:1,y:0,z:0} }
    const l2 = { point: {x:1,y:0,z:0}, direction: {x:2,y:0,z:0} }
    expect(classifyLineLineRelation(l1,l2).kind).toBe('coincident')
  })
  it('parallel', () => {
    const l1 = { point: {x:0,y:0,z:0}, direction: {x:1,y:0,z:0} }
    const l2 = { point: {x:0,y:1,z:0}, direction: {x:1,y:0,z:0} }
    expect(classifyLineLineRelation(l1,l2).kind).toBe('parallel')
  })
  it('intersecting', () => {
    const l1 = { point: {x:0,y:0,z:0}, direction: {x:1,y:0,z:0} }
    const l2 = { point: {x:0,y:0,z:0}, direction: {x:0,y:1,z:0} }
    const r = classifyLineLineRelation(l1,l2)
    expect(r.kind).toBe('intersecting')
    if (r.kind==='intersecting') expect(r.point).toEqual({x:0,y:0,z:0})
  })
  it('skew', () => {
    const l1 = { point: {x:0,y:0,z:0}, direction: {x:1,y:0,z:0} }
    const l2 = { point: {x:0,y:1,z:1}, direction: {x:0,y:1,z:0} }
    expect(classifyLineLineRelation(l1,l2).kind).toBe('skew')
  })
  it('zero direction', () => {
    const l1 = { point: {x:0,y:0,z:0}, direction: {x:0,y:0,z:0} }
    const l2 = { point: {x:0,y:0,z:0}, direction: {x:1,y:0,z:0} }
    expect(classifyLineLineRelation(l1,l2).kind).toBe('parallel')
  })

  // Line-Plane 3 حالات
  it('line-plane intersecting', () => {
    const line = { point: {x:0,y:0,z:2}, direction: {x:0,y:0,z:-1} }
    const plane = {a:0,b:0,c:1,d:0}
    const r = classifyLinePlaneRelation(line, plane)
    expect(r.kind).toBe('intersecting')
    if (r.kind==='intersecting') expect(r.point.z).toBeCloseTo(0)
  })
  it('parallel', () => {
    const line = { point: {x:0,y:0,z:1}, direction: {x:1,y:0,z:0} }
    const plane = {a:0,b:0,c:1,d:0}
    expect(classifyLinePlaneRelation(line, plane).kind).toBe('parallel')
  })
  it('contained', () => {
    const line = { point: {x:0,y:0,z:0}, direction: {x:1,y:0,z:0} }
    const plane = {a:0,b:0,c:1,d:0}
    expect(classifyLinePlaneRelation(line, plane).kind).toBe('contained')
  })
  it('zero normal', () => {
    const line = { point: {x:0,y:0,z:0}, direction: {x:1,y:0,z:0} }
    const plane = {a:0,b:0,c:0,d:0}
    expect(classifyLinePlaneRelation(line, plane).kind).toBe('parallel')
  })

  // Plane-Plane 3 حالات
  it('coincident', () => {
    expect(classifyPlanePlaneRelation({a:1,b:0,c:0,d:0},{a:2,b:0,c:0,d:0}).kind).toBe('coincident')
  })
  it('parallel', () => {
    expect(classifyPlanePlaneRelation({a:0,b:0,c:1,d:0},{a:0,b:0,c:1,d:-2}).kind).toBe('parallel')
  })
  it('intersecting', () => {
    const r = classifyPlanePlaneRelation({a:1,b:0,c:0,d:0},{a:0,b:1,c:0,d:0})
    expect(r.kind).toBe('intersecting')
    if (r.kind==='intersecting') {
      expect(r.line.direction.x).toBeCloseTo(0)
      expect(r.line.direction.y).toBeCloseTo(0)
    }
  })
  it('edge: near EPS', () => {
    const l1 = { point: {x:0,y:0,z:0}, direction: {x:1,y:0,z:0} }
    const l2 = { point: {x:0,y:1e-12,z:0}, direction: {x:1,y:0,z:0} }
    // قريب جداً → يعتبر متوازي/متطابق حسب EPS
    const r = classifyLineLineRelation(l1,l2)
    expect(['parallel','coincident'].includes(r.kind)).toBe(true)
  })
})
