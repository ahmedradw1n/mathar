import type { Point3, Vector3, Plane, Line3 } from './types'
import { dot, cross, length } from './vectors'
import { isZero } from './eps'

// إنشاء مستوى من نقطة وشعاع ناظم: a(x-p.x)+b(y-p.y)+c(z-p.z)=0
// إذا كان n صفرياً → نعيد null (لا يحدد مستوى)
export function planeFromPointAndNormal(p: Point3, n: Vector3): Plane | null {
  if (length(n) < 1e-9) return null
  return {
    a: n.x,
    b: n.y,
    c: n.z,
    d: -(n.x * p.x + n.y * p.y + n.z * p.z),
  }
}

// معادلة المستوى كنص
export function planeEquationString(plane: Plane): string {
  const fmt = (coeff: number, variable: string) => {
    if (coeff === 0) return ''
    const sign = coeff > 0 ? '+' : '-'
    const abs = Math.abs(coeff)
    const coeffStr = abs === 1 ? '' : String(abs)
    return ` ${sign} ${coeffStr}${variable}`
  }
  let s = ''
  if (plane.a !== 0) s += `${plane.a}x`
  s += fmt(plane.b, 'y')
  s += fmt(plane.c, 'z')
  if (s.startsWith(' + ')) s = s.slice(3)
  if (s.startsWith(' +')) s = s.slice(2)
  const rhs = -plane.d
  return `${s || '0'} = ${rhs}`
}

// مستوى من نقطة وشعاعين غير متوازيين داخل المستوى
export function planeFromPointAndTwoVectors(p: Point3, u: Vector3, v: Vector3): Plane | null {
  const n = cross(u, v)
  if (length(n) < 1e-9) return null // متوازيان → لا يحددان مستوى
  return planeFromPointAndNormal(p, n)
}

// صيغة المقطوعات: x/a + y/b + z/c = 1 — نعيد a,b,c للمقطوعات
export function planeInterceptForm(plane: Plane): { a: number; b: number; c: number } | null {
  const { a, b, c, d } = plane
  if (a === 0 || b === 0 || c === 0 || d === 0) return null
  // ax+by+cz = -d → x/(-d/a) + y/(-d/b) + z/(-d/c) =1
  return { a: -d / a, b: -d / b, c: -d / c }
}

// مستوى من ثلاث نقاط غير واقعة على استقامة واحدة
export function planeFromThreePoints(a: Point3, b: Point3, c: Point3): Plane | null {
  const ab: Vector3 = { x: b.x - a.x, y: b.y - a.y, z: b.z - a.z }
  const ac: Vector3 = { x: c.x - a.x, y: c.y - a.y, z: c.z - a.z }
  const n = cross(ab, ac)
  if (length(n) < 1e-9) return null // نقاط على استقامة واحدة
  return planeFromPointAndNormal(a, n)
}

// الشعاع الناظم
export function planeNormal(plane: Plane): Vector3 {
  return { x: plane.a, y: plane.b, z: plane.c }
}

// هل نقطة على المستوى؟
export function isPointOnPlane(p: Point3, plane: Plane, eps = 1e-9): boolean {
  return Math.abs(plane.a * p.x + plane.b * p.y + plane.c * p.z + plane.d) < eps
}

// المسافة من نقطة إلى مستوى: |ax0+by0+cz0+d| / √(a²+b²+c²) — يعيد null إذا كان المستوى غير صالح (n=0)
export function distancePointPlane(p: Point3, plane: Plane): number | null {
  const num = Math.abs(plane.a * p.x + plane.b * p.y + plane.c * p.z + plane.d)
  const denom = Math.sqrt(plane.a * plane.a + plane.b * plane.b + plane.c * plane.c)
  if (isZero(denom)) return null
  return num / denom
}

// مسقط نقطة على مستوى — يعيد null إذا كان المستوى غير صالح
export function projectPointOnPlane(p: Point3, plane: Plane): Point3 | null {
  const n = planeNormal(plane)
  const denom = dot(n, n)
  if (isZero(denom)) return null
  const t = -(plane.a * p.x + plane.b * p.y + plane.c * p.z + plane.d) / denom
  return { x: p.x + n.x * t, y: p.y + n.y * t, z: p.z + n.z * t }
}

// هل المستويان متوازيان؟
export function arePlanesParallel(p1: Plane, p2: Plane, eps = 1e-9): boolean {
  const n1 = planeNormal(p1); const n2 = planeNormal(p2)
  return length(cross(n1, n2)) < eps
}

// هل متطابقان؟
export function arePlanesCoincident(p1: Plane, p2: Plane, eps = 1e-9): boolean {
  if (!arePlanesParallel(p1, p2, eps)) return false
  // تحقق هل نقطة من p1 تحقق p2
  // نحتاج نقطة على p1
  const pt = pointOnPlane(p1)
  if (!pt) return false
  return isPointOnPlane(pt, p2, eps)
}

