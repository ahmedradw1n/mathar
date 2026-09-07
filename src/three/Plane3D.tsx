import * as THREE from 'three'
import { useMemo } from 'react'
import { Text } from '@react-three/drei'
import type { Plane, Point3, Vector3 } from '../math/types'
import { planeNormal, pointOnPlane } from '../math/planes'

type Props = {
  plane: Plane
  size?: number
  color?: string
  opacity?: number
  showNormal?: boolean
  normalLength?: number
  label?: string
}

export default function Plane3D({
  plane,
  size = 6,
  color = '#7c3aed',
  opacity = 0.28,
  showNormal = true,
  normalLength = 1.6,
  label,
}: Props) {
  const { pos, quat, normal } = useMemo(() => {
    const n: Vector3 = planeNormal(plane)
    const len = Math.sqrt(n.x * n.x + n.y * n.y + n.z * n.z)
    const norm: Vector3 = len < 1e-9 ? { x: 0, y: 1, z: 0 } : { x: n.x / len, y: n.y / len, z: n.z / len }
    const p: Point3 | null = pointOnPlane(plane)
    const posArr: [number, number, number] = p ? [p.x, p.y, p.z] : [0, 0, 0]
    // PlaneGeometry normal is (0,0,1), rotate to norm
    const from = new THREE.Vector3(0, 0, 1)
    const to = new THREE.Vector3(norm.x, norm.y, norm.z)
    const q = new THREE.Quaternion().setFromUnitVectors(from, to)
    return { pos: posArr, quat: q, normal: norm }
  }, [plane])

  // حالة الشعاع الناظم الصفري → لا نعرض مستوى
  const isInvalid = plane.a === 0 && plane.b === 0 && plane.c === 0

  if (isInvalid) {
    return (
      <Text position={[0, 1, 0]} fontSize={0.3} color="#ef4444" anchorX="center">
        شعاع ناظم صفري — لا يحدد مستوى
      </Text>
    )
  }

  return (
    <group>
      <mesh position={pos} quaternion={quat}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} />
      </mesh>
      {/* شبكة خفيفة على المستوى */}
      <mesh position={pos} quaternion={quat}>
        <planeGeometry args={[size, size, 6, 6]} />
        <meshBasicMaterial wireframe color={color} transparent opacity={0.18} />
      </mesh>
      {/* إطار */}
      <mesh position={pos} quaternion={quat}>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial color={color} transparent opacity={0} wireframe={false} />
      </mesh>

      {showNormal && (
        <group>
          {/* نقطة على المستوى */}
          <mesh position={pos}>
            <sphereGeometry args={[0.07, 10, 10]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          {/* سهم الناظم */}
          <group position={pos}>
            {/* خط */}
            <mesh position={[normal.x * normalLength * 0.5, normal.y * normalLength * 0.5, normal.z * normalLength * 0.5]} quaternion={quatFromVec(normal)}>
              <cylinderGeometry args={[0.03, 0.03, normalLength, 8]} />
              <meshStandardMaterial color="#ef4444" />
            </mesh>
            {/* رأس */}
            <mesh position={[normal.x * normalLength, normal.y * normalLength, normal.z * normalLength]} quaternion={quatFromVec(normal)}>
              <coneGeometry args={[0.1, 0.28, 10]} />
              <meshStandardMaterial color="#ef4444" />
            </mesh>
          </group>
          <Text
            position={[pos[0] + normal.x * (normalLength + 0.35), pos[1] + normal.y * (normalLength + 0.35), pos[2] + normal.z * (normalLength + 0.35)]}
            fontSize={0.24}
            color="#ef4444"
            anchorX="center"
            outlineWidth={0.02}
            outlineColor="white"
          >
            ⃗n
          </Text>
        </group>
      )}

      {label && (
        <Text position={[pos[0], pos[1] + 0.02, pos[2]]} fontSize={0.2} color="#334155" anchorX="center">
          {label}
        </Text>
      )}
    </group>
  )
}

function quatFromVec(v: Vector3): THREE.Quaternion {
  const from = new THREE.Vector3(0, 1, 0)
  const to = new THREE.Vector3(v.x, v.y, v.z).normalize()
  if (to.length() < 1e-9) return new THREE.Quaternion()
  return new THREE.Quaternion().setFromUnitVectors(from, to)
}
