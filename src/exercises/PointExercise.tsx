import ExerciseCard from './ExerciseCard'
import SceneShell from '../three/SceneShell'
import CoordinateSystem3D from '../three/CoordinateSystem3D'
import Point3D from '../three/Point3D'

export default function PointExercise() {
  // نقطة ثابتة للتمرين
  const target: [number, number, number] = [2, -1, 3]

  return (
    <div style={{ marginTop: 8 }}>
      <div
        style={{
          height: 300,
          borderRadius: 16,
          overflow: 'hidden',
          border: '1px solid #e2e8f0',
          background: 'white',
          marginBottom: 10,
        }}
      >
        <SceneShell cameraPosition={[6, 5, 7]}>
          <CoordinateSystem3D />
          <Point3D position={target} label="P(2|-1|3)" color="#0ea5e9" showProjection />
        </SceneShell>
      </div>

      <ExerciseCard
        id="m-1"
        title="تمرين 1 — قراءة الإحداثيات"
        difficulty="مبتدئ"
        question={
          <>
            انظر إلى النقطة <strong style={{ color: '#0ea5e9' }}>P</strong> في المشهد أعلاه. ما إحداثياتها؟
            <br />
            <span style={{ fontSize: 12, color: '#64748b' }}>
              اكتبها بصيغة <span dir="ltr">2,-1,3</span> أو <span dir="ltr">2|-1|3</span> (بدون أقواس)
            </span>
          </>
        }
        hints={[
          'تتبع الخط المتقطع العمودي إلى المستوي xy، ثم إلى المحورين x و y.',
          'x هي المسافة على المحور الأحمر، y على الأخضر، z على الأزرق (الارتفاع).',
          'لاحظ أن y سالبة (خلف الأصل). الإجابة هي 2, -1, 3.',
        ]}
        solution={
          <>
            النقطة <span dir="ltr">P(2|-1|3)</span> — أي <span dir="ltr">x=2, y=-1, z=3</span>.
            <br />
            نقرأ: تحرك 2 على <span style={{ color: '#ef4444' }}>x</span>، ثم -1 على{' '}
            <span style={{ color: '#22c55e' }}>y</span>، ثم 3 على{' '}
            <span style={{ color: '#3b82f6' }}>z</span>.
          </>
        }
        placeholder="مثال: 2,-1,3"
        check={(ans) => {
          const norm = ans.replace(/\|/g, ',').replace(/\s+/g, '').replace(/[()]/g, '')
          const okValues = ['2,-1,3', '2,-1,3.0']
          if (okValues.includes(norm)) return { ok: true }
          // تحليل رقمي
          const parts = norm.split(',').map(Number)
          if (parts.length === 3 && parts[0] === 2 && parts[1] === -1 && parts[2] === 3) return { ok: true }
          if (norm.includes('2') && norm.includes('-1') && norm.includes('3')) {
            // تحقق ترتيب
            if (parts[0] !== 2) return { ok: false, msg: 'x يجب أن تكون 2.' }
            if (parts[1] !== -1) return { ok: false, msg: 'y يجب أن تكون ‎-1 (لاحظ الاتجاه السالب).' }
            if (parts[2] !== 3) return { ok: false, msg: 'z يجب أن تكون 3.' }
          }
          return { ok: false, msg: 'تأكد من الصيغة: 2,-1,3 — تذكر أن شعاع الموضع ⃗OP له نفس المركبات.' }
        }}
      />

      <ExerciseCard
        id="m-2"
        title="تمرين 2 — شعاع الموضع"
        difficulty="مبتدئ"
        question={
          <>
            إذا كانت <span dir="ltr">A(1, 2, 2)</span> فما طول شعاع الموضع{' '}
            <span dir="ltr">|⃗OA|</span> ؟
          </>
        }
        hints={[
          'استخدم |⃗OA| = √(x²+y²+z²)',
          'احسب: 1² + 2² + 2² = 1+4+4 = 9',
          '√9 = 3',
        ]}
        solution={
          <>
            <span dir="ltr">|⃗OA| = √(1²+2²+2²) = √9 = 3</span>
          </>
        }
        placeholder="مثال: 3"
        check={(ans) => {
          const n = Number(ans.replace(',', '.'))
          if (Math.abs(n - 3) < 1e-9) return { ok: true }
          if (Math.abs(n - 9) < 1e-9) return { ok: false, msg: 'نسيت الجذر التربيعي — احسب √9.' }
          return { ok: false, msg: 'تذكر: |⃗OA| = √(x²+y²+z²). حاول مرة أخرى.' }
        }}
      />
    </div>
  )
}
