import { Line, Text } from '@react-three/drei'
import type { Point3 } from '../math/types'

export default function Barycenter3D3D({ A, B, C, G }: { A: Point3; B: Point3; C: Point3; G: Point3 | null }) {
  const toArr = (p: Point3): [number, number, number] => [p.x, p.y, p.z]
  return (
    <group>
      <Line points={[toArr(A), toArr(B)]} color="#cbd5e1" lineWidth={1.2} />
      <Line points={[toArr(B), toArr(C)]} color="#cbd5e1" lineWidth={1.2} />
      <Line points={[toArr(C), toArr(A)]} color="#cbd5e1" lineWidth={1.2} />
      {[A, B, C].map((p, i) => (
        <mesh key={i} position={toArr(p)}>
          <sphereGeometry args={[0.08, 10, 10]} />
          <meshStandardMaterial color={['#0ea5e9', '#f43f5e', '#22c55e'][i]} />
        </mesh>
      ))}
      <Text position={[A.x + 0.12, A.y + 0.12, A.z + 0.1]} fontSize={0.15} color="#0f172a">A</Text>
      <Text position={[B.x + 0.12, B.y + 0.12, B.z + 0.1]} fontSize={0.15} color="#0f172a">B</Text>
      <Text position={[C.x + 0.12, C.y + 0.12, C.z + 0.1]} fontSize={0.15} color="#0f172a">C</Text>
      {G && (
        <>
          <mesh position={toArr(G)}>
            <sphereGeometry args={[0.1, 10, 10]} />
            <meshStandardMaterial color="#7c3aed" />
          </mesh>
          <Text position={[G.x + 0.14, G.y + 0.14, G.z + 0.1]} fontSize={0.16} color="#7c3aed" outlineWidth={0.02} outlineColor="white">G</Text>
        </>
      )}
    </group>
  )
}
