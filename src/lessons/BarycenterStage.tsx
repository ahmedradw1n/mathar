import { useState, useMemo } from 'react'
import SceneShell from '../three/SceneShell'
import CoordinateSystem3D from '../three/CoordinateSystem3D'
import Barycenter2D3D from '../three/Barycenter2D3D'
import Barycenter3D3D from '../three/Barycenter3D3D'
import BarycenterGrouping3D from '../three/BarycenterGrouping3D'
import BarycenterTetra3D from '../three/BarycenterTetra3D'
import { LessonLayout, StepBlock, HintBox, HumanNote } from '../components/lessons/LessonLayout'
import { MathBlock, MathInline } from '../components/math/MathBlock'
import { weightedBarycenter2, weightedBarycenter3, weightedBarycenter4, associativeBarycenterExample, ratioFromWeights, weightedPointOnSegment, triangleCentroidWeighted } from '../math/barycenter'
import type { Point3 } from '../math/types'

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

export default function BarycenterStage() {
  const A2: Point3 = { x: 0, y: 0, z: 0 }
  const B2: Point3 = { x: 4, y: 0, z: 0 }
  const [alpha, setAlpha] = useState(1)
  const [beta, setBeta] = useState(2)
  const r2 = useMemo(() => weightedBarycenter2(A2, alpha, B2, beta), [alpha, beta])
  const tRatio = useMemo(() => ratioFromWeights(alpha, beta), [alpha, beta])

  // 3 points
  const A3: Point3 = { x: 0, y: 0, z: 0 }, B3: Point3 = { x: 3, y: 0, z: 0 }, C3: Point3 = { x: 0, y: 3, z: 0 }
  const [a3, setA3] = useState(1), [b3, setB3] = useState(1), [c3, setC3] = useState(1)
  const r3 = useMemo(() => weightedBarycenter3(A3, a3, B3, b3, C3, c3), [a3, b3, c3])

  // grouping
  const [ga, setGa] = useState(1), [gb, setGb] = useState(2), [gc, setGc] = useState(3)
  const grp = useMemo(() => associativeBarycenterExample({ x: 0, y: 0, z: 0 }, ga, { x: 3, y: 0, z: 0 }, gb, { x: 0, y: 3, z: 0 }, gc), [ga, gb, gc])

  // ratio visualizer
  const [t, setT] = useState(0.3)
  const Mt = weightedPointOnSegment(A2, B2, t)

  // tetra
  const TA: Point3 = { x: 0, y: 0, z: 0 }, TB: Point3 = { x: 2, y: 0, z: 0 }, TC: Point3 = { x: 0, y: 2, z: 0 }, TD: Point3 = { x: 0, y: 0, z: 2 }
  const r4 = weightedBarycenter4(TA, 1, TB, 1, TC, 1, TD, 1)
  const faceCent = triangleCentroidWeighted(TB, TC, TD)

  return (
    <LessonLayout title="مركز الأوزان — أين تتوازن النقاط؟" subtitle="تخيل نقطتين بأوزان مختلفة على عصا — أين تضع إصبعك لتتوازن؟ كلما ثقلت نقطة جذبت التوازن نحوها. هذه هي فكرة النقاط المثقلة.">
      {/* 1 */}
      <StepBlock num="1" title="ما معنى نقطة مثقلة؟ (A, α)">
        <p>خذ نقطة <MathInline tex="A" /> وضع عليها وزنًا <MathInline tex="\alpha" /> — كأنك تضع ثقلًا على طاولة. الوزن الموجب يشد المركز نحوه، السالب يدفعه بعيدًا، والصفر كأن النقطة غير موجودة.</p>
        <p>الشرط الوحيد: مجموع الأوزان لا يكون صفرًا — وإلا لا يوجد توازن.</p>
        <MathBlock label="التعريف الجميل" tex="(A,\alpha),\; (B,\beta),\; \sum\alpha_i\ne0 \;\Rightarrow\; \exists! G: \sum \alpha_i\vec{GA_i}=0" />
        <HumanNote>الوزن ليس مسافة — هو «قوة الجذب». نقطتان بوزن 2 و 1؟ المركز أقرب لصاحب الوزن 2 بمرتين. جرّب المنزلقات بعد قليل وشوف.</HumanNote>
      </StepBlock>

      {/* 2 */}
      <StepBlock num="2" title="بين نقطتين — أين يقع التوازن؟">
        <MathBlock label="القانون" tex="\alpha\vec{GA}+\beta\vec{GB}=0 \;\Rightarrow\; \vec{AG}=\frac{\beta}{\alpha+\beta}\vec{AB}" />
        <p>بكلام بسيط:</p>
        <div style={{ display: 'grid', gap: 6, fontSize: 13.5 }}>
          <div>• <MathInline tex="\alpha=\beta" /> → المركز في المنتصف تمامًا (توازن متساوٍ)</div>
          <div>• نفس الإشارة → المركز بين النقطتين، أقرب للأثقل</div>
          <div>• إشارتان مختلفتان → المركز خارج القطعة (كأن وزنًا سالبًا يدفعه)</div>
          <div>• وزن صفر → كأن النقطة غير موجودة</div>
        </div>
        <div style={{ height: 340, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white' }}>
          <SceneShell>
            <CoordinateSystem3D />
            <Barycenter2D3D A={A2} B={B2} G={r2.valid ? r2.point : null} invalid={!r2.valid} />
          </SceneShell>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
          <Slider label="α" value={alpha} min={-3} max={3} step={0.5} color="#0ea5e9" onChange={setAlpha} />
          <Slider label="β" value={beta} min={-3} max={3} step={0.5} color="#f43f5e" onChange={setBeta} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 8, fontSize: 12 }}>مجموع الأوزان = {(alpha + beta).toFixed(1)} {Math.abs(alpha + beta) < 1e-9 ? '— غير صالح' : ''}</div>
          <div style={{ background: r2.valid ? '#f0fdf4' : '#fef2f2', border: '1px solid #e2e8f0', borderRadius: 10, padding: 8, fontSize: 12 }}>{r2.valid ? `G=(${r2.point.x.toFixed(2)}, ${r2.point.y.toFixed(2)}, ${r2.point.z.toFixed(2)}) — t=${tRatio?.toFixed(2) ?? '—'}` : 'لا يوجد G'}</div>
        </div>
        {r2.valid && <MathBlock tex={`\\vec{AG}=\\frac{${beta}}{${alpha + beta}}\\vec{AB} = (${(r2.point.x - A2.x).toFixed(2)},0,0)`} />}
      </StepBlock>

      {/* 3 */}
      <StepBlock num="3" title="الخواص — الوحدانية وضرب الأوزان والصيغة بمرجع M">
        <MathBlock tex="\\text{إذا } \\sum\\alpha_i\\ne0 \\text{ فالمركز وحيد. و } (\\lambda\\alpha_i) \\text{ يعطي نفس } G \\text{ لكل } \\lambda\\ne0" />
        <MathBlock tex="\\sum \\alpha_i\\vec{MA_i} = (\\sum\\alpha_i)\\vec{MG} \\quad \\forall M" />
        <p>اشتقاق: <MathInline tex="\\vec{MA_i}=\\vec{MG}+\\vec{GA_i}" /> ثم جمع موزون واستخدام <MathInline tex="\\sum\\alpha_i\\vec{GA_i}=0" />.</p>
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: 10, fontSize: 13 }}>جرب تغيير <MathInline tex="\\lambda=2" /> أعلاه: (1,2) و(2,4) تعطيان نفس G — لأن النسبة محفوظة.</div>
      </StepBlock>

      {/* 4 */}
      <StepBlock num="4" title="مركز ثلاث نقاط — وحالة مركز ثقل المثلث">
        <MathBlock tex="\\vec{AG}=\\frac{\\beta}{\\Sigma}\\vec{AB}+\\frac{\\gamma}{\\Sigma}\\vec{AC},\\; \\Sigma=\\alpha+\\beta+\\gamma" />
        <MathBlock tex="\\alpha=\\beta=\\gamma=1 \\Rightarrow G=(A+B+C)/3" />
        <div style={{ height: 340, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white' }}>
          <SceneShell>
            <CoordinateSystem3D />
            <Barycenter3D3D A={A3} B={B3} C={C3} G={r3.valid ? r3.point : null} />
          </SceneShell>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 10 }}>
          <Slider label="α" value={a3} min={-2} max={3} step={0.5} color="#0ea5e9" onChange={setA3} />
          <Slider label="β" value={b3} min={-2} max={3} step={0.5} color="#f43f5e" onChange={setB3} />
          <Slider label="γ" value={c3} min={-2} max={3} step={0.5} color="#22c55e" onChange={setC3} />
        </div>
        <div style={{ background: r3.valid ? '#f0fdf4' : '#fef2f2', border: '1px solid #e2e8f0', borderRadius: 10, padding: 8, fontSize: 12, marginTop: 8 }}>{r3.valid ? `G=(${r3.point.x.toFixed(2)}, ${r3.point.y.toFixed(2)}, ${r3.point.z.toFixed(2)}) — Σ=${(a3 + b3 + c3).toFixed(1)}` : 'مجموع الأوزان صفر — لا مركز'}</div>
      </StepBlock>

      {/* 5 */}
      <StepBlock num="5" title="الخاصية التجميعية">
        <p>نجمع <MathInline tex="(A,\\alpha),(B,\\beta) → (G_1,\\alpha+\\beta)" /> ثم <MathInline tex="(G_1,\\alpha+\\beta),(C,\\gamma) → G" />. هذا يبسط مسائل 3 و4 نقاط.</p>
        <MathBlock tex="(A,1),(B,1),(C,1) → G_1=mid(AB),\\; (G_1,2),(C,1) → G" />
        <div style={{ height: 340, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white' }}>
          <SceneShell>
            <CoordinateSystem3D />
            <BarycenterGrouping3D A={{ x: 0, y: 0, z: 0 }} B={{ x: 3, y: 0, z: 0 }} C={{ x: 0, y: 3, z: 0 }} G1={grp.G1} G={grp.G} />
          </SceneShell>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 10 }}>
          <Slider label="α" value={ga} min={-2} max={3} step={0.5} color="#0ea5e9" onChange={setGa} />
          <Slider label="β" value={gb} min={-2} max={3} step={0.5} color="#f43f5e" onChange={setGb} />
          <Slider label="γ" value={gc} min={-2} max={3} step={0.5} color="#22c55e" onChange={setGc} />
        </div>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 8, fontSize: 12, marginTop: 8 }}>{grp.G ? `G₁=(${grp.G1!.x.toFixed(2)}, ${grp.G1!.y.toFixed(2)}) → G=(${grp.G.x.toFixed(2)}, ${grp.G.y.toFixed(2)})` : 'تجميع غير صالح (مجموع جزئي صفر)'}</div>
      </StepBlock>

      {/* 6 */}
      <StepBlock num="6" title="النسب وM.A.M — AM = t AB">
        <MathBlock tex="\\vec{AM}=t\\vec{AB} \\;\\Leftrightarrow\\; M=bar((A,1-t),(B,t)),\\; t=\\beta/(\\alpha+\\beta)" />
        <p>حالات t: داخل (0,1)، عند A (0)، عند B (1)، بعد B (&gt;1)، قبل A (&lt;0).</p>
        <div style={{ height: 340, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white' }}>
          <SceneShell>
            <CoordinateSystem3D />
            <Barycenter2D3D A={A2} B={B2} G={Mt} />
          </SceneShell>
        </div>
        <Slider label="t" value={t} min={-0.5} max={1.5} step={0.1} color="#7c3aed" onChange={setT} />
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 8, fontSize: 12, marginTop: 6 }}>M=({Mt.x.toFixed(2)}, {Mt.y.toFixed(2)}, {Mt.z.toFixed(2)}) — أوزان: α={(1 - t).toFixed(2)}, β={t.toFixed(2)} — {t < 0 ? 'قبل A' : t > 1 ? 'بعد B' : t === 0 ? 'عند A' : t === 1 ? 'عند B' : 'داخل القطعة'}</div>
      </StepBlock>

      {/* 7 */}
      <StepBlock num="7" title="M.A.M بالإحداثيات">
        <MathBlock tex="x_G=\\frac{\\sum\\alpha_i x_i}{\\sum\\alpha_i},\\; y_G=\\frac{\\sum\\alpha_i y_i}{\\sum\\alpha_i},\\; z_G=\\frac{\\sum\\alpha_i z_i}{\\sum\\alpha_i}" />
        <p>نفس الصيغة لـ 2 و3 و4 نقاط. أوزان سالبة/صفرية مسموحة شرط <MathInline tex="\\sum\\ne0" />.</p>
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: 10, fontSize: 13 }}>مثال: A(1|0|2) α=2, B(3|1|0) β=1 → G=((2·1+1·3)/3, (2·0+1·1)/3, (2·2+1·0)/3) = (1.67, 0.33, 1.33)</div>
      </StepBlock>

      {/* 8 */}
      <StepBlock num="8" title="تطبيقات في رباعي الوجوه ABCD">
        <MathBlock tex="G_{ABCD}=(A+B+C+D)/4,\\; G_{BCD}=(B+C+D)/3,\\; A,G,G_{BCD} \\text{ على استقامة واحدة و } AG:GG_{BCD}=3:1" />
        <div style={{ height: 360, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white' }}>
          <SceneShell>
            <CoordinateSystem3D />
            <BarycenterTetra3D A={TA} B={TB} C={TC} D={TD} G={r4.valid ? r4.point : null} faceCentroid={faceCent} />
          </SceneShell>
        </div>
        <p>الإثبات بالتجميع: <MathInline tex="(B,1)(C,1)(D,1)→(G_{BCD},3)" /> ثم <MathInline tex="(A,1)(G_{BCD},3)→G" /> فيظهر أن G يقع على A-Gbcd بنسبة 3:1. كذلك لإثبات الاستقامة والانتماء لمستوى نستخدم التمثيل المثقل.</p>
      </StepBlock>

      {/* 9 */}
      <StepBlock num="9" title="تطبيقات في المكعب ومتوازي المستطيلات">
        <p>المنتصفات هي مراكز مثقلة (1,1). النقاط على الأحرف بنسب t تُكتب كمراكز مثقلة. لإثبات استقامة نقاط نحاول كتابتها بمراكز مشتركة. لإثبات انتماء لمستوى نبحث عن تمثيل مثقل يضم النقاط.</p>
        <MathBlock tex="M\\in AB,\\; \\vec{AM}=t\\vec{AB} \\Rightarrow M=bar((A,1-t),(B,t))" />
        <HintBox>المكعب نفسه لا يحتاج إعادة رسم؛ الطبقة التعليمية توضح الأوزان والنسب فوقه.</HintBox>
      </StepBlock>
    </LessonLayout>
  )
}
