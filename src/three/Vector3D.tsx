import { Line, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo } from 'react'

type Props = {
  start: [number, number, number]
  end: [number, number, number]
  color?: string
  label?: string
  width?: number
}

export default function Vector3D({
  start,
  end,
  color = '#f59e0b',
  label,
  width = 2.8,
}: Props) {
  const { dir, len, mid } = useMemo(() => {
    const s = new THREE.Vector3(...start)
    const e = new THREE.Vector3(...end)
    const d = new THREE.Vector3().subVectors(e, s)
    const l = d.length()
    const m: [number, number, number] = [(s.x + e.x) / 2, (s.y + e.y) / 2, (s.z + e.z) / 2]
    return { dir: d, len: l, mid: m }
  }, [start, end])

  if (len < 0.001) return null

  // حساب اتجاه السهم (quaternion)
  const conePos: [number, number, number] = end
  // نحتاج إلى دوران — نستخدم مكون Cone موجه عبر lookAt
  // أسهل: نرسم Line + Cone منفصل مع حساب الـ quaternion يدوياً
  const normalized = dir.clone().normalize()
  // محور افتراضي للسهم هو +Y في coneGeometry، نحتاج quaternion من (0,1,0) إلى normalized
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    normalized
  )

  return (
    <group>
      <Line points={[start, end]} color={color} lineWidth={width} />

      {/* رأس السهم */}
      <mesh position={conePos} quaternion={quaternion}>
        <coneGeometry args={[0.11, 0.32, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* نقطة البداية */}
      <mesh position={start}>
        <sphereGeometry args={[0.07, 10, 10]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {label && (
        <Text
          position={[mid[0] + 0.2, mid[1] + 0.2, mid[2] + 0.2]}
          fontSize={0.26}
          color={color}
          anchorX="center"
          outlineWidth={0.02}
          outlineColor="white"
        >
          {label}
        </Text>
      )}
    </group>
  )
}
