import { EPS, isZero } from './eps'
import type { Point3, Plane } from './types'
import { pointsEqual } from './points'

// ========== تقاطع مستوى مع قطعة ==========
export type SegmentPlaneIntersection =
  | { kind: 'point'; t: number; point: Point3 }
  | { kind: 'segment'; reason: string } // القطعة داخل المستوى
  | { kind: 'none'; reason: string }

export function intersectPlaneWithSegment(A: Point3, B: Point3, plane: Plane, eps = EPS): SegmentPlaneIntersection {
  const { a, b, c, d } = plane
  const nLen = Math.sqrt(a * a + b * b + c * c)
  if (isZero(nLen, eps)) return { kind: 'none', reason: 'مستوى غير صالح (شعاع ناظم صفري)' }
  const fA = a * A.x + b * A.y + c * A.z + d
  const fB = a * B.x + b * B.y + c * B.z + d
  const onA = Math.abs(fA) < eps
  const onB = Math.abs(fB) < eps
  if (onA && onB) return { kind: 'segment', reason: 'القطعة داخل المستوى' }
  // t للحل: A + t(B-A), يحقق f=0
  const denom = fB - fA // = n·(B-A)
  if (isZero(denom, eps)) {
    // موازية ولا تقاطع
    return { kind: 'none', reason: 'القطعة موازية للمستوى' }
  }
  const t = -fA / denom
  if (t < -eps || t > 1 + eps) return { kind: 'none', reason: t < 0 ? 'التقاطع قبل A' : 'التقاطع بعد B' }
  const tc = Math.max(0, Math.min(1, t))
  const point: Point3 = { x: A.x + tc * (B.x - A.x), y: A.y + tc * (B.y - A.y), z: A.z + tc * (B.z - A.z) }
  return { kind: 'point', t: tc, point }
}

// ========== حساب t للمستقيم الوسيطي X(t)=A+t(B-A) مع المستوى ax+by+cz=d' حيث d'=-d ==========
export function planeSegmentT(A: Point3, B: Point3, plane: Plane, eps = EPS): number | null {
  const { a, b, c, d } = plane
  const denom = a * (B.x - A.x) + b * (B.y - A.y) + c * (B.z - A.z)
  if (isZero(denom, eps)) return null
  return -(a * A.x + b * A.y + c * A.z + d) / denom
}

// ========== استخراج مضلع المقطع ==========
export type SectionPolygon = {
  points: Point3[]
  closed: boolean // هل مغلق (≥3)
  kind: 'none' | 'point' | 'segment' | 'triangle' | 'quadrilateral' | 'polygon'
}

export function buildSectionPolygon(
  vertices: Point3[],
  edges: [number, number][], // indices into vertices
  plane: Plane,
  eps = EPS
): SectionPolygon {
  const raw: Point3[] = []
  for (const [ia, ib] of edges) {
    const A = vertices[ia], B = vertices[ib]
    if (!A || !B) continue
    const res = intersectPlaneWithSegment(A, B, plane, eps)
    if (res.kind === 'point') {
      raw.push(res.point)
    } else if (res.kind === 'segment') {
      // نضيف النقطتين
      raw.push(A, B)
    }
  }
  // إزالة مكررات باستخدام EPS
  const uniq: Point3[] = []
  for (const p of raw) {
    if (!uniq.some(q => pointsEqual(p, q, eps * 10))) uniq.push(p)
  }
  if (uniq.length === 0) return { points: [], closed: false, kind: 'none' }
  if (uniq.length === 1) return { points: uniq, closed: false, kind: 'point' }
  if (uniq.length === 2) return { points: uniq, closed: false, kind: 'segment' }

  // ترتيب النقاط حول المركز (project onto plane basis then sort by angle)
  const ordered = sortPointsOnPlane(uniq, plane)
  let kind: SectionPolygon['kind'] = 'polygon'
  if (ordered.length === 3) kind = 'triangle'
  else if (ordered.length === 4) kind = 'quadrilateral'
  else if (ordered.length >= 3) kind = 'polygon'
  return { points: ordered, closed: true, kind }
}

