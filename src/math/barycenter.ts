import { EPS, approxEqual, isZero } from './eps'
import type { Point3, Vector3 } from './types'
import { sub } from './vectors'
import { distanceBetweenPoints } from './points'

// ========== الأنواع ==========
export type WeightedPoint3D = { point: Point3; weight: number }

export type BarycenterResult =
  | { valid: true; point: Point3; sumWeights: number }
  | { valid: false; reason: string; sumWeights: number }

// ========== weighted barycenter عام ==========
export function weightedBarycenter(weighted: WeightedPoint3D[], eps = EPS): BarycenterResult {
  if (weighted.length === 0) return { valid: false, reason: 'لا توجد نقاط', sumWeights: 0 }
  const sum = weighted.reduce((s, w) => s + w.weight, 0)
  if (isZero(sum, eps)) return { valid: false, reason: 'مجموع الأوزان صفر — لا يوجد مركز أبعاد متناسبة', sumWeights: sum }
  let sx = 0, sy = 0, sz = 0
  for (const { point, weight } of weighted) {
    sx += weight * point.x
    sy += weight * point.y
    sz += weight * point.z
  }
  return { valid: true, point: { x: sx / sum, y: sy / sum, z: sz / sum }, sumWeights: sum }
}

export function weightedBarycenter2(A: Point3, alpha: number, B: Point3, beta: number, eps = EPS): BarycenterResult {
  return weightedBarycenter([{ point: A, weight: alpha }, { point: B, weight: beta }], eps)
}
export function weightedBarycenter3(A: Point3, alpha: number, B: Point3, beta: number, C: Point3, gamma: number, eps = EPS): BarycenterResult {
  return weightedBarycenter([{ point: A, weight: alpha }, { point: B, weight: beta }, { point: C, weight: gamma }], eps)
}
export function weightedBarycenter4(A: Point3, a: number, B: Point3, b: number, C: Point3, c: number, D: Point3, d: number, eps = EPS): BarycenterResult {
  return weightedBarycenter([{ point: A, weight: a }, { point: B, weight: b }, { point: C, weight: c }, { point: D, weight: d }], eps)
}

// ========== التحقق الشعاعي: Σ αi GAi = 0 ==========
export function verifyWeightedBarycenter(G: Point3, weighted: WeightedPoint3D[], eps = 1e-7): boolean {
  let sx = 0, sy = 0, sz = 0
  for (const { point, weight } of weighted) {
    sx += weight * (point.x - G.x)
    sy += weight * (point.y - G.y)
    sz += weight * (point.z - G.z)
  }
  return Math.abs(sx) < eps && Math.abs(sy) < eps && Math.abs(sz) < eps
}

// ========== هل G داخل القطعة/المثلث/مجسم؟ ==========
export function isBarycenterInsideSegment(G: Point3, A: Point3, B: Point3, eps = EPS): boolean {
  // t param: G = A + t(B-A), inside if 0<=t<=1
  const AB = sub(B as Vector3, A as unknown as Vector3) // reuse via direct calc
  const AG = { x: G.x - A.x, y: G.y - A.y, z: G.z - A.z }
  const denom = AB.x * AB.x + AB.y * AB.y + AB.z * AB.z
  if (isZero(denom, eps)) return false
  const t = (AG.x * AB.x + AG.y * AB.y + AG.z * AB.z) / denom
  return t >= -eps && t <= 1 + eps
}

// ========== الأوزان من نسبة t: AM = t AB -> weights for M = bar((A,1-t),(B,t)) ==========
export function weightsFromRatio(t: number): { alpha: number; beta: number } {
  // M = (1-t)A + tB => weights (1-t, t) normalized; if t in [0,1] those are weights summing to 1
  // For general t, same weights work (sum=1). For barycenter formulation any scalar multiple.
  return { alpha: 1 - t, beta: t }
}

export function ratioFromWeights(alpha: number, beta: number, eps = EPS): number | null {
  const sum = alpha + beta
  if (isZero(sum, eps)) return null
  // M = (alpha A + beta B)/sum = A + (beta/sum)(B-A) => t = beta/sum
  return beta / sum
}

// ratioFromWeights for general; also tFromPosition
export function tFromPosition(M: Point3, A: Point3, B: Point3, eps = EPS): number | null {
  const ABx = B.x - A.x, ABy = B.y - A.y, ABz = B.z - A.z
  const AMx = M.x - A.x, AMy = M.y - A.y, AMz = M.z - A.z
  const denom = ABx * ABx + ABy * ABy + ABz * ABz
  if (isZero(denom, eps)) return null
  return (AMx * ABx + AMy * ABy + AMz * ABz) / denom
}

