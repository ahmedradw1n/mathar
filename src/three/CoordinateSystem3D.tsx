import { Line, Text, Grid } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo } from 'react'

const AXIS_LEN = 5.5

function Axis({
  color,
  dir,
  label,
}: {
  color: string
  dir: [number, number, number]
  label: string
}) {
  const start: [number, number, number] = [0, 0, 0]
  const end: [number, number, number] = [
    dir[0] * AXIS_LEN,
    dir[1] * AXIS_LEN,
    dir[2] * AXIS_LEN,
  ]
  const shaftEnd: [number, number, number] = [
    dir[0] * (AXIS_LEN - 0.35),
    dir[1] * (AXIS_LEN - 0.35),
    dir[2] * (AXIS_LEN - 0.35),
  ]

  const quat = useMemo(() => {
    const from = new THREE.Vector3(0, 1, 0)
    const to = new THREE.Vector3(dir[0], dir[1], dir[2]).normalize()
    return new THREE.Quaternion().setFromUnitVectors(from, to)
  }, [dir])

  return (
    <group>
      <Line points={[start, shaftEnd]} color={color} lineWidth={3} />
      {/* رأس السهم — موجه حسب المحور */}
      <mesh position={end} quaternion={quat}>
        <coneGeometry args={[0.09, 0.35, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* تسمية المحور */}
      <Text
        position={[end[0] + dir[0] * 0.35, end[1] + dir[1] * 0.35, end[2] + dir[2] * 0.35]}
        fontSize={0.45}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="white"
      >
        {label}
      </Text>
      {/* تدريجات */}
      {Array.from({ length: AXIS_LEN }, (_, i) => i + 1).map((v) => (
        <group key={v}>
          <mesh
            position={[dir[0] * v, dir[1] * v, dir[2] * v]}
          >
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshStandardMaterial color={color} opacity={0.9} transparent />
          </mesh>
          <Text
            position={[
              dir[0] * v + 0.18,
              dir[1] * v + 0.18,
              dir[2] * v + 0.18,
            ]}
            fontSize={0.22}
            color="#334155"
            anchorX="center"
            anchorY="middle"
          >
            {v}
          </Text>
        </group>
      ))}
      {/* تدريجات سالبة */}
      {Array.from({ length: 2 }, (_, i) => -(i + 1)).map((v) => (
        <mesh key={`n${v}`} position={[dir[0] * v, dir[1] * v, dir[2] * v]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshStandardMaterial color={color} opacity={0.45} transparent />
        </mesh>
      ))}
    </group>
  )
}

export default function CoordinateSystem3D() {
  return (
    <group>
      {/* شبكة أرضية على xy — مصدر واحد فقط (Drei Grid) */}
      <Grid
        position={[0, 0, -0.01]}
        args={[14, 14]}
        cellSize={1}
        cellThickness={0.6}
        cellColor="#e2e8f0"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#94a3b8"
        fadeDistance={16}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid={false}
      />

      {/* المحاور */}
      <Axis color="#ef4444" dir={[1, 0, 0]} label="x" />
      <Axis color="#22c55e" dir={[0, 1, 0]} label="y" />
      <Axis color="#3b82f6" dir={[0, 0, 1]} label="z" />

      {/* نقطة الأصل */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <Text position={[0.22, -0.22, 0]} fontSize={0.28} color="#0f172a" anchorX="center">
        O
      </Text>

      {/* مستويات إحداثية شفافة خفيفة */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <planeGeometry args={[0.01, 0.01]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  )
}
