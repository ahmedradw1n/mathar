import { useState, useMemo } from 'react'
import SceneShell from '../three/SceneShell'
import CoordinateSystem3D from '../three/CoordinateSystem3D'
import PlanePlaneIntersection3D from '../three/PlanePlaneIntersection3D'
import Circumsphere3D from '../three/Circumsphere3D'
import Centroid3D from '../three/Centroid3D'
import { LessonLayout, StepBlock, HintBox } from '../components/lessons/LessonLayout'
import { MathBlock, MathInline } from '../components/math/MathBlock'
import { planePlaneIntersectionDetailed, sphereThroughPoints, triangleCentroid, tetrahedronCentroid, verifyCentroidOnMedian } from '../math/advancedGeometry'
import { cross } from '../math/vectors'
import type { Plane, Point3 } from '../math/types'

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

export default function AdvancedStage() {
  // للتقاطع
  const [p1, setP1] = useState<Plane>({ a: 1, b: 1, c: 1, d: -3 })
  const [p2, setP2] = useState<Plane>({ a: 1, b: -1, c: 0, d: 0 })
  const inter = useMemo(() => planePlaneIntersectionDetailed(p1, p2), [p1, p2])

  // للكرة: 4 نقاط مثال
  const [A, setA] = useState<Point3>({ x: 1, y: 0, z: 0 })
  const [B, setB] = useState<Point3>({ x: -1, y: 0, z: 0 })
  const [C, setC] = useState<Point3>({ x: 0, y: 1, z: 0 })
  const [D, setD] = useState<Point3>({ x: 0, y: 0, z: 1 })
  const sphereRes = useMemo(() => sphereThroughPoints([A, B, C, D]), [A, B, C, D])

  // للثقل: مثلث
  const [TA, setTA] = useState<Point3>({ x: 0, y: 0, z: 0 })
  const [TB, setTB] = useState<Point3>({ x: 3, y: 0, z: 0 })
  const [TC, setTC] = useState<Point3>({ x: 0, y: 3, z: 0 })
  const G = useMemo(() => triangleCentroid(TA, TB, TC), [TA, TB, TC])
  const onMedian = useMemo(() => verifyCentroidOnMedian(G, TA, TB, TC), [G, TA, TB, TC])

  // رباعي وجوه
  const [QA, setQA] = useState<Point3>({ x: 0, y: 0, z: 0 })
  const [QB, setQB] = useState<Point3>({ x: 2, y: 0, z: 0 })
  const QC: Point3 = { x: 0, y: 2, z: 0 }
  const QD: Point3 = { x: 0, y: 0, z: 2 }
  const Gt = useMemo(() => tetrahedronCentroid(QA, QB, QC, QD), [QA, QB, QC, QD])

  return (
    <LessonLayout title="التقاطعات المتقدمة، مركز الكرة، ومركز الثقل" subtitle="تجميع ما تعلمناه: المستويات، الأنظمة الخطية، المسافات، والمتوسطات.">
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, marginBottom: 12 }}>
        <div style={{ fontWeight: 800, fontSize: 13, color: '#0f172a', marginBottom: 6 }}>خريطة هذه المرحلة</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, fontSize: 11 }}>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: 8 }}><strong>تقاطع مستويين</strong><br />n₁×n₂ → u → نقطة → مستقيم</div>
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: 8 }}><strong>مركز الكرة</strong><br />|MA|²=|MB|² → نظام خطي → M</div>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: 8 }}><strong>مركز الثقل</strong><br />(A+B+C)/3 → متوسطات 2:1</div>
        </div>
      </div>

      {/* تقاطع */}
      <StepBlock num="1" title="تقاطع مستويين — الفكرة">
        <MathBlock tex="E_1: a_1x+b_1y+c_1z=d_1,\\; E_2: a_2x+b_2y+c_2z=d_2,\\; n_1=(a_1|b_1|c_1),\\; n_2=(a_2|b_2|c_2)" />
        <p>إذا لم يكن <MathInline tex="n_1\\parallel n_2" /> فإن التقاطع مستقيم.</p>
      </StepBlock>

      <StepBlock num="2" title="شعاع اتجاه التقاطع — u = n₁×n₂">
        <MathBlock tex="u\\perp n_1,\\; u\\perp n_2 \\;\\Rightarrow\\; u=n_1\\times n_2,\\; u\\cdot n_1=0,\\; u\\cdot n_2=0" />
        <HintBox>الجداء الاتجاهي يعطي شعاعاً متعامداً على الاثنين — راجع الجداء السلمي: التعامد يعني جداء صفري.</HintBox>
        <div style={{ height: 380, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', margin: '10px 0' }}>
          <SceneShell>
            <CoordinateSystem3D />
            <PlanePlaneIntersection3D p1={p1} p2={p2} />
          </SceneShell>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: '#0ea5e9' }}>E₁: a₁x+b₁y+c₁z=d₁</div>
            <Slider label="a₁" value={p1.a} min={-2} max={2} step={1} color="#ef4444" onChange={v => setP1({ ...p1, a: v })} />
            <Slider label="b₁" value={p1.b} min={-2} max={2} step={1} color="#22c55e" onChange={v => setP1({ ...p1, b: v })} />
            <Slider label="c₁" value={p1.c} min={-2} max={2} step={1} color="#3b82f6" onChange={v => setP1({ ...p1, c: v })} />
            <Slider label="d₁" value={p1.d} min={-4} max={4} step={1} color="#7c3aed" onChange={v => setP1({ ...p1, d: v })} />
          </div>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: '#f43f5e' }}>E₂</div>
            <Slider label="a₂" value={p2.a} min={-2} max={2} step={1} color="#ef4444" onChange={v => setP2({ ...p2, a: v })} />
            <Slider label="b₂" value={p2.b} min={-2} max={2} step={1} color="#22c55e" onChange={v => setP2({ ...p2, b: v })} />
            <Slider label="c₂" value={p2.c} min={-2} max={2} step={1} color="#3b82f6" onChange={v => setP2({ ...p2, c: v })} />
            <Slider label="d₂" value={p2.d} min={-4} max={4} step={1} color="#7c3aed" onChange={v => setP2({ ...p2, d: v })} />
          </div>
        </div>
        <MathBlock tex={`n_1=(${p1.a}|${p1.b}|${p1.c}),\\; n_2=(${p2.a}|${p2.b}|${p2.c}),\\; u=n_1\\times n_2=(${cross({x:p1.a,y:p1.b,z:p1.c},{x:p2.a,y:p2.b,z:p2.c}).x.toFixed(1)}|${cross({x:p1.a,y:p1.b,z:p1.c},{x:p2.a,y:p2.b,z:p2.c}).y.toFixed(1)}|${cross({x:p1.a,y:p1.b,z:p1.c},{x:p2.a,y:p2.b,z:p2.c}).z.toFixed(1)})`} />
        <div style={{ padding: 8, borderRadius: 10, background: inter.kind === 'intersecting' ? '#f0fdf4' : '#fef2f2', border: '1px solid #e2e8f0', fontSize: 13 }}>
          {inter.kind === 'intersecting' ? `✓ متقاطعان — u·n₁=${inter.uDotN1.toFixed(2)}≈0, u·n₂=${inter.uDotN2.toFixed(2)}≈0 — مستقيم: P(${inter.line.point.x.toFixed(1)},${inter.line.point.y.toFixed(1)},${inter.line.point.z.toFixed(1)}) + t·u` : inter.kind === 'parallel' ? 'متوازيان — لا خط' : inter.kind === 'coincident' ? 'متطابقان' : 'غير صالح'}
        </div>
      </StepBlock>

      <StepBlock num="3" title="إيجاد نقطة على التقاطع — لا تثبّت x=0 دائماً">
        <p>نحتاج <MathInline tex="P∈E₁" /> و <MathInline tex="P∈E₂" /> — نحل النظام مع استراتيجية robust (تجربة `z=0,y=0,x=0` عبر `linearSystem.ts:1`).</p>
        <HintBox>إعادة استخدام `relations.ts` و `linearSystem.ts` — فصل Math Core عن React.</HintBox>
      </StepBlock>

      <StepBlock num="4" title="الحالات — متطابقان/متوازيان/متقاطعان">
        <ul style={{ margin: 0, paddingInlineStart: 18, fontSize: 13, lineHeight: 1.8 }}>
          <li><MathInline tex="n_1\\parallel n_2" /> ومعادلة واحدة → متطابقان</li>
          <li><MathInline tex="n_1\\parallel n_2" /> ومختلفان → متوازيان</li>
          <li><MathInline tex="n_1\\times n_2\\neq0" /> → متقاطعان (مستقيم)</li>
        </ul>
      </StepBlock>

      {/* كرة */}
      <StepBlock num="5" title="مركز الكرة — تساوي المسافات">
        <MathBlock tex="|MA|=|MB|=|MC|=|MD|" />
        <p>لا نحل تربيعياً مباشرة — نربّع ونساوي:</p>
        <MathBlock tex="|MA|^2=|MB|^2 \\;\\Rightarrow\\; (x-a_1)^2+... = (x-b_1)^2+... \\;\\Rightarrow\\; 2(B-A)·M = |B|^2-|A|^2" />
        <p>تختفي <MathInline tex="x^2+y^2+z^2" /> ونحصل على معادلات خطية — نحل بـ `linearSystem.ts:1`.</p>
        <div style={{ height: 380, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 10 }}>
          <SceneShell>
            <CoordinateSystem3D />
            <Circumsphere3D points={[A, B, C, D]} sphere={sphereRes.kind === 'unique' ? sphereRes.sphere : null} />
          </SceneShell>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            [A, setA, 'A'],
            [B, setB, 'B'],
            [C, setC, 'C'],
            [D, setD, 'D'],
          ].map(([pt, set, label]: any) => (
            <div key={label} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 11 }}>{label}({pt.x}|{pt.y}|{pt.z})</div>
              <Slider label="x" value={pt.x} min={-3} max={3} step={1} color="#ef4444" onChange={v => set({ ...pt, x: v })} />
              <Slider label="y" value={pt.y} min={-3} max={3} step={1} color="#22c55e" onChange={v => set({ ...pt, y: v })} />
              <Slider label="z" value={pt.z} min={-3} max={3} step={1} color="#3b82f6" onChange={v => set({ ...pt, z: v })} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, padding: 8, borderRadius: 10, background: sphereRes.kind === 'unique' ? '#f0fdf4' : '#fef2f2', border: '1px solid #e2e8f0', fontSize: 13 }}>
          {sphereRes.kind === 'unique' ? `✓ حل وحيد — M(${sphereRes.center.x.toFixed(2)},${sphereRes.center.y.toFixed(2)},${sphereRes.center.z.toFixed(2)}), r=${sphereRes.radius.toFixed(2)} — |MA|≈|MB|≈|MC|≈|MD|` : `${sphereRes.kind}: ${sphereRes.reason}`}
        </div>
        <MathBlock tex="M=(1|0|0), B=(-1|0|0), C=(0|1|0), D=(0|0|1) → مثال بسيط للتحقق" />
      </StepBlock>

      <StepBlock num="6" title="اختيار النقاط — حالات منحطة">
        <ul style={{ margin: 0, paddingInlineStart: 18, fontSize: 13, lineHeight: 1.8 }}>
          <li>4 نقاط غير مستوية → كرة وحيدة (`unique`)</li>
          <li>4 في مستوى واحد → `none` (لا كرة وحيدة)</li>
          <li>مكررة → `invalid`</li>
          <li>3 على استقامة → `invalid`</li>
        </ul>
      </StepBlock>

      {/* ثقل */}
      <StepBlock num="7" title="مركز الثقل — مثلث">
        <MathBlock tex="G=\\frac{A+B+C}{3} = \\left(\\frac{x_A+x_B+x_C}{3}\\middle|...\\right)" />
        <MathBlock tex="\\overrightarrow{AG}=\\frac13\\overrightarrow{AB}+\\frac13\\overrightarrow{AC}" />
        <div style={{ height: 360, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 10 }}>
          <SceneShell>
            <CoordinateSystem3D />
            <Centroid3D points={[TA, TB, TC]} />
          </SceneShell>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            [TA, setTA, 'A'],
            [TB, setTB, 'B'],
            [TC, setTC, 'C'],
          ].map(([pt, set, label]: any) => (
            <div key={label} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 11 }}>{label}</div>
              <Slider label="x" value={pt.x} min={-3} max={5} step={1} color="#ef4444" onChange={v => set({ ...pt, x: v })} />
              <Slider label="y" value={pt.y} min={-3} max={5} step={1} color="#22c55e" onChange={v => set({ ...pt, y: v })} />
              <Slider label="z" value={pt.z} min={-3} max={3} step={1} color="#3b82f6" onChange={v => set({ ...pt, z: v })} />
            </div>
          ))}
        </div>
        <div style={{ padding: 8, borderRadius: 10, background: onMedian ? '#f0fdf4' : '#fef2f2', border: '1px solid #e2e8f0', fontSize: 13, marginTop: 8 }}>
          {onMedian ? '✓ G على المتوسط و AG:GM=2:1' : '✗ تحقق فشل'} — G({G.x.toFixed(1)},{G.y.toFixed(1)},{G.z.toFixed(1)})
        </div>
      </StepBlock>

      <StepBlock num="8" title="مركز ثقل رباعي الوجوه">
        <MathBlock tex="G=\\frac{A+B+C+D}{4}" />
        <div style={{ height: 320, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 8 }}>
          <SceneShell>
            <CoordinateSystem3D />
            <Centroid3D points={[QA, QB, QC, QD]} />
          </SceneShell>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <Slider label="QA x" value={QA.x} min={-2} max={2} step={1} color="#ef4444" onChange={v => setQA({ ...QA, x: v })} />
          <Slider label="QB x" value={QB.x} min={-2} max={4} step={1} color="#ef4444" onChange={v => setQB({ ...QB, x: v })} />
        </div>
        <div style={{ fontSize: 12, color: '#64748b' }}>G=({Gt.x.toFixed(1)},{Gt.y.toFixed(1)},{Gt.z.toFixed(1)}) — متوسط الإحداثيات الأربع</div>
      </StepBlock>

      <StepBlock num="9" title="خصائص مركز الثقل">
        <p>في المثلث، <MathInline tex="G" /> يقع على كل متوسط ويقسمه 2:1 — مرئي في المشهد (الخط البرتقالي المتقطع) حيث <MathInline tex="AG:GM=2:1" />.</p>
      </StepBlock>
    </LessonLayout>
  )
}
