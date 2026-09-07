import { useState, useMemo } from 'react'
import SceneShell from '../three/SceneShell'
import CoordinateSystem3D from '../three/CoordinateSystem3D'
import Cuboid3D from '../three/Cuboid3D'
import Pyramid3D from '../three/Pyramid3D'
import Tetrahedron3D from '../three/Tetrahedron3D'
import PlaneParametric3D from '../three/PlaneParametric3D'
import AxialBisectorPlane3D from '../three/AxialBisectorPlane3D'
import Point3D from '../three/Point3D'
import Plane3D from '../three/Plane3D'
import { LessonLayout, StepBlock, HintBox } from '../components/lessons/LessonLayout'
import { MathBlock, MathInline } from '../components/math/MathBlock'
import { dot, cross, length } from '../math/vectors'
import { triangleArea3D, tetrahedronVolume, cuboidDiagonal, faceDiagonal, verifyParallelEdges, verifyPerpendicularEdges } from '../math/geometryShapes'
import { planeFromThreePoints } from '../math/planes'
import { distancePointPlane } from '../math/distances'
import type { Point3, Plane } from '../math/types'

function Slider({ label, value, min, max, step, color, onChange }: { label: string; value: number; min: number; max: number; step: number; color: string; onChange: (v: number) => void }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
        <span style={{ fontWeight: 700, color }}>{label}={value}</span>
        <span style={{ color: '#64748b' }}>{min}→{max}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} style={{ width: '100%', accentColor: color }} />
    </div>
  )
}

