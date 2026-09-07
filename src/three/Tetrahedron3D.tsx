import { Line, Text } from '@react-three/drei'
import type { Point3 } from '../math/types'
import { tetrahedronCentroid } from '../math/advancedGeometry'

type Props = {
  A?: Point3
  B?: Point3
  C?: Point3
  D?: Point3
  showCentroid?: boolean
}

export default function Tetrahedron3D({
  A = { x: 0, y: 0, z: 0 },
  B = { x: 2, y: 0, z: 0 },
  C = { x: 0, y: 2, z: 0 },
  D = { x: 0, y: 0, z: 2 },
  showCentroid = true,
}: Props) {
  const toArr = (p: Point3): [number, number, number] => [p.x, p.y, p.z]
  const G = tetrahedronCentroid(A, B, C, D)
  const edges: [Point3, Point3][] = [
    [A, B], [A, C], [A, D], [B, C], [B, D], [C, D],
  ]
  return (
    <group>
      {edges.map(([p, q], i) => (
        <Line key={i} points={[toArr(p), toArr(q)]} color="#64748b" lineWidth={1.5} />
      ))}
      {[A, B, C, D].map((p, i) => (
        <group key={i}>
          <mesh position={toArr(p)}>
            <sphereGeometry args={[0.07, 10, 10]} />
            <meshStandardMaterial color={['#0ea5e9', '#f43f5e', '#22c55e', '#f59e0b'][i]} />
          </mesh>
          <Text position={[p.x + 0.12, p.y + 0.12, p.z + 0.1]} fontSize={0.16} color="#0f172a" anchorX="left">
            {String.fromCharCode(65 + i)}
          </Text>
        </group>
      ))}
      {showCentroid && (
        <>
          <mesh position={[G.x, G.y, G.z]}>
            <sphereGeometry args={[0.09, 10, 10]} />
            <meshStandardMaterial color="#7c3aed" />
          </mesh>
          <Text position={[G.x + 0.15, G.y + 0.15, G.z + 0.1]} fontSize={0.16} color="#7c3aed" anchorX="left" outlineWidth={0.02} outlineColor="white">
            G
          </Text>
        </>
      )}
    </group>
  )
}
