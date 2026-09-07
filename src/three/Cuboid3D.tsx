import { Line, Text } from '@react-three/drei'
import type { Point3 } from '../math/types'

type Props = {
  a?: number
  b?: number
  c?: number
  showDiagonal?: boolean
  showFaceDiagonal?: boolean
  highlightEdges?: [string, string][] // e.g. [['A','B']]
}

export default function Cuboid3D({ a = 2, b = 1.5, c = 1, showDiagonal = false, showFaceDiagonal = false, highlightEdges = [] }: Props) {
  const pts: Record<string, Point3> = {
    A: { x: 0, y: 0, z: 0 },
    B: { x: a, y: 0, z: 0 },
    C: { x: a, y: b, z: 0 },
    D: { x: 0, y: b, z: 0 },
    E: { x: 0, y: 0, z: c },
    F: { x: a, y: 0, z: c },
    G: { x: a, y: b, z: c },
    H: { x: 0, y: b, z: c },
  }
  const toArr = (p: Point3): [number, number, number] => [p.x, p.y, p.z]
  const edges: [string, string][] = [
    ['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'],
    ['E', 'F'], ['F', 'G'], ['G', 'H'], ['H', 'E'],
    ['A', 'E'], ['B', 'F'], ['C', 'G'], ['D', 'H'],
  ]
  const isHighlighted = (e: [string, string]) => highlightEdges.some(([x, y]) => (x === e[0] && y === e[1]) || (x === e[1] && y === e[0]))

  return (
    <group>
      {edges.map(([s, e]) => (
        <Line key={`${s}-${e}`} points={[toArr(pts[s]), toArr(pts[e])]} color={isHighlighted([s, e]) ? '#f59e0b' : '#64748b'} lineWidth={isHighlighted([s, e]) ? 3 : 1.5} />
      ))}
      {Object.entries(pts).map(([name, p]) => (
        <group key={name}>
          <mesh position={toArr(p)}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <Text position={[p.x + 0.15, p.y + 0.15, p.z + 0.1]} fontSize={0.18} color="#0f172a" anchorX="left" outlineWidth={0.02} outlineColor="white">
            {name}
          </Text>
        </group>
      ))}
      {showDiagonal && <Line points={[[0, 0, 0], [a, b, c]]} color="#ef4444" lineWidth={2.5} />}
      {showFaceDiagonal && <Line points={[[0, 0, 0], [a, b, 0]]} color="#22c55e" lineWidth={2} dashed dashSize={0.1} gapSize={0.06} />}
      {/* أبعاد */}
      <Text position={[a / 2, -0.3, 0]} fontSize={0.14} color="#64748b">a={a}</Text>
      <Text position={[a + 0.3, b / 2, 0]} fontSize={0.14} color="#64748b">b={b}</Text>
      <Text position={[-0.3, 0, c / 2]} fontSize={0.14} color="#64748b">c={c}</Text>
    </group>
  )
}
