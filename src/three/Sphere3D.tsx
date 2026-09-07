import { Text, Line } from '@react-three/drei'
import type { Point3, Sphere } from '../math/types'
import * as THREE from 'three'

type Props = {
  sphere: Sphere | null
  showRadiusLine?: boolean
  pointOnSurface?: Point3 | null
  color?: string
  opacity?: number
}

export default function Sphere3D({ sphere, showRadiusLine = true, pointOnSurface = null, color = '#0ea5e9', opacity = 0.28 }: Props) {
  if (!sphere || sphere.radius <= 1e-9) {
    return <Text position={[0, 0.8, 0]} fontSize={0.25} color="#ef4444" anchorX="center">نصف قطر غير صالح</Text>
  }
  const { center: c, radius: r } = sphere

  // نقطة على السطح افتراضية إذا لم تعطَ: +r على x
  const surf = pointOnSurface ?? { x: c.x + r, y: c.y, z: c.z }

  return (
    <group>
      {/* الكرة */}
      <mesh position={[c.x, c.y, c.z]}>
        <sphereGeometry args={[r, 32, 32]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} />
      </mesh>
      {/* شبكة */}
      <mesh position={[c.x, c.y, c.z]}>
        <sphereGeometry args={[r * 1.001, 16, 16]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.12} />
      </mesh>
      {/* المركز */}
      <mesh position={[c.x, c.y, c.z]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <Text position={[c.x + 0.18, c.y + 0.18, c.z + 0.12]} fontSize={0.2} color="#0f172a" anchorX="left" outlineWidth={0.02} outlineColor="white">
        {`M(${c.x}|${c.y}|${c.z})`}
      </Text>
      {/* نصف القطر */}
      {showRadiusLine && (
        <>
          <Line points={[[c.x, c.y, c.z], [surf.x, surf.y, surf.z]]} color={color} lineWidth={2} />
          <Text position={[(c.x + surf.x) / 2 + 0.15, (c.y + surf.y) / 2 + 0.15, (c.z + surf.z) / 2 + 0.1]} fontSize={0.14} color={color} anchorX="center" outlineWidth={0.02} outlineColor="white">
            {`r=${r}`}
          </Text>
        </>
      )}
      {/* نقطة على السطح */}
      {pointOnSurface && (
        <>
          <mesh position={[pointOnSurface.x, pointOnSurface.y, pointOnSurface.z]}>
            <sphereGeometry args={[0.08, 10, 10]} />
            <meshStandardMaterial color="#22c55e" />
          </mesh>
          <Text position={[pointOnSurface.x + 0.15, pointOnSurface.y + 0.15, pointOnSurface.z + 0.1]} fontSize={0.16} color="#22c55e" anchorX="left" outlineWidth={0.02} outlineColor="white">A</Text>
        </>
      )}
    </group>
  )
}
