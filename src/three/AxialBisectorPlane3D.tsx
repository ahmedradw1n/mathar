import { Line, Text } from '@react-three/drei'
import Plane3D from './Plane3D'
import Point3D from './Point3D'
import type { Point3 } from '../math/types'
import { axialBisectorPlane, isOnAxialBisector } from '../math/geometryShapes'
import { distanceBetweenPoints } from '../math/points'

type Props = { A: Point3; B: Point3; X?: Point3 }

export default function AxialBisectorPlane3D({ A, B, X }: Props) {
  const plane = axialBisectorPlane(A, B)
  const mid: Point3 = { x: (A.x + B.x) / 2, y: (A.y + B.y) / 2, z: (A.z + B.z) / 2 }
  const testX = X ?? mid
  const on = isOnAxialBisector(testX, A, B)
  const dA = distanceBetweenPoints(testX, A)
  const dB = distanceBetweenPoints(testX, B)

  return (
    <group>
      <Point3D position={[A.x, A.y, A.z]} label="A" color="#0ea5e9" showProjection={false} />
      <Point3D position={[B.x, B.y, B.z]} label="B" color="#f43f5e" showProjection={false} />
      <Line points={[[A.x, A.y, A.z], [B.x, B.y, B.z]]} color="#94a3b8" lineWidth={1.5} />
      <Point3D position={[mid.x, mid.y, mid.z]} label="M" color="#22c55e" showProjection={false} />
      {plane && <Plane3D plane={plane} color="#7c3aed" opacity={0.2} />}
      {X && (
        <>
          <Point3D position={[testX.x, testX.y, testX.z]} label={`X ${on ? '✓' : '✗'}`} color={on ? '#22c55e' : '#ef4444'} showProjection={false} />
          <Text position={[testX.x + 0.3, testX.y + 0.3, testX.z + 0.15]} fontSize={0.12} color={on ? '#22c55e' : '#ef4444'}>
            {`|XA|=${dA.toFixed(2)} |XB|=${dB.toFixed(2)} ${on ? 'متساوية' : 'غير متساوية'}`}
          </Text>
        </>
      )}
      <Text position={[mid.x + 0.5, mid.y + 0.5, mid.z + 0.3]} fontSize={0.12} color="#7c3aed">المستوى المحوري</Text>
    </group>
  )
}
