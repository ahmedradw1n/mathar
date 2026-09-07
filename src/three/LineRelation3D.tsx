import Line3D from './Line3D'
import Point3D from './Point3D'
import type { Line3, Point3 } from '../math/types'

type Props = {
  l1: Line3
  l2: Line3
  intersection?: Point3 | null
  skewHelper?: boolean
}

export default function LineRelation3D({ l1, l2, intersection }: Props) {
  return (
    <group>
      <Line3D line={l1} color="#0ea5e9" label="g" />
      <Line3D line={l2} color="#f43f5e" label="h" />
      {intersection && <Point3D position={[intersection.x, intersection.y, intersection.z]} label="T" color="#22c55e" showProjection={false} />}
    </group>
  )
}
