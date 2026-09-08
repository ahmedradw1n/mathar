import { useState, useMemo } from 'react'
import SceneShell from '../three/SceneShell'
import CoordinateSystem3D from '../three/CoordinateSystem3D'
import SolidSection3D from '../three/SolidSection3D'
import { LessonLayout, StepBlock, HintBox } from '../components/lessons/LessonLayout'
import { MathBlock, MathInline } from '../components/math/MathBlock'
import { buildSectionPolygon, cuboidVertices, cuboidEdges, tetrahedronVertices, tetrahedronEdges, sectionKindLabel, intersectPlaneWithSegment } from '../math/sections'
import type { Point3, Plane } from '../math/types'

function Slider({ label, value, min, max, step, color, onChange }: { label: string; value: number; min: number; max: number; step: number; color: string; onChange: (v: number) => void }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
        <span style={{ fontWeight: 700, color }}>{label}={value.toFixed(1)}</span>
        <span style={{ color: '#64748b' }}>{min}→{max}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))} style={{ width: '100%', accentColor: color }} />
    </div>
  )
}

export default function SectionsStage() {
  // مكعب
  const [pa, setPa] = useState(1), [pb, setPb] = useState(1), [pc, setPc] = useState(1), [pd, setPd] = useState(-2)
  const cubePlane: Plane = useMemo(() => ({ a: pa, b: pb, c: pc, d: pd }), [pa, pb, pc, pd])
  const cubeVerts = useMemo(() => cuboidVertices(2, 2, 2), [])
  const cubeEdgesList = useMemo(() => cuboidEdges(), [])
  const cubeSection = useMemo(() => buildSectionPolygon(cubeVerts, cubeEdgesList, cubePlane), [cubeVerts, cubeEdgesList, cubePlane])

  // رباعي وجوه
  const TA: Point3 = { x: 0, y: 0, z: 0 }, TB: Point3 = { x: 2, y: 0, z: 0 }, TC: Point3 = { x: 0, y: 2, z: 0 }, TD: Point3 = { x: 0, y: 0, z: 2 }
  const [qa, setQa] = useState(1), [qb, setQb] = useState(1), [qc, setQc] = useState(1), [qd, setQd] = useState(-1)
  const tetPlane: Plane = useMemo(() => ({ a: qa, b: qb, c: qc, d: qd }), [qa, qb, qc, qd])
  const tetVerts = useMemo(() => tetrahedronVertices(TA, TB, TC, TD), [])
  const tetEdgesList = useMemo(() => tetrahedronEdges(), [])
  const tetSection = useMemo(() => buildSectionPolygon(tetVerts, tetEdgesList, tetPlane), [tetVerts, tetEdgesList, tetPlane])

  // مثال حسابي لتقاطع قطعة مع مستوى
  const segA: Point3 = { x: 0, y: 0, z: 0 }, segB: Point3 = { x: 2, y: 0, z: 0 }
  const exPlane: Plane = { a: 1, b: 0, c: 0, d: -1 }
  const segRes = intersectPlaneWithSegment(segA, segB, exPlane)

  return (
    <LessonLayout title="مقاطع المجسمات بالمستويات" subtitle="المقطع هو تقاطع المجسم مع المستوى — نقاط التقاطع مع الأحرف تحدد مضلع المقطع.">
      <StepBlock num="1" title="مفهوم المقطع">
        <p>مقطع مجسم بمستوى هو مجموعة نقاط المجسم التي تنتمي للمستوى. إذا قطع المستوى الأحرف، نحصل على نقاط تقاطع تشكل مضلعًا (مثلث/رباعي/خماسي...).</p>
        <MathBlock tex="S \\cap E = \\{ X\\in S : a x + b y + c z + d =0 \\}" />
      </StepBlock>

      <StepBlock num="2" title="مقطع المكعب — حالات مثلث ورباعي ومستوى موازٍ لوجه">
        <p>حرّك معاملات المستوى <MathInline tex="ax+by+cz+d=0" /> وشاهد تغير المقطع لحظيًا.</p>
        <div style={{ height: 380, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white' }}>
          <SceneShell>
            <CoordinateSystem3D />
            <SolidSection3D vertices={cubeVerts} edges={cubeEdgesList} plane={cubePlane} sectionPoints={cubeSection.points} labels={['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']} />
          </SceneShell>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
          <Slider label="a" value={pa} min={-2} max={2} step={0.5} color="#ef4444" onChange={setPa} />
          <Slider label="b" value={pb} min={-2} max={2} step={0.5} color="#22c55e" onChange={setPb} />
          <Slider label="c" value={pc} min={-2} max={2} step={0.5} color="#3b82f6" onChange={setPc} />
          <Slider label="d" value={pd} min={-4} max={2} step={0.5} color="#7c3aed" onChange={setPd} />
        </div>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 8, fontSize: 12, marginTop: 8 }}>المستوى: {pa}x+{pb}y+{pc}z+{pd}=0 — المقطع: {sectionKindLabel(cubeSection.kind)} — نقاط: {cubeSection.points.length}</div>
        <HintBox>المستوى الموازي لوجه (مثلاً <MathInline tex="z=1" />) يعطي مقطعًا موازيًا لذلك الوجه.</HintBox>
      </StepBlock>

      <StepBlock num="3" title="مقطع رباعي الوجوه — مثلث أو رباعي">
        <div style={{ height: 380, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white' }}>
          <SceneShell>
            <CoordinateSystem3D />
            <SolidSection3D vertices={tetVerts} edges={tetEdgesList} plane={tetPlane} sectionPoints={tetSection.points} labels={['A', 'B', 'C', 'D']} />
          </SceneShell>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
          <Slider label="a" value={qa} min={-2} max={2} step={0.5} color="#ef4444" onChange={setQa} />
          <Slider label="b" value={qb} min={-2} max={2} step={0.5} color="#22c55e" onChange={setQb} />
          <Slider label="c" value={qc} min={-2} max={2} step={0.5} color="#3b82f6" onChange={setQc} />
          <Slider label="d" value={qd} min={-4} max={2} step={0.5} color="#7c3aed" onChange={setQd} />
        </div>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 8, fontSize: 12, marginTop: 8 }}>المقطع: {sectionKindLabel(tetSection.kind)} — نقاط: {tetSection.points.length}</div>
        <p>حالات حدية: مرور برأس، بحرف، ملامسة وجه، أو لا يقطع داخليًا — كلها تُظهر بوضوح.</p>
      </StepBlock>

      <StepBlock num="4" title="حساب نقطة التقاطع — X(t)=A+t(B-A)">
        <MathBlock tex="t = -\\frac{a x_A + b y_A + c z_A + d}{a(x_B-x_A)+b(y_B-y_A)+c(z_B-z_A)}" />
        <p>إذا <MathInline tex="t<0" /> فقبل A، <MathInline tex="0≤t≤1" /> داخل القطعة، <MathInline tex="t>1" /> بعد B. موازية إذا المقام≈0.</p>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 10, fontSize: 13 }}>مثال: A(0|0|0) B(2|0|0), E: x=1 → t=0.5 → P(1|0|0) — داخل القطعة {segRes.kind === 'point' ? `✓ t=${segRes.t.toFixed(2)}` : '—'}</div>
      </StepBlock>

      <StepBlock num="5" title="استخراج مضلع المقطع — الخوارزمية">
        <p>1) لكل حافة احسب تقاطعها مع المستوى. 2) اجمع النقاط بدون تكرار (EPS). 3) رتبها حول المركز داخل المستوى. 4) صنف: لا شيء/نقطة/قطعة/مثلث/رباعي/مضلع.</p>
        <MathBlock tex="\\text{ترتيب الزاوية: } \\theta_i = atan2(v·(P_i-C), u·(P_i-C))" />
      </StepBlock>

      <StepBlock num="6" title="الربط مع M.A.M والنسب">
        <p>نقطة على حرف: <MathInline tex="\\vec{AM}=t\\vec{AB}" /> هي مركز مثقل <MathInline tex="(A,1-t),(B,t)" />. عند تقاطع مستوى مع الحرف نحسب t ثم نمثل النقطة مثقلة، ومنها نحدد شكل المقطع وعلاقاته.</p>
        <MathBlock tex="\\text{نسب } → \\text{ أوزان } → \\text{ إحداثيات } → \\text{ تقاطع } → \\text{ مضلع المقطع}" />
      </StepBlock>
    </LessonLayout>
  )
}