// نقطة على المستوى (أي نقطة)
export function pointOnPlane(plane: Plane): Point3 | null {
  const { a, b, c, d } = plane
  if (Math.abs(a) > 1e-9) return { x: -d / a, y: 0, z: 0 }
  if (Math.abs(b) > 1e-9) return { x: 0, y: -d / b, z: 0 }
  if (Math.abs(c) > 1e-9) return { x: 0, y: 0, z: -d / c }
  return null
}

// تقاطع مستويين — إرجاع مستقيم أو null
export function intersectPlanes(p1: Plane, p2: Plane, eps = 1e-9): Line3 | null {
  const n1 = planeNormal(p1); const n2 = planeNormal(p2)
  const dir = cross(n1, n2)
  if (length(dir) < eps) return null // متوازيان / متطابقان

  // نجد نقطة تحقق المعادلتين — نثبت إحدى الإحداثيات = 0 ونحل جملة 2x2
  const absX = Math.abs(dir.x), absY = Math.abs(dir.y), absZ = Math.abs(dir.z)
  let point: Point3 | null = null

  if (absZ >= absX && absZ >= absY) {
    // ثبت z=0
    const det = p1.a * p2.b - p2.a * p1.b
    if (Math.abs(det) > eps) {
      const x = (-p1.d * p2.b + p2.d * p1.b) / det
      const y = (-p1.a * p2.d + p2.a * p1.d) / det
      point = { x, y, z: 0 }
    }
  } else if (absY >= absX && absY >= absZ) {
    const det = p1.a * p2.c - p2.a * p1.c
    if (Math.abs(det) > eps) {
      const x = (-p1.d * p2.c + p2.d * p1.c) / det
      const z = (-p1.a * p2.d + p2.a * p1.d) / det
      point = { x, y: 0, z }
    }
  } else {
    const det = p1.b * p2.c - p2.b * p1.c
    if (Math.abs(det) > eps) {
      const y = (-p1.d * p2.c + p2.d * p1.c) / det
      const z = (-p1.b * p2.d + p2.b * p1.d) / det
      point = { x: 0, y, z }
    }
  }

  // fallback عام: حل عبر least squares بسيط
  if (!point) {
    // جرب z=0 ثم y=0 ثم x=0
    const tryZ0 = () => {
      const det = p1.a * p2.b - p2.a * p1.b
      if (Math.abs(det) < eps) return null
      return { x: (-p1.d * p2.b + p2.d * p1.b) / det, y: (-p1.a * p2.d + p2.a * p1.d) / det, z: 0 }
    }
    const tryY0 = () => {
      const det = p1.a * p2.c - p2.a * p1.c
      if (Math.abs(det) < eps) return null
      return { x: (-p1.d * p2.c + p2.d * p1.c) / det, y: 0, z: (-p1.a * p2.d + p2.a * p1.d) / det }
    }
    const tryX0 = () => {
      const det = p1.b * p2.c - p2.b * p1.c
      if (Math.abs(det) < eps) return null
      return { x: 0, y: (-p1.d * p2.c + p2.d * p1.c) / det, z: (-p1.b * p2.d + p2.b * p1.d) / det }
    }
    point = tryZ0() ?? tryY0() ?? tryX0()
  }

  if (!point) return null
  return { point, direction: dir }
}

// المستوى المحوري لقطعة AB: (B-A)·(X - M)=0
export function bisectorPlane(a: Point3, b: Point3): Plane | null {
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, z: (a.z + b.z) / 2 }
  const n: Vector3 = { x: b.x - a.x, y: b.y - a.y, z: b.z - a.z }
  return planeFromPointAndNormal(mid, n)
}

// تصنيف علاقة مستوى-مستوى
export function classifyPlanePlane(p1: Plane, p2: Plane, eps = 1e-9): 'coincident' | 'parallel' | 'intersecting' {
  if (arePlanesCoincident(p1, p2, eps)) return 'coincident'
  if (arePlanesParallel(p1, p2, eps)) return 'parallel'
  return 'intersecting'
}

// علاقة مستقيم بمستوى
export function classifyLinePlane(line: Line3, plane: Plane, eps = 1e-9): 'in-plane' | 'parallel' | 'intersecting' {
  const n = planeNormal(plane)
  const denom = dot(line.direction, n)
  const onPlane = isPointOnPlane(line.point, plane, eps)
  if (Math.abs(denom) < eps) {
    return onPlane ? 'in-plane' : 'parallel'
  }
  return 'intersecting'
}

// نقطة تقاطع مستقيم مع مستوى
export function linePlaneIntersection(line: Line3, plane: Plane, eps = 1e-9): Point3 | null {
  const n = planeNormal(plane)
  const denom = dot(line.direction, n)
  if (Math.abs(denom) < eps) return null
  const t = -(plane.a * line.point.x + plane.b * line.point.y + plane.c * line.point.z + plane.d) / denom
  return {
    x: line.point.x + line.direction.x * t,
    y: line.point.y + line.direction.y * t,
    z: line.point.z + line.direction.z * t,
  }
}
