import { useState, useMemo } from 'react'
import SceneShell from '../three/SceneShell'
import CoordinateSystem3D from '../three/CoordinateSystem3D'
import LineRelation3D from '../three/LineRelation3D'
import LinePlaneRelation3D from '../three/LinePlaneRelation3D'
import PlaneRelation3D from '../three/PlaneRelation3D'
import { LessonLayout, StepBlock, HintBox, HumanNote } from '../components/lessons/LessonLayout'
import { MathBlock, MathInline } from '../components/math/MathBlock'
import { classifyLineLineRelation, classifyLinePlaneRelation, classifyPlanePlaneRelation, arabicLineLine, arabicLinePlane, arabicPlanePlane } from '../math/relations'
import { cross, dot } from '../math/vectors'
import type { Line3, Plane } from '../math/types'

function Slider({ label, value, min, max, step, color, onChange }: { label: string; value: number; min: number; max: number; step: number; color: string; onChange: (v: number) => void }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
        <span style={{ fontWeight: 700, color }}>{label}={value}</span>
        <span style={{ color: '#64748b' }}>{min}→{max}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ width: '100%', accentColor: color }} />
    </div>
  )
}

export default function RelationsStage() {
  // Line-Line state
  const [P, setP] = useState<[number, number, number]>([0, 0, 0])
  const [u, setU] = useState<[number, number, number]>([2, 0, 0])
  const [Q, setQ] = useState<[number, number, number]>([0, 1, 0])
  const [v, setV] = useState<[number, number, number]>([2, 0, 0])
  const l1: Line3 = useMemo(() => ({ point: { x: P[0], y: P[1], z: P[2] }, direction: { x: u[0], y: u[1], z: u[2] } }), [P, u])
  const l2: Line3 = useMemo(() => ({ point: { x: Q[0], y: Q[1], z: Q[2] }, direction: { x: v[0], y: v[1], z: v[2] } }), [Q, v])
  const resLL = useMemo(() => classifyLineLineRelation(l1, l2), [l1, l2])
  const interLL = resLL.kind === 'intersecting' ? resLL.point : null

  const presetLL = (kind: 'coincident' | 'parallel' | 'intersecting' | 'skew') => {
    if (kind === 'coincident') { setP([0, 0, 0]); setU([2, 0, 0]); setQ([1, 0, 0]); setV([2, 0, 0]) }
    if (kind === 'parallel') { setP([0, 0, 0]); setU([2, 0, 0]); setQ([0, 1, 0]); setV([2, 0, 0]) }
    if (kind === 'intersecting') { setP([0, 0, 0]); setU([2, 0, 0]); setQ([0, 0, 0]); setV([0, 2, 0]) }
    if (kind === 'skew') { setP([0, 0, 0]); setU([2, 0, 0]); setQ([0, 1, 1]); setV([0, 2, 1]) }
  }

  // Line-Plane
  const [Plp, setPlp] = useState<[number, number, number]>([0, 0, 1])
  const [ulp, setUlp] = useState<[number, number, number]>([0, 0, -1])
  const [pln, setPln] = useState<Plane>({ a: 0, b: 0, c: 1, d: 0 }) // z=0
  const lineLP: Line3 = useMemo(() => ({ point: { x: Plp[0], y: Plp[1], z: Plp[2] }, direction: { x: ulp[0], y: ulp[1], z: ulp[2] } }), [Plp, ulp])
  const resLP = useMemo(() => classifyLinePlaneRelation(lineLP, pln), [lineLP, pln])
  const interLP = resLP.kind === 'intersecting' ? resLP.point : null
  const ndotu = useMemo(() => dot({ x: pln.a, y: pln.b, z: pln.c }, { x: ulp[0], y: ulp[1], z: ulp[2] }), [pln, ulp])

  const presetLP = (kind: 'intersecting' | 'parallel' | 'contained') => {
    if (kind === 'intersecting') { setPlp([0, 0, 1]); setUlp([0, 0, -1]); setPln({ a: 0, b: 0, c: 1, d: 0 }) }
    if (kind === 'parallel') { setPlp([0, 0, 1]); setUlp([1, 0, 0]); setPln({ a: 0, b: 0, c: 1, d: 0 }) }
    if (kind === 'contained') { setPlp([1, 0, 0]); setUlp([1, 0, 0]); setPln({ a: 0, b: 0, c: 1, d: 0 }) }
  }

  // Plane-Plane
  const [p1, setP1] = useState<Plane>({ a: 1, b: 0, c: 0, d: 0 }) // x=0
  const [p2, setP2] = useState<Plane>({ a: 0, b: 1, c: 0, d: 0 }) // y=0
  const resPP = useMemo(() => classifyPlanePlaneRelation(p1, p2), [p1, p2])
  const interPP = resPP.kind === 'intersecting' ? resPP.line : null
  const n1 = useMemo(() => ({ x: p1.a, y: p1.b, z: p1.c }), [p1])
  const n2 = useMemo(() => ({ x: p2.a, y: p2.b, z: p2.c }), [p2])
  const uCross = useMemo(() => cross(n1, n2), [n1, n2])

  const presetPP = (kind: 'coincident' | 'parallel' | 'intersecting') => {
    if (kind === 'coincident') { setP1({ a: 1, b: 0, c: 0, d: 0 }); setP2({ a: 2, b: 0, c: 0, d: 0 }) }
    if (kind === 'parallel') { setP1({ a: 0, b: 0, c: 1, d: 0 }); setP2({ a: 0, b: 0, c: 1, d: -2 }) }
    if (kind === 'intersecting') { setP1({ a: 1, b: 0, c: 0, d: 0 }); setP2({ a: 0, b: 1, c: 0, d: 0 }) }
  }

  return (
    <LessonLayout title="كيف يلتقي المستقيمان والمستويان؟" subtitle="هل يمشيان معًا؟ هل يتقاطعان؟ هل يتخالفان كطريقين في جسور مختلفة؟ الفكرة كلها في 'هل اتجاههما متوازٍ؟' و 'هل يلتقيان فعلًا؟'">
      <div style={{ background: 'linear-gradient(135deg,#f5f3ff,#eff6ff)', border: '1px solid #ddd6fe', borderRadius: 14, padding: '12px 14px', fontSize: 13.5, color: '#334155', lineHeight: 1.7, marginBottom: 12 }}>
        <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>🧩 الخلاصة قبل التفاصيل</div>
        <div style={{ display: 'grid', gap: 6 }}>
          <div>• مستقيمان: شوف <MathInline tex="u\times v" /> — صفر؟ متوازيان. لا؟ حلّ المعادلة <MathInline tex="P+t u = Q+s v" /> — لها حل؟ متقاطعان، وإلا متخالفان.</div>
          <div>• مستقيم + مستوى: شوف <MathInline tex="n\cdot u" /> — صفر؟ موازٍ أو واقع. غير صفر؟ يقطع في نقطة واحدة.</div>
          <div>• مستويان: شوف <MathInline tex="n_1\times n_2" /> — هو اتجاه خط التقاطع إن وجد.</div>
        </div>
      </div>

      {/* مفهوم الوضع النسبي */}
      <StepBlock num="1" title="الفكرة العامة — مثل طرق السيارات">
        <p>تخيل مستقيمان كطريقين: إما يسيران متوازيين كطريقين سريعين، أو يلتقيان في تقاطع، أو يكونان متطابقين (نفس الطريق)، أو متخالفين كجسر فوق طريق — لا يتوازيان ولا يلتقيان. هذا الأخير لا يحدث في الورقة، فقط في الفضاء.</p>
        <HumanNote>كل الاختبارات تعتمد على ما تعلمته: <MathInline tex="u\times v=0" /> للتوازي، و <MathInline tex="n\cdot u=0" /> للتعامد.</HumanNote>
      </StepBlock>

      {/* Line-Line */}
      <StepBlock num="2" title="الوضع النسبي لمستقيمين — الحالات الأربع">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
          {(['coincident', 'parallel', 'intersecting', 'skew'] as const).map(k => (
            <button key={k} onClick={() => presetLL(k)} style={{ padding: '6px 10px', borderRadius: 999, border: '1px solid', borderColor: resLL.kind === k ? '#0f172a' : '#e2e8f0', background: resLL.kind === k ? '#0f172a' : 'white', color: resLL.kind === k ? 'white' : '#334155', fontSize: 11, cursor: 'pointer' }}>
              {k === 'coincident' ? 'متطابقان' : k === 'parallel' ? 'متوازيان' : k === 'intersecting' ? 'متقاطعان' : 'متخالفان'}
            </button>
          ))}
        </div>
        <div style={{ height: 380, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 10 }}>
          <SceneShell>
            <CoordinateSystem3D />
            <LineRelation3D l1={l1} l2={l2} intersection={interLL} />
          </SceneShell>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: '#0ea5e9' }}>g: P + t·u</div>
            <Slider label="Px" value={P[0]} min={-3} max={3} step={1} color="#ef4444" onChange={v => setP([v, P[1], P[2]])} />
            <Slider label="Py" value={P[1]} min={-3} max={3} step={1} color="#22c55e" onChange={v => setP([P[0], v, P[2]])} />
            <Slider label="Pz" value={P[2]} min={-3} max={3} step={1} color="#3b82f6" onChange={v => setP([P[0], P[1], v])} />
            <Slider label="ux" value={u[0]} min={-3} max={3} step={1} color="#ef4444" onChange={v => setU([v, u[1], u[2]])} />
            <Slider label="uy" value={u[1]} min={-3} max={3} step={1} color="#22c55e" onChange={v => setU([u[0], v, u[2]])} />
            <Slider label="uz" value={u[2]} min={-3} max={3} step={1} color="#3b82f6" onChange={v => setU([u[0], u[1], v])} />
          </div>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: '#f43f5e' }}>h: Q + s·v</div>
            <Slider label="Qx" value={Q[0]} min={-3} max={3} step={1} color="#ef4444" onChange={v => setQ([v, Q[1], Q[2]])} />
            <Slider label="Qy" value={Q[1]} min={-3} max={3} step={1} color="#22c55e" onChange={v => setQ([Q[0], v, Q[2]])} />
            <Slider label="Qz" value={Q[2]} min={-3} max={3} step={1} color="#3b82f6" onChange={v => setQ([Q[0], Q[1], v])} />
            <Slider label="vx" value={v[0]} min={-3} max={3} step={1} color="#ef4444" onChange={v2 => setV([v2, v[1], v[2]])} />
            <Slider label="vy" value={v[1]} min={-3} max={3} step={1} color="#22c55e" onChange={v2 => setV([v[0], v2, v[2]])} />
            <Slider label="vz" value={v[2]} min={-3} max={3} step={1} color="#3b82f6" onChange={v2 => setV([v[0], v[1], v2])} />
          </div>
        </div>
        <div style={{ marginTop: 10, padding: '8px 12px', borderRadius: 10, background: resLL.kind === 'intersecting' ? '#f0fdf4' : resLL.kind === 'skew' ? '#fefce8' : '#f8fafc', border: `1px solid ${resLL.kind === 'intersecting' ? '#bbf7d0' : '#e2e8f0'}`, fontSize: 13 }}>
          <strong>التصنيف: {arabicLineLine(resLL.kind)}</strong> — {resLL.kind === 'intersecting' && interLL ? `نقطة التقاطع (${interLL.x.toFixed(2)},${interLL.y.toFixed(2)},${interLL.z.toFixed(2)})` : resLL.kind === 'skew' ? 'لا تقاطع ولا توازٍ — في الفضاء لا يكفي أن لا يتوازيا ليتقاطعا' : resLL.kind === 'parallel' ? 'u∥v و Q∉g' : 'نفس المستقيم'}
        </div>
        <MathBlock tex={`u\\times v = (${cross({x:u[0],y:u[1],z:u[2]},{x:v[0],y:v[1],z:v[2]}).x.toFixed(1)}, ${cross({x:u[0],y:u[1],z:u[2]},{x:v[0],y:v[1],z:v[2]}).y.toFixed(1)}, ${cross({x:u[0],y:u[1],z:u[2]},{x:v[0],y:v[1],z:v[2]}).z.toFixed(1)}) \\; ${cross({x:u[0],y:u[1],z:u[2]},{x:v[0],y:v[1],z:v[2]}).x===0 && cross({x:u[0],y:u[1],z:u[2]},{x:v[0],y:v[1],z:v[2]}).y===0 && cross({x:u[0],y:u[1],z:u[2]},{x:v[0],y:v[1],z:v[2]}).z===0 ? '=0\\Rightarrow متوازيان' : '\\neq0'}`} />
      </StepBlock>

      {/* Line-Plane */}
      <StepBlock num="3" title="الوضع النسبي لمستقيم ومستوى — الحالات الثلاث">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
          {(['intersecting', 'parallel', 'contained'] as const).map(k => (
            <button key={k} onClick={() => presetLP(k as any)} style={{ padding: '6px 10px', borderRadius: 999, border: '1px solid', borderColor: resLP.kind === k ? '#0f172a' : '#e2e8f0', background: resLP.kind === k ? '#0f172a' : 'white', color: resLP.kind === k ? 'white' : '#334155', fontSize: 11, cursor: 'pointer' }}>
              {k === 'intersecting' ? 'متقاطع' : k === 'parallel' ? 'موازٍ' : 'يقع داخل'}
            </button>
          ))}
        </div>
        <div style={{ height: 360, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 10 }}>
          <SceneShell>
            <CoordinateSystem3D />
            <LinePlaneRelation3D line={lineLP} plane={pln} intersection={interLP} />
          </SceneShell>
        </div>
        <div style={{ padding: '8px 12px', borderRadius: 10, background: resLP.kind === 'intersecting' ? '#f0fdf4' : resLP.kind === 'contained' ? '#eff6ff' : '#fef2f2', border: `1px solid ${resLP.kind === 'intersecting' ? '#bbf7d0' : '#e2e8f0'}`, fontSize: 13 }}>
          <strong>{arabicLinePlane(resLP.kind)}</strong> — <MathInline tex={`n\\cdot u = ${ndotu.toFixed(2)}`} /> {Math.abs(ndotu) < 1e-9 ? '(صفر → موازٍ أو واقع)' : '(≠0 → يقطع)'} {resLP.kind === 'intersecting' && interLP ? `— نقطة (${interLP.x.toFixed(1)},${interLP.y.toFixed(1)},${interLP.z.toFixed(1)}) عند t=${(resLP as any).t.toFixed(2)}` : ''}
        </div>
        <MathBlock tex={`n\\cdot P + t(n\\cdot u)=d \\;\\Rightarrow\\; t=\\frac{d-n\\cdot P}{n\\cdot u}`} />
        <HintBox>إذا كان <MathInline tex="n\\cdot u\\neq0" /> يوجد تقاطع وحيد. إذا =0 نتحقق هل <MathInline tex="P" /> على المستوى: نعم→يقع داخل، لا→موازٍ.</HintBox>
      </StepBlock>

      {/* Plane-Plane */}
      <StepBlock num="4" title="الوضع النسبي لمستويين — التقاطع مستقيم">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
          {(['coincident', 'parallel', 'intersecting'] as const).map(k => (
            <button key={k} onClick={() => presetPP(k)} style={{ padding: '6px 10px', borderRadius: 999, border: '1px solid', borderColor: resPP.kind === k ? '#0f172a' : '#e2e8f0', background: resPP.kind === k ? '#0f172a' : 'white', color: resPP.kind === k ? 'white' : '#334155', fontSize: 11, cursor: 'pointer' }}>
              {k === 'coincident' ? 'متطابقان' : k === 'parallel' ? 'متوازيان' : 'متقاطعان'}
            </button>
          ))}
        </div>
        <div style={{ height: 380, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 10 }}>
          <SceneShell>
            <CoordinateSystem3D />
            <PlaneRelation3D p1={p1} p2={p2} intersectionLine={interPP} />
          </SceneShell>
        </div>
        <div style={{ padding: '8px 12px', borderRadius: 10, background: resPP.kind === 'intersecting' ? '#f0fdf4' : '#f8fafc', border: '1px solid #e2e8f0', fontSize: 13 }}>
          <strong>{arabicPlanePlane(resPP.kind)}</strong> {resPP.kind === 'intersecting' && interPP ? `— اتجاه التقاطع u=n₁×n₂=(${uCross.x.toFixed(1)},${uCross.y.toFixed(1)},${uCross.z.toFixed(1)}) — و n₁·u=0 و n₂·u=0` : ''}
        </div>
        {resPP.kind === 'intersecting' && interPP && <MathBlock tex={`s:\\; X = (${interPP.point.x.toFixed(1)},${interPP.point.y.toFixed(1)},${interPP.point.z.toFixed(1)}) + t\\cdot(${interPP.direction.x.toFixed(1)},${interPP.direction.y.toFixed(1)},${interPP.direction.z.toFixed(1)})`} />}
        <MathBlock tex="u = n_1\\times n_2,\\; u\\cdot n_1=0,\\; u\\cdot n_2=0" />
      </StepBlock>
    </LessonLayout>
  )
}
