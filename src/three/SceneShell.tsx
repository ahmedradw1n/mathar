import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import * as THREE from 'three'

type Props = {
  children: React.ReactNode
  cameraPosition?: [number, number, number]
  showGrid?: boolean
}

export default function SceneShell({ children, cameraPosition = [7, 6, 8], showGrid = true }: Props) {
  const controlsRef = useRef<any>(null)

  const handleReset = () => {
    if (controlsRef.current) controlsRef.current.reset()
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', touchAction: 'none' as any }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%', display: 'block', touchAction: 'none' as any }}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
        }}
      >
        <PerspectiveCamera makeDefault position={cameraPosition} fov={50} />
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.08}
          minDistance={3}
          maxDistance={20}
          maxPolarAngle={Math.PI * 0.48}
          enablePan={false}
          touches={{
            ONE: THREE.TOUCH.ROTATE,
            TWO: THREE.TOUCH.DOLLY_PAN,
          }}
          // منع سحب الصفحة أثناء التفاعل على الهاتف
        />
        {/* إضاءة */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[8, 10, 6]} intensity={1.1} castShadow />
        <directionalLight position={[-6, -4, -8]} intensity={0.35} />
        <hemisphereLight args={['#ffffff', '#8aa0b8', 0.35]} />

        <Suspense fallback={null}>
          {showGrid && (
            <gridHelper args={[14, 14, '#cbd5e1', '#e2e8f0']} position={[0, 0, 0]} />
          )}
          {children}
        </Suspense>
      </Canvas>

      <button
        onClick={handleReset}
        aria-label="إعادة ضبط الكاميرا"
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 2,
          background: 'rgba(255,255,255,0.92)',
          border: '1px solid #e2e8f0',
          borderRadius: 10,
          padding: '6px 10px',
          fontSize: 12,
          cursor: 'pointer',
          backdropFilter: 'blur(6px)',
          touchAction: 'manipulation',
        }}
      >
        إعادة الضبط ↺
      </button>
      <div
        style={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          zIndex: 2,
          background: 'rgba(255,255,255,0.88)',
          border: '1px solid #e2e8f0',
          borderRadius: 8,
          padding: '4px 8px',
          fontSize: 10.5,
          color: '#64748b',
          pointerEvents: 'none',
        }}
      >
        إصبع واحد: دوران · إصبعان: تكبير
      </div>
    </div>
  )
}
