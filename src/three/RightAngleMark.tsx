import { Line } from '@react-three/drei'

type Props = {
  center: [number, number, number]
  dirA: [number, number, number] // متجه وحدة تقريباً
  dirB: [number, number, number]
  size?: number
  color?: string
}

export default function RightAngleMark({ center, dirA, dirB, size = 0.22, color = '#22c55e' }: Props) {
  const p1: [number, number, number] = [center[0] + dirA[0] * size, center[1] + dirA[1] * size, center[2] + dirA[2] * size]
  const p2: [number, number, number] = [p1[0] + dirB[0] * size, p1[1] + dirB[1] * size, p1[2] + dirB[2] * size]
  const p3: [number, number, number] = [center[0] + dirB[0] * size, center[1] + dirB[1] * size, center[2] + dirB[2] * size]

  return <Line points={[p1, p2, p3]} color={color} lineWidth={1.8} />
}
