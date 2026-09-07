import { Line, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo } from 'react'

type Props = {
  center: [number, number, number]
  vecA: [number, number, number]
  vecB: [number, number, number]
  radius?: number
  color?: string
  label?: string
}

export default function AngleArc({ center, vecA, vecB, radius = 0.7, color = '#7c3aed', label }: Props) {
  const { points, mid } = useMemo(() => {
    const c = new THREE.Vector3(...center)
    const a = new THREE.Vector3(...vecA).sub(c).normalize()
    const b = new THREE.Vector3(...vecB).sub(c).normalize()
    if (a.length() < 1e-6 || b.length() < 1e-6) return { points: [], mid: center as [number,number,number] }
    const angle = a.angleTo(b)
    const segments = Math.max(8, Math.floor(angle * 16))
    const axis = new THREE.Vector3().crossVectors(a, b)
    if (axis.length() < 1e-6) return { points: [], mid: center as [number,number,number] }
    axis.normalize()
    const pts: [number, number, number][] = []
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const q = new THREE.Quaternion().setFromAxisAngle(axis, angle * t)
      const v = a.clone().applyQuaternion(q).multiplyScalar(radius).add(c)
      pts.push([v.x, v.y, v.z])
    }
    // mid for label
    const halfQ = new THREE.Quaternion().setFromAxisAngle(axis, angle / 2)
    const m = a.clone().applyQuaternion(halfQ).multiplyScalar(radius * 1.35).add(c)
    return { points: pts, mid: [m.x, m.y, m.z] as [number, number, number] }
  }, [center, vecA, vecB, radius])

  if (points.length < 2) return null

  return (
    <group>
      <Line points={points} color={color} lineWidth={2.2} />
      {label && (
        <Text position={mid} fontSize={0.22} color={color} anchorX="center" outlineWidth={0.02} outlineColor="white">
          {label}
        </Text>
      )}
    </group>
  )
}