// نقطة على القطعة بنسب t
export function weightedPointOnSegment(A: Point3, B: Point3, t: number): Point3 {
  return { x: A.x + t * (B.x - A.x), y: A.y + t * (B.y - A.y), z: A.z + t * (B.z - A.z) }
}

// ========== تجميع ==========
export function combineWeightedPoints(weighted: WeightedPoint3D[], indices: number[], eps = EPS): WeightedPoint3D | null {
  if (indices.length === 0) return null
  const subset = indices.map(i => weighted[i]).filter(Boolean)
  if (subset.length !== indices.length) return null
  const res = weightedBarycenter(subset, eps)
  if (!res.valid) return null
  const sum = subset.reduce((s, w) => s + w.weight, 0)
  return { point: res.point, weight: sum }
}

// مثالي: إرجاع G1 ثم استخدامه
export function associativeBarycenterExample(
  A: Point3, alpha: number, B: Point3, beta: number, C: Point3, gamma: number, eps = EPS
): { G1: Point3 | null; G: Point3 | null } {
  const r1 = weightedBarycenter2(A, alpha, B, beta, eps)
  if (!r1.valid) return { G1: null, G: null }
  const G1 = r1.point
  const r2 = weightedBarycenter([{ point: G1, weight: r1.sumWeights }, { point: C, weight: gamma }], eps)
  return { G1, G: r2.valid ? r2.point : null }
}

// ========== تغيير الأوزان بمعامل ==========
export function scaledWeights(weights: number[], lambda: number): number[] {
  return weights.map(w => w * lambda)
}

// ========== صيغة M المرجعية: Σ αi MAi = (Σ αi) MG ==========
export function sumWeightedVectorsFromM(M: Point3, weighted: WeightedPoint3D[]): Vector3 {
  let sx = 0, sy = 0, sz = 0
  for (const { point, weight } of weighted) {
    sx += weight * (point.x - M.x)
    sy += weight * (point.y - M.y)
    sz += weight * (point.z - M.z)
  }
  return { x: sx, y: sy, z: sz }
}

// ========== إحداثيات مباشرة ==========
export function weightedCoordinate(values: number[], weights: number[], eps = EPS): number | null {
  const sum = weights.reduce((a, b) => a + b, 0)
  if (isZero(sum, eps)) return null
  let s = 0
  for (let i = 0; i < values.length; i++) s += (weights[i] ?? 0) * values[i]
  return s / sum
}

// ========== مركز ثقل حالات خاصة ==========
export function triangleCentroidWeighted(A: Point3, B: Point3, C: Point3): Point3 {
  return { x: (A.x + B.x + C.x) / 3, y: (A.y + B.y + C.y) / 3, z: (A.z + B.z + C.z) / 3 }
}
export function tetrahedronCentroidWeighted(A: Point3, B: Point3, C: Point3, D: Point3): Point3 {
  return { x: (A.x + B.x + C.x + D.x) / 4, y: (A.y + B.y + C.y + D.y) / 4, z: (A.z + B.z + C.z + D.z) / 4 }
}

// ========== Helpers للتحقق من شروط ==========
export function classifyWeightsForTwoPoints(alpha: number, beta: number, eps = EPS): 'midpoint' | 'inside' | 'outside' | 'weight-zero' | 'invalid' {
  if (isZero(alpha + beta, eps)) return 'invalid'
  if (isZero(alpha, eps) || isZero(beta, eps)) return 'weight-zero'
  if (approxEqual(alpha, beta, eps)) return 'midpoint'
  // نفس الإشارة => داخل، إشارتان مختلفتان => خارج
  if (alpha * beta > 0) return 'inside'
  return 'outside'
}

// وحدة اختبار: إعادة التحجيم تعطي نفس المركز
export function isBarycenterInvariantUnderScaling(weighted: WeightedPoint3D[], lambda: number, eps = 1e-7): boolean {
  const r1 = weightedBarycenter(weighted, eps)
  const scaled = weighted.map(w => ({ point: w.point, weight: w.weight * lambda }))
  const r2 = weightedBarycenter(scaled, eps)
  if (!r1.valid || !r2.valid) return false
  return distanceBetweenPoints(r1.point, r2.point) < 1e-6
}
