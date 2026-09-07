import type { Point3, Vector3, Line3 } from './types'
import { dot, cross, length, scale, isZeroVector } from './vectors'
import { isZero, EPS } from './eps'
import { translatePoint, distanceBetweenPoints } from './points'

// إنشاء مستقيم من نقطة وشعاع اتجاه — يعيد null إذا كان الشعاع صفرياً
export function lineFromPointAndDirection(point: Point3, direction: Vector3, eps = EPS): Line3 | null {
  if (isZeroVector(direction, eps)) return null
  return { point, direction }
}

// شعاع الاتجاه بين نقطتين — يعيد null إذا كانت النقطتان متطابقتين
export function directionBetweenPoints(from: Point3, to: Point3, eps = EPS): Vector3 | null {
  const v: Vector3 = { x: to.x - from.x, y: to.y - from.y, z: to.z - from.z }
  if (isZeroVector(v, eps)) return null
  return v
}

// مستقيم يمر بنقطتين — يعيد null إذا كانتا متطابقتين
export function lineFromTwoPoints(a: Point3, b: Point3, eps = EPS): Line3 | null {
  const dir = directionBetweenPoints(a, b, eps)
  if (!dir) return null
  return { point: a, direction: dir }
}

// نقطة على المستقيم عند وسيط t: X = P + t·u
export function pointOnLine(line: Line3, t: number): Point3 {
  return translatePoint(line.point, scale(line.direction, t))
}

// الإحداثيات البارامترية كـ نص/كائن
export function parametricLineCoordinates(line: Line3): { x: string; y: string; z: string; vector: string } {
  const { point, direction } = line
  return {
    x: `x = ${point.x} + t·${direction.x}`,
    y: `y = ${point.y} + t·${direction.y}`,
    z: `z = ${point.z} + t·${direction.z}`,
    vector: `⃗x = ⃗p + t·⃗u`,
  }
}

// هل نقطة على المستقيم؟
export function isPointOnLine(p: Point3, line: Line3, eps = 1e-9): boolean {
  const v: Vector3 = { x: p.x - line.point.x, y: p.y - line.point.y, z: p.z - line.point.z }
  if (isZeroVector(v, eps)) return true
  return length(cross(v, line.direction)) < eps
}

// هل نقطة على القطعة AB (0 ≤ t ≤ 1) حيث القطعة من a إلى b
export function isPointOnSegment(p: Point3, a: Point3, b: Point3, eps = 1e-9): boolean {
  const dir = directionBetweenPoints(a, b, eps)
  if (!dir) return false // a==b ليست قطعة
  const line: Line3 = { point: a, direction: dir }
  if (!isPointOnLine(p, line, eps)) return false
  const t = parameterOfProjection(p, line)
  return t >= -eps && t <= 1 + eps
}

// هل نقطة على نصف المستقيم من origin في اتجاه direction (t ≥ 0)
export function isPointOnRay(p: Point3, origin: Point3, direction: Vector3, eps = 1e-9): boolean {
  if (isZeroVector(direction, eps)) return false
  const line: Line3 = { point: origin, direction }
  if (!isPointOnLine(p, line, eps)) return false
  const t = parameterOfProjection(p, line)
  return t >= -eps
}

// أقرب نقطة على المستقيم إلى نقطة معطاة (المسقط القائم)
export function closestPointOnLine(p: Point3, line: Line3): Point3 {
  const ap: Vector3 = { x: p.x - line.point.x, y: p.y - line.point.y, z: p.z - line.point.z }
  const denom = dot(line.direction, line.direction)
  if (isZero(denom)) return { ...line.point }
  const t = dot(ap, line.direction) / denom
  return pointOnLine(line, t)
}

// قيمة t للمسقط
export function parameterOfProjection(p: Point3, line: Line3): number {
  const ap: Vector3 = { x: p.x - line.point.x, y: p.y - line.point.y, z: p.z - line.point.z }
  const denom = dot(line.direction, line.direction)
  if (isZero(denom)) return 0
  return dot(ap, line.direction) / denom
}

// هل المستقيمان متوازيان؟
export function areLinesParallel(l1: Line3, l2: Line3, eps = 1e-9): boolean {
  return length(cross(l1.direction, l2.direction)) < eps
}

// هل متطابقان؟
export function areLinesCoincident(l1: Line3, l2: Line3, eps = 1e-9): boolean {
  if (!areLinesParallel(l1, l2, eps)) return false
  return isPointOnLine(l2.point, l1, eps)
}

// تقاطع مستقيمين — إرجاع نقطة التقاطع إن وجدت (للـ skew يرجع null)
export function lineIntersection(l1: Line3, l2: Line3, eps = 1e-9): Point3 | null {
  if (isZeroVector(l1.direction, eps) || isZeroVector(l2.direction, eps)) return null
  const p1 = l1.point; const u = l1.direction
  const p2 = l2.point; const v = l2.direction
  const w: Vector3 = { x: p1.x - p2.x, y: p1.y - p2.y, z: p1.z - p2.z }

  const a = dot(u, u)
  const b = dot(u, v)
  const c = dot(v, v)
  const d = dot(u, w)
  const e = dot(v, w)
  const denom = a * c - b * b

  if (Math.abs(denom) < eps) {
    if (isPointOnLine(p2, l1, eps)) return { ...p1 }
    return null
  }

  const t = (b * e - c * d) / denom
  const s = (a * e - b * d) / denom

  const pt1 = pointOnLine(l1, t)
  const pt2 = pointOnLine(l2, s)

  if (distanceBetweenPoints(pt1, pt2) < eps) return pt1
  return null
}

// تصنيف علاقة مستقيمين
export function classifyLineLine(l1: Line3, l2: Line3, eps = 1e-9): 'coincident' | 'parallel' | 'intersecting' | 'skew' {
  if (areLinesCoincident(l1, l2, eps)) return 'coincident'
  if (areLinesParallel(l1, l2, eps)) return 'parallel'
  const inter = lineIntersection(l1, l2, eps)
  if (inter) return 'intersecting'
  return 'skew'
}

// تمثيلات مكافئة: هل يمثلان نفس المستقيم؟
export function areLinesEquivalent(l1: Line3, l2: Line3, eps = 1e-9): boolean {
  return areLinesCoincident(l1, l2, eps)
}

// للتوافق مع الكود القديم — alias
export const pointOnSegment = isPointOnSegment
export const pointOnRay = isPointOnRay
