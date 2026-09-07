import type { Line3, Plane, Point3 } from './types'
import { EPS } from './eps'
import { isZeroVector, cross, dot, length } from './vectors'
import { classifyLineLine, lineIntersection } from './lines'
import { classifyLinePlane, linePlaneIntersection, planeNormal } from './planes'
import { arePlanesParallel, arePlanesCoincident } from './planes'
import { findPointOnPlaneIntersection } from './linearSystem'

// === Line — Line ===
export type LineLineResult =
  | { kind: 'coincident'; line: Line3 }
  | { kind: 'parallel' }
  | { kind: 'intersecting'; point: Point3; t: number; s: number }
  | { kind: 'skew'; closestA?: Point3; closestB?: Point3 }

export function classifyLineLineRelation(l1: Line3, l2: Line3, eps = EPS): LineLineResult {
  if (isZeroVector(l1.direction, eps) || isZeroVector(l2.direction, eps)) {
    // اتجاه صفري → لا يحدد مستقيماً
    return { kind: 'parallel' } // نعامله كحالة غير صالحة
  }
  const kind = classifyLineLine(l1, l2, eps)
  if (kind === 'coincident') return { kind: 'coincident', line: l1 }
  if (kind === 'parallel') return { kind: 'parallel' }
  if (kind === 'intersecting') {
    const pt = lineIntersection(l1, l2, eps)!
    // احسب t,s تقريبياً
    const t = dot({ x: pt.x - l1.point.x, y: pt.y - l1.point.y, z: pt.z - l1.point.z }, l1.direction) / dot(l1.direction, l1.direction)
    const s = dot({ x: pt.x - l2.point.x, y: pt.y - l2.point.y, z: pt.z - l2.point.z }, l2.direction) / dot(l2.direction, l2.direction)
    return { kind: 'intersecting', point: pt, t, s }
  }
  return { kind: 'skew' }
}

export function arabicLineLine(kind: LineLineResult['kind']): string {
  switch (kind) {
    case 'coincident': return 'متطابقان'
    case 'parallel': return 'متوازيان'
    case 'intersecting': return 'متقاطعان'
    case 'skew': return 'متخالفان'
  }
}

// === Line — Plane ===
export type LinePlaneResult =
  | { kind: 'intersecting'; point: Point3; t: number }
  | { kind: 'parallel' } // موازٍ ولا ينتمي
  | { kind: 'contained' } // يقع داخل المستوى

export function classifyLinePlaneRelation(line: Line3, plane: Plane, eps = EPS): LinePlaneResult {
  if (isZeroVector(line.direction, eps)) return { kind: 'parallel' }
  const n = planeNormal(plane)
  if (isZeroVector(n, eps)) return { kind: 'parallel' } // ناظم صفري
  const kind = classifyLinePlane(line, plane, eps)
  if (kind === 'intersecting') {
    const pt = linePlaneIntersection(line, plane, eps)!
    const denom = dot(line.direction, n)
    const t = -(plane.a * line.point.x + plane.b * line.point.y + plane.c * line.point.z + plane.d) / denom
    return { kind: 'intersecting', point: pt, t }
  }
  if (kind === 'in-plane') return { kind: 'contained' }
  return { kind: 'parallel' }
}

export function arabicLinePlane(kind: LinePlaneResult['kind']): string {
  switch (kind) {
    case 'intersecting': return 'متقاطع'
    case 'parallel': return 'موازٍ'
    case 'contained': return 'يقع داخل المستوى'
  }
}

// === Plane — Plane ===
export type PlanePlaneResult =
  | { kind: 'coincident' }
  | { kind: 'parallel' }
  | { kind: 'intersecting'; line: Line3 }

export function classifyPlanePlaneRelation(p1: Plane, p2: Plane, eps = EPS): PlanePlaneResult {
  const n1 = planeNormal(p1), n2 = planeNormal(p2)
  if (isZeroVector(n1, eps) || isZeroVector(n2, eps)) return { kind: 'parallel' }
  if (arePlanesCoincident(p1, p2, eps)) return { kind: 'coincident' }
  if (arePlanesParallel(p1, p2, eps)) return { kind: 'parallel' }
  // متقاطعان → خط
  const dir = cross(n1, n2)
  if (length(dir) < eps) return { kind: 'parallel' }
  const pt = findPointOnPlaneIntersection(p1, p2, eps)
  if (!pt) return { kind: 'parallel' }
  return { kind: 'intersecting', line: { point: pt, direction: dir } }
}

export function arabicPlanePlane(kind: PlanePlaneResult['kind']): string {
  switch (kind) {
    case 'coincident': return 'متطابقان'
    case 'parallel': return 'متوازيان'
    case 'intersecting': return 'متقاطعان (في مستقيم)'
  }
}
