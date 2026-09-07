import { Line, Text } from '@react-three/drei'
import Point3D from './Point3D'
import type { Point3 } from '../math/types'
import { triangleCentroid, tetrahedronCentroid } from '../math/advancedGeometry'

type Props = { points: Point3[] } // 3 للمثلث، 4 لرباعي الوجوه

export default function Centroid3D({ points }: Props) {
  const isTri = points.length === 3
  const isTet = points.length === 4
  const G = isTri ? triangleCentroid(points[0], points[1], points[2]) : isTet ? tetrahedronCentroid(points[0], points[1], points[2], points[3]) : points[0]

  // متوسطات للمثلث: من كل رأس إلى منتصف الضلع المقابل
  const mids = isTri ? [
    { x: (points[1].x + points[2].x) / 2, y: (points[1].y + points[2].y) / 2, z: (points[1].z + points[2].z) / 2 },
    { x: (points[0].x + points[2].x) / 2, y: (points[0].y + points[2].y) / 2, z: (points[0].z + points[2].z) / 2 },
    { x: (points[0].x + points[1].x) / 2, y: (points[0].y + points[1].y) / 2, z: (points[0].z + points[1].z) / 2 },
  ] : []

  return (
    <group>
      {/* الرؤوس */}
      {points.map((p, i) => (
        <Point3D key={i} position={[p.x, p.y, p.z]} label={`${String.fromCharCode(65 + i)}`} color={['#0ea5e9', '#f43f5e', '#22c55e', '#f59e0b'][i]} showProjection={false} />
      ))}
      {/* أضلاع المثلث */}
      {isTri && (
        <>
          <Line points={[[points[0].x, points[0].y, points[0].z], [points[1].x, points[1].y, points[1].z]]} color="#94a3b8" lineWidth={1.2} />
          <Line points={[[points[1].x, points[1].y, points[1].z], [points[2].x, points[2].y, points[2].z]]} color="#94a3b8" lineWidth={1.2} />
          <Line points={[[points[2].x, points[2].y, points[2].z], [points[0].x, points[0].y, points[0].z]]} color="#94a3b8" lineWidth={1.2} />
          {/* متوسطات */}
          <Line points={[[points[0].x, points[0].y, points[0].z], [mids[0].x, mids[0].y, mids[0].z]]} color="#f59e0b" lineWidth={1.5} dashed dashSize={0.08} gapSize={0.05} />
          <Line points={[[points[1].x, points[1].y, points[1].z], [mids[1].x, mids[1].y, mids[1].z]]} color="#f59e0b" lineWidth={1.5} dashed dashSize={0.08} gapSize={0.05} />
          <Line points={[[points[2].x, points[2].y, points[2].z], [mids[2].x, mids[2].y, mids[2].z]]} color="#f59e0b" lineWidth={1.5} dashed dashSize={0.08} gapSize={0.05} />
        </>
      )}
      {/* G */}
      <Point3D position={[G.x, G.y, G.z]} label={`G(${G.x.toFixed(1)}|${G.y.toFixed(1)}|${G.z.toFixed(1)})`} color="#7c3aed" showProjection={false} />
      <Text position={[G.x + 0.25, G.y + 0.25, G.z + 0.15]} fontSize={0.14} color="#7c3aed" anchorX="left">2:1</Text>
    </group>
  )
}
