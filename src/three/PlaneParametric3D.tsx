import { Line, Text } from '@react-three/drei'
import Plane3D from './Plane3D'
import Point3D from './Point3D'
import type { Point3, Vector3 } from '../math/types'
import { planeFromPointAndTwoVectors } from '../math/planes'
import { planeParametricPoint } from '../math/geometryShapes'

type Props = {
  P: Point3
  u: Vector3
  v: Vector3
  r: number
  s: number
}

export default function PlaneParametric3D({ P, u, v, r, s }: Props) {
  const plane = planeFromPointAndTwoVectors(P, u, v)
  const X = planeParametricPoint(P, u, v, r, s)
  const Pu: Point3 = { x: P.x + u.x, y: P.y + u.y, z: P.z + u.z }
  const Pv: Point3 = { x: P.x + v.x, y: P.y + v.y, z: P.z + v.z }

  return (
    <group>
      {plane && <Plane3D plane={plane} color="#7c3aed" opacity={0.18} />}
      <Point3D position={[P.x, P.y, P.z]} label="P" color="#0f172a" showProjection={false} />
      {/* u و v */}
      <Line points={[[P.x, P.y, P.z], [Pu.x, Pu.y, Pu.z]]} color="#ef4444" lineWidth={2.5} />
      <Text position={[Pu.x + 0.15, Pu.y + 0.15, Pu.z + 0.1]} fontSize={0.14} color="#ef4444">u</Text>
      <Line points={[[P.x, P.y, P.z], [Pv.x, Pv.y, Pv.z]]} color="#22c55e" lineWidth={2.5} />
      <Text position={[Pv.x + 0.15, Pv.y + 0.15, Pv.z + 0.1]} fontSize={0.14} color="#22c55e">v</Text>
      {/* r·u و s·v */}
      <Line points={[[P.x, P.y, P.z], [P.x + r * u.x, P.y + r * u.y, P.z + r * u.z]]} color="#f59e0b" lineWidth={2} dashed dashSize={0.08} gapSize={0.05} />
      <Line points={[[P.x + r * u.x, P.y + r * u.y, P.z + r * u.z], [X.x, X.y, X.z]]} color="#0ea5e9" lineWidth={2} dashed dashSize={0.08} gapSize={0.05} />
      <Point3D position={[X.x, X.y, X.z]} label={`X(r=${r},s=${s})`} color="#7c3aed" showProjection={false} />
      <Text position={[X.x + 0.2, X.y + 0.2, X.z + 0.15]} fontSize={0.12} color="#64748b">r·u + s·v</Text>
    </group>
  )
}
