import { Line, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo } from 'react'
import type { Line3, Point3 } from '../math/types'
import { pointOnLine } from '../math/lines'

type Props = {
  line: Line3
  mode?: 'line' | 'segment' | 'ray'
  extent?: number // طول الامتداد للعرض (نصف الطول للمستقيم)
  color?: string
  label?: string
  t?: number // نقطة متحركة
  showMovingPoint?: boolean
  showDirection?: boolean
}

export default function Line3D({
  line,
  mode = 'line',
  extent = 6,
  color = '#f59e0b',
  label,
  t,
  showMovingPoint = false,
  showDirection = true,
}: Props) {
  const { start, end, movingPos } = useMemo(() => {
    const P = line.point
    const u = line.direction
    // تطبيع للعرض؟ نستخدم u كما هو لكن للامتداد نحتاج scaled
    // نحسب نقاط النهاية حسب النمط
    let s: Point3, e: Point3
    if (mode === 'segment') {
      // القطعة من P إلى P+u (حيث u = B-A)
      s = P
      e = pointOnLine(line, 1)
    } else if (mode === 'ray') {
      // نصف المستقيم من P إلى +extent
      s = P
      // e = P + extent * (u normalized * (|u|? keep direction))
      // استخدم اتجاه الوحدة مضروباً بـ extent
      const len = Math.sqrt(u.x * u.x + u.y * u.y + u.z * u.z) || 1
      const ux = u.x / len, uy = u.y / len, uz = u.z / len
      e = { x: P.x + ux * extent, y: P.y + uy * extent, z: P.z + uz * extent }
    } else {
      // مستقيم كامل: من -extent إلى +extent
      const len = Math.sqrt(u.x * u.x + u.y * u.y + u.z * u.z) || 1
      const ux = u.x / len, uy = u.y / len, uz = u.z / len
      s = { x: P.x - ux * extent, y: P.y - uy * extent, z: P.z - uz * extent }
      e = { x: P.x + ux * extent, y: P.y + uy * extent, z: P.z + uz * extent }
    }
    const mv = t !== undefined ? pointOnLine(line, t) : null
    return { start: [s.x, s.y, s.z] as [number, number, number], end: [e.x, e.y, e.z] as [number, number, number], movingPos: mv ? ([mv.x, mv.y, mv.z] as [number, number, number]) : null }
  }, [line, mode, extent, t])

  // سهم الاتجاه عند نقطة قريبة من P في اتجاه u
  const dirArrow = useMemo(() => {
    if (!showDirection) return null
    const P = line.point
    const u = line.direction
    const len = Math.sqrt(u.x * u.x + u.y * u.y + u.z * u.z)
    if (len < 1e-9) return null
    const ux = u.x / len, uy = u.y / len, uz = u.z / len
    const tip: [number, number, number] = [P.x + ux * 1.1, P.y + uy * 1.1, P.z + uz * 1.1]
    const from = new THREE.Vector3(0, 1, 0)
    const to = new THREE.Vector3(ux, uy, uz)
    const quat = new THREE.Quaternion().setFromUnitVectors(from, to)
    return { tip, quat }
  }, [line, showDirection])

  // لون مختلف للقطعة vs المستقيم
  const lineColor = mode === 'segment' ? '#22c55e' : mode === 'ray' ? '#0ea5e9' : color
  const isSegment = mode === 'segment'

  return (
    <group>
      {/* الخط الرئيسي */}
      <Line points={[start, end]} color={lineColor} lineWidth={isSegment ? 4 : 2.5} />

      {/* نقطة P */}
      <mesh position={[line.point.x, line.point.y, line.point.z]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text position={[line.point.x + 0.18, line.point.y + 0.18, line.point.z + 0.12]} fontSize={0.2} color={color} anchorX="left" outlineWidth={0.02} outlineColor="white">
        P
      </Text>

      {/* سهم الاتجاه */}
      {dirArrow && (
        <mesh position={dirArrow.tip} quaternion={dirArrow.quat}>
          <coneGeometry args={[0.09, 0.26, 10]} />
          <meshStandardMaterial color={lineColor} />
        </mesh>
      )}

      {/* للقطعة: نقطة النهاية Q */}
      {isSegment && (
        <>
          <mesh position={end}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshStandardMaterial color={lineColor} />
          </mesh>
          <Text position={[end[0] + 0.18, end[1] + 0.18, end[2] + 0.12]} fontSize={0.2} color={lineColor} anchorX="left" outlineWidth={0.02} outlineColor="white">
            Q
          </Text>
        </>
      )}

      {/* نقطة متحركة عند t */}
      {showMovingPoint && movingPos && (
        <group>
          <mesh position={movingPos}>
            <sphereGeometry args={[0.14, 14, 14]} />
            <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.3} />
          </mesh>
          <Text position={[movingPos[0] + 0.22, movingPos[1] + 0.22, movingPos[2] + 0.12]} fontSize={0.22} color="#ef4444" anchorX="left" outlineWidth={0.02} outlineColor="white">
            {`X(t=${t})`}
          </Text>
          {/* خط متقطع من P إلى النقطة المتحركة للتوضيح */}
          <Line points={[[line.point.x, line.point.y, line.point.z], movingPos]} color="#ef4444" lineWidth={1.2} dashed dashSize={0.1} gapSize={0.07} />
        </group>
      )}

      {label && (
        <Text position={[(start[0] + end[0]) / 2 + 0.3, (start[1] + end[1]) / 2 + 0.3, (start[2] + end[2]) / 2 + 0.15]} fontSize={0.22} color={lineColor} anchorX="center" outlineWidth={0.02} outlineColor="white">
          {label}
        </Text>
      )}
    </group>
  )
}
