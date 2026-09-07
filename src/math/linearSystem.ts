import { EPS } from './eps'

// حل نظام 2x2: [a b; c d] * [x; y] = [e; f]
// يعيد {x,y} أو null إذا كان مفرداً
export function solve2x2(
  a: number, b: number, e: number,
  c: number, d: number, f: number,
  eps = EPS
): { x: number; y: number } | null {
  const det = a * d - b * c
  if (Math.abs(det) < eps) return null
  return {
    x: (e * d - b * f) / det,
    y: (a * f - e * c) / det,
  }
}

// حل نظام 3x3 عبر Gaussian elimination مع EPS
// المصفوفة 3x4 (augmented)
export function solve3x3(
  m: number[][],
  eps = EPS
): [number, number, number] | null {
  // نسخ
  const a = m.map(row => [...row])
  const n = 3
  // Gaussian
  for (let col = 0; col < n; col++) {
    // pivot
    let pivotRow = col
    for (let r = col; r < n; r++) {
      if (Math.abs(a[r][col]) > Math.abs(a[pivotRow][col])) pivotRow = r
    }
    if (Math.abs(a[pivotRow][col]) < eps) return null // مفرد
    // swap
    if (pivotRow !== col) [a[col], a[pivotRow]] = [a[pivotRow], a[col]]
    // normalize pivot row
    const pivot = a[col][col]
    for (let j = col; j <= n; j++) a[col][j] /= pivot
    // eliminate other rows
    for (let r = 0; r < n; r++) {
      if (r === col) continue
      const factor = a[r][col]
      for (let j = col; j <= n; j++) a[r][j] -= factor * a[col][j]
    }
  }
  return [a[0][3], a[1][3], a[2][3]]
}

// إيجاد نقطة على تقاطع مستويين: حل a1x+b1y+c1z=d1', a2x+b2y+c2z=d2' مع تثبيت متغير واحد =0
// d' = -d في تمثيلنا (ax+by+cz+d=0 → ax+by+cz = -d)
export function findPointOnPlaneIntersection(
  p1: { a: number; b: number; c: number; d: number },
  p2: { a: number; b: number; c: number; d: number },
  eps = EPS
): { x: number; y: number; z: number } | null {
  const d1 = -p1.d, d2 = -p2.d
  // جرّب تثبيت z=0, y=0, x=0
  const tryZ0 = solve2x2(p1.a, p1.b, d1, p2.a, p2.b, d2, eps)
  if (tryZ0) return { x: tryZ0.x, y: tryZ0.y, z: 0 }
  const tryY0 = solve2x2(p1.a, p1.c, d1, p2.a, p2.c, d2, eps)
  if (tryY0) return { x: tryY0.x, y: 0, z: tryY0.y }
  const tryX0 = solve2x2(p1.b, p1.c, d1, p2.b, p2.c, d2, eps)
  if (tryX0) return { x: 0, y: tryX0.x, z: tryX0.y }
  return null
}
