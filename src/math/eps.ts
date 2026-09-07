/** التسامح العددي الموحد — لا تستخدم === للمقارنات الهندسية */

export const EPS = 1e-9
export const EPS_ANGLE = 1e-9

export function approxEqual(a: number, b: number, eps = EPS): boolean {
  return Math.abs(a - b) < eps
}

export function isZero(a: number, eps = EPS): boolean {
  return Math.abs(a) < eps
}

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v))
}
