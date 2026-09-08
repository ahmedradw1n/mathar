import { Line, Text } from '@react-three/drei'
import * as THREE from 'three'
import type { Point3, Plane } from '../math/types'

type Props = {
  vertices: Point3[]
  edges: [number, number][]
  plane: Plane
  sectionPoints: Point3[]
  showPlane?: boolean
  labels?: string[]
}

export default function SolidSection3D({ vertices, edges, plane, sectionPoints, showPlane = true, labels }: Props) {
  const toArr = (p: Point3): [number, number, number] => [p.x, p.y, p.z]
  // plane mesh: create large quad centered at point on plane
  const planeMesh = (() => {
    const n = new THREE.Vector3(plane.a, plane.b, plane.c)
    const len = n.length()
    if (len < 1e-9) return null
    n.normalize()
    // find point on plane
    let pt: THREE.Vector3 | null = null
    if (Math.abs(plane.a) > 1e-9) pt = new THREE.Vector3(-plane.d / plane.a, 0, 0)
    else if (Math.abs(plane.b) > 1e-9) pt = new THREE.Vector3(0, -plane.d / plane.b, 0)
    else if (Math.abs(plane.c) > 1e-9) pt = new THREE.Vector3(0, 0, -plane.d / plane.c)
    else return null
    // orient plane
    const size = 6
    const geom = new THREE.PlaneGeometry(size, size)
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), n)
    geom.applyQuaternion(quat)
    geom.translate(pt.x, pt.y, pt.z)
    return geom
  })()

  // polygon lines
  const poly = sectionPoints.length >= 2 ? [...sectionPoints, sectionPoints[0]] : []

  return (
    <group>
      {/* حواف المجسم */}
      {edges.map(([a, b], i) => {
        const pa = vertices[a], pb = vertices[b]
        if (!pa || !pb) return null
        return <Line key={i} points={[toArr(pa), toArr(pb)]} color="#64748b" lineWidth={1.5} />
      })}
      {/* رؤوس */}
      {vertices.map((p, i) => (
        <mesh key={i} position={toArr(p)}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      ))}
      {labels && labels.map((lab, i) => {
        const p = vertices[i]
        if (!p) return null
        return <Text key={lab} position={[p.x + 0.12, p.y + 0.12, p.z + 0.1]} fontSize={0.13} color="#0f172a">{lab}</Text>
      })}
      {/* مستوى */}
      {showPlane && planeMesh && (
        <mesh geometry={planeMesh}>
          <meshStandardMaterial color="#7c3aed" transparent opacity={0.18} side={THREE.DoubleSide} />
        </mesh>
      )}
      {/* مضلع المقطع */}
      {poly.length >= 3 && (
        <>
          <Line points={poly.map(toArr) as any} color="#ef4444" lineWidth={3} />
          {/* fill */}
        </>
      )}
      {poly.length === 2 && <Line points={poly.slice(0, 2).map(toArr) as any} color="#ef4444" lineWidth={3} />}
      {/* نقاط التقاطع */}
      {sectionPoints.map((p, i) => (
        <mesh key={`s-${i}`} position={toArr(p)}>
          <sphereGeometry args={[0.08, 10, 10]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.4} />
        </mesh>
      ))}
      {sectionPoints.map((p, i) => (
        <Text key={`t-${i}`} position={[p.x + 0.1, p.y + 0.1, p.z + 0.08]} fontSize={0.12} color="#ef4444">P{i + 1}</Text>
      ))}
    </group>
  )
}
