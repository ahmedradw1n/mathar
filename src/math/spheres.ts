import type { Point3, Sphere, Plane } from './types'
import { distanceBetweenPoints } from './points'
import { distancePointPlane, projectionPointOnPlane } from './distances'
import { EPS } from './eps'
import { planeNormal } from './planes'

// === الأنواع المهيكلة ===
export type PointSphereRelationKind = 'inside' | 'onSurface' | 'outside' | 'invalid'
export type SpherePlaneDetailedKind = 'disjoint' | 'tangent' | 'intersecting' | 'invalid'

export type SpherePlaneDetailed =
  | { kind: 'disjoint'; delta: number; H: Point3 | null }
  | { kind: 'tangent'; delta: number; point: Point3 }
  | { kind: 'intersecting'; delta: number; center: Point3; rho: number }
  | { kind: 'invalid'; reason: string }

// === إنشاء ===
export function sphereFromCenterRadius(center: Point3, radius: number): Sphere | null {
  if (radius <= EPS) return null // منحلّة أو سالبة
  if (radius < 0) return null
  return { center, radius }
}

export function sphereFromCenterAndPoint(center: Point3, pointOnSphere: Point3): Sphere | null {
  const r = distanceBetweenPoints(center, pointOnSphere)
  if (r <= EPS) return null
  return { center, radius: r }
}

// === معادلة موسعة ===
// الصيغة الموسعة: x²+y²+z²+ A x + B y + C z + D =0
// المركز M = (-A/2, -B/2, -C/2), r² = x0²+y0²+z0² - D

export function sphereFromExpandedEquation(A: number, B: number, C: number, D: number, eps = EPS): { sphere: Sphere | null; kind: 'sphere' | 'point' | 'empty'; r2: number; center: Point3 } {
  const cx = -A / 2, cy = -B / 2, cz = -C / 2
  const center: Point3 = { x: cx, y: cy, z: cz }
  const r2 = cx * cx + cy * cy + cz * cz - D
  if (r2 > eps) return { sphere: { center, radius: Math.sqrt(r2) }, kind: 'sphere', r2, center }
  if (Math.abs(r2) <= eps) return { sphere: null, kind: 'point', r2, center }
  return { sphere: null, kind: 'empty', r2, center }
}

export function sphereToExpandedEquation(sphere: Sphere): { A: number; B: number; C: number; D: number } {
  const { center: c, radius: r } = sphere
  // (x - cx)² + ... = r² → x²+y²+z² -2cx x -2cy y -2cz z + (cx²+cy²+cz² - r²)=0
  return {
    A: -2 * c.x,
    B: -2 * c.y,
    C: -2 * c.z,
    D: c.x * c.x + c.y * c.y + c.z * c.z - r * r,
  }
}

// === معادلة قياسية كنص ===
export function sphereEquation(sphere: Sphere): string {
  const { center, radius } = sphere
  const fmt = (v: number) => (v >= 0 ? ` - ${v}` : ` + ${Math.abs(v)}`)
  return `(x${fmt(center.x)})² + (y${fmt(center.y)})² + (z${fmt(center.z)})² = ${radius * radius}`
}

export function sphereEquationLatex(sphere: Sphere): string {
  const { center: c, radius: r } = sphere
  const fmt = (v: number, label: string) => {
    if (v === 0) return `${label}^2`
    const sign = v > 0 ? '-' : '+'
    return `(${label} ${sign} ${Math.abs(v)})^2`
  }
  return `${fmt(c.x, 'x')} + ${fmt(c.y, 'y')} + ${fmt(c.z, 'z')} = ${r * r}`
}

export function sphereEquationExpandedLatex(A: number, B: number, C: number, D: number): string {
  const fmt = (coeff: number, v: string) => {
    if (coeff === 0) return ''
    const sign = coeff > 0 ? '+' : ''
    return `${sign}${coeff}${v}`
  }
  return `x^2+y^2+z^2${fmt(A, 'x')}${fmt(B, 'y')}${fmt(C, 'z')}${D >= 0 ? `+${D}` : `${D}`}=0`
}

