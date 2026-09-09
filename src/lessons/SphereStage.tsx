import { useState, useMemo } from 'react'
import SceneShell from '../three/SceneShell'
import CoordinateSystem3D from '../three/CoordinateSystem3D'
import Sphere3D from '../three/Sphere3D'
import SpherePointRelation3D from '../three/SpherePointRelation3D'
import SpherePlaneIntersection3D from '../three/SpherePlaneIntersection3D'
import { LessonLayout, StepBlock, HintBox, HumanNote } from '../components/lessons/LessonLayout'
import { MathBlock, MathInline } from '../components/math/MathBlock'
import { sphereFromCenterRadius, sphereFromCenterAndPoint, sphereFromExpandedEquation, sphereEquationLatex, pointSphereRelation, spherePlaneIntersectionDetailed } from '../math/spheres'
import { distanceBetweenPoints } from '../math/points'
import type { Plane } from '../math/types'

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

export default function SphereStage() {
  const [center, setCenter] = useState<[number, number, number]>([2, -1, 1])
  const [radius, setRadius] = useState(2.5)
  const sphere = useMemo(() => sphereFromCenterRadius({ x: center[0], y: center[1], z: center[2] }, radius), [center, radius])
  const sphereLatex = useMemo(() => sphere ? sphereEquationLatex(sphere) : 'غير صالحة', [sphere])

  // للانتماء
  const [Apt, setApt] = useState<[number, number, number]>([4, -1, 1])
  const rel = useMemo(() => sphere ? pointSphereRelation({ x: Apt[0], y: Apt[1], z: Apt[2] }, sphere) : 'invalid', [Apt, sphere])

  // للمستوى
  const [plane, setPlane] = useState<Plane>({ a: 0, b: 0, c: 1, d: -1 })
  const detail = useMemo(() => sphere ? spherePlaneIntersectionDetailed(sphere, plane) : { kind: 'invalid', reason: 'لا كرة' } as any, [sphere, plane])

  // للموسعة
  const [exp, setExp] = useState({ A: -4, B: 2, C: -2, D: -11 })
  const expanded = useMemo(() => sphereFromExpandedEquation(exp.A, exp.B, exp.C, exp.D), [exp])
  const expandedSphere = expanded.sphere

  // لكرة تمر بنقطة
  const [M2, setM2] = useState<[number, number, number]>([0, 0, 0])
  const [A2, setA2] = useState<[number, number, number]>([2, 0, 0])
  const sphere2 = useMemo(() => sphereFromCenterAndPoint({ x: M2[0], y: M2[1], z: M2[2] }, { x: A2[0], y: A2[1], z: A2[2] }), [M2, A2])

  return (
    <LessonLayout title="الكرة — كل النقاط على نفس البُعد" subtitle="تخيل تثبت خيطًا طوله r في نقطة M وتدور به في كل الاتجاهات — السطح الذي يرسمه هو الكرة. كل نقطة عليه تبعد r تمامًا عن المركز.">
      <div style={{ background: 'linear-gradient(135deg,#fffbeb,#eff6ff)', border: '1px solid #fde68a', borderRadius: 14, padding: '12px 14px', fontSize: 13.5, color: '#334155', lineHeight: 1.7, marginBottom: 12 }}>
        <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>🧭 كيف نفكر؟</div>
        الكرة = «كل النقاط التي تبعد r عن M». منها نأخذ معادلتها، ثم نسأل: هل نقطة معينة داخلها أم عليها؟ وهل مستوى يقطعها في دائرة أم يمسها؟
      </div>

      {/* 1 — مفهوم */}
      <StepBlock num="1" title="الفكرة — خيط ويدور">
        <p>ثبت نقطة <MathInline tex="M" />، وخذ خيطًا طوله <MathInline tex="r" />، ولفّه في كل الاتجاهات — طرف الخيط يرسم كرة. رياضيًا:</p>
        <MathBlock label="التعريف" tex="|MX| = r" />
        <MathBlock label="بالمسافة" tex="\sqrt{(x-x_0)^2+(y-y_0)^2+(z-z_0)^2}=r" />
        <MathBlock label="الشكل الذي نستخدمه" tex="(x-x_0)^2+(y-y_0)^2+(z-z_0)^2=r^2" />
        <HumanNote>الرُبيعان مربعان لإخفاء الجذر — أسهل للتعويض في الامتحان. تذكر: المعادلة تصف السطح فقط، أما داخل الكرة فهو <MathInline tex="|MX|<r" />.</HumanNote>
        <div style={{ height: 360, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white' }}>
          <SceneShell>
            <CoordinateSystem3D />
            {sphere && <Sphere3D sphere={sphere} pointOnSurface={{ x: Apt[0], y: Apt[1], z: Apt[2] }} />}
          </SceneShell>
        </div>
      </StepBlock>

      {/* 2 — معنى الرموز */}
      <StepBlock num="2" title="معنى كل رمز">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 10 }}><strong>M(x₀|y₀|z₀)</strong> — المركز الثابت</div>
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: 10 }}><strong>r</strong> — نصف القطر (&gt;0)</div>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: 10 }}><strong>X(x|y|z)</strong> — نقطة متغيرة على السطح</div>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: 10 }}><strong>سطح الكرة</strong> — المعادلة تصف السطح، والمتباينة تحدد الداخل</div>
        </div>
      </StepBlock>

      {/* 3 — تفاعل */}
      <StepBlock num="3" title="حرّك المركز وكبّر الكرة — شوف المعادلة تتغير">
        <div style={{ height: 380, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 10 }}>
          <SceneShell>
            <CoordinateSystem3D />
            {sphere && <Sphere3D sphere={sphere} />}
          </SceneShell>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 12 }}>المركز M</div>
            <Slider label="x₀" value={center[0]} min={-3} max={3} step={0.5} color="#ef4444" onChange={v => setCenter([v, center[1], center[2]])} />
            <Slider label="y₀" value={center[1]} min={-3} max={3} step={0.5} color="#22c55e" onChange={v => setCenter([center[0], v, center[2]])} />
            <Slider label="z₀" value={center[2]} min={-3} max={3} step={0.5} color="#3b82f6" onChange={v => setCenter([center[0], center[1], v])} />
          </div>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 12 }}>نصف القطر r</div>
            <Slider label="r" value={radius} min={0} max={4} step={0.5} color="#0ea5e9" onChange={v => setRadius(v)} />
            <div style={{ fontSize: 11, color: radius > 0 ? '#22c55e' : '#ef4444', marginTop: 6 }}>{radius > 0 ? `✓ كرة صالحة — ${sphereLatex}` : 'r≤0 → حالة منحلة/غير صالحة — لا كرة'}</div>
          </div>
        </div>
        {sphere && <MathBlock tex={sphereLatex} />}
      </StepBlock>

      {/* 4 — شروط */}
      <StepBlock num="4" title="شروط نصف القطر">
        <ul style={{ margin: 0, paddingInlineStart: 18, fontSize: 13, lineHeight: 1.8 }}>
          <li><MathInline tex="r>0" /> → كرة حقيقية</li>
          <li><MathInline tex="r=0" /> → نقطة منحلة (ليست كرة)</li>
          <li><MathInline tex="r<0" /> → غير صالح</li>
        </ul>
      </StepBlock>

      {/* 5 — استخراج */}
      <StepBlock num="5" title="القراءة من الصيغة القياسية — انتبه للإشارة">
        <MathBlock tex="(x-2)^2+(y+3)^2+(z-1)^2=25 \\;\\Rightarrow\\; M=(2|-3|1),\\; r=5" />
        <p>مثال في المشهد: <MathInline tex="M=(2|-1|1), r=2.5" /> → <MathInline tex="(x+2?) لا — انتبه: (x-2) يعطي 2, (y+1) يعطي −1" /></p>
        <HintBox>اختبر: <MathInline tex="(x+2)^2+(y-3)^2+(z+1)^2=16" /> → <MathInline tex="M=(-2|3|-1), r=4" /> — الإشارة معكوسة.</HintBox>
      </StepBlock>

      {/* 6-8 — موسعة وإكمال */}
      <StepBlock num="6" title="الصيغة الموسعة وإكمال المربع">
        <MathBlock tex="x^2+y^2+z^2+Ax+By+Cz+D=0" />
        <MathBlock tex="M=(-A/2,-B/2,-C/2),\\; r^2 = x_0^2+y_0^2+z_0^2 - D" />
        <div style={{ height: 340, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 10 }}>
          <SceneShell>
            <CoordinateSystem3D />
            {expandedSphere && <Sphere3D sphere={expandedSphere} color="#f59e0b" />}
            {!expandedSphere && <div />}
          </SceneShell>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <Slider label="A" value={exp.A} min={-6} max={6} step={1} color="#ef4444" onChange={v => setExp({ ...exp, A: v })} />
          <Slider label="B" value={exp.B} min={-6} max={6} step={1} color="#22c55e" onChange={v => setExp({ ...exp, B: v })} />
          <Slider label="C" value={exp.C} min={-6} max={6} step={1} color="#3b82f6" onChange={v => setExp({ ...exp, C: v })} />
          <Slider label="D" value={exp.D} min={-20} max={20} step={1} color="#7c3aed" onChange={v => setExp({ ...exp, D: v })} />
        </div>
        <MathBlock tex={`M=(${-exp.A / 2}|${-exp.B / 2}|${-exp.C / 2}),\\; r^2=${expanded.r2.toFixed(2)} \\;\\Rightarrow\\; ${expanded.kind === 'sphere' ? `r=${expanded.sphere!.radius.toFixed(2)}` : expanded.kind === 'point' ? 'نقطة منحلة' : 'لا توجد كرة (r²<0)'}`} />
        {expanded.kind !== 'sphere' && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: 8, color: '#991b1b', fontSize: 13 }}>{expanded.kind === 'point' ? 'r²=0 → نقطة' : 'r²<0 → لا نقاط حقيقية'}</div>}
        <HintBox>إكمال المربع: <MathInline tex="x^2+Ax → (x+A/2)^2 - A²/4" /> — طبّق على x,y,z.</HintBox>
      </StepBlock>

      {/* 10 — تمر بنقطة */}
      <StepBlock num="7" title="كرة تمر بنقطة — r = |MA|">
        <div style={{ height: 360, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 10 }}>
          <SceneShell>
            <CoordinateSystem3D />
            {sphere2 && <Sphere3D sphere={sphere2} color="#22c55e" pointOnSurface={{ x: A2[0], y: A2[1], z: A2[2] }} />}
          </SceneShell>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 12 }}>M</div>
            <Slider label="x" value={M2[0]} min={-3} max={3} step={1} color="#ef4444" onChange={v => setM2([v, M2[1], M2[2]])} />
            <Slider label="y" value={M2[1]} min={-3} max={3} step={1} color="#22c55e" onChange={v => setM2([M2[0], v, M2[2]])} />
            <Slider label="z" value={M2[2]} min={-3} max={3} step={1} color="#3b82f6" onChange={v => setM2([M2[0], M2[1], v])} />
          </div>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 12 }}>A على الكرة</div>
            <Slider label="x" value={A2[0]} min={-3} max={3} step={1} color="#ef4444" onChange={v => setA2([v, A2[1], A2[2]])} />
            <Slider label="y" value={A2[1]} min={-3} max={3} step={1} color="#22c55e" onChange={v => setA2([A2[0], v, A2[2]])} />
            <Slider label="z" value={A2[2]} min={-3} max={3} step={1} color="#3b82f6" onChange={v => setA2([A2[0], A2[1], v])} />
          </div>
        </div>
        {sphere2 && <MathBlock tex={`r=|MA|=${distanceBetweenPoints({ x: M2[0], y: M2[1], z: M2[2] }, { x: A2[0], y: A2[1], z: A2[2] }).toFixed(2)}`} />}
      </StepBlock>

      {/* 11 — انتماء */}
      <StepBlock num="8" title="هل النقطة على/داخل/خارج الكرة؟">
        <div style={{ height: 340, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 10 }}>
          <SceneShell>
            <CoordinateSystem3D />
            {sphere && <SpherePointRelation3D sphere={sphere} point={{ x: Apt[0], y: Apt[1], z: Apt[2] }} />}
          </SceneShell>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <Slider label="Ax" value={Apt[0]} min={-4} max={6} step={0.5} color="#ef4444" onChange={v => setApt([v, Apt[1], Apt[2]])} />
          <Slider label="Ay" value={Apt[1]} min={-4} max={4} step={0.5} color="#22c55e" onChange={v => setApt([Apt[0], v, Apt[2]])} />
          <Slider label="Az" value={Apt[2]} min={-4} max={4} step={0.5} color="#3b82f6" onChange={v => setApt([Apt[0], Apt[1], v])} />
        </div>
        <div style={{ background: rel === 'onSurface' ? '#f0fdf4' : rel === 'inside' ? '#fffbeb' : '#fef2f2', border: `1px solid ${rel === 'onSurface' ? '#bbf7d0' : rel === 'inside' ? '#fde68a' : '#fecaca'}`, borderRadius: 10, padding: 8, fontSize: 13, marginTop: 8 }}>
          {rel === 'onSurface' ? '✓ على السطح |MA|≈r' : rel === 'inside' ? 'داخل الكرة |MA|<r' : 'خارج الكرة |MA|>r'} — {rel === 'onSurface' ? 'تحقق المعادلة' : rel === 'inside' ? 'المتباينة <' : 'المتباينة >'}
        </div>
      </StepBlock>

      {/* 13-16 — كرة ومستوى */}
      <StepBlock num="9" title="الكرة والمستوى — δ = d(M,E)">
        <p>المسافة بين المركز والمستوى (من المرحلة 7) تحدد الوضع.</p>
        <MathBlock tex="\\delta = d(M,E)" />
        <div style={{ height: 380, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 10 }}>
          <SceneShell>
            <CoordinateSystem3D />
            <SpherePlaneIntersection3D sphere={sphere} plane={plane} />
          </SceneShell>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 10 }}>
            <Slider label="a" value={plane.a} min={-2} max={2} step={1} color="#ef4444" onChange={v => setPlane({ ...plane, a: v })} />
            <Slider label="b" value={plane.b} min={-2} max={2} step={1} color="#22c55e" onChange={v => setPlane({ ...plane, b: v })} />
            <Slider label="c" value={plane.c} min={-2} max={2} step={1} color="#3b82f6" onChange={v => setPlane({ ...plane, c: v })} />
            <Slider label="d" value={plane.d} min={-4} max={4} step={1} color="#7c3aed" onChange={v => setPlane({ ...plane, d: v })} />
          </div>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 10, fontSize: 12 }}>
            <div>الكرة: <MathInline tex={`M(${center[0]}|${center[1]}|${center[2]}), r=${radius}`} /></div>
            <div>المستوى: <MathInline tex={`${plane.a}x+${plane.b}y+${plane.c}z+${plane.d}=0`} /></div>
            <div style={{ marginTop: 6, padding: 8, borderRadius: 8, background: detail.kind === 'disjoint' ? '#f8fafc' : detail.kind === 'tangent' ? '#fffbeb' : detail.kind === 'intersecting' ? '#f0fdf4' : '#fef2f2', border: '1px solid #e2e8f0' }}>
              <strong>{detail.kind === 'disjoint' ? 'لا تقاطع δ>r' : detail.kind === 'tangent' ? 'تماس δ=r' : detail.kind === 'intersecting' ? 'تقاطع في دائرة δ<r' : 'غير صالح'}</strong>
              {detail.kind === 'intersecting' && <div>ρ = √(r²−δ²) = {detail.rho.toFixed(2)} — مركزها H=proj_E(M)</div>}
              {detail.kind === 'tangent' && <div>H هي نقطة التماس = proj_E(M)</div>}
            </div>
          </div>
        </div>
        <MathBlock tex="\\rho = \\sqrt{r^2-\\delta^2},\\; r^2=\\delta^2+\\rho^2" />
        <HintBox>عند <MathInline tex="\\delta=0" /> (المستوى يمر بالمركز) → <MathInline tex="\\rho=r" /> — دائرة عظمى. عند <MathInline tex="\\delta>r" /> لا جذر — لا دائرة.</HintBox>
      </StepBlock>
    </LessonLayout>
  )
}
