import type { Point3, Vector3 } from './types'
import { scale } from './vectors'
import { approxEqual } from './eps'

export function point(x: number, y: number, z: number): Point3 {
  return { x, y, z }
}

export function pointsEqual(a: Point3, b: Point3, eps = 1e-9): boolean {
  return approxEqual(a.x, b.x, eps) && approxEqual(a.y, b.y, eps) && approxEqual(a.z, b.z, eps)
}

// إزاحة نقطة بشعاع
export function translatePoint(p: Point3, v: Vector3): Point3 {
  return { x: p.x + v.x, y: p.y + v.y, z: p.z + v.z }
}

// نقطة على مستقيم: p + t·dir
export function pointOnLineAt(base: Point3, dir: Vector3, t: number): Point3 {
  return translatePoint(base, scale(dir, t))
}

// المسافة بين نقطتين
export function distanceBetweenPoints(a: Point3, b: Point3): number {
  const dx = a.x - b.x
  const dy = a.y - b.y
  const dz = a.z - b.z
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

// منتصف قطعة
export function midpoint(a: Point3, b: Point3): Point3 {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, z: (a.z + b.z) / 2 }
}

// مركز ثقل (متوسط نقاط)
export function centroid(points: Point3[]): Point3 {
  if (points.length === 0) return { x: 0, y: 0, z: 0 }
  let sx = 0, sy = 0, sz = 0
  for (const p of points) { sx += p.x; sy += p.y; sz += p.z }
  const n = points.length
  return { x: sx / n, y: sy / n, z: sz / n }
}

// تحويل نقطة إلى شعاع موضع (نفس المركبات)
export function toVector(p: Point3): Vector3 {
  return { x: p.x, y: p.y, z: p.z }
}

export function fromVector(v: Vector3): Point3 {
  return { x: v.x, y: v.y, z: v.z }
}

// هل النقطة تحقق معادلة المستوى ax+by+cz+d=0
export function pointSatisfiesPlane(p: Point3, plane: { a: number; b: number; c: number; d: number }, eps = 1e-9): boolean {
  return Math.abs(plane.a * p.x + plane.b * p.y + plane.c * p.z + plane.d) < eps
}
