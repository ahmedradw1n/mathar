import { Line, Text } from '@react-three/drei'

type Props = {
  size?: number
  showVectors?: { from: string; to: string; color: string; label: string }[]
}

// رؤوس مكعب من (0,0,0) إلى (s,s,s) بتسميات A-H
export default function CubeFrame({ size = 2, showVectors = [] }: Props) {
  const s = size
  const pts: Record<string, [number, number, number]> = {
    A: [0, 0, 0],
    B: [s, 0, 0],
    C: [s, s, 0],
    D: [0, s, 0],
    E: [0, 0, s],
    F: [s, 0, s],
    G: [s, s, s],
    H: [0, s, s],
  }

  const edges: [string, string][] = [
    ['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'],
    ['E', 'F'], ['F', 'G'], ['G', 'H'], ['H', 'E'],
    ['A', 'E'], ['B', 'F'], ['C', 'G'], ['D', 'H'],
  ]

  return (
    <group>
      {edges.map(([a, b]) => (
        <Line key={`${a}-${b}`} points={[pts[a], pts[b]]} color="#64748b" lineWidth={1.2} />
      ))}
      {Object.entries(pts).map(([name, pos]) => (
        <group key={name}>
          <mesh position={pos}>
            <sphereGeometry args={[0.07, 10, 10]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
          <Text position={[pos[0] + 0.18, pos[1] + 0.18, pos[2] + 0.12]} fontSize={0.2} color="#0f172a" anchorX="center">
            {name}
          </Text>
        </group>
      ))}
      {showVectors.map((v, i) => {
        const from = pts[v.from]
        const to = pts[v.to]
        if (!from || !to) return null
        const mid: [number,number,number] = [(from[0]+to[0])/2,(from[1]+to[1])/2,(from[2]+to[2])/2]
        return (
          <group key={i}>
            <Line points={[from, to]} color={v.color} lineWidth={3} />
            <Text position={[mid[0]+0.12,mid[1]+0.12,mid[2]+0.12]} fontSize={0.18} color={v.color} anchorX="center" outlineWidth={0.015} outlineColor="white">
              {v.label}
            </Text>
          </group>
        )
      })}
    </group>
  )
}
