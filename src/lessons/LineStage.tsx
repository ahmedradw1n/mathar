import { useState, useMemo } from 'react'
import SceneShell from '../three/SceneShell'
import CoordinateSystem3D from '../three/CoordinateSystem3D'
import Point3D from '../three/Point3D'
import Line3D from '../three/Line3D'
import { LessonLayout, StepBlock, HintBox } from '../components/lessons/LessonLayout'
import { MathBlock, MathInline } from '../components/math/MathBlock'
import { lineFromPointAndDirection, lineFromTwoPoints, directionBetweenPoints, pointOnLine } from '../math/lines'

function Slider({ label, value, min, max, step, color, onChange }: { label: string; value: number; min: number; max: number; step: number; color: string; onChange: (v: number) => void }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
        <span style={{ fontWeight: 700, color }}>{label} = {value}</span>
        <span style={{ color: '#64748b' }}>{min} → {max}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ width: '100%', accentColor: color }} />
    </div>
  )
}

export default function LineStage() {
  // للدرس 1-3: P و u و t
  const [P, setP] = useState<[number, number, number]>([1, 2, 1])
  const [u, setU] = useState<[number, number, number]>([2, -1, 1])
  const [t, setT] = useState(0)
  const linePU = useMemo(() => lineFromPointAndDirection({ x: P[0], y: P[1], z: P[2] }, { x: u[0], y: u[1], z: u[2] }), [P, u])
  const Xt = useMemo(() => (linePU ? pointOnLine(linePU, t) : null), [linePU, t])
  const lineValid = !!linePU

  // للدرس 4: نقطتان
  const [A, setA] = useState<[number, number, number]>([0, 0, 0])
  const [B, setB] = useState<[number, number, number]>([3, 2, 1])
  const AB = useMemo(() => directionBetweenPoints({ x: A[0], y: A[1], z: A[2] }, { x: B[0], y: B[1], z: B[2] }), [A, B])
  const lineAB = useMemo(() => lineFromTwoPoints({ x: A[0], y: A[1], z: A[2] }, { x: B[0], y: B[1], z: B[2] }), [A, B])
  const [tAB, setTAB] = useState(0.5)
  const Xab = useMemo(() => (lineAB ? pointOnLine(lineAB, tAB) : null), [lineAB, tAB])

  // للدرس 5-6: mode
  const [mode, setMode] = useState<'line' | 'segment' | 'ray'>('line')
  const [tMode, setTMode] = useState(0.5)

  // للدرس 8: مكافئ
  const [P2, setP2] = useState<[number, number, number]>([2, 1, 0])
  const u2 = useMemo(() => ({ x: u[0] * 2, y: u[1] * 2, z: u[2] * 2 }), [u])

  return (
    <LessonLayout title="المستقيمات في الفضاء" subtitle="نقطة + اتجاه + وسيط t — من المفهوم إلى القطعة ونصف المستقيم والتمثيلات المكافئة.">
      {/* خريطة مفاهيمية */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '12px 14px', marginBottom: 12 }}>
        <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: 8, fontSize: 13 }}>خريطة هذه المرحلة</div>
        <div dir="ltr" style={{ fontFamily: 'monospace', fontSize: 11.5, lineHeight: 1.7, color: '#334155', background: '#f8fafc', borderRadius: 8, padding: 10, overflowX: 'auto' }}>
          نقطة P + شعاع اتجاه u<br />
          ↓<br />
          المستقيم g: X = P + t·u<br />
          ↓<br />
          الوسيط t → نقطة على المستقيم<br />
          ↓<br />
          نقطتان A,B → شعاع AB = B−A<br />
          ↓<br />
          المستقيم بين نقطتين: X = A + t·AB (t=0→A, t=1→B)<br />
          ↓<br />
          مجال t → مستقيم (ℝ) / قطعة [0,1] / نصف مستقيم [0,∞)
        </div>
        <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>كل خطوة تبني على السابقة — راجع المرحلة الثانية: الشعاع والضرب بعدد.</div>
      </div>

      {/* 1 — مفهوم المستقيم */}
      <StepBlock num="1" title="ما هو المستقيم؟ — نقطة + اتجاه">
        <p>المستقيم في الفضاء لا نهائي، يحدده <strong>نقطة ثابتة</strong> <MathInline tex="P" /> و <strong>شعاع اتجاه</strong> <MathInline tex="\\vec{u}" />.</p>
        <MathBlock tex="g:\\; \\vec{x} = \\vec{p} + t\\,\\vec{u}\\quad \\text{أو}\\quad X = P + t\\cdot\\vec{u}" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13, marginBottom: 8 }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 10 }}><strong>P</strong> — نقطة ثابتة على المستقيم (البداية)</div>
          <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 10, padding: 10 }}><strong>u=(a|b|c)</strong> — شعاع الاتجاه (≠0)</div>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: 10 }}><strong>X</strong> — أي نقطة متغيرة على المستقيم</div>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: 10 }}><strong>t∈ℝ</strong> — الوسيط (يحدد أين تقع X)</div>
        </div>
        <HintBox>تذكر من المرحلة الثانية: شعاع الاتجاه يمكن ضربه بعدد غير صفري دون تغيير اتجاه المستقيم.</HintBox>
        <div style={{ height: 360, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginTop: 10 }}>
          <SceneShell>
            <CoordinateSystem3D />
            {lineValid ? <Line3D line={linePU!} color="#7c3aed" label="g" /> : null}
            <Point3D position={P} label={`P(${P[0]}|${P[1]}|${P[2]})`} color="#0ea5e9" showProjection={false} />
          </SceneShell>
        </div>
        {!lineValid && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: 8, color: '#991b1b', fontSize: 13, marginTop: 8 }}>الشعاع <MathInline tex="\\vec{u}=(0|0|0)" /> لا يحدد مستقيماً — غيّر u.</div>}
      </StepBlock>

      {/* 2 — فهم الوسيط t */}
      <StepBlock num="2" title="الوسيط t — أين تقع النقطة؟">
        <p>حرّك <MathInline tex="t" /> من −5 إلى +5 وشاهد النقطة الحمراء <MathInline tex="X(t)" /> تتحرك.</p>
        <div style={{ height: 380, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 10 }}>
          <SceneShell>
            <CoordinateSystem3D />
            {lineValid ? <Line3D line={linePU!} color="#7c3aed" t={t} showMovingPoint extent={7} /> : null}
          </SceneShell>
        </div>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}><span style={{ fontWeight: 700 }}>t = {t}</span><span style={{ color: '#64748b' }}>-5 → 5</span></div>
          <input type="range" min={-5} max={5} step={0.5} value={t} onChange={(e) => setT(Number(e.target.value))} style={{ width: '100%' }} />
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
            {[ -2, -1, 0, 1, 2].map((v) => (
              <button key={v} onClick={() => setT(v)} style={{ padding: '4px 10px', borderRadius: 999, border: '1px solid', borderColor: t === v ? '#0f172a' : '#e2e8f0', background: t === v ? '#0f172a' : 'white', color: t === v ? 'white' : '#334155', fontSize: 12, cursor: 'pointer' }}>t={v}</button>
            ))}
          </div>
          {Xt && <MathBlock tex={`X(${t}) = P + ${t}\\cdot\\vec{u} = (${P[0]}+${t}\\cdot${u[0]},\\, ${P[1]}+${t}\\cdot${u[1]},\\, ${P[2]}+${t}\\cdot${u[2]}) = (${Xt.x.toFixed(1)}, ${Xt.y.toFixed(1)}, ${Xt.z.toFixed(1)})`} />}
          <div style={{ fontSize: 12, color: '#475569', marginTop: 6 }}>
            <MathInline tex="t=0 \\Rightarrow X=P" /> · <MathInline tex="t=1 \\Rightarrow X=P+u" /> · <MathInline tex="t=-1 \\Rightarrow X=P-u" />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: '#0ea5e9' }}>P</div>
            <Slider label="x₀" value={P[0]} min={-3} max={3} step={1} color="#ef4444" onChange={(v) => setP([v, P[1], P[2]])} />
            <Slider label="y₀" value={P[1]} min={-3} max={3} step={1} color="#22c55e" onChange={(v) => setP([P[0], v, P[2]])} />
            <Slider label="z₀" value={P[2]} min={-3} max={3} step={1} color="#3b82f6" onChange={(v) => setP([P[0], P[1], v])} />
          </div>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: '#f59e0b' }}>u</div>
            <Slider label="a" value={u[0]} min={-3} max={3} step={1} color="#ef4444" onChange={(v) => setU([v, u[1], u[2]])} />
            <Slider label="b" value={u[1]} min={-3} max={3} step={1} color="#22c55e" onChange={(v) => setU([u[0], v, u[2]])} />
            <Slider label="c" value={u[2]} min={-3} max={3} step={1} color="#3b82f6" onChange={(v) => setU([u[0], u[1], v])} />
          </div>
        </div>
      </StepBlock>

      {/* 3 — الإحداثيات */}
      <StepBlock num="3" title="الصيغة الإحداثية">
        <MathBlock tex="x = x_0 + t\\,a\\quad y = y_0 + t\\,b\\quad z = z_0 + t\\,c" />
        <p>مثال: <MathInline tex="P=(1|2|3),\\; u=(2|-1|4)" /> → <MathInline tex="x=1+2t,\\; y=2-t,\\; z=3+4t" /></p>
        <button onClick={() => { setP([1, 2, 3]); setU([2, -1, 4]); setT(0) }} style={{ padding: '6px 12px', borderRadius: 999, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: 12 }}>طبّق P(1|2|3) u(2|−1|4)</button>
        {lineValid && <MathBlock tex={`x=${P[0]}+${u[0]}t,\\; y=${P[1]}+${u[1]}t,\\; z=${P[2]}+${u[2]}t \\quad (t=${t}) \\Rightarrow X=(${Xt?.x.toFixed(1)},${Xt?.y.toFixed(1)},${Xt?.z.toFixed(1)})`} />}
      </StepBlock>

      {/* 4 — نقطتان */}
      <StepBlock num="4" title="مستقيم يمر بنقطتين — A و B">
        <MathBlock tex="\\vec{AB}=B-A,\\; g:\\; X = A + t\\cdot\\vec{AB}" />
        <div style={{ height: 360, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 10 }}>
          <SceneShell>
            <CoordinateSystem3D />
            {lineAB ? <Line3D line={lineAB} color="#7c3aed" t={tAB} showMovingPoint /> : null}
            <Point3D position={A} label={`A(${A[0]}|${A[1]}|${A[2]})`} color="#0ea5e9" showProjection={false} />
            <Point3D position={B} label={`B(${B[0]}|${B[1]}|${B[2]})`} color="#22c55e" showProjection={false} />
          </SceneShell>
        </div>
        {!AB && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: 8, color: '#991b1b', fontSize: 13 }}>A و B متطابقتان — لا يوجد مستقيم وحيد. غيّر إحداهما.</div>}
        {AB && lineAB && (
          <>
            <MathBlock tex={`\\vec{AB}=(${B[0]}-${A[0]},${B[1]}-${A[1]},${B[2]}-${A[2]})=(${AB.x},${AB.y},${AB.z})`} />
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}><span>t = {tAB}</span><span style={{ color: '#64748b' }}>-2 → 2</span></div>
              <input type="range" min={-2} max={2} step={0.25} value={tAB} onChange={(e) => setTAB(Number(e.target.value))} style={{ width: '100%' }} />
              <div style={{ fontSize: 12, color: '#475569', marginTop: 4 }}><MathInline tex="t=0\\to A" /> · <MathInline tex="t=1\\to B" /> · <MathInline tex="t=0.5\\to منتصف" /> — النقطة الحمراء {Xab ? `(${Xab.x.toFixed(1)},${Xab.y.toFixed(1)},${Xab.z.toFixed(1)})` : ''}</div>
            </div>
          </>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: '#0ea5e9' }}>A</div>
            <Slider label="x" value={A[0]} min={-3} max={3} step={1} color="#ef4444" onChange={(v) => setA([v, A[1], A[2]])} />
            <Slider label="y" value={A[1]} min={-3} max={3} step={1} color="#22c55e" onChange={(v) => setA([A[0], v, A[2]])} />
            <Slider label="z" value={A[2]} min={-3} max={3} step={1} color="#3b82f6" onChange={(v) => setA([A[0], A[1], v])} />
          </div>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: '#22c55e' }}>B</div>
            <Slider label="x" value={B[0]} min={-3} max={3} step={1} color="#ef4444" onChange={(v) => setB([v, B[1], B[2]])} />
            <Slider label="y" value={B[1]} min={-3} max={3} step={1} color="#22c55e" onChange={(v) => setB([B[0], v, B[2]])} />
            <Slider label="z" value={B[2]} min={-3} max={3} step={1} color="#3b82f6" onChange={(v) => setB([B[0], B[1], v])} />
          </div>
        </div>
      </StepBlock>

      {/* 5 — مستقيم vs قطعة vs نصف */}
      <StepBlock num="5" title="المستقيم مقابل القطعة مقابل نصف المستقيم — مجال t">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, fontSize: 12, marginBottom: 10 }}>
          <div style={{ background: mode === 'line' ? '#f0fdf4' : 'white', border: `1px solid ${mode === 'line' ? '#22c55e' : '#e2e8f0'}`, borderRadius: 10, padding: 10 }}><strong>مستقيم</strong><br /><MathInline tex="t\\in\\mathbb{R}" /><br /><span style={{ color: '#64748b' }}>-∞→+∞</span></div>
          <div style={{ background: mode === 'segment' ? '#f0fdf4' : 'white', border: `1px solid ${mode === 'segment' ? '#22c55e' : '#e2e8f0'}`, borderRadius: 10, padding: 10 }}><strong>قطعة AB</strong><br /><MathInline tex="0\\le t\\le1" /></div>
          <div style={{ background: mode === 'ray' ? '#f0fdf4' : 'white', border: `1px solid ${mode === 'ray' ? '#22c55e' : '#e2e8f0'}`, borderRadius: 10, padding: 10 }}><strong>نصف مستقيم</strong><br /><MathInline tex="t\\ge0" /></div>
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
          {(['line', 'segment', 'ray'] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} style={{ padding: '6px 12px', borderRadius: 999, border: '1px solid', borderColor: mode === m ? '#0f172a' : '#e2e8f0', background: mode === m ? '#0f172a' : 'white', color: mode === m ? 'white' : '#334155', cursor: 'pointer', fontSize: 12 }}>
              {m === 'line' ? 'مستقيم' : m === 'segment' ? 'قطعة' : 'نصف مستقيم'}
            </button>
          ))}
        </div>
        <div style={{ height: 360, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 10 }}>
          <SceneShell>
            <CoordinateSystem3D />
            {lineAB ? <Line3D line={lineAB} mode={mode} t={tMode} showMovingPoint color={mode === 'segment' ? '#22c55e' : mode === 'ray' ? '#0ea5e9' : '#f59e0b'} /> : null}
          </SceneShell>
        </div>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}><span>t = {tMode}</span><span style={{ color: '#64748b' }}>{mode === 'segment' ? '0 → 1' : mode === 'ray' ? '0 → 5' : '-3 → 3'}</span></div>
          <input type="range" min={mode === 'segment' ? 0 : mode === 'ray' ? 0 : -3} max={mode === 'segment' ? 1 : mode === 'ray' ? 5 : 3} step={mode === 'segment' ? 0.1 : 0.25} value={tMode} onChange={(e) => setTMode(Number(e.target.value))} style={{ width: '100%' }} />
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
            {mode === 'segment' && (tMode < 0 || tMode > 1 ? '❌ خارج القطعة (لكن على امتداد المستقيم)' : '✅ داخل القطعة')}
            {mode === 'ray' && (tMode < 0 ? '❌ خلف البداية' : '✅ على نصف المستقيم')}
            {mode === 'line' && 'ℹ️ كل t على المستقيم'}
          </div>
        </div>
      </StepBlock>

      {/* 7 — أداة */}
      <StepBlock num="6" title="أداة: من P و u إلى المعادلة">
        <p>أدخل <MathInline tex="P" /> و <MathInline tex="u" /> أعلاه (الدرس 2) — النظام يولد المعادلة الشعاعية والإحداثية فوراً. جرّب <MathInline tex="P=(1|2|3), u=(2|-1|4)" />.</p>
        {lineValid ? (
          <>
            <MathBlock tex={`g:\\; \\vec{x} = (${P[0]},${P[1]},${P[2]}) + t\\cdot(${u[0]},${u[1]},${u[2]})`} />
            <MathBlock tex={`x=${P[0]}+${u[0]}t,\\; y=${P[1]}+${u[1]}t,\\; z=${P[2]}+${u[2]}t`} />
          </>
        ) : (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: 8, color: '#991b1b' }}>u صفري — لا معادلة</div>
        )}
      </StepBlock>

      {/* 8 — شعاع اتجاه */}
      <StepBlock num="7" title="شعاع الاتجاه — مكافئ">
        <p><MathInline tex="u" /> يمكن ضربه بعدد غير صفري: <MathInline tex="u=(1|2|3)" /> و <MathInline tex="2u=(2|4|6)" /> يمثلان نفس المستقيم. لكن <MathInline tex="u=0" /> لا يصلح.</p>
        <div style={{ height: 300, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 8 }}>
          <SceneShell>
            <CoordinateSystem3D />
            <Line3D line={{ point: { x: P2[0], y: P2[1], z: P2[2] }, direction: { x: u[0], y: u[1], z: u[2] } }} color="#7c3aed" label="u" />
            <Line3D line={{ point: { x: P2[0], y: P2[1], z: P2[2] }, direction: u2 }} color="#22c55e" label="2u (نفس الاتجاه)" />
            <Point3D position={P2} label={`P(${P2[0]}|${P2[1]}|${P2[2]})`} color="#0ea5e9" showProjection={false} />
          </SceneShell>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: 10 }}>
            <Slider label="P x" value={P2[0]} min={-2} max={2} step={1} color="#ef4444" onChange={(v) => setP2([v, P2[1], P2[2]])} />
            <Slider label="P y" value={P2[1]} min={-2} max={2} step={1} color="#22c55e" onChange={(v) => setP2([P2[0], v, P2[2]])} />
            <Slider label="P z" value={P2[2]} min={-2} max={2} step={1} color="#3b82f6" onChange={(v) => setP2([P2[0], P2[1], v])} />
          </div>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: 10, fontSize: 12, color: '#475569' }}>
            <MathInline tex="u=(a|b|c),\; 2u=(2a|2b|2c)" /> نفس الخط<br />
            <MathInline tex="(-1)u" /> يعكس الاتجاه لكن يبقى نفس المستقيم
          </div>
        </div>
      </StepBlock>

      {/* 9 — مكافئ */}
      <StepBlock num="8" title="تمثيلات مكافئة — نفس المستقيم بأكثر من صيغة">
        <p><MathInline tex="X=P+t\\cdot u" /> و <MathInline tex="X=Q+s\\cdot v" /> يمثلان نفس المستقيم إذا كانت النقطتان على نفس الخط و <MathInline tex="u\\parallel v" />.</p>
        <HintBox>التمهيد للوضع النسبي (المرحلة 6): متوازيان + نقطة مشتركة = متطابقان.</HintBox>
        <MathBlock tex="P=(0|0|0), u=(1|0|0) \\quad Q=(2|0|0), v=(2|0|0) \\;\\Rightarrow\\; \\text{نفس المستقيم (محور x)}" />
      </StepBlock>
    </LessonLayout>
  )
}
