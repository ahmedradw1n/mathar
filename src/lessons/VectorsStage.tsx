import { useState, useMemo } from 'react'
import SceneShell from '../three/SceneShell'
import CoordinateSystem3D from '../three/CoordinateSystem3D'
import Point3D from '../three/Point3D'
import Vector3D from '../three/Vector3D'
import AngleArc from '../three/AngleArc'
import RightAngleMark from '../three/RightAngleMark'
import CubeFrame from '../three/CubeFrame'
import { LessonLayout, StepBlock, HintBox, HumanNote } from '../components/lessons/LessonLayout'
import { MathBlock, MathInline } from '../components/math/MathBlock'
import { add, sub, scale, dot, length, angleBetweenDeg, areOrthogonal, areParallel, vectorBetweenPoints, projectVectorOnto } from '../math/vectors'

// مكون مساعد لمنزلق محور
function AxisSlider({ label, value, color, onChange }: { label: string; value: number; color: string; onChange: (v: number) => void }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
        <span style={{ fontWeight: 700, color }}>{label} = {value}</span>
        <span style={{ color: '#64748b' }}>-4 → 4</span>
      </div>
      <input type="range" min={-4} max={4} step={1} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ width: '100%', accentColor: color }} />
    </div>
  )
}

export default function VectorsStage() {
  // للشعاع بين نقطتين
  const [A, setA] = useState<[number, number, number]>([1, 2, 1])
  const [B, setB] = useState<[number, number, number]>([4, 5, 3])
  const AB = useMemo(() => vectorBetweenPoints({ x: A[0], y: A[1], z: A[2] }, { x: B[0], y: B[1], z: B[2] }), [A, B])

  // للعمليات
  const [av, setAv] = useState<[number, number, number]>([2, 1, 0])
  const [bv, setBv] = useState<[number, number, number]>([1, 2, 0])
  const [lambda, setLambda] = useState(2)
  const sum = useMemo(() => add({ x: av[0], y: av[1], z: av[2] }, { x: bv[0], y: bv[1], z: bv[2] }), [av, bv])
  const diff = useMemo(() => sub({ x: av[0], y: av[1], z: av[2] }, { x: bv[0], y: bv[1], z: bv[2] }), [av, bv])
  const scaled = useMemo(() => scale({ x: av[0], y: av[1], z: av[2] }, lambda), [av, lambda])
  const [op, setOp] = useState<'add' | 'sub' | 'scale'>('add')

  // للطول
  const [lenVec, setLenVec] = useState<[number, number, number]>([3, 4, 12])
  const lenVal = useMemo(() => length({ x: lenVec[0], y: lenVec[1], z: lenVec[2] }), [lenVec])

  // للجداء السلمي
  const [da, setDa] = useState<[number, number, number]>([3, 1, 0])
  const [db, setDb] = useState<[number, number, number]>([1, 2, 1])
  const dotVal = useMemo(() => dot({ x: da[0], y: da[1], z: da[2] }, { x: db[0], y: db[1], z: db[2] }), [da, db])
  const lenA = useMemo(() => length({ x: da[0], y: da[1], z: da[2] }), [da])
  const lenB = useMemo(() => length({ x: db[0], y: db[1], z: db[2] }), [db])
  const angDeg = useMemo(() => angleBetweenDeg({ x: da[0], y: da[1], z: da[2] }, { x: db[0], y: db[1], z: db[2] }), [da, db])
  const isOrth = useMemo(() => areOrthogonal({ x: da[0], y: da[1], z: da[2] }, { x: db[0], y: db[1], z: db[2] }, 1e-6), [da, db, dotVal])
  const isPara = useMemo(() => areParallel({ x: da[0], y: da[1], z: da[2] }, { x: db[0], y: db[1], z: db[2] }, 1e-6), [da, db])

  // للمسقط
  const proj = useMemo(() => projectVectorOnto({ x: da[0], y: da[1], z: da[2] }, { x: db[0], y: db[1], z: db[2] }), [da, db])
  const projEnd: [number, number, number] = [proj.x, proj.y, proj.z]

  const [cubeTab, setCubeTab] = useState<'ortho' | 'angle'>('ortho')

  return (
    <LessonLayout title="الأشعة — أسهم لها اتجاه وطول" subtitle="الشعاع ليس نقطة. هو 'حركة' من مكان لآخر. فهمه يفتح لك كل هندسة الفضاء: الزوايا، التعامد، والمسقط.">
      <div style={{ background: 'linear-gradient(135deg,#f5f3ff,#eff6ff)', border: '1px solid #ddd6fe', borderRadius: 14, padding: '12px 14px', fontSize: 13.5, color: '#334155', lineHeight: 1.7, marginBottom: 14 }}>
        <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>🗺️ كيف نمشي في الدرس؟</div>
        نبدأ بسهم بسيط <MathInline tex="\vec{AB}" /> → نعرف طوله → نتعلم كيف نضرب سهمين ببعض (الجداء) → نعرف منه هل الزاوية حادة أم قائمة → ثم متى يكون السهمان عموديين أو متوازيين → وأخيرًا «ظل» سهم على آخر (المسقط).
        <div style={{ marginTop: 8, background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '8px 10px', fontSize: 12.5 }}>
          💡 <strong>الفكرة المفتاحية:</strong> الجداء السلمي هو «كاشف العلاقة» — إذا كان موجبًا: الزاوية حادة، صفرًا: قائمة تمامًا، سالبًا: منفرجة. جرّب وشوف القوس البنفسجي يتغير.
        </div>
      </div>
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 10, marginBottom: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 12, color: '#0f172a', marginBottom: 6 }}>وسيلة الإيضاح — الألوان</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 11 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 4, background: '#0ea5e9', display: 'inline-block', borderRadius: 2 }} /> a (أزرق)</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 4, background: '#f43f5e', display: 'inline-block', borderRadius: 2 }} /> b (أحمر)</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 4, background: '#22c55e', display: 'inline-block', borderRadius: 2 }} /> النتيجة (أخضر)</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 12, height: 4, background: '#f59e0b', display: 'inline-block', borderRadius: 2 }} /> المسقط (برتقالي)</span>
        </div>
      </div>
      {/* 1 — مفهوم الشعاع */}
      <StepBlock num="1" title="ما هو الشعاع؟ تخيل سهمًا">
        <p>النقطة تقول «أنا هنا». الشعاع يقول «تحرك هكذا». له <strong>بداية</strong> و<strong>نهاية</strong> و<strong>اتجاه</strong>. في المشهد: النقطة الزرقاء <MathInline tex="A" /> والحمراء <MathInline tex="B" />، والسهم البرتقالي بينهما هو <MathInline tex="\vec{AB}" /> — اسحبه وشوف أرقامه تتغير.</p>
        <HumanNote>لو <MathInline tex="A" /> و <MathInline tex="B" /> في نفس المكان، الشعاع يختفي — طوله صفر. هذا مهم بعد قليل.</HumanNote>
        <div style={{ display: 'grid', gap: 12 }}>
          <div style={{ height: 360, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white' }}>
            <SceneShell>
              <CoordinateSystem3D />
              <Point3D position={A} label={`A(${A[0]}|${A[1]}|${A[2]})`} color="#0ea5e9" showProjection />
              <Point3D position={B} label={`B(${B[0]}|${B[1]}|${B[2]})`} color="#f43f5e" showProjection />
              <Vector3D start={A} end={B} color="#f59e0b" label="⃗AB" />
            </SceneShell>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#0ea5e9' }}>النقطة A</div>
              <AxisSlider label="x" value={A[0]} color="#ef4444" onChange={(v) => setA([v, A[1], A[2]])} />
              <AxisSlider label="y" value={A[1]} color="#22c55e" onChange={(v) => setA([A[0], v, A[2]])} />
              <AxisSlider label="z" value={A[2]} color="#3b82f6" onChange={(v) => setA([A[0], A[1], v])} />
            </div>
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#f43f5e' }}>النقطة B</div>
              <AxisSlider label="x" value={B[0]} color="#ef4444" onChange={(v) => setB([v, B[1], B[2]])} />
              <AxisSlider label="y" value={B[1]} color="#22c55e" onChange={(v) => setB([B[0], v, B[2]])} />
              <AxisSlider label="z" value={B[2]} color="#3b82f6" onChange={(v) => setB([B[0], B[1], v])} />
            </div>
          </div>
          <MathBlock label="كيف نحسبه؟ ببساطة: النهاية ناقص البداية" tex={`\\vec{AB}=B-A=(${B[0]}-${A[0]},\\,${B[1]}-${A[1]},\\,${B[2]}-${A[2]})=(${AB.x},${AB.y},${AB.z})`} />
          <HintBox>حرّك أي منزلق — الشعاع البرتقالي يلحق فورًا. هذا هو <MathInline tex="\vec{AB}=B-A" /> حيّ أمامك، ليس مجرد حروف.</HintBox>
        </div>
      </StepBlock>

      {/* مثال ثابت مطلوب */}
      <StepBlock num="2" title="مثال: A(1|2|1) و B(4|5|3)">
        <MathBlock tex="\vec{AB}= (4-1\,|\,5-2\,|\,3-1) = (3\,|\,3\,|\,2)" />
        <p>اضغط الزر لتطبيق المثال، ثم غيّر A و B لتعمم الفكرة.</p>
        <button onClick={() => { setA([1, 2, 1]); setB([4, 5, 3]) }} style={{ padding: '8px 14px', borderRadius: 999, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: 13 }}>طبّق المثال A(1|2|1) → B(4|5|3)</button>
      </StepBlock>

      {/* 3 — العمليات */}
      <StepBlock num="3" title="العمليات على الأشعة — جمع، طرح، ضرب بعدد">
        <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
          {(['add', 'sub', 'scale'] as const).map((k) => (
            <button key={k} onClick={() => setOp(k)} style={{ padding: '6px 12px', borderRadius: 999, border: '1px solid', borderColor: op === k ? '#0f172a' : '#e2e8f0', background: op === k ? '#0f172a' : 'white', color: op === k ? 'white' : '#334155', cursor: 'pointer', fontSize: 13 }}>
              {k === 'add' ? 'الجمع a+b' : k === 'sub' ? 'الطرح a−b' : 'الضرب λa'}
            </button>
          ))}
        </div>

        <div style={{ height: 360, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 12 }}>
          <SceneShell cameraPosition={[7, 7, 7]}>
            <CoordinateSystem3D />
            {/* a من الأصل، b من الأصل، والنتيجة */}
            <Vector3D start={[0, 0, 0]} end={av} color="#0ea5e9" label="a" />
            {op !== 'scale' && <Vector3D start={[0, 0, 0]} end={bv} color="#f43f5e" label="b" />}
            {op === 'add' && <Vector3D start={[0, 0, 0]} end={[sum.x, sum.y, sum.z]} color="#22c55e" label="a+b" />}
            {op === 'sub' && <Vector3D start={[0, 0, 0]} end={[diff.x, diff.y, diff.z]} color="#22c55e" label="a−b" />}
            {op === 'scale' && <Vector3D start={[0, 0, 0]} end={[scaled.x, scaled.y, scaled.z]} color="#22c55e" label={`λa (${lambda})`} />}
            {/* لتوضيح الجمع متوازي الأضلاع: b من نهاية a */}
            {op === 'add' && <Vector3D start={av} end={[sum.x, sum.y, sum.z]} color="#f43f5e" label="" />}
          </SceneShell>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#0ea5e9' }}>الشعاع a</div>
            <AxisSlider label="x" value={av[0]} color="#ef4444" onChange={(v) => setAv([v, av[1], av[2]])} />
            <AxisSlider label="y" value={av[1]} color="#22c55e" onChange={(v) => setAv([av[0], v, av[2]])} />
            <AxisSlider label="z" value={av[2]} color="#3b82f6" onChange={(v) => setAv([av[0], av[1], v])} />
          </div>
          {op !== 'scale' ? (
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#f43f5e' }}>الشعاع b</div>
              <AxisSlider label="x" value={bv[0]} color="#ef4444" onChange={(v) => setBv([v, bv[1], bv[2]])} />
              <AxisSlider label="y" value={bv[1]} color="#22c55e" onChange={(v) => setBv([bv[0], v, bv[2]])} />
              <AxisSlider label="z" value={bv[2]} color="#3b82f6" onChange={(v) => setBv([bv[0], bv[1], v])} />
            </div>
          ) : (
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>العدد λ</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span>λ = {lambda}</span>
                <span style={{ color: '#64748b' }}>-3 → 3</span>
              </div>
              <input type="range" min={-3} max={3} step={0.5} value={lambda} onChange={(e) => setLambda(Number(e.target.value))} style={{ width: '100%' }} />
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>جرّب λ=2, 1, 0, −1, −2 — لاحظ أن السالب يعكس الاتجاه.</div>
              <MathBlock tex={`\\lambda a = ${lambda}\\cdot(${av[0]},${av[1]},${av[2]}) = (${scaled.x},${scaled.y},${scaled.z})`} />
            </div>
          )}
        </div>

        {op === 'add' && <MathBlock tex={`a+b = (${av[0]}+${bv[0]},\\,${av[1]}+${bv[1]},\\,${av[2]}+${bv[2]}) = (${sum.x},${sum.y},${sum.z})`} />}
        {op === 'sub' && <MathBlock tex={`a-b = (${av[0]}-${bv[0]},\\,${av[1]}-${bv[1]},\\,${av[2]}-${bv[2]}) = (${diff.x},${diff.y},${diff.z})`} />}
      </StepBlock>

      {/* 4 — الطول */}
      <StepBlock num="4" title="طول الشعاع — |a| = √(a₁²+a₂²+a₃²)">
        <div style={{ height: 340, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 10 }}>
          <SceneShell>
            <CoordinateSystem3D />
            <Vector3D start={[0, 0, 0]} end={lenVec} color="#7c3aed" label={`|a|=${lenVal.toFixed(2)}`} />
          </SceneShell>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {(['x', 'y', 'z'] as const).map((ax, i) => (
            <div key={ax} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: 10 }}>
              <AxisSlider label={ax} value={lenVec[i]} color={ax === 'x' ? '#ef4444' : ax === 'y' ? '#22c55e' : '#3b82f6'} onChange={(v) => { const n = [...lenVec] as [number, number, number]; n[i] = v; setLenVec(n) }} />
            </div>
          ))}
        </div>
        <MathBlock tex={`|a| = \\sqrt{${lenVec[0]}^2+${lenVec[1]}^2+${lenVec[2]}^2}=\\sqrt{${lenVec[0] * lenVec[0]}+${lenVec[1] * lenVec[1]}+${lenVec[2] * lenVec[2]}}=${lenVal.toFixed(2)}`} />
        <HintBox>جرّب <MathInline tex="a=(3|4|12)" /> — ستحصل على <MathInline tex="|a|=13" />. غيّر أي مركبة وشاهد الطول يتحدث.</HintBox>
        <button onClick={() => setLenVec([3, 4, 12])} style={{ marginTop: 8, padding: '6px 12px', borderRadius: 999, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', fontSize: 13 }}>طبّق (3|4|12) → 13</button>
      </StepBlock>

      {/* 5 — شعاع الموضع */}
      <StepBlock num="5" title="شعاع الموضع — من O إلى A">
        <MathBlock tex="\vec{OA}=(x_A,\;y_A,\;z_A)\quad\text{حيث }O(0|0|0)" />
        <p>هو نفس إحداثيات النقطة، لكنه شعاع. استخدمناه سابقاً في الدرس الأول — راجع المنزلقات هناك.</p>
      </StepBlock>

      {/* 6 — الجداء السلمي */}
      <StepBlock num="6" title="الجداء السلمي — ضرب سهمين يعطي رقمًا">
        <p>نضرب سهمين والنتيجة <strong>رقم</strong> فقط — ليس سهمًا جديدًا. لماذا؟ لأنه يخبرنا «كم يساعد أحدهما الآخر في اتجاهه». تخيل شخصين يدفعان صندوقًا: إذا دفعا بنفس الاتجاه، الرقم كبير وموجب. إذا تعاكسا، سالب. إذا أحدهما يدفع جانبًا (90°)، فلا يساعد أبدًا — الرقم صفر.</p>
        <MathBlock label="القانون ببساطة" tex="a\cdot b = a_1b_1+a_2b_2+a_3b_3" />
        <div style={{ height: 380, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 10 }}>
          <SceneShell cameraPosition={[8, 7, 7]}>
            <CoordinateSystem3D />
            <Vector3D start={[0, 0, 0]} end={da} color="#0ea5e9" label={`a(${da[0]},${da[1]},${da[2]})`} />
            <Vector3D start={[0, 0, 0]} end={db} color="#f43f5e" label={`b(${db[0]},${db[1]},${db[2]})`} />
            <AngleArc center={[0, 0, 0]} vecA={da} vecB={db} color={isOrth ? '#22c55e' : '#7c3aed'} label={`${angDeg.toFixed(1)}°`} />
            {/* مسقط a على b */}
            <Vector3D start={[0, 0, 0]} end={projEnd} color="#f59e0b" label="مسقط a على b" />
          </SceneShell>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#0ea5e9' }}>a</div>
            <AxisSlider label="x" value={da[0]} color="#ef4444" onChange={(v) => setDa([v, da[1], da[2]])} />
            <AxisSlider label="y" value={da[1]} color="#22c55e" onChange={(v) => setDa([da[0], v, da[2]])} />
            <AxisSlider label="z" value={da[2]} color="#3b82f6" onChange={(v) => setDa([da[0], da[1], v])} />
          </div>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#f43f5e' }}>b</div>
            <AxisSlider label="x" value={db[0]} color="#ef4444" onChange={(v) => setDb([v, db[1], db[2]])} />
            <AxisSlider label="y" value={db[1]} color="#22c55e" onChange={(v) => setDb([db[0], v, db[2]])} />
            <AxisSlider label="z" value={db[2]} color="#3b82f6" onChange={(v) => setDb([db[0], db[1], v])} />
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
          <span style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 999, padding: '4px 10px', fontSize: 12 }}><MathInline tex={`a\\cdot b=${dotVal}`} /></span>
          <span style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 999, padding: '4px 10px', fontSize: 12 }}><MathInline tex={`|a|=${lenA.toFixed(2)},\\;|b|=${lenB.toFixed(2)}`} /></span>
          <span style={{ background: isOrth ? '#f0fdf4' : isPara ? '#fef2f2' : '#f8fafc', border: `1px solid ${isOrth ? '#bbf7d0' : isPara ? '#fecaca' : '#e2e8f0'}`, borderRadius: 999, padding: '4px 10px', fontSize: 12, fontWeight: 700 }}>{isOrth ? '✓ متعامدان (·=0)' : isPara ? '⇔ متوازيان' : `الزاوية ${angDeg.toFixed(1)}°`}</span>
        </div>
        <MathBlock tex={`a\\cdot b = ${da[0]}\\cdot${db[0]}+${da[1]}\\cdot${db[1]}+${da[2]}\\cdot${db[2]}=${dotVal}`} />
      </StepBlock>

      {/* 7 — الزاوية */}
      <StepBlock num="7" title="كم الزاوية بين السهمين؟">
        <p>نفس فكرة المثلث، لكن في الفضاء. الجداء + الطولين يعطينا الزاوية مباشرة. لا تحفظ، فقط اعرف: كلما كبُر الجداء، صغُرت الزاوية.</p>
        <MathBlock label="من الجداء إلى الزاوية" tex={`\\cos\\alpha = \\frac{a\\cdot b}{|a||b|}=\\frac{${dotVal}}{${lenA.toFixed(2)}\\cdot${lenB.toFixed(2)}}=\\frac{${dotVal}}{${(lenA * lenB).toFixed(2)}}=${lenA * lenB === 0 ? '—' : (dotVal / (lenA * lenB)).toFixed(3)}} \\;\\Rightarrow\\; \\alpha=${angDeg.toFixed(1)}^\\circ`} />
        <HumanNote>القوس البنفسجي هو الزاوية الحقيقية — حرّك <MathInline tex="a" /> أو <MathInline tex="b" /> وشوف الرقم يتبعه. عند 90° يصبح الجداء صفرًا تمامًا.</HumanNote>
      </StepBlock>

      {/* 8 — التعامد */}
      <StepBlock num="8" title="متى نقول عمودي؟ عندما الجداء = صفر">
        <p>ببساطة: إذا كان <MathInline tex="a\cdot b = 0" /> فالسهمين متعامدان — كزاوية الغرفة. جرّب تحريك المنزلقات حتى ترى اللون الأخضر وعلامة الزاوية القائمة ✓. هذا الاختبار سيتكرر في كل الفصول القادمة.</p>
        <div style={{ height: 300, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 8 }}>
          <SceneShell>
            <CoordinateSystem3D />
            <Vector3D start={[0, 0, 0]} end={da} color="#0ea5e9" label="a" />
            <Vector3D start={[0, 0, 0]} end={db} color={isOrth ? '#22c55e' : '#f43f5e'} label={isOrth ? 'b — متعامد ✓' : 'b'} />
            <AngleArc center={[0, 0, 0]} vecA={da} vecB={db} color={isOrth ? '#22c55e' : '#94a3b8'} label={`${angDeg.toFixed(1)}°`} />
            {isOrth && <RightAngleMark center={[0, 0, 0]} dirA={[da[0]/lenA, da[1]/lenA, da[2]/lenA]} dirB={[db[0]/lenB, db[1]/lenB, db[2]/lenB]} color="#22c55e" />}
          </SceneShell>
        </div>
        <div style={{ padding: '8px 12px', borderRadius: 10, background: isOrth ? '#f0fdf4' : '#fef2f2', border: `1px solid ${isOrth ? '#bbf7d0' : '#fecaca'}`, color: isOrth ? '#166534' : '#991b1b', fontSize: 13 }}>
          {isOrth ? `✅ متعامدان — a·b = ${dotVal} (≈0) — الزاوية 90°` : `❌ غير متعامدين — a·b = ${dotVal} — الزاوية ${angDeg.toFixed(1)}° — حاول جعل الجداء صفراً`}
        </div>
        <HintBox>مثال: <MathInline tex="a=(1,2,0), b=(-2,1,0) → a·b=0" /> متعامدان.</HintBox>
      </StepBlock>

      {/* 9 — التوازي */}
      <StepBlock num="9" title="التوازي — b = λa">
        <p>شعاعان متوازيان إذا كان أحدهما مضاعفاً للآخر. جرّب λ موجب وسالب وصفر.</p>
        <div style={{ height: 300, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 8 }}>
          <SceneShell>
            <CoordinateSystem3D />
            <Vector3D start={[0, 0, 0]} end={av} color="#0ea5e9" label="a" />
            <Vector3D start={[0, 0, 0]} end={[av[0] * lambda, av[1] * lambda, av[2] * lambda]} color={lambda > 0 ? '#22c55e' : lambda < 0 ? '#ef4444' : '#94a3b8'} label={lambda > 0 ? 'b=λa نفس الاتجاه' : lambda < 0 ? 'b=λa عكس الاتجاه' : 'صِفري'} />
          </SceneShell>
        </div>
        <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}><span>λ = {lambda}</span><span style={{ color: '#64748b' }}>-3 → 3</span></div>
          <input type="range" min={-3} max={3} step={0.5} value={lambda} onChange={(e) => setLambda(Number(e.target.value))} style={{ width: '100%' }} />
          <div style={{ fontSize: 12, color: '#475569', marginTop: 6 }}>{lambda > 0 ? 'λ موجب → نفس الاتجاه' : lambda < 0 ? 'λ سالب → اتجاه معاكس (انعكاس)' : 'λ=0 → شعاع صفري'} — {areParallel({ x: av[0], y: av[1], z: av[2] }, { x: av[0] * lambda, y: av[1] * lambda, z: av[2] * lambda }) || lambda === 0 ? 'متوازيان ✓' : '—'}</div>
        </div>
      </StepBlock>

      {/* 10 — تطبيق هندسي مكعب */}
      <StepBlock num="10" title="تطبيق هندسي — الجداء السلمي في مكعب">
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <button onClick={() => setCubeTab('ortho')} style={{ padding: '6px 12px', borderRadius: 999, border: '1px solid', borderColor: cubeTab === 'ortho' ? '#0f172a' : '#e2e8f0', background: cubeTab === 'ortho' ? '#0f172a' : 'white', color: cubeTab === 'ortho' ? 'white' : '#334155', cursor: 'pointer', fontSize: 13 }}>تعامد ضلعين</button>
          <button onClick={() => setCubeTab('angle')} style={{ padding: '6px 12px', borderRadius: 999, border: '1px solid', borderColor: cubeTab === 'angle' ? '#0f172a' : '#e2e8f0', background: cubeTab === 'angle' ? '#0f172a' : 'white', color: cubeTab === 'angle' ? 'white' : '#334155', cursor: 'pointer', fontSize: 13 }}>زاوية قطرين</button>
        </div>
        <div style={{ height: 360, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 8 }}>
          <SceneShell cameraPosition={[4, 3.5, 5]}>
            <CubeFrame size={2} showVectors={cubeTab === 'ortho' ? [{ from: 'A', to: 'B', color: '#0ea5e9', label: 'AB' }, { from: 'A', to: 'D', color: '#f43f5e', label: 'AD' }] : [{ from: 'A', to: 'G', color: '#0ea5e9', label: 'AG' }, { from: 'B', to: 'H', color: '#f43f5e', label: 'BH' }]} />
          </SceneShell>
        </div>
        {cubeTab === 'ortho' ? (
          <>
            <MathBlock tex="AB=(2,0,0),\; AD=(0,2,0)\; \Rightarrow\; AB\cdot AD = 2\cdot0+0\cdot2+0\cdot0=0\;\Rightarrow\; AB\perp AD" />
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '8px 10px', fontSize: 13, color: '#166534' }}>✅ زاوية قائمة — إثبات التعامد بالجداء السلمي.</div>
          </>
        ) : (
          <>
            <MathBlock tex="AG=(2,2,2),\; BH=(-2,2,2)\; \Rightarrow\; \cos\alpha=\frac{AG\cdot BH}{|AG||BH|}=\frac{-4+4+4}{\\sqrt{12}\\cdot\\sqrt{12}}=\frac{4}{12}=0.333\;\Rightarrow\;\alpha\approx70.5^\circ" />
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '8px 10px', fontSize: 13, color: '#1e40af' }}>زاوية بين قطرين متقاطعين — ليست قائمة، ليست متوازية.</div>
          </>
        )}
      </StepBlock>

      {/* 11 — المسقط */}
      <StepBlock num="11" title="المسقط — ظلّ سهم على سهم آخر">
        <p>تخيل ضوءًا فوق <MathInline tex="a" /> وظلّه يقع على <MathInline tex="b" />. هذا الظل هو المسقط — «كم من <MathInline tex="a" /> يمشي فعلًا في اتجاه <MathInline tex="b" />». إذا كانا متعامدين، الظل صفر.</p>
        <MathBlock label="قانون الظل" tex="proj_b(a)=\frac{a\cdot b}{|b|^2}\,b" />
        <div style={{ height: 360, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 8 }}>
          <SceneShell>
            <CoordinateSystem3D />
            <Vector3D start={[0, 0, 0]} end={da} color="#0ea5e9" label="a" />
            <Vector3D start={[0, 0, 0]} end={db} color="#64748b" label="b (الاتجاه)" />
            <Vector3D start={[0, 0, 0]} end={projEnd} color="#f59e0b" label="المسقط" />
            {/* عمود من نهاية a إلى نهاية المسقط */}
            <Vector3D start={projEnd} end={da} color="#94a3b8" label="" />
          </SceneShell>
        </div>
        {lenB < 1e-9 ? (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '8px 10px', fontSize: 13, color: '#991b1b' }}>الشعاع b صفري — لا يمكن الإسقاط عليه (قسمة على صفر). غيّر b ليكون غير صفري.</div>
        ) : (
          <MathBlock tex={`a\cdot b=${dotVal},\; |b|^2=${(lenB * lenB).toFixed(2)}\; \Rightarrow\; proj_b(a)=\\frac{${dotVal}}{${(lenB * lenB).toFixed(2)}}\,b=(${proj.x.toFixed(2)},${proj.y.toFixed(2)},${proj.z.toFixed(2)})`} />
        )}
        <HintBox>حرّك a أو b وشاهد المسقط البرتقالي يتحرك. عندما تكون الزاوية 90° يصبح المسقط صفرياً — لأن <MathInline tex="a\cdot b=0" />.</HintBox>
      </StepBlock>
    </LessonLayout>
  )
}
