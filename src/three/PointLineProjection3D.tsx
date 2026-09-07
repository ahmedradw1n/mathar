import { Text, Line } from '@react-three/drei'
import Point3D from './Point3D'
import Line3D from './Line3D'
import RightAngleMark from './RightAngleMark'
import type { Point3, Line3 } from '../math/types'
import { projectionPointOnLine, distancePointLine } from '../math/distances'
import { parameterOfProjection } from '../math/lines'

type Props = {
  A: Point3
  line: Line3
  showValues?: boolean
}

export default function PointLineProjection3D({ A, line, showValues = true }: Props) {
  const H = projectionPointOnLine(A, line)
  const dist = distancePointLine(A, line)
  const t = H ? parameterOfProjection(A, line) : null
  const isValid = !!H && dist !== null

  if (!isValid || !H || dist === null || t === null) {
    return (
      <group>
        <Line3D line={line} color="#94a3b8" />
        <Point3D position={[A.x, A.y, A.z]} label="A" color="#ef4444" showProjection={false} />
        <Text position={[0, 0.5, 0]} fontSize={0.25} color="#ef4444" anchorX="center">شعاع اتجاه صفري — لا خط</Text>
      </group>
    )
  }

  const Hpos: [number, number, number] = [H.x, H.y, H.z]
  const Apos: [number, number, number] = [A.x, A.y, A.z]
  const dirNorm = (() => {
    const len = Math.sqrt(line.direction.x ** 2 + line.direction.y ** 2 + line.direction.z ** 2) || 1
    return { x: line.direction.x / len, y: line.direction.y / len, z: line.direction.z / len }
  })()
  // لـ RightAngleMark نحتاج متجه AH واتجاه المستقيم
  const ahDir = { x: A.x - H.x, y: A.y - H.y, z: A.z - H.z }
  const ahLen = Math.sqrt(ahDir.x ** 2 + ahDir.y ** 2 + ahDir.z ** 2) || 1
  const ahNorm = { x: ahDir.x / ahLen, y: ahDir.y / ahLen, z: ahDir.z / ahLen }

  return (
    <group>
      <Line3D line={line} color="#f59e0b" label="g" />
      <Point3D position={Apos} label="A" color="#ef4444" showProjection={false} />
      <Point3D position={Hpos} label="H" color="#22c55e" showProjection={false} />
      {/* القطعة AH */}
      <Line points={[Apos, Hpos]} color="#ef4444" lineWidth={3} />
      {/* علامة قائمة عند H إذا كانت المسافة > EPS */}
      {dist > 1e-9 && <RightAngleMark center={Hpos} dirA={[dirNorm.x, dirNorm.y, dirNorm.z]} dirB={[ahNorm.x, ahNorm.y, ahNorm.z]} color="#22c55e" />}
      {showValues && (
        <>
          <Text position={[ (A.x + H.x)/2 + 0.15, (A.y + H.y)/2 + 0.15, (A.z + H.z)/2 + 0.1 ]} fontSize={0.18} color="#ef4444" anchorX="center" outlineWidth={0.02} outlineColor="white">
            {`d=${dist.toFixed(2)}`}
          </Text>
          <Text position={[H.x + 0.25, H.y + 0.25, H.z + 0.15]} fontSize={0.16} color="#22c55e" anchorX="left" outlineWidth={0.02} outlineColor="white">
            {`t=${t.toFixed(2)}`}
          </Text>
        </>
      )}
    </group>
  )
}
