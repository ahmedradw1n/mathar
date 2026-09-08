import { Line, Text } from '@react-three/drei'
import type { Point3 } from '../math/types'

export default function BarycenterTetra3D({ A, B, C, D, G, showG = true, faceCentroid }: { A: Point3; B: Point3; C: Point3; D: Point3; G: Point3 | null; showG?: boolean; faceCentroid?: Point3 | null }) {
  const toArr = (p: Point3): [number, number, number] => [p.x, p.y, p.z]
  const edges: [Point3, Point3][] = [[A, B], [A, C], [A, D], [B, C], [B, D], [C, D]]
  return (
    <group>
      {edges.map(([p, q], i) => <Line key={i} points={[toArr(p), toArr(q)]} color="#94a3b8" lineWidth={1.2} />)}
      {[A, B, C, D].map((p, i) => (
        <mesh key={i} position={toArr(p)}><sphereGeometry args={[0.07, 10, 10]} /><meshStandardMaterial color={['#0ea5e9', '#f43f5e', '#22c55e', '#f59e0b'][i]} /></mesh>
      ))}
      {['A', 'B', 'C', 'D'].map((label, i) => {
        const p = [A, B, C, D][i]
        return <Text key={label} position={[p.x + 0.12, p.y + 0.12, p.z + 0.1]} fontSize={0.14} color="#0f172a">{label}</Text>
      })}
      {faceCentroid && (
        <>
          <mesh position={toArr(faceCentroid)}><sphereGeometry args={[0.07, 10, 10]} /><meshStandardMaterial color="#06b6d4" /></mesh>
          <Text position={[faceCentroid.x + 0.12, faceCentroid.y + 0.12, faceCentroid.z + 0.1]} fontSize={0.13} color="#06b6d4">Gbcd</Text>
          <Line points={[toArr(A), toArr(faceCentroid)]} color="#06b6d4" lineWidth={1} dashed dashSize={0.07} gapSize={0.05} />
        </>
      )}
      {showG && G && (
        <>
          <mesh position={toArr(G)}><sphereGeometry args={[0.1, 10, 10]} /><meshStandardMaterial color="#7c3aed" /></mesh>
          <Text position={[G.x + 0.14, G.y + 0.14, G.z + 0.1]} fontSize={0.15} color="#7c3aed" outlineWidth={0.02} outlineColor="white">G</Text>
        </>
      )}
    </group>
  )
}