function sortPointsOnPlane(points: Point3[], plane: Plane): Point3[] {
  if (points.length <= 2) return points
  // centroid
  let cx = 0, cy = 0, cz = 0
  for (const p of points) { cx += p.x; cy += p.y; cz += p.z }
  cx /= points.length; cy /= points.length; cz /= points.length
  const center: Point3 = { x: cx, y: cy, z: cz }
  // build basis: find two orthonormal vectors in plane
  const n = { x: plane.a, y: plane.b, z: plane.c }
  const nLen = Math.sqrt(n.x * n.x + n.y * n.y + n.z * n.z)
  if (nLen < 1e-9) return points
  const nn = { x: n.x / nLen, y: n.y / nLen, z: n.z / nLen }
  // pick arbitrary not parallel to n
  let ap: Point3 = { x: 1, y: 0, z: 0 }
  if (Math.abs(nn.x) > 0.9) ap = { x: 0, y: 1, z: 0 }
  // u = ap - (ap·n)n
  const dot = ap.x * nn.x + ap.y * nn.y + ap.z * nn.z
  let ux = ap.x - dot * nn.x, uy = ap.y - dot * nn.y, uz = ap.z - dot * nn.z
  let ulen = Math.sqrt(ux * ux + uy * uy + uz * uz)
  if (ulen < 1e-9) {
    ap = { x: 0, y: 0, z: 1 }
    const d2 = ap.x * nn.x + ap.y * nn.y + ap.z * nn.z
    ux = ap.x - d2 * nn.x; uy = ap.y - d2 * nn.y; uz = ap.z - d2 * nn.z
    ulen = Math.sqrt(ux * ux + uy * uy + uz * uz)
  }
  ux /= ulen; uy /= ulen; uz /= ulen
  // v = n × u
  const vx = nn.y * uz - nn.z * uy
  const vy = nn.z * ux - nn.x * uz
  const vz = nn.x * uy - nn.y * ux
  // compute angle for each point relative to center projected
  const withAngle = points.map(p => {
    const dx = p.x - center.x, dy = p.y - center.y, dz = p.z - center.z
    const px = dx * ux + dy * uy + dz * uz
    const py = dx * vx + dy * vy + dz * vz
    return { p, ang: Math.atan2(py, px) }
  })
  withAngle.sort((a, b) => a.ang - b.ang)
  return withAngle.map(x => x.p)
}

// ========== helpers: رؤوس وأحرف للأشكال ==========
export function cuboidVertices(a: number, b: number, c: number): Point3[] {
  return [
    { x: 0, y: 0, z: 0 }, //0 A
    { x: a, y: 0, z: 0 }, //1 B
    { x: a, y: b, z: 0 }, //2 C
    { x: 0, y: b, z: 0 }, //3 D
    { x: 0, y: 0, z: c }, //4 E
    { x: a, y: 0, z: c }, //5 F
    { x: a, y: b, z: c }, //6 G
    { x: 0, y: b, z: c }, //7 H
  ]
}
export function cuboidEdges(): [number, number][] {
  return [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7],
  ]
}
export function tetrahedronVertices(A: Point3, B: Point3, C: Point3, D: Point3): Point3[] { return [A, B, C, D] }
export function tetrahedronEdges(): [number, number][] {
  return [[0, 1], [0, 2], [0, 3], [1, 2], [1, 3], [2, 3]]
}

// تصنيف نصي
export function sectionKindLabel(kind: SectionPolygon['kind']): string {
  switch (kind) {
    case 'none': return 'لا يوجد مقطع'
    case 'point': return 'نقطة'
    case 'segment': return 'قطعة'
    case 'triangle': return 'مثلث'
    case 'quadrilateral': return 'رباعي'
    case 'polygon': return 'مضلع'
  }
}
