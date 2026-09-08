import { Line, Text } from '@react-three/drei'
import type { Point3 } from '../math/types'

type Props = {
  A: Point3
  B: Point3
  G: Point3 | null
  invalid?: boolean
}

export default function Barycenter2D3D({ A, B, G, invalid }: Props) {
  const toArr = (p: Point3): [number, number, number] => [p.x, p.y, p.z]
  return (
    <group>
      <Line points={[toArr(A), toArr(B)]} color="#94a3b8" lineWidth={2} />
      {[A, B].map((p, i) => (
        <mesh key={i} position={toArr(p)}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial color={i === 0 ? '#0ea5e9' : '#f43f5e'} />
        </mesh>
      ))}
      <Text position={[A.x + 0.15, A.y + 0.15, A.z + 0.1]} fontSize={0.16} color="#0f172a">A</Text>
      <Text position={[B.x + 0.15, B.y + 0.15, B.z + 0.1]} fontSize={0.16} color="#0f172a">B</Text>
      {G && !invalid && (
        <>
          <mesh position={toArr(G)}>
            <sphereGeometry args={[0.11, 12, 12]} />
            <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={0.3} />
          </mesh>
          <Text position={[G.x + 0.15, G.y + 0.15, G.z + 0.1]} fontSize={0.17} color="#7c3aed" outlineWidth={0.02} outlineColor="white">G</Text>
        </>
      )}
      {invalid && (
        <Text position={[ (A.x+B.x)/2, (A.y+B.y)/2 +0.4, (A.z+B.z)/2 ]} fontSize={0.14} color="#ef4444" outlineWidth={0.02} outlineColor="white">مجموع الأوزان≈0 — لا يوجد مركز</Text>
      )}
    </group>
  )
}
