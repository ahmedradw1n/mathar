import Plane3D from './Plane3D'
import Line3D from './Line3D'
import Point3D from './Point3D'
import Vector3D from './Vector3D'
import { Text } from '@react-three/drei'
import type { Plane } from '../math/types'
import { planeNormal } from '../math/planes'
import { intersectPlanes } from '../math/planes'

type Props = { p1: Plane; p2: Plane }

export default function PlanePlaneIntersection3D({ p1, p2 }: Props) {
  const n1 = planeNormal(p1), n2 = planeNormal(p2)
  const line = intersectPlanes(p1, p2)
  const n1Len = Math.sqrt(n1.x ** 2 + n1.y ** 2 + n1.z ** 2) || 1
  const n2Len = Math.sqrt(n2.x ** 2 + n2.y ** 2 + n2.z ** 2) || 1

  return (
    <group>
      <Plane3D plane={p1} color="#0ea5e9" opacity={0.18} showNormal={false} />
      <Plane3D plane={p2} color="#f43f5e" opacity={0.18} showNormal={false} />
      {/* الناظمان */}
      <Vector3D start={[0, 0, 0]} end={[n1.x / n1Len * 1.5, n1.y / n1Len * 1.5, n1.z / n1Len * 1.5]} color="#0ea5e9" label="n₁" />
      <Vector3D start={[0, 0, 0]} end={[n2.x / n2Len * 1.5, n2.y / n2Len * 1.5, n2.z / n2Len * 1.5]} color="#f43f5e" label="n₂" />
      {line ? (
        <>
          <Line3D line={line} color="#22c55e" label="s" />
          <Point3D position={[line.point.x, line.point.y, line.point.z]} label="P" color="#22c55e" showProjection={false} />
          <Text position={[line.point.x + 0.3, line.point.y + 0.3, line.point.z + 0.3]} fontSize={0.14} color="#22c55e" anchorX="left">u=n₁×n₂</Text>
        </>
      ) : (
        <Text position={[0, 1, 0]} fontSize={0.22} color="#64748b" anchorX="center">متوازيان/متطابقان — لا خط وحيد</Text>
      )}
    </group>
  )
}
