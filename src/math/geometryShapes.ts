import type { Point3, Vector3, Plane } from './types'
import { EPS } from './eps'
import { dot, cross, length, isZeroVector } from './vectors'
import { distanceBetweenPoints } from './points'
import { isPointOnPlane, planeFromPointAndNormal } from './planes'
import { distancePointPlane, projectionPointOnPlane } from './distances'

// الجداء الاتجاهي — يعيد شعاعاً متعامداً
export function crossProduct(u: Vector3, v: Vector3): Vector3 {
  return cross(u, v)
}

// الجداء الثلاثي: u·(v×w) — حجم متوازي المستطيلات المائل
export function scalarTripleProduct(u: Vector3, v: Vector3, w: Vector3): number {
  return dot(u, cross(v, w))
}

// مساحة مثلث ABC = ½|AB×AC|
export function triangleArea3D(A: Point3, B: Point3, C: Point3): number {
  const AB: Vector3 = { x: B.x - A.x, y: B.y - A.y, z: B.z - A.z }
  const AC: Vector3 = { x: C.x - A.x, y: C.y - A.y, z: C.z - A.z }
  return length(cross(AB, AC)) / 2
}

// حجم رباعي الوجوه ABCD = 1/6 |AB·(AC×AD)|
export function tetrahedronVolume(A: Point3, B: Point3, C: Point3, D: Point3): number {
  const AB: Vector3 = { x: B.x - A.x, y: B.y - A.y, z: B.z - A.z }
  const AC: Vector3 = { x: C.x - A.x, y: C.y - A.y, z: C.z - A.z }
  const AD: Vector3 = { x: D.x - A.x, y: D.y - A.y, z: D.z - A.z }
  return Math.abs(scalarTripleProduct(AB, AC, AD)) / 6
}

// قطر متوازي مستطيلات أبعاده a,b,c
export function cuboidDiagonal(a: number, b: number, c: number): number {
  return Math.sqrt(a * a + b * b + c * c)
}

// قطر وجه a×b
export function faceDiagonal(a: number, b: number): number {
  return Math.sqrt(a * a + b * b)
}

// تمثيل وسيطي للمستوى: X = P + r·u + s·v
export function planeParametricPoint(P: Point3, u: Vector3, v: Vector3, r: number, s: number): Point3 {
  return {
    x: P.x + r * u.x + s * v.x,
    y: P.y + r * u.y + s * v.y,
    z: P.z + r * u.z + s * v.z,
  }
}

// هل نقطة على المستوى الوسيطي؟ (تتحقق هل يمكن حل r,s)
export function isPointOnParametricPlane(X: Point3, P: Point3, u: Vector3, v: Vector3, eps = EPS): boolean {
  // نحاول إيجاد r,s يحققان X-P = r·u + s·v — نحل في المستوي المكون من u,v
  // نستخدم أن u,v مستقلان → نتحقق هل (X-P)·n ≈0 حيث n=u×v
  const n = cross(u, v)
  if (isZeroVector(n, eps)) return false
  const w: Vector3 = { x: X.x - P.x, y: X.y - P.y, z: X.z - P.z }
  return Math.abs(dot(w, n)) < eps * length(n) * length(w) + eps
}

// المستوى المحوري — يعيد المستوى أو null إذا A≈B
export function axialBisectorPlane(A: Point3, B: Point3): Plane | null {
  const mid: Point3 = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2, z: (A.z + B.z) / 2 }
  const n: Vector3 = { x: B.x - A.x, y: B.y - A.y, z: B.z - A.z }
  if (isZeroVector(n)) return null
  return planeFromPointAndNormal(mid, n)
}

// التحقق: هل X على المستوى المحوري؟ أي |XA|≈|XB|
export function isOnAxialBisector(X: Point3, A: Point3, B: Point3, eps = 1e-9): boolean {
  return Math.abs(distanceBetweenPoints(X, A) - distanceBetweenPoints(X, B)) < eps
}

// تحقق توازي حافتين: u = λv
export function verifyParallelEdges(u: Vector3, v: Vector3, eps = EPS): { parallel: boolean; lambda?: number } {
  if (isZeroVector(u, eps) || isZeroVector(v, eps)) return { parallel: false }
  if (!isZeroVector(cross(u, v), eps)) return { parallel: false }
  // أوجد λ من مكون غير صفري
  const comps: [number, number][] = [[u.x, v.x], [u.y, v.y], [u.z, v.z]]
  for (const [a, b] of comps) {
    if (Math.abs(b) > eps) return { parallel: true, lambda: a / b }
  }
  return { parallel: true, lambda: 0 }
}

// تحقق تعامد حافتين: u·v≈0
export function verifyPerpendicularEdges(u: Vector3, v: Vector3, eps = EPS): boolean {
  if (isZeroVector(u, eps) || isZeroVector(v, eps)) return false
  return Math.abs(dot(u, v)) < eps
}

// علاقة |a|² = a·a
export function lengthViaDot(a: Vector3): number {
  return Math.sqrt(dot(a, a))
}

export function verifyLengthViaDot(a: Vector3, eps = 1e-9): boolean {
  return Math.abs(length(a) - Math.sqrt(dot(a, a))) < eps
}

// التحقق من نقطة على وجه (مستوى)
export function verifyPointOnFace(P: Point3, plane: Plane, eps = 1e-9): boolean {
  return isPointOnPlane(P, plane, eps)
}

// ارتفاع هرم: h = d(S, E) حيث E مستوى القاعدة
export function pyramidHeight(apex: Point3, basePlane: Plane): number | null {
  const d = distancePointPlane(apex, basePlane)
  return d
}

// مسقط قمة الهرم على القاعدة
export function pyramidFoot(apex: Point3, basePlane: Plane): Point3 | null {
  return projectionPointOnPlane(apex, basePlane)
}
