import { Text, Line } from '@react-three/drei'
import Sphere3D from './Sphere3D'
import Point3D from './Point3D'
import type { Point3, Sphere } from '../math/types'
import { distanceBetweenPoints } from '../math/points'

type Props = { points: Point3[]; sphere: Sphere | null }

export default function Circumsphere3D({ points, sphere }: Props) {
  return (
    <group>
      {sphere && <Sphere3D sphere={sphere} color="#7c3aed" opacity={0.18} />}
      {points.map((p, i) => (
        <Point3D key={i} position={[p.x, p.y, p.z]} label={`${String.fromCharCode(65 + i)}`} color={i === 0 ? '#0ea5e9' : i === 1 ? '#f43f5e' : i === 2 ? '#22c55e' : '#f59e0b'} showProjection={false} />
      ))}
      {sphere && points.map((p, i) => {
        const mid: [number, number, number] = [(sphere.center.x + p.x) / 2, (sphere.center.y + p.y) / 2, (sphere.center.z + p.z) / 2]
        const d = distanceBetweenPoints(sphere.center, p)
        return (
          <group key={`l-${i}`}>
            <Line points={[[sphere.center.x, sphere.center.y, sphere.center.z], [p.x, p.y, p.z]]} color="#94a3b8" lineWidth={1.2} dashed dashSize={0.08} gapSize={0.05} />
            <Text position={[mid[0], mid[1] + 0.12, mid[2]]} fontSize={0.11} color="#64748b" anchorX="center">{d.toFixed(2)}</Text>
          </group>
        )
      })}
      {sphere && <Point3D position={[sphere.center.x, sphere.center.y, sphere.center.z]} label={`M r=${sphere.radius.toFixed(2)}`} color="#7c3aed" showProjection={false} />}
    </group>
  )
}
