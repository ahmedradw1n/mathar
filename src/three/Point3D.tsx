import { Text, Line } from '@react-three/drei'

type Props = {
  position: [number, number, number]
  label?: string
  color?: string
  size?: number
  showProjection?: boolean
}

export default function Point3D({
  position,
  label,
  color = '#7c3aed',
  size = 0.13,
  showProjection = true,
}: Props) {
  const [x, y, z] = position

  return (
    <group>
      {/* الكرة */}
      <mesh position={position}>
        <sphereGeometry args={[size, 20, 20]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.15} />
      </mesh>

      {/* هالة */}
      <mesh position={position}>
        <sphereGeometry args={[size * 1.35, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.12} />
      </mesh>

      {/* تسمية */}
      {label && (
        <Text
          position={[x + 0.28, y + 0.28, z + 0.18]}
          fontSize={0.3}
          color="#0f172a"
          anchorX="left"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="white"
        >
          {label}
        </Text>
      )}

      {/* إسقاطات متقطعة على المحاور */}
      {showProjection && (
        <>
          {/* عمود من النقطة إلى المستوي xy */}
          <Line
            points={[
              [x, y, z],
              [x, y, 0],
            ]}
            color={color}
            lineWidth={1.5}
            dashed
            dashScale={6}
            dashSize={0.12}
            gapSize={0.08}
          />
          <Line
            points={[
              [x, y, 0],
              [x, 0, 0],
            ]}
            color="#94a3b8"
            lineWidth={1}
            dashed
            dashScale={6}
            dashSize={0.08}
            gapSize={0.06}
          />
          <Line
            points={[
              [x, y, 0],
              [0, y, 0],
            ]}
            color="#94a3b8"
            lineWidth={1}
            dashed
            dashScale={6}
            dashSize={0.08}
            gapSize={0.06}
          />
        </>
      )}

      {/* نقاط الإسقاط الصغيرة */}
      {showProjection && (
        <mesh position={[x, y, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color={color} opacity={0.55} transparent />
        </mesh>
      )}
    </group>
  )
}
