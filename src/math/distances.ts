import type { Point3, Line3, Plane, Vector3 } from './types'
import { dot, length, isZeroVector } from './vectors'
import { EPS } from './eps'
import { distancePointPlane as planeDistanceRaw, projectPointOnPlane as planeProjectRaw, planeNormal, isPointOnPlane } from './planes'
import { closestPointOnLine } from './lines'
import { distanceBetweenPoints } from './points'
import { cross } from './vectors'

// المسافة بين نقطتين — امتداد فيثاغورس
export function distancePointPoint(a: Point3, b: Point3): number {
  return distanceBetweenPoints(a, b)
}

// مسقط نقطة على مستقيم — يعيد null إذا كان شعاع الاتجاه صفرياً
export function projectionPointOnLine(p: Point3, line: Line3, eps = EPS): Point3 | null {
  if (isZeroVector(line.direction, eps)) return null
  return closestPointOnLine(p, line)
}

// المسافة بين نقطة ومستقيم — null إذا كان الاتجاه صفرياً
export function distancePointLine(p: Point3, line: Line3, eps = EPS): number | null {
  const h = projectionPointOnLine(p, line, eps)
  if (!h) return null
  return distanceBetweenPoints(p, h)
}

// مسقط نقطة على مستوى — null إذا كان الناظم صفرياً
export function projectionPointOnPlane(p: Point3, plane: Plane, eps = EPS): Point3 | null {
  const n = planeNormal(plane)
  if (isZeroVector(n, eps)) return null
  return planeProjectRaw(p, plane)
}

// المسافة بين نقطة ومستوى — null إذا كان الناظم صفرياً
export function distancePointPlane(p: Point3, plane: Plane, eps = EPS): number | null {
  const n = planeNormal(plane)
  if (isZeroVector(n, eps)) return null
  return planeDistanceRaw(p, plane)
}

// مسافة نقطة-نقطة كـ alias للاتساق
export { distanceBetweenPoints as distancePointPointAlias }

// التحقق الهندسي لنقطة-مستقيم: H على المستقيم و AH·u≈0
export function verifyProjectionOnLine(a: Point3, h: Point3 | null, line: Line3, eps = 1e-9): { onLine: boolean; perpendicular: boolean } {
  if (!h) return { onLine: false, perpendicular: false }
  // H على المستقيم؟
  const ap: Vector3 = { x: h.x - line.point.x, y: h.y - line.point.y, z: h.z - line.point.z }
  const crossLen = length(cross(ap, line.direction))
  const onLine = crossLen < eps || (Math.abs(ap.x) < eps && Math.abs(ap.y) < eps && Math.abs(ap.z) < eps)
  // AH عمودي؟
  const ah: Vector3 = { x: h.x - a.x, y: h.y - a.y, z: h.z - a.z }
  const perp = Math.abs(dot(ah, line.direction)) < eps || length(ah) < eps
  return { onLine, perpendicular: perp }
}

// التحقق لنقطة-مستوى: H على المستوى و AH ∥ n
export function verifyProjectionOnPlane(a: Point3, h: Point3 | null, plane: Plane, eps = 1e-9): { onPlane: boolean; parallel: boolean } {
  if (!h) return { onPlane: false, parallel: false }
  const onPlane = isPointOnPlane(h, plane, eps)
  const n = planeNormal(plane)
  const ah: Vector3 = { x: h.x - a.x, y: h.y - a.y, z: h.z - a.z }
  // AH × n ≈0 → متوازيان
  const crossLen = length(cross(ah, n))
  const parallel = crossLen < eps || length(ah) < eps
  return { onPlane, parallel }
}

// إعادة تصدير للتوافق
export { distanceBetweenPoints }
