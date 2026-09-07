import { Line, Text } from '@react-three/drei'
import type { Point3 } from '../math/types'
import { distancePointPlane, projectionPointOnPlane } from '../math/distances'
import type { Plane } from '../math/types'

type Props = {
  baseA?: number
  baseB?: number
  height?: number
  showHeight?: boolean
  showCentroid?: boolean
}

export default function Pyramid3D({ baseA = 2, baseB = 2, height = 2.5, showHeight = true, showCentroid = false }: Props) {
  const A: Point3 = { x: 0, y: 0, z: 0 }
  const B: Point3 = { x: baseA, y: 0, z: 0 }
  const C: Point3 = { x: baseA, y: baseB, z: 0 }
  const D: Point3 = { x: 0, y: baseB, z: 0 }
  const S: Point3 = { x: baseA / 2, y: baseB / 2, z: height }
  const pts: Record<string, Point3> = { A, B, C, D, S }
  const toArr = (p: Point3): [number, number, number] => [p.x, p.y, p.z]
  const baseEdges: [string, string][] = [['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A']]
  const sideEdges: [string, string][] = [['S', 'A'], ['S', 'B'], ['S', 'C'], ['S', 'D']]

  // ارتفاع: المسقط على قاعدة z=0
  const basePlane: Plane = { a: 0, b: 0, c: 1, d: 0 }
  const foot = projectionPointOnPlane(S, basePlane)
  const hDist = distancePointPlane(S, basePlane)

  return (
    <group>
      {baseEdges.map(([s, e]) => (
        <Line key={`${s}-${e}`} points={[toArr(pts[s]), toArr(pts[e])]} color="#64748b" lineWidth={1.8} />
      ))}
      {sideEdges.map(([s, e]) => (
        <Line key={`${s}-${e}`} points={[toArr(pts[s]), toArr(pts[e])]} color="#7c3aed" lineWidth={1.5} />
      ))}
      {Object.entries(pts).map(([name, p]) => (
        <group key={name}>
          <mesh position={toArr(p)}>
            <sphereGeometry args={[0.07, 10, 10]} />
            <meshStandardMaterial color={name === 'S' ? '#ef4444' : '#0f172a'} />
          </mesh>
          <Text position={[p.x + 0.12, p.y + 0.12, p.z + 0.1]} fontSize={0.18} color="#0f172a" anchorX="left" outlineWidth={0.02} outlineColor="white">
            {name}
          </Text>
        </group>
      ))}
      {showHeight && foot && (
        <>
          <Line points={[[S.x, S.y, S.z], [foot.x, foot.y, foot.z]]} color="#22c55e" lineWidth={2} dashed dashSize={0.08} gapSize={0.05} />
          <Text position={[(S.x + foot.x) / 2 + 0.2, (S.y + foot.y) / 2, (S.z + foot.z) / 2]} fontSize={0.14} color="#22c55e">h={hDist?.toFixed(2)}</Text>
          <mesh position={[foot.x, foot.y, foot.z]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial color="#22c55e" />
          </mesh>
        </>
      )}
      {showCentroid && (
        <Text position={[baseA / 2, baseB / 2, height / 4]} fontSize={0.12} color="#7c3aed">G</Text>
      )}
    </group>
  )
}
