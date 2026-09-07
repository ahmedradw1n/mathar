import { Text, Line } from '@react-three/drei'
import Point3D from './Point3D'
import Plane3D from './Plane3D'
import type { Point3, Plane } from '../math/types'
import { projectionPointOnPlane, distancePointPlane } from '../math/distances'
import { planeNormal } from '../math/planes'

type Props = {
  A: Point3
  plane: Plane
  showValues?: boolean
}

export default function PointPlaneProjection3D({ A, plane, showValues = true }: Props) {
  const H = projectionPointOnPlane(A, plane)
  const dist = distancePointPlane(A, plane)
  const n = planeNormal(plane)
  const nLen = Math.sqrt(n.x ** 2 + n.y ** 2 + n.z ** 2) || 1
  const nNorm = { x: n.x / nLen, y: n.y / nLen, z: n.z / nLen }

  if (!H || dist === null) {
    return (
      <group>
        <Plane3D plane={plane} color="#94a3b8" opacity={0.15} showNormal={false} />
        <Point3D position={[A.x, A.y, A.z]} label="A" color="#ef4444" showProjection={false} />
        <Text position={[0, 0.5, 0]} fontSize={0.25} color="#ef4444" anchorX="center">شعاع ناظم صفري — لا مستوى</Text>
      </group>
    )
  }

  const Hpos: [number, number, number] = [H.x, H.y, H.z]
  const Apos: [number, number, number] = [A.x, A.y, A.z]

  return (
    <group>
      <Plane3D plane={plane} color="#7c3aed" opacity={0.22} showNormal />
      <Point3D position={Apos} label="A" color="#ef4444" showProjection={false} />
      <Point3D position={Hpos} label="H" color="#22c55e" showProjection={false} />
      {/* AH */}
      <Line points={[Apos, Hpos]} color="#ef4444" lineWidth={3} />
      {/* خط يوضح اتجاه الناظم عند H (امتداد صغير) */}
      <Line points={[Hpos, [H.x + nNorm.x * 0.6, H.y + nNorm.y * 0.6, H.z + nNorm.z * 0.6]]} color="#0ea5e9" lineWidth={1.5} dashed dashSize={0.08} gapSize={0.05} />
      {showValues && (
        <>
          <Text position={[(A.x + H.x) / 2 + 0.15, (A.y + H.y) / 2 + 0.15, (A.z + H.z) / 2 + 0.1]} fontSize={0.18} color="#ef4444" anchorX="center" outlineWidth={0.02} outlineColor="white">
            {`d=${dist.toFixed(2)}`}
          </Text>
          <Text position={[H.x + 0.25, H.y + 0.25, H.z + 0.1]} fontSize={0.14} color="#64748b" anchorX="left" outlineWidth={0.02} outlineColor="white">
            {`H(${H.x.toFixed(1)},${H.y.toFixed(1)},${H.z.toFixed(1)})`}
          </Text>
        </>
      )}
    </group>
  )
}
