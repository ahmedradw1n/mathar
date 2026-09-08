import { Line, Text } from '@react-three/drei'
import type { Point3 } from '../math/types'

export default function BarycenterGrouping3D({ A, B, C, G1, G, showG1 = true }: { A: Point3; B: Point3; C: Point3; G1: Point3 | null; G: Point3 | null; showG1?: boolean }) {
  const toArr = (p: Point3): [number, number, number] => [p.x, p.y, p.z]
  return (
    <group>
      <Line points={[toArr(A), toArr(B)]} color="#94a3b8" lineWidth={1.5} />
      {G1 && G && <Line points={[toArr(G1), toArr(C)]} color="#a78bfa" lineWidth={1.5} dashed dashSize={0.08} gapSize={0.05} />}
      {[A, B, C].map((p, i) => (
        <mesh key={i} position={toArr(p)}><sphereGeometry args={[0.08, 10, 10]} /><meshStandardMaterial color={['#0ea5e9', '#f43f5e', '#22c55e'][i]} /></mesh>
      ))}
      <Text position={[A.x + 0.12, A.y + 0.12, A.z + 0.1]} fontSize={0.14} color="#0f172a">A</Text>
      <Text position={[B.x + 0.12, B.y + 0.12, B.z + 0.1]} fontSize={0.14} color="#0f172a">B</Text>
      <Text position={[C.x + 0.12, C.y + 0.12, C.z + 0.1]} fontSize={0.14} color="#0f172a">C</Text>
      {showG1 && G1 && (
        <>
          <mesh position={toArr(G1)}><sphereGeometry args={[0.09, 10, 10]} /><meshStandardMaterial color="#f59e0b" /></mesh>
          <Text position={[G1.x + 0.13, G1.y + 0.13, G1.z + 0.1]} fontSize={0.14} color="#f59e0b">G₁</Text>
        </>
      )}
      {G && (
        <>
          <mesh position={toArr(G)}><sphereGeometry args={[0.11, 10, 10]} /><meshStandardMaterial color="#7c3aed" /></mesh>
          <Text position={[G.x + 0.14, G.y + 0.14, G.z + 0.1]} fontSize={0.16} color="#7c3aed" outlineWidth={0.02} outlineColor="white">G</Text>
        </>
      )}
    </group>
  )
}
