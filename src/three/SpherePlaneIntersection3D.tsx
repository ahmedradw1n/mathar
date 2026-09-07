import { Line, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo } from 'react'
import Sphere3D from './Sphere3D'
import Plane3D from './Plane3D'
import Point3D from './Point3D'
import type { Sphere, Plane } from '../math/types'
import { spherePlaneIntersectionDetailed } from '../math/spheres'
import { planeNormal } from '../math/planes'

type Props = {
  sphere: Sphere | null
  plane: Plane
  showCircle?: boolean
}

function buildCircle(center: [number, number, number], radius: number, normal: [number, number, number], segments = 64): [number, number, number][] {
  const n = new THREE.Vector3(...normal).normalize()
  // اختر e1 عمودي على n
  const tmp = Math.abs(n.x) < 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0)
  const e1 = new THREE.Vector3().crossVectors(n, tmp).normalize()
  const e2 = new THREE.Vector3().crossVectors(n, e1).normalize()
  const c = new THREE.Vector3(...center)
  const pts: [number, number, number][] = []
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2
    const p = c.clone().add(e1.clone().multiplyScalar(Math.cos(theta) * radius)).add(e2.clone().multiplyScalar(Math.sin(theta) * radius))
    pts.push([p.x, p.y, p.z])
  }
  return pts
}

export default function SpherePlaneIntersection3D({ sphere, plane, showCircle = true }: Props) {
  const detail = useMemo(() => {
    if (!sphere) return { kind: 'invalid', reason: 'كرة غير صالحة' } as any
    return spherePlaneIntersectionDetailed(sphere, plane)
  }, [sphere, plane])

  const n = planeNormal(plane)
  const nLen = Math.sqrt(n.x ** 2 + n.y ** 2 + n.z ** 2) || 1
  const nNorm: [number, number, number] = [n.x / nLen, n.y / nLen, n.z / nLen]

  const circlePts = useMemo(() => {
    if (detail.kind !== 'intersecting') return null
    return buildCircle([detail.center.x, detail.center.y, detail.center.z], detail.rho, nNorm)
  }, [detail, nNorm])

  const label = detail.kind === 'disjoint' ? 'لا يوجد تقاطع' : detail.kind === 'tangent' ? 'تماس' : detail.kind === 'intersecting' ? 'تقاطع في دائرة' : 'غير صالح'
  const labelColor = detail.kind === 'disjoint' ? '#64748b' : detail.kind === 'tangent' ? '#f59e0b' : detail.kind === 'intersecting' ? '#22c55e' : '#ef4444'

  return (
    <group>
      {sphere && <Sphere3D sphere={sphere} color="#0ea5e9" opacity={0.2} />}
      <Plane3D plane={plane} color="#7c3aed" opacity={0.18} />
      {sphere && <Point3D position={[sphere.center.x, sphere.center.y, sphere.center.z]} label={`M`} color="#0f172a" showProjection={false} />}
      {detail.kind !== 'invalid' && detail.kind !== 'disjoint' && 'point' in detail && (
        <Point3D position={[detail.point.x, detail.point.y, detail.point.z]} label="H (تماس)" color="#f59e0b" showProjection={false} />
      )}
      {detail.kind === 'disjoint' && detail.H && <Point3D position={[detail.H.x, detail.H.y, detail.H.z]} label="H" color="#94a3b8" showProjection={false} />}
      {detail.kind === 'intersecting' && detail.center && (
        <>
          <Point3D position={[detail.center.x, detail.center.y, detail.center.z]} label="H مركز الدائرة" color="#22c55e" showProjection={false} />
          {/* MH */}
          {sphere && <Line points={[[sphere.center.x, sphere.center.y, sphere.center.z], [detail.center.x, detail.center.y, detail.center.z]]} color="#ef4444" lineWidth={2} />}
          {circlePts && showCircle && <Line points={circlePts} color="#22c55e" lineWidth={2.5} />}
          <Text position={[detail.center.x + 0.3, detail.center.y + 0.3, detail.center.z + 0.2]} fontSize={0.14} color="#22c55e" anchorX="left" outlineWidth={0.02} outlineColor="white">
            {`ρ=${detail.rho.toFixed(2)}`}
          </Text>
        </>
      )}
      {detail.kind === 'tangent' && sphere && 'point' in detail && (
        <Line points={[[sphere.center.x, sphere.center.y, sphere.center.z], [detail.point.x, detail.point.y, detail.point.z]]} color="#ef4444" lineWidth={2} />
      )}
      {detail.kind === 'disjoint' && sphere && detail.H && (
        <Line points={[[sphere.center.x, sphere.center.y, sphere.center.z], [detail.H.x, detail.H.y, detail.H.z]]} color="#94a3b8" lineWidth={2} dashed dashSize={0.08} gapSize={0.05} />
      )}
      <Text position={[0, (sphere?.center.y ?? 0) + (sphere?.radius ?? 2) + 1, 0]} fontSize={0.18} color={labelColor} anchorX="center" outlineWidth={0.02} outlineColor="white">
        {label} {detail.kind !== 'invalid' && 'delta' in detail ? `δ=${(detail as any).delta.toFixed(2)} r=${sphere?.radius}` : ''}
      </Text>
      {detail.kind === 'invalid' && <Text position={[0, 0, 0]} fontSize={0.2} color="#ef4444">{detail.reason}</Text>}
    </group>
  )
}
