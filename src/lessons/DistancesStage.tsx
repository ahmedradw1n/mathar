import { useState, useMemo } from 'react'
import SceneShell from '../three/SceneShell'
import CoordinateSystem3D from '../three/CoordinateSystem3D'
import Point3D from '../three/Point3D'
import Line3D from '../three/Line3D'
import PointLineProjection3D from '../three/PointLineProjection3D'
import PointPlaneProjection3D from '../three/PointPlaneProjection3D'
import { LessonLayout, StepBlock, HintBox } from '../components/lessons/LessonLayout'
import { MathBlock, MathInline } from '../components/math/MathBlock'
import { distanceBetweenPoints } from '../math/points'
import { projectionPointOnLine, distancePointLine, projectionPointOnPlane, distancePointPlane, verifyProjectionOnLine, verifyProjectionOnPlane } from '../math/distances'
import { parameterOfProjection } from '../math/lines'
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

export default function DistancesStage() {
  // 1 — نقطتان
  const [A1, setA1] = useState<[number, number, number]>([0, 0, 0])
  const [B1, setB1] = useState<[number, number, number]>([2, 3, 6])
  const distAB = useMemo(() => distanceBetweenPoints({ x: A1[0], y: A1[1], z: A1[2] }, { x: B1[0], y: B1[1], z: B1[2] }), [A1, B1])
  const dx = B1[0] - A1[0], dy = B1[1] - A1[1], dz = B1[2] - A1[2]

  // 2-4 — نقطة ومستقيم
  const [A2, setA2] = useState<[number, number, number]>([2, 2, 1])
  const [P2, setP2] = useState<[number, number, number]>([0, 0, 0])
  const [u2, setU2] = useState<[number, number, number]>([2, 0, 0])
  const line2: Line3 = useMemo(() => ({ point: { x: P2[0], y: P2[1], z: P2[2] }, direction: { x: u2[0], y: u2[1], z: u2[2] } }), [P2, u2])
  const H2 = useMemo(() => projectionPointOnLine({ x: A2[0], y: A2[1], z: A2[2] }, line2), [A2, line2])
  const d2 = useMemo(() => distancePointLine({ x: A2[0], y: A2[1], z: A2[2] }, line2), [A2, line2])
  const t2 = useMemo(() => (H2 ? parameterOfProjection({ x: A2[0], y: A2[1], z: A2[2] }, line2) : null), [A2, line2, H2])
  const ver2 = useMemo(() => (H2 ? verifyProjectionOnLine({ x: A2[0], y: A2[1], z: A2[2] }, H2, line2) : null), [A2, H2, line2])

  // 6-8 — نقطة ومستوى
  const [A3, setA3] = useState<[number, number, number]>([1, 1, 2])
  const [plane, setPlane] = useState<Plane>({ a: 0, b: 0, c: 1, d: 0 }) // z=0
  const H3 = useMemo(() => projectionPointOnPlane({ x: A3[0], y: A3[1], z: A3[2] }, plane), [A3, plane])
  const d3 = useMemo(() => distancePointPlane({ x: A3[0], y: A3[1], z: A3[2] }, plane), [A3, plane])
  const ver3 = useMemo(() => (H3 ? verifyProjectionOnPlane({ x: A3[0], y: A3[1], z: A3[2] }, H3, plane) : null), [A3, H3, plane])



  return (
    <LessonLayout title="المسافات والمساقط" subtitle="من طول الشعاع إلى مسافة نقطة عن مستقيم ومستوى — الفكرة الهندسية قبل الصيغة.">
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, marginBottom: 12 }}>
        <div style={{ fontWeight: 800, fontSize: 13, color: '#0f172a', marginBottom: 6 }}>خريطة هذه المرحلة</div>
        <div dir="ltr" style={{ fontFamily: 'monospace', fontSize: 11, background: '#f8fafc', borderRadius: 8, padding: 10, overflowX: 'auto' }}>
          نقاط → شعاع AB → طول |AB| (فيثاغورس 3D) → الجداء السلمي → التعامد → المسقط → المسافة<br />
          &nbsp;&nbsp;├─ مسقط على مستقيم: t=((A-P)·u)/|u|² → H=P+t·u → d=|AH|<br />
          &nbsp;&nbsp;└─ مسقط على مستوى: λ=(n·A−d)/|n|² → H=A−λn → d=|AH| (∥n)
        </div>
        <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>يربط: شعاع الاتجاه، الشعاع الناظم، الجداء، معادلة المستوى، المستقيم الوسيطي.</div>
      </div>

      {/* 1 — بين نقطتين */}
      <StepBlock num="1" title="المسافة بين نقطتين — AB = B−A">
        <p>أقصر مسافة بين نقطتين هي طول الشعاع بينهما.</p>
        <MathBlock tex="AB = B-A = (x_2-x_1,\; y_2-y_1,\; z_2-z_1),\quad |AB| = \\sqrt{(x_2-x_1)^2+(y_2-y_1)^2+(z_2-z_1)^2}" />
        <div style={{ height: 340, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 10 }}>
          <SceneShell>
            <CoordinateSystem3D />
            <Point3D position={A1} label={`A(${A1[0]}|${A1[1]}|${A1[2]})`} color="#0ea5e9" showProjection={false} />
            <Point3D position={B1} label={`B(${B1[0]}|${B1[1]}|${B1[2]})`} color="#22c55e" showProjection={false} />
            <Line3D line={{ point: { x: A1[0], y: A1[1], z: A1[2] }, direction: { x: dx, y: dy, z: dz } }} mode="segment" color="#7c3aed" />
          </SceneShell>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: '#0ea5e9' }}>A</div>
            <Slider label="x1" value={A1[0]} min={-3} max={3} step={1} color="#ef4444" onChange={v => setA1([v, A1[1], A1[2]])} />
            <Slider label="y1" value={A1[1]} min={-3} max={3} step={1} color="#22c55e" onChange={v => setA1([A1[0], v, A1[2]])} />
            <Slider label="z1" value={A1[2]} min={-3} max={3} step={1} color="#3b82f6" onChange={v => setA1([A1[0], A1[1], v])} />
          </div>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: '#22c55e' }}>B</div>
            <Slider label="x2" value={B1[0]} min={-3} max={3} step={1} color="#ef4444" onChange={v => setB1([v, B1[1], B1[2]])} />
            <Slider label="y2" value={B1[1]} min={-3} max={3} step={1} color="#22c55e" onChange={v => setB1([B1[0], v, B1[2]])} />
            <Slider label="z2" value={B1[2]} min={-3} max={3} step={1} color="#3b82f6" onChange={v => setB1([B1[0], B1[1], v])} />
          </div>
        </div>
        <MathBlock tex={`|AB| = \\sqrt{${dx}^2+${dy}^2+${dz}^2}=\\sqrt{${dx*dx}+${dy*dy}+${dz*dz}}=${distAB.toFixed(2)}`} />
        <HintBox>هذا امتداد فيثاغورس: مربع المسافة مجموع مربعات الفروق الثلاثة. جرّب <MathInline tex="A(0|0|0), B(2|3|6) → |AB|=7" />.</HintBox>
      </StepBlock>

      {/* 2 — اشتقاق المسقط على مستقيم */}
      <StepBlock num="2" title="المسقط القائم على مستقيم — اشتقاق t">
        <p>لدينا <MathInline tex="g: X=P+t·u" /> ونقطة <MathInline tex="A" />. نريد <MathInline tex="H∈g" /> بحيث <MathInline tex="AH ⟂ g" />.</p>
        <MathBlock tex="(A-H)\\cdot u = 0" />
        <MathBlock tex="H=P+t·u \\;\\Rightarrow\\; (A-P-t·u)\\cdot u =0 \\;\\Rightarrow\\; t = \\frac{(A-P)\\cdot u}{|u|^2}" />
        <MathBlock tex="H = P + t·u,\\quad |u|^2 = u\\cdot u" />
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: 8, fontSize: 12, color: '#991b1b' }}>مهم: المقام <MathInline tex="|u|^2" /> لا يجوز أن يكون صفراً — شعاع اتجاه صفري لا يحدد مستقيماً (نعيد <MathInline tex="null" />).</div>
      </StepBlock>

      {/* 3 — المسافة نقطة-مستقيم */}
      <StepBlock num="3" title="المسافة بين نقطة ومستقيم — d=|AH|">
        <p>بعد إيجاد <MathInline tex="H" />، المسافة هي طول <MathInline tex="AH" /> — أقصر مسافة، ليست إلى نقطة عشوائية.</p>
        <MathBlock tex="d(A,g)=|A-H| = |A-(P+t·u)|" />
        <div style={{ height: 360, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 10 }}>
          <SceneShell>
            <CoordinateSystem3D />
            <PointLineProjection3D A={{ x: A2[0], y: A2[1], z: A2[2] }} line={line2} />
          </SceneShell>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: '#ef4444' }}>A</div>
            <Slider label="x" value={A2[0]} min={-4} max={4} step={1} color="#ef4444" onChange={v => setA2([v, A2[1], A2[2]])} />
            <Slider label="y" value={A2[1]} min={-4} max={4} step={1} color="#22c55e" onChange={v => setA2([A2[0], v, A2[2]])} />
            <Slider label="z" value={A2[2]} min={-4} max={4} step={1} color="#3b82f6" onChange={v => setA2([A2[0], A2[1], v])} />
          </div>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 12 }}>P و u</div>
            <Slider label="Px" value={P2[0]} min={-3} max={3} step={1} color="#ef4444" onChange={v => setP2([v, P2[1], P2[2]])} />
            <Slider label="Py" value={P2[1]} min={-3} max={3} step={1} color="#22c55e" onChange={v => setP2([P2[0], v, P2[2]])} />
            <Slider label="Pz" value={P2[2]} min={-3} max={3} step={1} color="#3b82f6" onChange={v => setP2([P2[0], P2[1], v])} />
            <Slider label="ux" value={u2[0]} min={-3} max={3} step={1} color="#ef4444" onChange={v => setU2([v, u2[1], u2[2]])} />
            <Slider label="uy" value={u2[1]} min={-3} max={3} step={1} color="#22c55e" onChange={v => setU2([u2[0], v, u2[2]])} />
            <Slider label="uz" value={u2[2]} min={-3} max={3} step={1} color="#3b82f6" onChange={v => setU2([u2[0], u2[1], v])} />
          </div>
        </div>
        {H2 && d2 !== null && t2 !== null ? (
          <>
            <MathBlock tex={`t=${t2.toFixed(2)},\\; H=(${H2.x.toFixed(1)},${H2.y.toFixed(1)},${H2.z.toFixed(1)}),\\; d=${d2.toFixed(2)}`} />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
              <span style={{ background: ver2?.onLine ? '#f0fdf4' : '#fef2f2', border: `1px solid ${ver2?.onLine ? '#bbf7d0' : '#fecaca'}`, borderRadius: 999, padding: '3px 8px', fontSize: 11 }}>{ver2?.onLine ? '✓ H على المستقيم' : '✗ H ليس على المستقيم'}</span>
              <span style={{ background: ver2?.perpendicular ? '#f0fdf4' : '#fef2f2', border: `1px solid ${ver2?.perpendicular ? '#bbf7d0' : '#fecaca'}`, borderRadius: 999, padding: '3px 8px', fontSize: 11 }}>{ver2?.perpendicular ? '✓ AH ⟂ g' : '✗ ليس عمودياً'}</span>
            </div>
          </>
        ) : (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: 8, color: '#991b1b', fontSize: 13 }}>شعاع اتجاه صفري — لا خط صالح (null)</div>
        )}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
          <button onClick={() => { setA2([0, 1, 0]); setP2([0, 0, 0]); setU2([2, 0, 0]) }} style={{ padding: '6px 10px', borderRadius: 999, border: '1px solid #e2e8f0', background: 'white', fontSize: 11, cursor: 'pointer' }}>نقطة على المستقيم (d≈0)</button>
          <button onClick={() => { setA2([0, 2, 0]); setP2([0, 0, 0]); setU2([2, 0, 0]) }} style={{ padding: '6px 10px', borderRadius: 999, border: '1px solid #e2e8f0', background: 'white', fontSize: 11, cursor: 'pointer' }}>خارج المستقيم</button>
          <button onClick={() => { setA2([-2, 0, 0]); setP2([0, 0, 0]); setU2([2, 0, 0]) }} style={{ padding: '6px 10px', borderRadius: 999, border: '1px solid #e2e8f0', background: 'white', fontSize: 11, cursor: 'pointer' }}>خلف P</button>
          <button onClick={() => setU2([-2, 0, 0])} style={{ padding: '6px 10px', borderRadius: 999, border: '1px solid #e2e8f0', background: 'white', fontSize: 11, cursor: 'pointer' }}>عكس الاتجاه</button>
        </div>
      </StepBlock>

      {/* 5 — بالجداء */}
      <StepBlock num="4" title="المسقط بالجداء السلمي — PH = proj_u(A−P)">
        <MathBlock tex="proj_{u}(v)=\\frac{v\\cdot u}{|u|^2}\\,u,\\quad v=A-P,\\quad H=P+proj_u(A-P)" />
        <p>يربط الشعاع → الجداء → المسقط → المسافة.</p>
      </StepBlock>

      {/* 6 — نقطة ومستوى */}
      <StepBlock num="5" title="المسافة بين نقطة ومستوى — d=|ax₀+by₀+cz₀−d|/√(a²+b²+c²)">
        <p>أقصر مسافة تسير مع الناظم <MathInline tex="n=(a,b,c)" />.</p>
        <MathBlock tex="d(A,E)=\\frac{|a x_0+b y_0+c z_0 - d|}{\\sqrt{a^2+b^2+c^2}}" />
        <HintBox>البسط هو ابتعاد مقاس باتجاه الناظم، المقام طوله. لا تنس القيمة المطلقة.</HintBox>
      </StepBlock>

      {/* 7 — اشتقاق مسقط مستوى */}
      <StepBlock num="6" title="المسقط على مستوى — H = A − λn">
        <MathBlock tex="AH \\parallel n \\;\\Rightarrow\\; H=A-\\lambda n,\\; H\\in E: n\\cdot H = d" />
        <MathBlock tex="n\\cdot(A-\\lambda n)=d \\;\\Rightarrow\\; \\lambda=\\frac{n\\cdot A - d}{|n|^2},\\; H=A-\\frac{n\\cdot A-d}{|n|^2}\\,n" />
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: 8, fontSize: 12, color: '#991b1b' }}>تحقق الإشارة: <MathInline tex="\\lambda = (n·A−d)/|n|²" /> ثم <MathInline tex="H=A−λn" /> — اختُبرت عددياً.</div>
      </StepBlock>

      {/* 8 — علاقة */}
      <StepBlock num="7" title="العلاقة — d=|AH| و AH∥n و AH⟂E">
        <p>عندما يكون <MathInline tex="H" /> هو المسقط، <MathInline tex="d(A,E)=|AH|" /> و <MathInline tex="AH" /> عمودي على المستوى (موازٍ للناظم).</p>
        <div style={{ height: 360, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 10 }}>
          <SceneShell>
            <CoordinateSystem3D />
            <PointPlaneProjection3D A={{ x: A3[0], y: A3[1], z: A3[2] }} plane={plane} />
          </SceneShell>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: '#ef4444' }}>A</div>
            <Slider label="x" value={A3[0]} min={-4} max={4} step={1} color="#ef4444" onChange={v => setA3([v, A3[1], A3[2]])} />
            <Slider label="y" value={A3[1]} min={-4} max={4} step={1} color="#22c55e" onChange={v => setA3([A3[0], v, A3[2]])} />
            <Slider label="z" value={A3[2]} min={-4} max={4} step={1} color="#3b82f6" onChange={v => setA3([A3[0], A3[1], v])} />
          </div>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 12 }}>المستوى E</div>
            <Slider label="a" value={plane.a} min={-3} max={3} step={1} color="#ef4444" onChange={v => setPlane({ ...plane, a: v })} />
            <Slider label="b" value={plane.b} min={-3} max={3} step={1} color="#22c55e" onChange={v => setPlane({ ...plane, b: v })} />
            <Slider label="c" value={plane.c} min={-3} max={3} step={1} color="#3b82f6" onChange={v => setPlane({ ...plane, c: v })} />
            <Slider label="d" value={plane.d} min={-5} max={5} step={1} color="#7c3aed" onChange={v => setPlane({ ...plane, d: v })} />
            <div style={{ fontSize: 11, color: '#64748b' }}>{plane.a}x+{plane.b}y+{plane.c}z+{plane.d}=0</div>
          </div>
        </div>
        {H3 && d3 !== null ? (
          <>
            <MathBlock tex={`H=(${H3.x.toFixed(2)},${H3.y.toFixed(2)},${H3.z.toFixed(2)}),\\; d=${d3.toFixed(2)}`} />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
              <span style={{ background: ver3?.onPlane ? '#f0fdf4' : '#fef2f2', border: `1px solid ${ver3?.onPlane ? '#bbf7d0' : '#fecaca'}`, borderRadius: 999, padding: '3px 8px', fontSize: 11 }}>{ver3?.onPlane ? '✓ H على المستوى' : '✗ ليس على المستوى'}</span>
              <span style={{ background: ver3?.parallel ? '#f0fdf4' : '#fef2f2', border: `1px solid ${ver3?.parallel ? '#bbf7d0' : '#fecaca'}`, borderRadius: 999, padding: '3px 8px', fontSize: 11 }}>{ver3?.parallel ? '✓ AH ∥ n' : '✗ ليس موازياً'}</span>
            </div>
          </>
        ) : (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: 8, color: '#991b1b', fontSize: 13 }}>ناظم صفري — لا مستوى (null)</div>
        )}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
          <button onClick={() => { setA3([1, 0, 0]); setPlane({ a: 0, b: 0, c: 1, d: 0 }) }} style={{ padding: '6px 10px', borderRadius: 999, border: '1px solid #e2e8f0', background: 'white', fontSize: 11, cursor: 'pointer' }}>على المستوى d=0</button>
          <button onClick={() => setA3([0, 0, 2])} style={{ padding: '6px 10px', borderRadius: 999, border: '1px solid #e2e8f0', background: 'white', fontSize: 11, cursor: 'pointer' }}>فوق المستوى</button>
          <button onClick={() => setA3([0, 0, -2])} style={{ padding: '6px 10px', borderRadius: 999, border: '1px solid #e2e8f0', background: 'white', fontSize: 11, cursor: 'pointer' }}>تحت المستوى</button>
          <button onClick={() => setPlane({ a: 1, b: 1, c: 1, d: -3 })} style={{ padding: '6px 10px', borderRadius: 999, border: '1px solid #e2e8f0', background: 'white', fontSize: 11, cursor: 'pointer' }}>مستوى مائل</button>
        </div>
      </StepBlock>

      {/* 10 — تحقق */}
      <StepBlock num="8" title="التحقق الهندسي">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 10 }}><strong>نقطة-مستقيم:</strong> H∈g و (A−H)·u≈0 — يظهران كشارتين خضراوين أعلاه</div>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 10 }}><strong>نقطة-مستوى:</strong> H∈E و (A−H)×n≈0 — AH ∥ n</div>
        </div>
      </StepBlock>

      {/* 11 — أخطاء شائعة */}
      <StepBlock num="9" title="أخطاء شائعة">
        <ul style={{ margin: 0, paddingInlineStart: 18, fontSize: 13, lineHeight: 1.8 }}>
          <li>نسيان تربيع <MathInline tex="|u|^2" /> في المقام</li>
          <li>الخلط بين <MathInline tex="A-P" /> و <MathInline tex="P-A" /> (الإشارة)</li>
          <li>الخلط بين المسقط <MathInline tex="H" /> والمسافة <MathInline tex="d" /></li>
          <li>اعتبار أي نقطة على المستقيم أقصر مسافة</li>
          <li>استخدام شعاع صفري <MathInline tex="|u|=0" /> أو ناظم صفري</li>
          <li>نسيان القيمة المطلقة في مسافة المستوى</li>
          <li>الخلط بين <MathInline tex="n·u=0" /> و <MathInline tex="n×u=0" /></li>
        </ul>
      </StepBlock>
    </LessonLayout>
  )
}
