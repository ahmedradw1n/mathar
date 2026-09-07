/**
 * الأنواع الأساسية — الفصل الصارم بين النقطة والشعاع
 * Point3: موقع في الفضاء
 * Vector3: اتجاه وطول، له مركبات
 */

// النقطة في الفضاء
export type Point3 = {
  x: number
  y: number
  z: number
}

// الشعاع في الفضاء — نفس البنية لكن دلالة مختلفة
export type Vector3 = {
  x: number
  y: number
  z: number
}

// المستقيم: نقطة + شعاع اتجاه (⃗x = ⃗p + t·⃗u)
export type Line3 = {
  point: Point3
  direction: Vector3
}

// المستوى: ax + by + cz + d = 0  حيث الشعاع الناظم = (a,b,c)
export type Plane = {
  a: number
  b: number
  c: number
  d: number
}

// الكرة: مركز + نصف قطر
export type Sphere = {
  center: Point3
  radius: number
}

// نتيجة علاقة الكرة والمستوى
export type SpherePlaneRelation = 'outside' | 'tangent' | 'intersecting'

// نتيجة وضع مستقيم-مستقيم
export type LineLineRelation = 'coincident' | 'parallel' | 'intersecting' | 'skew'

// وضع مستقيم-مستوى
export type LinePlaneRelation = 'in-plane' | 'parallel' | 'intersecting'

// وضع مستوى-مستوى
export type PlanePlaneRelation = 'coincident' | 'parallel' | 'intersecting'

// helpers للتحويل إلى مصفوفة Three.js
export function toTuple(p: Point3 | Vector3): [number, number, number] {
  return [p.x, p.y, p.z]
}

export function fromTuple([x, y, z]: [number, number, number]): Point3 {
  return { x, y, z }
}
