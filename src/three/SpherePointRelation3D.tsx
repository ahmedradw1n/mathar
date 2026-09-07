import { Text, Line } from '@react-three/drei'
import Sphere3D from './Sphere3D'
import Point3D from './Point3D'
import type { Point3, Sphere } from '../math/types'
import { pointSphereRelation } from '../math/spheres'
import { distanceBetweenPoints } from '../math/points'

type Props = {
  sphere: Sphere | null
  point: Point3
}

export default function SpherePointRelation3D({ sphere, point }: Props) {
  if (!sphere) return <Text position={[0, 0.5, 0]} fontSize={0.25} color="#ef4444">كرة غير صالحة</Text>
  const rel = pointSphereRelation(point, sphere)
  const d = distanceBetweenPoints(point, sphere.center)
  const color = rel === 'onSurface' ? '#22c55e' : rel === 'inside' ? '#f59e0b' : '#ef4444'
  const label = rel === 'onSurface' ? 'على السطح' : rel === 'inside' ? 'داخل الكرة' : 'خارج الكرة'

  return (
    <group>
      <Sphere3D sphere={sphere} color="#0ea5e9" opacity={0.22} pointOnSurface={null} />
      <Point3D position={[point.x, point.y, point.z]} label={`A(${point.x}|${point.y}|${point.z})`} color={color} showProjection={false} />
      <Line points={[[sphere.center.x, sphere.center.y, sphere.center.z], [point.x, point.y, point.z]]} color={color} lineWidth={2} dashed dashSize={0.08} gapSize={0.05} />
      <Text position={[(sphere.center.x + point.x) / 2 + 0.15, (sphere.center.y + point.y) / 2 + 0.15, (sphere.center.z + point.z) / 2 + 0.1]} fontSize={0.14} color={color} anchorX="center" outlineWidth={0.02} outlineColor="white">
        {`|MA|=${d.toFixed(2)} vs r=${sphere.radius}`}
      </Text>
      <Text position={[0, sphere.center.y + sphere.radius + 0.6, sphere.center.z]} fontSize={0.18} color={color} anchorX="center" outlineWidth={0.02} outlineColor="white">
        {label}
      </Text>
    </group>
  )
}
