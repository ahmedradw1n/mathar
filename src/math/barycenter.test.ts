import { describe, it, expect } from 'vitest'
import { weightedBarycenter, weightedBarycenter2, weightedBarycenter3, weightedBarycenter4, verifyWeightedBarycenter, weightsFromRatio, ratioFromWeights, tFromPosition, weightedPointOnSegment, combineWeightedPoints, associativeBarycenterExample, isBarycenterInvariantUnderScaling, classifyWeightsForTwoPoints } from './barycenter'
import { distanceBetweenPoints } from './points'
import type { Point3 } from './types'

const A: Point3 = { x: 0, y: 0, z: 0 }
const B: Point3 = { x: 4, y: 0, z: 0 }
const C: Point3 = { x: 0, y: 3, z: 0 }
const D: Point3 = { x: 0, y: 0, z: 2 }

describe('barycenter', () => {
  it('نقطتان متساويتان → منتصف', () => {
    const r = weightedBarycenter2(A, 1, B, 1)
    expect(r.valid && r.point.x).toBeCloseTo(2)
  })
  it('وزن صفر → النقطة الأخرى', () => {
    const r = weightedBarycenter2(A, 0, B, 5)
    expect(r.valid && r.point.x).toBeCloseTo(4)
  })
  it('أوزان سالبة — خارج', () => {
    const r = weightedBarycenter2(A, 3, B, -1)
    expect(r.valid).toBe(true)
    if (r.valid) expect(r.point.x).toBeCloseTo(-2) // (0*3+4*(-1))/2=-2
  })
  it('مجموع صفر → invalid', () => {
    const r = weightedBarycenter2(A, 2, B, -2)
    expect(r.valid).toBe(false)
  })
  it('مركز خارج القطعة مع أوزان مختلطة الإشارة', () => {
    const r = weightedBarycenter2(A, 1, B, -2)
    expect(r.valid).toBe(true)
    if (r.valid) expect(r.point.x).toBeCloseTo(8)
  })
  it('نقاط متطابقة', () => {
    const P: Point3 = { x: 1, y: 1, z: 1 }
    const r = weightedBarycenter2(P, 1, P, 1)
    expect(r.valid && r.point.x).toBeCloseTo(1)
  })
  it('ثلاث نقاط متساوية → (1,1,0)', () => {
    const r = weightedBarycenter3({ x: 0, y: 0, z: 0 }, 1, { x: 3, y: 0, z: 0 }, 1, { x: 0, y: 3, z: 0 }, 1)
    expect(r.valid && r.point.x).toBeCloseTo(1)
    expect(r.valid && r.point.y).toBeCloseTo(1)
  })
  it('أربع نقاط 1,1,1,1 → (0.5,0.5,0.5) for tetra', () => {
    const r = weightedBarycenter4({ x: 0, y: 0, z: 0 }, 1, { x: 2, y: 0, z: 0 }, 1, { x: 0, y: 2, z: 0 }, 1, { x: 0, y: 0, z: 2 }, 1)
    expect(r.valid && r.point.x).toBeCloseTo(0.5)
  })
  it('إعادة التحجيم تعطي نفس المركز', () => {
    const pts = [{ point: A, weight: 1 }, { point: B, weight: 2 }]
    expect(isBarycenterInvariantUnderScaling(pts, 2)).toBe(true)
    expect(isBarycenterInvariantUnderScaling(pts, -1)).toBe(true)
  })
  it('الحالات القريبة من EPS — مجموع≈0', () => {
    const r = weightedBarycenter([{ point: A, weight: 1 }, { point: B, weight: -1 + 1e-12 }])
    expect(r.valid).toBe(false)
  })
  it('التحقق الشعاعي Σ α GA =0', () => {
    const r = weightedBarycenter3(A, 1, B, 2, C, 3)
    expect(r.valid).toBe(true)
    if (r.valid) expect(verifyWeightedBarycenter(r.point, [{ point: A, weight: 1 }, { point: B, weight: 2 }, { point: C, weight: 3 }])).toBe(true)
  })
  it('weightsFromRatio / ratioFromWeights', () => {
    const w = weightsFromRatio(0.4)
    expect(w.alpha).toBeCloseTo(0.6)
    expect(ratioFromWeights(0.6, 0.4)).toBeCloseTo(0.4)
    expect(ratioFromWeights(1, -1)).toBeNull()
  })
  it('tFromPosition', () => {
    const M = { x: 2, y: 0, z: 0 }
    expect(tFromPosition(M, A, B)).toBeCloseTo(0.5)
  })
  it('weightedPointOnSegment', () => {
    const M = weightedPointOnSegment(A, B, 0.25)
    expect(M.x).toBeCloseTo(1)
  })
  it('combineWeightedPoints', () => {
    const w = [{ point: A, weight: 1 }, { point: B, weight: 2 }, { point: C, weight: 3 }]
    const g1 = combineWeightedPoints(w, [0, 1])
    expect(g1).not.toBeNull()
    expect(g1!.weight).toBe(3)
  })
  it('associative', () => {
    const { G, G1 } = associativeBarycenterExample(A, 1, B, 1, C, 1)
    expect(G1).not.toBeNull()
    expect(G).not.toBeNull()
    const direct = weightedBarycenter3(A, 1, B, 1, C, 1)
    if (G && direct.valid) expect(distanceBetweenPoints(G, direct.point)).toBeLessThan(1e-6)
  })
  it('classify', () => {
    expect(classifyWeightsForTwoPoints(1, 1)).toBe('midpoint')
    expect(classifyWeightsForTwoPoints(1, 2)).toBe('inside')
    expect(classifyWeightsForTwoPoints(1, -1)).toBe('invalid')
    expect(classifyWeightsForTwoPoints(2, -1)).toBe('outside')
  })
})
