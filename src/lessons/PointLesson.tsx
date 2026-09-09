import SceneShell from '../three/SceneShell'
import CoordinateSystem3D from '../three/CoordinateSystem3D'
import Point3D from '../three/Point3D'
import Vector3D from '../three/Vector3D'
import { LessonLayout, StepBlock, HumanNote } from '../components/lessons/LessonLayout'
import { MathBlock, MathInline } from '../components/math/MathBlock'
import { length as vecLength } from '../math/vectors'

export default function PointLesson({
  point,
  onChange,
}: {
  point: [number, number, number]
  onChange: (p: [number, number, number]) => void
}) {
  const [x, y, z] = point
  const len = vecLength({ x, y, z })

  return (
    <LessonLayout
      title="النقطة في الفضاء — أين أنت بالضبط؟"
      subtitle="تخيل أنك تصف لصديق مكان كتاب في غرفة: 'امشِ 3 خطوات يمينًا، 2 للأمام، وارفعه 4 فوق الأرض' — هذه هي الإحداثيات الثلاثة، لا أكثر."
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
        {/* المشهد sticky على الديسكتوب */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 14,
          }}
          className="lesson-grid"
        >
          <div
            style={{
              height: 380,
              borderRadius: 16,
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
              background: 'white',
            }}
          >
            <SceneShell cameraPosition={[7, 6, 8]}>
              <CoordinateSystem3D />
              <Point3D position={point} label={`A(${x}|${y}|${z})`} color="#7c3aed" showProjection />
              <Vector3D start={[0, 0, 0]} end={point} color="#f59e0b" label="⃗OA" />
            </SceneShell>
          </div>

          {/* وسيلة إيضاح الألوان */}
          <div
            style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: 16,
              padding: 12,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', marginBottom: 8 }}>وسيلة الإيضاح</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 12 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: '#ef4444', display: 'inline-block' }} /> محور x (أحمر)
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: '#22c55e', display: 'inline-block' }} /> محور y (أخضر)
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: 3, background: '#3b82f6', display: 'inline-block' }} /> محور z (أزرق)
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#7c3aed', display: 'inline-block' }} /> النقطة A (بنفسجي)
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 14, height: 4, borderRadius: 2, background: '#f59e0b', display: 'inline-block' }} /> الشعاع ⃗OA (برتقالي)
              </span>
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>الألوان للمساعدة فقط — الأسماء والرموز هي الأساس.</div>
          </div>

          {/* منزلقات التحكم */}
          <div
            style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: 16,
              padding: 14,
            }}
          >
            <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>
              جرّب بنفسك — غيّر إحداثيات النقطة <span dir="ltr">A({x} | {y} | {z})</span>
            </div>

            {(['x', 'y', 'z'] as const).map((axis, idx) => {
              const val = point[idx]
              return (
                <div key={axis} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: axis === 'x' ? '#ef4444' : axis === 'y' ? '#22c55e' : '#3b82f6' }}>
                      {axis} = {val}
                    </span>
                    <span style={{ fontSize: 12, color: '#64748b' }}>-5 → 5</span>
                  </div>
                  <input
                    type="range"
                    min={-5}
                    max={5}
                    step={1}
                    value={val}
                    onChange={(e) => {
                      const v = Number(e.target.value)
                      const next: [number, number, number] = [...point] as any
                      next[idx] = v
                      onChange(next)
                    }}
                    style={{ width: '100%', accentColor: axis === 'x' ? '#ef4444' : axis === 'y' ? '#22c55e' : '#3b82f6' }}
                  />
                </div>
              )
            })}

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
                marginTop: 8,
                fontSize: 13,
                color: '#334155',
              }}
            >
              <span
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 999,
                  padding: '4px 10px',
                }}
                dir="ltr"
              >
                <MathInline tex={`\\vec{OA}=(${x},${y},${z})`} /> → <span dir="rtl">الطول</span> = {len.toFixed(2)}
              </span>
              <button
                onClick={() => onChange([3, 2, 4])}
                style={{
                  padding: '6px 12px',
                  borderRadius: 999,
                  border: '1px solid #e2e8f0',
                  background: 'white',
                  cursor: 'pointer',
                  fontSize: 13,
                }}
              >
                إعادة إلى (3|2|4)
              </button>
            </div>
          </div>
        </div>

        {/* الشرح */}
        <StepBlock num={1} title="ليش نحتاج 3 أرقام؟">
          <p>
            في الورقة (2D) يكفي تقول <MathInline tex="(x,y)" /> — يمين/يسار وفوق/تحت. لكن في الغرفة الحقيقية لازم تضيف <strong>الارتفاع</strong>. بلا <MathInline tex="z" /> ما تعرف هل الكتاب على الأرض أم على الرف.
          </p>
          <p>
            لذلك أي نقطة في الفضاء نكتبها <MathInline tex="A(a\,|\,b\,|\,c)" /> — ثلاثة أرقام تحكي القصة كاملة:
          </p>
          <div style={{ display: 'grid', gap: 8, margin: '10px 0' }}>
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 12px', display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} /> <strong style={{ color: '#ef4444' }}>x</strong> — كم خطوة يمين/يسار (المحور الأحمر)
            </div>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 12px', display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }} /> <strong style={{ color: '#22c55e' }}>y</strong> — كم خطوة أمام/خلف (الأخضر)
            </div>
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '10px 12px', display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#3b82f6' }} /> <strong style={{ color: '#3b82f6' }}>z</strong> — كم ترفع لفوق (الأزرق)
            </div>
          </div>
          <MathBlock label="القاعدة ببساطة" tex="A(3\,|\,2\,|\,4)\;\; \Longleftrightarrow\;\; x=3,\; y=2,\; z=4" />
          <HumanNote>
            جرّب الآن: حرّك منزلق <MathInline tex="z" /> وشوف النقطة البنفسجية تطلع وتنزل مثل مصعد. الخطوط المتقطعة؟ هذا ظلّها على الأرض — يساعدك تعرف مكانها حتى لو دوّرت المشهد.
          </HumanNote>
        </StepBlock>

        <StepBlock num={2} title="نقطة الصفر — أين يبدأ كل شيء؟">
          <p>
            كل القياسات تبدأ من <MathInline tex="O(0,0,0)" /> — زاوية الغرفة حيث تلتقي الجدران والأرض. منها نعدّ: 3 يمين، 2 أمام، 4 فوق.
          </p>
          <p>
            <strong>جرّب بيدك:</strong> افتح يدك اليمنى — الإبهام = <MathInline tex="x" /> ، السبابة = <MathInline tex="y" /> ، الوسطى = <MathInline tex="z" />. هكذا يتذكر الطلاب الاتجاهات دومًا.
          </p>
          <HumanNote>دوّر المشهد بإصبع واحد، كبّر بإصبعين، وإذا ضعت اضغط «إعادة الضبط ↺» فوق المشهد.</HumanNote>
        </StepBlock>

        <StepBlock num={3} title="كيف تقرأ الإحداثيات من المشهد؟">
          <p>
            شايف الخط المتقطع النازل من النقطة البنفسجية؟ ينزل عموديًا إلى الأرض عند <MathInline tex="(x,y,0)" />، ثم يتفرع خطان إلى المحور الأحمر والأخضر. هكذا تعرف <MathInline tex="x" /> و <MathInline tex="y" />، والارتفاع هو <MathInline tex="z" />.
          </p>
          <MathBlock label="شعاع الموضع" tex="\vec{OA} = (x_A,\; y_A,\; z_A)\quad\text{— سهم من الأصل إلى النقطة}" />
          <HumanNote>
            السهم البرتقالي <MathInline tex="\vec{OA}" /> هو نفسه عنوان النقطة، بس على شكل سهم. النقطة تقول «أنا هنا»، والشعاع يقول «هكذا تصل إليّ من الصفر».
          </HumanNote>
        </StepBlock>

        <StepBlock num={4} title="مثال حي — كم يبعد الكتاب عن الزاوية؟">
          <p>
            خلينا نحسب المسافة من الزاوية <MathInline tex="O" /> إلى <MathInline tex="A(3|2|4)" />. كأنك تمدّ خيطًا مستقيمًا:
          </p>
          <MathBlock label="فيثاغورس في الفضاء" tex="|\vec{OA}| = \sqrt{x^2 + y^2 + z^2} = \sqrt{3^2+2^2+4^2} = \sqrt{9+4+16}=\sqrt{29}\approx 5.39" />
          <p>
            والآن نقطتك الحالية <MathInline tex={`A(${x}|${y}|${z})`} /> تبعد <MathInline tex={`\\sqrt{${x}^2+${y}^2+${z}^2}=${len.toFixed(2)}`} /> — حرّك المنزلقات وشوف الرقم يتغير لحظيًا. لا تحفظ القانون، شوفه يشتغل.
          </p>
        </StepBlock>

        <StepBlock num={5} title="انتبه — النقطة ليست الشعاع!">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 20 }}>📍</div>
              <strong>نقطة A</strong>
              <br />
              <span style={{ fontSize: 13, color: '#475569' }}>عنوان ثابت — «أين؟»</span>
              <br />
              <MathInline tex="A(3,2,4)" />
            </div>
            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 12, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 20 }}>➡️</div>
              <strong>شعاع ⃗OA</strong>
              <br />
              <span style={{ fontSize: 13, color: '#475569' }}>طريق — «كيف أصل؟»</span>
              <br />
              <MathInline tex="\vec{OA}=(3,2,4)" />
            </div>
          </div>
          <HumanNote>
            نفس الأرقام، لكن المعنى يختلف تمامًا. إذا خلطت بينهما في الامتحان، ستخسر نقاطًا سهلة. تذكر: النقطة بيت، والشعاع طريق إليه.
          </HumanNote>
        </StepBlock>
      </div>
    </LessonLayout>
  )
}