// === نقطة-كرة ===
export function pointSphereRelation(point: Point3, sphere: Sphere | null, eps = EPS): PointSphereRelationKind {
  if (!sphere || sphere.radius <= eps) return 'invalid'
  const d2 = (point.x - sphere.center.x) ** 2 + (point.y - sphere.center.y) ** 2 + (point.z - sphere.center.z) ** 2
  const r2 = sphere.radius * sphere.radius
  if (Math.abs(d2 - r2) <= eps * Math.max(1, r2)) return 'onSurface'
  if (d2 < r2) return 'inside'
  return 'outside'
}

export function isPointOnSphere(p: Point3, sphere: Sphere, eps = 1e-9): boolean {
  return pointSphereRelation(p, sphere, eps) === 'onSurface'
}

export function isPointInsideSphere(p: Point3, sphere: Sphere, eps = 1e-9): boolean {
  return pointSphereRelation(p, sphere, eps) === 'inside'
}

// === كرة-مستوى (بسيط) ===
export function spherePlaneRelation(sphere: Sphere, plane: Plane, eps = 1e-9): 'outside' | 'tangent' | 'intersecting' | 'invalid' {
  const d = distancePointPlane(sphere.center, plane)
  if (d === null) return 'invalid'
  if (d > sphere.radius + eps) return 'outside'
  if (Math.abs(d - sphere.radius) <= eps) return 'tangent'
  return 'intersecting'
}

export function spherePlaneIntersectionRadius(sphere: Sphere, plane: Plane): number | null {
  const d = distancePointPlane(sphere.center, plane)
  if (d === null) return null
  if (d >= sphere.radius) return 0
  return Math.sqrt(sphere.radius * sphere.radius - d * d)
}

// === كرة-مستوى مفصّل مع H و rho ===
export function spherePlaneIntersectionDetailed(sphere: Sphere | null, plane: Plane, eps = EPS): SpherePlaneDetailed {
  if (!sphere || sphere.radius <= eps) return { kind: 'invalid', reason: 'نصف قطر غير صالح' }
  const n = planeNormal(plane)
  const nLen2 = n.x * n.x + n.y * n.y + n.z * n.z
  if (nLen2 <= eps * eps) return { kind: 'invalid', reason: 'شعاع ناظم صفري' }
  const delta = distancePointPlane(sphere.center, plane)
  if (delta === null) return { kind: 'invalid', reason: 'مستوى غير صالح' }
  const H = projectionPointOnPlane(sphere.center, plane)
  if (!H) return { kind: 'invalid', reason: 'لا يمكن إسقاط المركز' }
  if (delta > sphere.radius + eps) return { kind: 'disjoint', delta, H }
  if (Math.abs(delta - sphere.radius) <= eps) return { kind: 'tangent', delta, point: H }
  // متقاطع
  const rho = Math.sqrt(Math.max(0, sphere.radius * sphere.radius - delta * delta))
  return { kind: 'intersecting', delta, center: H, rho }
}

// === إكمال المربع (شرح) ===
export function completeSquareExpanded(A: number, B: number, C: number, D: number): { center: Point3; r2: number; steps: string[] } {
  const cx = -A / 2, cy = -B / 2, cz = -C / 2
  const r2 = cx * cx + cy * cy + cz * cz - D
  const steps = [
    `x²+${A}x → (x+${A / 2})² - ${(A * A) / 4}`,
    `y²+${B}y → (y+${B / 2})² - ${(B * B) / 4}`,
    `z²+${C}z → (z+${C / 2})² - ${(C * C) / 4}`,
    `المركز M=(${cx}|${cy}|${cz}), r²=${r2}`,
  ]
  return { center: { x: cx, y: cy, z: cz }, r2, steps }
}

// === التحقق لدائرة التقاطع ===
export function verifyCirclePoint(point: Point3, sphere: Sphere, plane: Plane, eps = 1e-7): { onPlane: boolean; onSphere: boolean } {
  const onPlane = Math.abs(plane.a * point.x + plane.b * point.y + plane.c * point.z + plane.d) < eps * Math.max(1, Math.sqrt(plane.a ** 2 + plane.b ** 2 + plane.c ** 2))
  const onSphere = Math.abs((point.x - sphere.center.x) ** 2 + (point.y - sphere.center.y) ** 2 + (point.z - sphere.center.z) ** 2 - sphere.radius ** 2) < eps * Math.max(1, sphere.radius ** 2)
  return { onPlane, onSphere }
}
