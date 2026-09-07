import { EPS, approxEqual, isZero } from './eps'
import type { Vector3, Point3 } from './types'

// إنشاء
export function vec(x: number, y: number, z: number): Vector3 {
  return { x, y, z }
}

// جمع شعاعين
export function add(a: Vector3, b: Vector3): Vector3 {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z }
}

// طرح شعاعين
export function sub(a: Vector3, b: Vector3): Vector3 {
  return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z }
}

// ضرب شعاع بعدد
export function scale(v: Vector3, k: number): Vector3 {
  return { x: v.x * k, y: v.y * k, z: v.z * k }
}

// الجداء السلمي
export function dot(a: Vector3, b: Vector3): number {
  return a.x * b.x + a.y * b.y + a.z * b.z
}

// الجداء الشعاعي (متجهي)
export function cross(a: Vector3, b: Vector3): Vector3 {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  }
}

// طول الشعاع
export function length(v: Vector3): number {
  return Math.sqrt(dot(v, v))
}

export function lengthSq(v: Vector3): number {
  return dot(v, v)
}

// هل الشعاع صفري؟
export function isZeroVector(v: Vector3, eps = EPS): boolean {
  return lengthSq(v) < eps * eps
}

// تطبيع (إرجاع شعاع وحدة)
export function normalize(v: Vector3): Vector3 {
  const len = length(v)
  if (isZero(len)) return { x: 0, y: 0, z: 0 }
  return scale(v, 1 / len)
}

// الزاوية بين شعاعين (بالراديان) — 0 إلى π
export function angleBetween(a: Vector3, b: Vector3): number {
  const la = length(a)
  const lb = length(b)
  if (isZero(la) || isZero(lb)) return 0
  const cosTheta = dot(a, b) / (la * lb)
  // clamp بسبب أخطاء floating
  const c = Math.max(-1, Math.min(1, cosTheta))
  return Math.acos(c)
}

export function angleBetweenDeg(a: Vector3, b: Vector3): number {
  return (angleBetween(a, b) * 180) / Math.PI
}

// هل متعامدان؟ |a·b| < eps
export function areOrthogonal(a: Vector3, b: Vector3, eps = 1e-9): boolean {
  if (isZeroVector(a) || isZeroVector(b)) return false
  return Math.abs(dot(a, b)) < eps
}

// هل متوازيان؟ |a × b| ≈ 0
export function areParallel(a: Vector3, b: Vector3, eps = 1e-9): boolean {
  if (isZeroVector(a) || isZeroVector(b)) return false
  return length(cross(a, b)) < eps
}

// الشعاع بين نقطتين: AB = B - A
export function vectorBetweenPoints(from: Point3, to: Point3): Vector3 {
  return { x: to.x - from.x, y: to.y - from.y, z: to.z - from.z }
}

// مسقط شعاع على شعاع آخر
export function projectVectorOnto(a: Vector3, onto: Vector3): Vector3 {
  const denom = dot(onto, onto)
  if (isZero(denom)) return { x: 0, y: 0, z: 0 }
  const k = dot(a, onto) / denom
  return scale(onto, k)
}

// طول المسقط
export function projectLength(a: Vector3, onto: Vector3): number {
  const lenOnto = length(onto)
  if (isZero(lenOnto)) return 0
  return dot(a, onto) / lenOnto
}

// مقارنة شعاعين
export function vectorsEqual(a: Vector3, b: Vector3, eps = EPS): boolean {
  return approxEqual(a.x, b.x, eps) && approxEqual(a.y, b.y, eps) && approxEqual(a.z, b.z, eps)
}

// lerp
export function lerp(a: Vector3, b: Vector3, t: number): Vector3 {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, z: a.z + (b.z - a.z) * t }
}
