import SceneShell from '../three/SceneShell'
import CoordinateSystem3D from '../three/CoordinateSystem3D'
import Point3D from '../three/Point3D'
import Vector3D from '../three/Vector3D'
import { LessonLayout, StepBlock, HintBox } from '../components/lessons/LessonLayout'
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
      title="النقطة والإحداثيات في الفضاء"
      subtitle="أول خطوة لفهم الفضاء ثلاثي الأبعاد: كيف نحدد مكان نقطة بدقة بثلاثة أرقام فقط."
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
        <StepBlock num={1} title="ماذا يعني أن النقطة لها 3 إحداثيات؟">
          <p>
            في المستوى نحتاج رقمين <MathInline tex="(x,y)" /> لنحدد نقطة. في الفضاء نحتاج{' '}
            <strong>ثلاثة</strong>: <MathInline tex="A(a\,|\,b\,|\,c)" /> أو <MathInline tex="A(a,b,c)" />.
          </p>
          <p>
            كل إحداثية تقول كم نتحرك على محور: <span style={{ color: '#ef4444', fontWeight: 700 }}>x</span>{' '}
            (أحمر)، <span style={{ color: '#22c55e', fontWeight: 700 }}>y</span> (أخضر)،{' '}
            <span style={{ color: '#3b82f6', fontWeight: 700 }}>z</span> (أزرق، الارتفاع).
          </p>
          <MathBlock tex="A(3\,|\,2\,|\,4)\;\; \Longleftrightarrow\;\; x=3,\; y=2,\; z=4" />
          <HintBox>
            حرّك المنزلقات أعلاه وشاهد النقطة <strong>A</strong> تتحرك فوراً مع إسقاطاتها المتقطعة على
            المحاور. هذه الخطوط المتقطعة هي «ظل» النقطة على المستوي <MathInline tex="xy" />.
          </HintBox>
        </StepBlock>

        <StepBlock num={2} title="نظام الإحداثيات — نقطة الأصل والمحاور">
          <p>
            نقطة الأصل هي <MathInline tex="O(0,0,0)" />، ملتقى المحاور الثلاثة. كل نقطة أخرى تُقاس
            انطلاقاً منها. جرّب تدوير المشهد بإصبع واحد، والتكبير بإصبعين (أو عجلة الماوس)، ثم اضغط «إعادة
            الضبط».
          </p>
          <p>
            قاعدة اليد اليمنى: إذا أشرت بإبهامك نحو <MathInline tex="x" /> وسبابتك نحو{' '}
            <MathInline tex="y" />، فإن وسطاك تشير نحو <MathInline tex="z" />.
          </p>
        </StepBlock>

        <StepBlock num={3} title="قراءة الإحداثيات — من المشهد إلى الأرقام">
          <p>
            انظر إلى النقطة <MathInline tex="A" /> في المشهد. الخط المتقطع العمودي ينزل إلى{' '}
            <MathInline tex="(x,y,0)" /> ثم خطان أفقيان إلى المحورين. هكذا تقرأ{' '}
            <MathInline tex="x" /> و <MathInline tex="y" /> و <MathInline tex="z" />.
          </p>
          <MathBlock tex="\vec{OA} = (x_A,\; y_A,\; z_A)\quad\text{— شعاع الموضع}" />
          <p>
            شعاع الموضع <MathInline tex="\vec{OA}" /> هو السهم البرتقالي من <MathInline tex="O" /> إلى{' '}
            <MathInline tex="A" />. مركباته هي نفس إحداثيات <MathInline tex="A" />.
          </p>
        </StepBlock>

        <StepBlock num={4} title="مثال محلول — كم طول شعاع الموضع؟">
          <p>
            للنقطة <MathInline tex="A(3|2|4)" />:
          </p>
          <MathBlock tex="|\vec{OA}| = \sqrt{x^2 + y^2 + z^2} = \sqrt{3^2+2^2+4^2} = \sqrt{9+4+16}=\sqrt{29}\approx 5.39" />
          <p>
            مع إحداثياتك الحالية <MathInline tex={`A(${x}|${y}|${z})`} /> الطول ={' '}
            <MathInline tex={`\\sqrt{${x}^2+${y}^2+${z}^2}=${len.toFixed(2)}`} /> — يتحدث حياً مع كل حركة.
          </p>
        </StepBlock>

        <StepBlock num={5} title="الفرق بين النقطة والشعاع (مهم)">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: 10 }}>
              <strong>نقطة A</strong>
              <br />
              موقع ثابت
              <br />
              <MathInline tex="A(3,2,4)" />
            </div>
            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 10, padding: 10 }}>
              <strong>شعاع ⃗OA</strong>
              <br />
              سهم له طول واتجاه
              <br />
              <MathInline tex="\vec{OA}=(3,2,4)" />
            </div>
          </div>
          <p style={{ marginTop: 8 }}>
            نفس الأرقام، معنى مختلف. النقطة «أين»، الشعاع «كيف نصل».
          </p>
        </StepBlock>
      </div>
    </LessonLayout>
  )
}
