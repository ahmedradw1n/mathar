import { useState, useMemo } from 'react'
import SceneShell from '../three/SceneShell'
import CoordinateSystem3D from '../three/CoordinateSystem3D'
import Point3D from '../three/Point3D'
import Vector3D from '../three/Vector3D'
import Plane3D from '../three/Plane3D'
import { LessonLayout, StepBlock, HintBox } from '../components/lessons/LessonLayout'
import { MathBlock, MathInline } from '../components/math/MathBlock'
import { planeFromPointAndNormal, planeFromThreePoints, planeEquationString, isPointOnPlane, distancePointPlane, planeInterceptForm } from '../math/planes'
import { cross } from '../math/vectors'
import { Text } from '@react-three/drei'

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

export default function PlaneStage() {
  // للدرس 1: مستوى عام
  const [plane1] = useState({ a: 0, b: 0, c: 1, d: 0 }) // z=0
  const [testPoint, setTestPoint] = useState<[number, number, number]>([1, 1, 2])
  const onPlane1 = useMemo(() => isPointOnPlane({ x: testPoint[0], y: testPoint[1], z: testPoint[2] }, plane1), [testPoint, plane1])

  // للدرس 3/6: نقطة + ناظم
  const [P0, setP0] = useState<[number, number, number]>([1, 1, 1])
  const [n, setN] = useState<[number, number, number]>([0, 0, 1])
  const planeFromPN = useMemo(() => planeFromPointAndNormal({ x: P0[0], y: P0[1], z: P0[2] }, { x: n[0], y: n[1], z: n[2] }), [P0, n])

  // للدرس 8: ثلاث نقاط
  const [A3, setA3] = useState<[number, number, number]>([0, 0, 0])
  const [B3, setB3] = useState<[number, number, number]>([2, 0, 1])
  const [C3, setC3] = useState<[number, number, number]>([0, 2, 0])
  const plane3 = useMemo(() => planeFromThreePoints({ x: A3[0], y: A3[1], z: A3[2] }, { x: B3[0], y: B3[1], z: B3[2] }, { x: C3[0], y: C3[1], z: C3[2] }), [A3, B3, C3])
  const ab = useMemo(() => ({ x: B3[0] - A3[0], y: B3[1] - A3[1], z: B3[2] - A3[2] }), [A3, B3])
  const ac = useMemo(() => ({ x: C3[0] - A3[0], y: C3[1] - A3[1], z: C3[2] - A3[2] }), [A3, C3])
  const n3 = useMemo(() => cross(ab, ac), [ab, ac])

  // للدرس 7: مستويات إحداثية
  const [spec, setSpec] = useState<'xy' | 'xz' | 'yz' | 'x3' | 'y-2' | 'z5'>('xy')
  const specPlane = useMemo(() => {
    switch (spec) {
      case 'xy': return { a: 0, b: 0, c: 1, d: 0 }
      case 'xz': return { a: 0, b: 1, c: 0, d: 0 }
      case 'yz': return { a: 1, b: 0, c: 0, d: 0 }
      case 'x3': return { a: 1, b: 0, c: 0, d: -3 }
      case 'y-2': return { a: 0, b: 1, c: 0, d: 2 }
      case 'z5': return { a: 0, b: 0, c: 1, d: -5 }
    }
  }, [spec])

  // للدرس 9: مقطوعات
  const [cut, setCut] = useState({ a: 2, b: 3, c: 4 })
  const cutPlane = useMemo(() => {
    // x/a + y/b + z/c =1 →  (1/a)x + (1/b)y + (1/c)z =1 → (bc)x + (ac)y + (ab)z = abc
    // نستخدم: a_cut,b_cut,c_cut are intercepts, plane: x/a + y/b + z/c =1 → (1/a,1/b,1/c)·(x,y,z)=1
    // نحول إلى ax+by+cz+d=0: (1/a)x + (1/b)y + (1/c)z -1=0
    return { a: 1 / cut.a, b: 1 / cut.b, c: 1 / cut.c, d: -1 }
  }, [cut])
  const intercept = useMemo(() => planeInterceptForm(cutPlane), [cutPlane])

  return (
    <LessonLayout title="المستوى في الفضاء" subtitle="من سطح الطاولة إلى المعادلة ax+by+cz=d — مع الشعاع الناظم، الانتماء، والطرق المختلفة لتحديده.">
      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '10px 12px', fontSize: 12.5, color: '#1e40af', marginBottom: 12 }}>
        <strong>تذكير من المرحلة السابقة:</strong> الجداء السلمي صفر يعني تعامد — وهذا أساس الشعاع الناظم: <MathInline tex="\\vec{n}\\cdot\\vec{u}=0" /> لكل <MathInline tex="\\vec{u}" /> داخل المستوى.
      </div>

      {/* 1 */}
      <StepBlock num="1" title="ما هو المستوى؟ — سطح لا نهائي">
        <p>تخيل سطح طاولة ممتد بلا حدود، أو جدار، أو ورقة. في الرياضيات، المستوى سطح مستوٍ لا نهائي يحدده 3 نقاط غير على استقامة واحدة.</p>
        <div style={{ height: 360, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 10 }}>
          <SceneShell>
            <CoordinateSystem3D />
            <Plane3D plane={plane1} color="#7c3aed" opacity={0.22} />
            <Point3D position={[0, 0, 0]} label="نقطة على المستوى" color="#22c55e" showProjection={false} />
            <Point3D position={[1, 1, 1.5]} label="نقطة خارجه" color="#ef4444" showProjection />
          </SceneShell>
        </div>
        <p>في المشهد: المستوى البنفسجي الشفاف، نقطة خضراء عليه، وأخرى حمراء خارجه. دوّر المشهد لترى أنه مستوٍ من كل الزوايا.</p>
      </StepBlock>

      {/* 2 */}
      <StepBlock num="2" title="الشعاع الناظم — n ⟂ المستوى">
        <p>لكل مستوى شعاع ناظم <MathInline tex="\\vec{n}=(a,b,c)" /> عمودي عليه. أي شعاع داخل المستوى <MathInline tex="\\vec{u}" /> يحقق <MathInline tex="\\vec{n}\\cdot\\vec{u}=0" />.</p>
        <HintBox>تذكر: تعلمنا أن الجداء صفر ⇔ تعامد (المرحلة الثانية). هنا نطبقه.</HintBox>
        <div style={{ height: 360, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', margin: '10px 0' }}>
          <SceneShell>
            <CoordinateSystem3D />
            <Plane3D plane={{ a: 0, b: 0, c: 1, d: 0 }} color="#7c3aed" showNormal normalLength={1.4} />
            {/* شعاع داخل المستوى */}
            <Vector3D start={[0, 0, 0]} end={[2, 0, 0]} color="#22c55e" label="u داخل المستوى" />
          </SceneShell>
        </div>
        <MathBlock tex="\\vec{n}=(0,0,1),\; \\vec{u}=(2,0,0)\; \Rightarrow\; \\vec{n}\\cdot\\vec{u}=0\; \checkmark\; \text{متعامدان}" />
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '8px 10px', fontSize: 13, color: '#166534' }}>السهم الأحمر هو الناظم، الأخضر داخل المستوى — بينهما 90°.</div>
      </StepBlock>

      {/* 3 */}
      <StepBlock num="3" title="معادلة المستوى — من n·(x−P₀)=0 إلى ax+by+cz=d">
        <p>نبدأ بنقطة <MathInline tex="P_0(x_0|y_0|z_0)" /> وشعاع ناظم <MathInline tex="\\vec{n}=(a,b,c)" />:</p>
        <MathBlock tex="\\vec{n}\\cdot(\\vec{x}-\\vec{P_0})=0" />
        <MathBlock tex="a(x-x_0)+b(y-y_0)+c(z-z_0)=0" />
        <MathBlock tex="ax+by+cz = ax_0+by_0+cz_0 = d" />
        <p>حيث <MathInline tex="d = ax_0+by_0+cz_0" /> و الصيغة العامة <MathInline tex="ax+by+cz+d'=0" /> مع <MathInline tex="d'=-d" /> (حسب الاصطلاح).</p>
        <div style={{ height: 360, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 10 }}>
          <SceneShell>
            <CoordinateSystem3D />
            {planeFromPN ? <Plane3D plane={planeFromPN} color="#0ea5e9" showNormal /> : <Text position={[0, 1, 0]} fontSize={0.3} color="#ef4444">ناظم صفري</Text>}
            <Point3D position={P0} label={`P₀(${P0[0]}|${P0[1]}|${P0[2]})`} color="#0ea5e9" showProjection={false} />
          </SceneShell>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: '#0ea5e9' }}>P₀</div>
            <Slider label="x₀" value={P0[0]} min={-3} max={3} step={1} color="#ef4444" onChange={(v) => setP0([v, P0[1], P0[2]])} />
            <Slider label="y₀" value={P0[1]} min={-3} max={3} step={1} color="#22c55e" onChange={(v) => setP0([P0[0], v, P0[2]])} />
            <Slider label="z₀" value={P0[2]} min={-3} max={3} step={1} color="#3b82f6" onChange={(v) => setP0([P0[0], P0[1], v])} />
          </div>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: '#ef4444' }}>⃗n = (a,b,c)</div>
            <Slider label="a" value={n[0]} min={-3} max={3} step={1} color="#ef4444" onChange={(v) => setN([v, n[1], n[2]])} />
            <Slider label="b" value={n[1]} min={-3} max={3} step={1} color="#22c55e" onChange={(v) => setN([n[0], v, n[2]])} />
            <Slider label="c" value={n[2]} min={-3} max={3} step={1} color="#3b82f6" onChange={(v) => setN([n[0], n[1], v])} />
          </div>
        </div>
        {planeFromPN ? <MathBlock tex={`${planeEquationString(planeFromPN)} \\quad \\text{— تتحدث حياً مع كل تغيير}`} /> : <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: 8, color: '#991b1b', fontSize: 13 }}>الشعاع الناظم صفري — لا يحدد مستوى. غيّر a,b,c.</div>}
      </StepBlock>

      {/* 4 */}
      <StepBlock num="4" title="معنى كل رمز">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 10 }}><strong>x,y,z</strong> — إحداثيات أي نقطة متغيرة</div>
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: 10 }}><strong>a,b,c</strong> — مركبات الناظم ⃗n</div>
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: 10 }}><strong>P₀</strong> — نقطة ثابتة على المستوى</div>
          <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: 10 }}><strong>d</strong> — ثابت = a·x₀+b·y₀+c·z₀</div>
        </div>
        <HintBox>الفرق: (x,y,z) متغيرة، (a,b,c) تحدد الاتجاه، d يحدد الموضع.</HintBox>
      </StepBlock>

      {/* 5 */}
      <StepBlock num="5" title="هل النقطة تنتمي إلى المستوى؟ — بالتعويض">
        <p>المستوى <MathInline tex="E: ax+by+cz+d=0" /> — نعوض P لنرى هل تحقق.</p>
        <div style={{ height: 340, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 10 }}>
          <SceneShell>
            <CoordinateSystem3D />
            <Plane3D plane={{ a: 1, b: 1, c: 1, d: -3 }} color="#7c3aed" />
            <Point3D position={testPoint} label={`P(${testPoint[0]}|${testPoint[1]}|${testPoint[2]}) ${onPlane1 ? '∈' : '∉'} E`} color={onPlane1 ? '#22c55e' : '#ef4444'} />
          </SceneShell>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {(['x', 'y', 'z'] as const).map((ax, i) => (
            <div key={ax} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: 10 }}>
              <Slider label={ax} value={testPoint[i]} min={-3} max={3} step={1} color={ax === 'x' ? '#ef4444' : ax === 'y' ? '#22c55e' : '#3b82f6'} onChange={(v) => { const n = [...testPoint] as [number, number, number]; (n as any)[i] = v; setTestPoint(n) }} />
            </div>
          ))}
        </div>
        <MathBlock tex={`1\\cdot${testPoint[0]}+1\\cdot${testPoint[1]}+1\\cdot${testPoint[2]}-3=${testPoint[0] + testPoint[1] + testPoint[2] - 3} \\; ${onPlane1 ? '=0\\; \\checkmark\\; P\\in E' : '\\neq0\\; P\\notin E'}`} />
        <div style={{ padding: '8px 12px', borderRadius: 10, background: onPlane1 ? '#f0fdf4' : '#fef2f2', border: `1px solid ${onPlane1 ? '#bbf7d0' : '#fecaca'}`, color: onPlane1 ? '#166534' : '#991b1b', fontSize: 13 }}>{onPlane1 ? '✅ النقطة على المستوى' : '❌ ليست على المستوى — حاول جعل x+y+z=3'}</div>
      </StepBlock>

      {/* 6 — مكرر لكن تأكيد */}
      <StepBlock num="6" title="بناء مستوى من نقطة وناظم — تفاعلي">
        <p>نفس مشهد الدرس 3 — كل تغيير في P₀ أو ⃗n يولد معادلة جديدة فوراً. جرّب أعلاه.</p>
        {planeFromPN && <div style={{ fontSize: 12, color: '#475569' }}>المسافة من الأصل إلى المستوى: {(distancePointPlane({ x: 0, y: 0, z: 0 }, planeFromPN) ?? 0).toFixed(2)}</div>}
      </StepBlock>

      {/* 7 */}
      <StepBlock num="7" title="المستويات الإحداثية والخاصة">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
          {[
            ['xy', 'xy: z=0'],
            ['xz', 'xz: y=0'],
            ['yz', 'yz: x=0'],
            ['x3', 'x=3'],
            ['y-2', 'y=−2'],
            ['z5', 'z=5'],
          ].map(([k, label]) => (
            <button key={k} onClick={() => setSpec(k as any)} style={{ padding: '6px 10px', borderRadius: 999, border: '1px solid', borderColor: spec === k ? '#0f172a' : '#e2e8f0', background: spec === k ? '#0f172a' : 'white', color: spec === k ? 'white' : '#334155', cursor: 'pointer', fontSize: 12 }}>{label}</button>
          ))}
        </div>
        <div style={{ height: 340, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 8 }}>
          <SceneShell>
            <CoordinateSystem3D />
            <Plane3D plane={specPlane} color={spec === 'xy' ? '#22c55e' : spec === 'xz' ? '#0ea5e9' : spec === 'yz' ? '#ef4444' : '#7c3aed'} />
          </SceneShell>
        </div>
        <MathBlock tex={spec === 'xy' ? 'z=0' : spec === 'xz' ? 'y=0' : spec === 'yz' ? 'x=0' : spec === 'x3' ? 'x=3' : spec === 'y-2' ? 'y=-2' : 'z=5'} />
        <p style={{ fontSize: 13, color: '#475569' }}>الـمستويات الخاصة توازي الإحداثي عندما يكون أحد معاملات الناظم صفراً.</p>
      </StepBlock>

      {/* 8 */}
      <StepBlock num="8" title="طرق تحديد مستوى — ثلاث نقاط">
        <p>ثلاث نقاط غير على استقامة واحدة تحدد مستوى وحيداً: <MathInline tex="AB=B-A,\; AC=C-A,\; \\vec{n}=AB\\times AC" /></p>
        <div style={{ height: 380, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 10 }}>
          <SceneShell cameraPosition={[6, 5, 6]}>
            <CoordinateSystem3D />
            <Point3D position={A3} label={`A(${A3[0]}|${A3[1]}|${A3[2]})`} color="#0ea5e9" showProjection={false} />
            <Point3D position={B3} label={`B`} color="#f43f5e" showProjection={false} />
            <Point3D position={C3} label={`C`} color="#22c55e" showProjection={false} />
            {plane3 ? <Plane3D plane={plane3} color="#7c3aed" showNormal /> : <Text position={[0, 1, 0]} fontSize={0.3} color="#ef4444">نقاط على استقامة واحدة</Text>}
          </SceneShell>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            [A3, setA3, '#0ea5e9', 'A'],
            [B3, setB3, '#f43f5e', 'B'],
            [C3, setC3, '#22c55e', 'C'],
          ].map(([pt, setter, col, name]: any) => (
            <div key={name} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: 8 }}>
              <div style={{ fontWeight: 700, fontSize: 12, color: col }}>{name}</div>
              {(['x', 'y', 'z'] as const).map((ax, i) => (
                <Slider key={ax} label={ax} value={pt[i]} min={-3} max={3} step={1} color={ax === 'x' ? '#ef4444' : ax === 'y' ? '#22c55e' : '#3b82f6'} onChange={(v) => { const n = [...pt] as [number, number, number]; n[i] = v; setter(n) }} />
              ))}
            </div>
          ))}
        </div>
        {plane3 ? (
          <>
            <MathBlock tex={`AB=(${ab.x},${ab.y},${ab.z}),\; AC=(${ac.x},${ac.y},${ac.z}),\; \\vec{n}=AB\\times AC=(${n3.x},${n3.y},${n3.z})`} />
            <MathBlock tex={planeEquationString(plane3)} />
          </>
        ) : (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: 8, color: '#991b1b', fontSize: 13 }}>النقاط على استقامة واحدة — الجداء الشعاعي صفر — لا يحدد مستوى وحيداً. غيّر إحداها.</div>
        )}
        <HintBox>نقطة + شعاعان غير متوازيين كافيان أيضاً: <MathInline tex="\\vec{n}=u\\times v" />.</HintBox>
      </StepBlock>

      {/* 9 */}
      <StepBlock num="9" title="صيغة المقطوعات — x/a + y/b + z/c = 1">
        <p>عندما يقطع المستوى المحاور في <MathInline tex="(a,0,0),(0,b,0),(0,0,c)" />:</p>
        <MathBlock tex="\\frac{x}{a}+\\frac{y}{b}+\\frac{z}{c}=1" />
        <div style={{ height: 340, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 10 }}>
          <SceneShell>
            <CoordinateSystem3D />
            <Plane3D plane={cutPlane} color="#f59e0b" />
            <Point3D position={[cut.a, 0, 0]} label={`(${cut.a},0,0)`} color="#ef4444" showProjection={false} />
            <Point3D position={[0, cut.b, 0]} label={`(0,${cut.b},0)`} color="#22c55e" showProjection={false} />
            <Point3D position={[0, 0, cut.c]} label={`(0,0,${cut.c})`} color="#3b82f6" showProjection={false} />
          </SceneShell>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <Slider label="a مقطوعة x" value={cut.a} min={1} max={5} step={1} color="#ef4444" onChange={(v) => setCut({ ...cut, a: v })} />
          <Slider label="b مقطوعة y" value={cut.b} min={1} max={5} step={1} color="#22c55e" onChange={(v) => setCut({ ...cut, b: v })} />
          <Slider label="c مقطوعة z" value={cut.c} min={1} max={5} step={1} color="#3b82f6" onChange={(v) => setCut({ ...cut, c: v })} />
        </div>
        <MathBlock tex={`\\frac{x}{${cut.a}}+\\frac{y}{${cut.b}}+\\frac{z}{${cut.c}}=1 \\quad\\Rightarrow\\quad ${planeEquationString(cutPlane)}`} />
        <div style={{ fontSize: 12, color: '#475569' }}>المقطوعات هي {intercept ? `(${intercept.a},${intercept.b},${intercept.c})` : '—'} — نفسها.</div>
      </StepBlock>
    </LessonLayout>
  )
}


