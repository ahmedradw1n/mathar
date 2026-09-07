import Plane3D from './Plane3D'
import Line3D from './Line3D'
import type { Plane, Line3 } from '../math/types'

type Props = {
  p1: Plane
  p2: Plane
  intersectionLine?: Line3 | null
}

export default function PlaneRelation3D({ p1, p2, intersectionLine }: Props) {
  return (
    <group>
      <Plane3D plane={p1} color="#0ea5e9" opacity={0.22} />
      <Plane3D plane={p2} color="#f43f5e" opacity={0.22} />
      {intersectionLine && <Line3D line={intersectionLine} color="#22c55e" label="s" />}
    </group>
  )
}
