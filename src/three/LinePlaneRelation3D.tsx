import Line3D from './Line3D'
import Plane3D from './Plane3D'
import Point3D from './Point3D'
import type { Line3, Plane, Point3 } from '../math/types'

type Props = {
  line: Line3
  plane: Plane
  intersection?: Point3 | null
}

export default function LinePlaneRelation3D({ line, plane, intersection }: Props) {
  return (
    <group>
      <Plane3D plane={plane} color="#7c3aed" opacity={0.22} />
      <Line3D line={line} color="#f59e0b" label="g" />
      {intersection && <Point3D position={[intersection.x, intersection.y, intersection.z]} label="S" color="#22c55e" showProjection={false} />}
    </group>
  )
}
