import type { Point3, Sphere, Plane, Line3 } from './types'
import { EPS } from './eps'
import { distanceBetweenPoints, centroid } from './points'
import { dot, cross, length } from './vectors'
import { solve3x3 } from './linearSystem'
import { intersectPlanes, planeNormal, isPointOnPlane } from './planes'
import { pointsEqual } from './points'

// === تقاطع مستويين مفصّل ===
export type PlaneIntersectionDetailed =
  | { kind: 'intersecting'; line: Line3; uDotN1: number; uDotN2: number }
  | { kind: 'parallel' }
  | { kind: 'coincident' }
  | { kind: 'invalid'; reason: string }

export function planePlaneIntersectionDetailed(p1: Plane, p2: Plane, eps = EPS): PlaneIntersectionDetailed {
  const n1 = planeNormal(p1), n2 = planeNormal(p2)
  if (length(n1) < eps || length(n2) < eps) return { kind: 'invalid', reason: 'شعاع ناظم صفري' }
  const line = intersectPlanes(p1, p2, eps)
  if (line) {
    return {
      kind: 'intersecting',
      line,
      uDotN1: dot(line.direction, n1),
      uDotN2: dot(line.direction, n2),
    }
  }
  // لا يوجد خط → متوازيان أو متطابقان
  const pt = (() => {
    if (Math.abs(p1.a) > eps) return { x: -p1.d / p1.a, y: 0, z: 0 }
    if (Math.abs(p1.b) > eps) return { x: 0, y: -p1.d / p1.b, z: 0 }
    if (Math.abs(p1.c) > eps) return { x: 0, y: 0, z: -p1.d / p1.c }
    return null
  })()
  if (pt && isPointOnPlane(pt as Point3, p2, eps)) return { kind: 'coincident' }
  return { kind: 'parallel' }
}

export function verifyPlaneIntersection(line: Line3, p1: Plane, p2: Plane, eps = 1e-7): { onP1: boolean; onP2: boolean; perpN1: boolean; perpN2: boolean } {
  const n1 = planeNormal(p1), n2 = planeNormal(p2)
  return {
    onP1: isPointOnPlane(line.point, p1, eps),
    onP2: isPointOnPlane(line.point, p2, eps),
    perpN1: Math.abs(dot(line.direction, n1)) < eps,
    perpN2: Math.abs(dot(line.direction, n2)) < eps,
  }
}

// === كرة عبر نقاط ===
export type SphereThroughPointsResult =
  | { kind: 'unique'; sphere: Sphere; center: Point3; radius: number }
  | { kind: 'none'; reason: string }
  | { kind: 'indeterminate'; reason: string }
  | { kind: 'invalid'; reason: string }

export function sphereThroughPoints(points: Point3[], eps = EPS): SphereThroughPointsResult {
  // إزالة مكررات
  const uniq: Point3[] = []
  for (const p of points) {
    if (!uniq.some(q => pointsEqual(p, q, eps))) uniq.push(p)
  }
  if (uniq.length < 2) return { kind: 'invalid', reason: 'نقاط غير كافية أو مكررة' }
  if (uniq.length === 2) {
    // نقطتان → مركز على المستوى المحوري، غير وحيد
    return { kind: 'indeterminate', reason: 'نقطتان تحددان لا نهائي من الكرات (مركز على المستوى المحوري)' }
  }
  if (uniq.length === 3) {
    // ثلاث نقاط غير على استقامة → دائرة، لكن كرة غير وحيدة (مركز على المستقيم العمودي)
    const ab = { x: uniq[1].x - uniq[0].x, y: uniq[1].y - uniq[0].y, z: uniq[1].z - uniq[0].z }
    const ac = { x: uniq[2].x - uniq[0].x, y: uniq[2].y - uniq[0].y, z: uniq[2].z - uniq[0].z }
    if (length(cross(ab, ac)) < eps) return { kind: 'invalid', reason: 'ثلاث نقاط على استقامة واحدة' }
    return { kind: 'indeterminate', reason: 'ثلاث نقاط تحدد دائرة، لكن الكرة غير وحيدة (مركز على المستقيم العمودي)' }
  }
  if (uniq.length === 4) {
    const [A, B, C, D] = uniq
    // بناء نظام: 2(B-A)·M = |B|² - |A|² إلخ
    const toSq = (p: Point3) => p.x * p.x + p.y * p.y + p.z * p.z
    const rhs = (q: Point3, p: Point3) => toSq(q) - toSq(p)
    const row = (q: Point3, p: Point3): [number, number, number, number] => [
      2 * (q.x - p.x),
      2 * (q.y - p.y),
      2 * (q.z - p.z),
      rhs(q, p),
    ]
    const m = [row(B, A), row(C, A), row(D, A)]
    const sol = solve3x3(m, eps)
    if (!sol) {
      // تحقق هل النقاط مستوية؟
      const ab = { x: B.x - A.x, y: B.y - A.y, z: B.z - A.z }
      const ac = { x: C.x - A.x, y: C.y - A.y, z: C.z - A.z }
      const ad = { x: D.x - A.x, y: D.y - A.y, z: D.z - A.z }
      const vol = dot(ab, cross(ac, ad))
      if (Math.abs(vol) < eps) return { kind: 'none', reason: 'أربع نقاط في مستوى واحد — لا كرة وحيدة' }
      return { kind: 'none', reason: 'لا يوجد حل وحيد (نظام مفرد)' }
    }
    const center: Point3 = { x: sol[0], y: sol[1], z: sol[2] }
    const radius = distanceBetweenPoints(center, A)
    // تحقق
    const check = uniq.every(p => Math.abs(distanceBetweenPoints(center, p) - radius) < 1e-6)
    if (!check) return { kind: 'none', reason: 'عدم تساوي المسافات — خطأ عددي' }
    return { kind: 'unique', sphere: { center, radius }, center, radius }
  }
  // أكثر من 4
  return { kind: 'invalid', reason: 'عدد نقاط غير مدعوم (حتى 4)' }
}

export function verifySphereThroughPoints(sphere: Sphere, points: Point3[], eps = 1e-6): boolean {
  return points.every(p => Math.abs(distanceBetweenPoints(sphere.center, p) - sphere.radius) < eps)
}

// === مركز الثقل ===
export function triangleCentroid(A: Point3, B: Point3, C: Point3): Point3 {
  return centroid([A, B, C])
}

export function tetrahedronCentroid(A: Point3, B: Point3, C: Point3, D: Point3): Point3 {
  return centroid([A, B, C, D])
}

// هل G على المتوسط؟ تحقق أن G يقسم المتوسط 2:1
export function verifyCentroidOnMedian(G: Point3, A: Point3, B: Point3, C: Point3, eps = 1e-9): boolean {
  // متوسط BC: Mbc
  const Mbc = { x: (B.x + C.x) / 2, y: (B.y + C.y) / 2, z: (B.z + C.z) / 2 }
  // تحقق أن G على المستقيم A-Mbc وأن AG:GM =2:1
  const AG = { x: G.x - A.x, y: G.y - A.y, z: G.z - A.z }
  const GM = { x: Mbc.x - G.x, y: Mbc.y - G.y, z: Mbc.z - G.z }
  // AG =2*GM ?
  const twoGM = { x: GM.x * 2, y: GM.y * 2, z: GM.z * 2 }
  return Math.abs(AG.x - twoGM.x) < eps && Math.abs(AG.y - twoGM.y) < eps && Math.abs(AG.z - twoGM.z) < eps
}