export default function ShapesStage() {
  const [a, setA] = useState(2)
  const [b, setB] = useState(1.5)
  const [c, setC] = useState(1)
  const [baseA, setBaseA] = useState(2)
  const [baseB, setBaseB] = useState(2)
  const [h, setH] = useState(2)
  const [r, setR] = useState(0.5)
  const [s, setS] = useState(0.5)
  const [Abis, setAbis] = useState<Point3>({ x: 0, y: 0, z: 0 })
  const [Bbis, setBbis] = useState<Point3>({ x: 2, y: 0, z: 0 })

  // مثلث للمساحة
  const TriA: Point3 = { x: 0, y: 0, z: 0 }, TriB: Point3 = { x: 2, y: 0, z: 0 }, TriC: Point3 = { x: 0, y: 2, z: 0 }
  const area = triangleArea3D(TriA, TriB, TriC)
  // رباعي وجوه للحجم
  const TetA: Point3 = { x: 0, y: 0, z: 0 }, TetB: Point3 = { x: 2, y: 0, z: 0 }, TetC: Point3 = { x: 0, y: 2, z: 0 }, TetD: Point3 = { x: 0, y: 0, z: 2 }
  const vol = tetrahedronVolume(TetA, TetB, TetC, TetD)
  const triple = dot({ x: TetB.x - TetA.x, y: TetB.y - TetA.y, z: TetB.z - TetA.z }, cross({ x: TetC.x - TetA.x, y: TetC.y - TetA.y, z: TetC.z - TetA.z }, { x: TetD.x - TetA.x, y: TetD.y - TetA.y, z: TetD.z - TetA.z }))

  // وجه مكعب
  const facePlane = useMemo(() => planeFromThreePoints({ x: 0, y: 0, z: 0 }, { x: 2, y: 0, z: 0 }, { x: 2, y: 1.5, z: 0 }), [])
  const apex: Point3 = { x: 1, y: 0.75, z: h }
  const basePl: Plane = { a: 0, b: 0, c: 1, d: 0 }
  const heightDist = distancePointPlane(apex, basePl)

  // متوازي/تعامد
  const AB = { x: a, y: 0, z: 0 }, AD = { x: 0, y: b, z: 0 }
  const isPerp = verifyPerpendicularEdges(AB, AD)
  const isPar = verifyParallelEdges({ x: a, y: 0, z: 0 }, { x: a, y: 0, z: c })

  // طول عبر الجداء — 3.4
  const vecLen = { x: 2, y: 3, z: 6 }
  const lenDot = Math.sqrt(dot(vecLen, vecLen))
  const lenDirect = length(vecLen)

  return (
    <LessonLayout title="الأشكال الهندسية والتطبيقات" subtitle="متوازي المستطيلات، المكعب، الهرم، والمسائل الشاملة — دمج كل ما تعلمناه.">
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, marginBottom: 12 }}>
        <div style={{ fontWeight: 800, fontSize: 13, color: '#0f172a', marginBottom: 6 }}>خريطة المنهج الكاملة</div>
        <div dir="ltr" style={{ fontFamily: 'monospace', fontSize: 10, background: '#f8fafc', borderRadius: 8, padding: 10, overflowX: 'auto' }}>
          أشعة→عمليات→طول→جداء→زوايا→تعامد/توازي→مسقط<br />→ مستوى(ناظم)→مستقيم→تقاطعات→مسافات→كرة→نظام خطي→مركز الكرة/الثقل→أشكال→ مسائل شاملة
        </div>
      </div>

      {/* 1 — مراجعة */}
      <StepBlock num="1" title="مراجعة الأشكال — كيف نمثلها؟">
        <p>كل شكل يُمثل بنقاط وأشعة ومستويات. مثال: متوازي المستطيلات 8 رؤوس، 12 حافة، 6 أوجه.</p>
        <div style={{ height: 340, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white' }}>
          <SceneShell>
            <CoordinateSystem3D />
            <Cuboid3D a={a} b={b} c={c} />
          </SceneShell>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 10 }}>
          <Slider label="a" value={a} min={1} max={3} step={0.5} color="#ef4444" onChange={setA} />
          <Slider label="b" value={b} min={1} max={3} step={0.5} color="#22c55e" onChange={setB} />
          <Slider label="c" value={c} min={1} max={3} step={0.5} color="#3b82f6" onChange={setC} />
        </div>
        <MathBlock tex={`\\vec{AB}=B-A=(${a},0,0),\\; \\vec{AD}=(0,${b},0),\\; \\vec{AE}=(0,0,${c})`} />
      </StepBlock>

      {/* 3 — تعامد */}
      <StepBlock num="2" title="إثبات التعامد — AB·AD=0">
        <div style={{ height: 340, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 10 }}>
          <SceneShell>
            <CoordinateSystem3D />
            <Cuboid3D a={a} b={b} c={c} highlightEdges={[['A', 'B'], ['A', 'D']]} />
          </SceneShell>
        </div>
        <MathBlock tex={`AB·AD = (${a},0,0)·(0,${b},0)=0 \\;\\Rightarrow\\; AB\\perp AD ${isPerp ? '✓' : '✗'}`} />
        <div style={{ padding: 8, borderRadius: 10, background: isPerp ? '#f0fdf4' : '#fef2f2', border: '1px solid #e2e8f0', fontSize: 13 }}>{isPerp ? '✓ متعامدان — زاوية قائمة' : '✗'}</div>
      </StepBlock>

      {/* 4 — أقطار */}
      <StepBlock num="3" title="الأقطار — d=√(a²+b²+c²)">
        <MathBlock tex={`d_{space}=\\sqrt{a^2+b^2+c^2}=\\sqrt{${a}²+${b}²+${c}²}=${cuboidDiagonal(a, b, c).toFixed(2)},\\; d_{face}=\\sqrt{a^2+b^2}=${faceDiagonal(a, b).toFixed(2)}`} />
        <p>اشتقاق: قطر الفراغ هو شعاع `AG=(a,b,c)` وطوله عبر الجداء.</p>
        <div style={{ height: 320, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white' }}>
          <SceneShell>
            <CoordinateSystem3D />
            <Cuboid3D a={a} b={b} c={c} showDiagonal showFaceDiagonal />
          </SceneShell>
        </div>
      </StepBlock>

      {/* 5 — مكعب */}
      <StepBlock num="4" title="المكعب — a=b=c">
        <MathBlock tex={`a=b=c=${a} \\;\\Rightarrow\\; d_{face}=a\\sqrt2=${(a * Math.sqrt(2)).toFixed(2)},\\; d_{space}=a\\sqrt3=${(a * Math.sqrt(3)).toFixed(2)}`} />
        <div style={{ height: 320, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white' }}>
          <SceneShell>
            <CoordinateSystem3D />
            <Cuboid3D a={a} b={a} c={a} showDiagonal />
          </SceneShell>
        </div>
      </StepBlock>

      {/* 6 — هرم */}
      <StepBlock num="5" title="الهرم ورباعي الوجوه">
        <div style={{ height: 380, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 10 }}>
          <SceneShell>
            <CoordinateSystem3D />
            <Pyramid3D baseA={baseA} baseB={baseB} height={h} showHeight />
          </SceneShell>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <Slider label="baseA" value={baseA} min={1} max={3} step={0.5} color="#ef4444" onChange={setBaseA} />
          <Slider label="baseB" value={baseB} min={1} max={3} step={0.5} color="#22c55e" onChange={setBaseB} />
          <Slider label="h" value={h} min={1} max={4} step={0.5} color="#3b82f6" onChange={setH} />
        </div>
        <div style={{ height: 320, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginTop: 10 }}>
          <SceneShell>
            <CoordinateSystem3D />
            <Tetrahedron3D />
          </SceneShell>
        </div>
      </StepBlock>

      {/* 7 — مستوى وجه */}
      <StepBlock num="6" title="المستوى الذي يحتوي وجهاً — n = u×v">
        <MathBlock tex="A(0|0|0), B(2|0|0), C(2|1.5|0) → u=AB=(2,0,0), v=AC=(2,1.5,0) → n=u×v=(0,0,3)" />
        {facePlane && <MathBlock tex={`المستوى: ${facePlane.a}x+${facePlane.b}y+${facePlane.c}z+${facePlane.d}=0`} />}
        <div style={{ height: 320, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white' }}>
          <SceneShell>
            <CoordinateSystem3D />
            {facePlane && <Plane3D plane={facePlane} color="#7c3aed" opacity={0.2} />}
            <Point3D position={[0, 0, 0]} label="A" color="#0ea5e9" showProjection={false} />
            <Point3D position={[2, 0, 0]} label="B" color="#f43f5e" showProjection={false} />
            <Point3D position={[2, 1.5, 0]} label="C" color="#22c55e" showProjection={false} />
          </SceneShell>
        </div>
      </StepBlock>

      {/* 9 — ارتفاع */}
      <StepBlock num="7" title="المسافة والارتفاع — h = d(S,E)">
        <MathBlock tex={`S(1|0.75|${h}),\\; E:z=0 → h=${heightDist?.toFixed(2)}`} />
        <p>المسقط <MathInline tex="H∈E" /> و <MathInline tex="SH⊥E" /> (المرحلة 7).</p>
        <div style={{ height: 320, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white' }}>
          <SceneShell>
            <CoordinateSystem3D />
            <Pyramid3D baseA={2} baseB={1.5} height={h} showHeight />
          </SceneShell>
        </div>
      </StepBlock>

      {/* 10 — مساحة */}
      <StepBlock num="8" title="مساحة مثلث — ½|u×v|">
        <MathBlock tex={`u=AB=(2,0,0), v=AC=(0,2,0) → u×v=(0,0,4) → Area=½·4=2`} />
        <div style={{ padding: 8, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: 13 }}>المثلث السابق مساحته {area.toFixed(2)} (نصف متوازي الأضلاع)</div>
      </StepBlock>

      {/* 11 — حجم */}
      <StepBlock num="9" title="حجم رباعي الوجوه — 1/6|u·(v×w)|">
        <MathBlock tex={`u=(2,0,0), v=(0,2,0), w=(0,0,2) → u·(v×w)=8 → V=8/6≈1.33`} />
        <div style={{ padding: 8, borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: 13 }}>الحجم الحالي {vol.toFixed(2)} — الجداء الثلاثي {triple.toFixed(1)} /6</div>
      </StepBlock>

      {/* 12 — توازي */}
      <StepBlock num="10" title="التوازي — u=λv">
        <MathBlock tex={`AB=(2,0,0), DC=(2,0,0) → λ=1 → متوازيان ${isPar.parallel ? '✓' : '✗'}`} />
        <HintBox>اختبر `EPS`: المكون الصفري لا يمنع اكتشاف التوازي.</HintBox>
      </StepBlock>

      {/* 14 — محوري */}
      <StepBlock num="11" title="المستوى المحوري — |XA|=|XB| (تكملة 5.10)">
        <div style={{ height: 360, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 10 }}>
          <SceneShell>
            <CoordinateSystem3D />
            <AxialBisectorPlane3D A={Abis} B={Bbis} X={{ x: 1, y: 0, z: 0 }} />
          </SceneShell>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <Slider label="Ax" value={Abis.x} min={-2} max={2} step={1} color="#ef4444" onChange={v => setAbis({ ...Abis, x: v })} />
            <Slider label="Ay" value={Abis.y} min={-2} max={2} step={1} color="#22c55e" onChange={v => setAbis({ ...Abis, y: v })} />
          </div>
          <div>
            <Slider label="Bx" value={Bbis.x} min={-2} max={2} step={1} color="#ef4444" onChange={v => setBbis({ ...Bbis, x: v })} />
            <Slider label="By" value={Bbis.y} min={-2} max={2} step={1} color="#22c55e" onChange={v => setBbis({ ...Bbis, y: v })} />
          </div>
        </div>
        <MathBlock tex="المستوى يمر بمنتصف AB وناظمه AB — كل X فيه يحقق |XA|=|XB|" />
      </StepBlock>

      {/* 15 — وسيطي */}
      <StepBlock num="12" title="التمثيل الوسيطي للمستوى — X=P+r·u+s·v (تكملة 5.6)">
        <div style={{ height: 360, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 10 }}>
          <SceneShell>
            <CoordinateSystem3D />
            <PlaneParametric3D P={{ x: 0, y: 0, z: 0 }} u={{ x: 2, y: 0, z: 0 }} v={{ x: 0, y: 2, z: 0 }} r={r} s={s} />
          </SceneShell>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <Slider label="r" value={r} min={-1} max={1} step={0.25} color="#ef4444" onChange={setR} />
          <Slider label="s" value={s} min={-1} max={1} step={0.25} color="#22c55e" onChange={setS} />
        </div>
        <MathBlock tex={`X = (0|0|0)+r(2|0|0)+s(0|2|0) = (${(r * 2).toFixed(1)}|${(s * 2).toFixed(1)}|0)`} />
        <HintBox>غيّر `r` يتحرك مع `u`، `s` مع `v` — أي نقطة في المستوى بهذه الصورة.</HintBox>
      </StepBlock>

      {/* 16 — طول */}
      <StepBlock num="13" title="طول الشعاع والجداء — |a|²=a·a (تكملة 3.4)">
        <MathBlock tex={`a=(2|3|6) → a·a=4+9+36=49 → |a|=√49=7,\\; \\sqrt{a·a}=${lenDot.toFixed(2)},\\; |a| مباشر=${lenDirect.toFixed(2)}`} />
        <div style={{ padding: 8, borderRadius: 10, background: Math.abs(lenDirect - lenDot) < 1e-9 ? '#f0fdf4' : '#fef2f2', border: '1px solid #e2e8f0', fontSize: 13 }}>{Math.abs(lenDirect - lenDot) < 1e-9 ? '✓ متطابق — |a|²=a·a' : '✗'}</div>
      </StepBlock>

      {/* 20 — جداء */}
      <StepBlock num="14" title="الجداء الاتجاهي والثلاثي">
        <MathBlock tex="u×v ⟂ u,v,\\; |u×v|=|u||v|sinθ,\\; u·(v×w)=حجم متوازي المستطيلات" />
        <div style={{ fontSize: 12, color: '#64748b' }}>مثال: `u×v=(0,0,4)` طوله 4 → مساحة 2, `u·(v×w)=8` → حجم رباعي 1.33</div>
      </StepBlock>

      {/* شامل */}
      <StepBlock num="15" title="مسائل شاملة — من نقاط إلى نتيجة">
        <p>مسار: نقاط → أشعة `B-A` → تعامد `·=0` → مستوى `n=u×v` → مسافة `d(S,E)` → حجم `1/6|triple|` → تحقق بصري.</p>
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: 10, fontSize: 13 }}>
          جرب تغيير أبعاد متوازي المستطيلات أعلاه وشاهد كل القيم تتحدث — هذا هو الدمج.
        </div>
      </StepBlock>
    </LessonLayout>
  )
}
