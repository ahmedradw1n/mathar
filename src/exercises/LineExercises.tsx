import { useState } from 'react'
import ExerciseCard from './ExerciseCard'
import SceneShell from '../three/SceneShell'
import CoordinateSystem3D from '../three/CoordinateSystem3D'
import Line3D from '../three/Line3D'
import Point3D from '../three/Point3D'
import { MathInline } from '../components/math/MathBlock'
import { lineFromTwoPoints } from '../math/lines'

export default function LineExercises() {
  // للتمرين التفاعلي الأخير
  const A: [number, number, number] = [0, 0, 0]
  const B: [number, number, number] = [2, 0, 0]
  const line = lineFromTwoPoints({ x: A[0], y: A[1], z: A[2] }, { x: B[0], y: B[1], z: B[2] })!
  const Ptest: [number, number, number] = [3, 0, 0] // على المستقيم لكن خارج القطعة
  const Qtest: [number, number, number] = [1, 1, 0] // خارج المستقيم

  const [pick, setPick] = useState<'P' | 'Q' | null>(null)

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <ExerciseCard
        id="ln-m1"
        title="تمرين 1 — شعاع الاتجاه"
        difficulty="مبتدئ"
        question={<>المستقيم <MathInline tex="g: X=(1|2|3)+t(2|-1|4)" /> — ما شعاع اتجاهه؟</>}
        hints={['u هو ما يضرب t', '(2,−1,4)', 'ليس النقطة P']}
        solution={<><MathInline tex="u=(2,-1,4)" /></>}
        placeholder="مثال: 2,-1,4"
        check={(ans) => {
          const n = ans.replace(/[()]/g, '').split(',').map(Number)
          return n[0] === 2 && n[1] === -1 && n[2] === 4 ? { ok: true } : { ok: false, msg: 'u=(2,−1,4)' }
        }}
      />

      <ExerciseCard
        id="ln-m2"
        title="تمرين 2 — نقطة عند t"
        difficulty="مبتدئ"
        question={<><MathInline tex="g: X=(0|1|0)+t(1|0|1)" /> احسب النقطة عند <MathInline tex="t=2" /></>}
        hints={['X = (0+2·1, 1+2·0, 0+2·1)', '(2,1,2)', 'عوّض t=2']}
        solution={<><MathInline tex="X=(2,1,2)" /></>}
        placeholder="مثال: 2,1,2"
        check={(ans) => {
          const n = ans.replace(/[()]/g, '').split(',').map(Number)
          return n[0] === 2 && n[1] === 1 && n[2] === 2 ? { ok: true } : { ok: false, msg: '0+2·1=2, 1+0=1, 0+2·1=2' }
        }}
      />

      <ExerciseCard
        id="ln-m3"
        title="تمرين 3 — t=0"
        difficulty="مبتدئ"
        question={<>أين تقع النقطة عند <MathInline tex="t=0" /> للمستقيم <MathInline tex="X=P+t·u" />؟</>}
        hints={['X(0)=P+0·u', 'X(0)=P', 'النقطة الثابتة']}
        solution={<><MathInline tex="X(0)=P" /></>}
        placeholder="مثال: P"
        check={(ans) => (ans.includes('P') || ans.includes('p') ? { ok: true } : { ok: false, msg: 'X(0)=P' })}
      />

      <ExerciseCard
        id="ln-m4"
        title="تمرين 4 — المعادلات الإحداثية"
        difficulty="مبتدئ"
        question={<><MathInline tex="P=(1|0|2), u=(0|3|-1)" /> اكتب <MathInline tex="y=" /> كدالة t</>}
        hints={['y = y₀ + t·b', 'y = 0 + t·3 = 3t', 'y=3t']}
        solution={<><MathInline tex="y=3t" /></>}
        placeholder="مثال: 3t"
        check={(ans) => (ans.replace(/\s/g, '') === '3t' || ans.replace(/\s/g, '') === '0+3t' ? { ok: true } : { ok: false, msg: 'y=0+3t=3t' })}
      />

      <ExerciseCard
        id="ln-mid5"
        title="تمرين 5 — مستقيم من نقطة واتجاه"
        difficulty="متوسط"
        question={<>أنشئ مستقيماً يمر بـ <MathInline tex="P(2|1|0)" /> واتجاه <MathInline tex="u=(1|1|1)" /> — اكتب x(t)</>}
        hints={['x = x₀ + t·a = 2 + t·1', 'x=2+t']}
        solution={<><MathInline tex="x=2+t" /></>}
        placeholder="مثال: 2+t"
        check={(ans) => (ans.replace(/\s/g, '') === '2+t' || ans.replace(/\s/g, '') === '2+1t' ? { ok: true } : { ok: false, msg: 'x=2+t·1=2+t' })}
      />

      <ExerciseCard
        id="ln-mid6"
        title="تمرين 6 — مستقيم بنقطتين"
        difficulty="متوسط"
        question={<><MathInline tex="A(1|1|0), B(3|3|2)" /> — ما شعاع الاتجاه؟</>}
        hints={['AB=B−A', '(2,2,2)', 'ثم g: X=A+t·AB']}
        solution={<><MathInline tex="AB=(2,2,2)" /></>}
        placeholder="مثال: 2,2,2"
        check={(ans) => {
          const n = ans.replace(/[()]/g, '').split(',').map(Number)
          return n[0] === 2 && n[1] === 2 && n[2] === 2 ? { ok: true } : { ok: false, msg: 'B−A=(2,2,2)' }
        }}
      />

      <ExerciseCard
        id="ln-mid7"
        title="تمرين 7 — نقطة على المستقيم"
        difficulty="متوسط"
        question={<><MathInline tex="A(0|0|0), B(2|0|0)" /> المستقيم <MathInline tex="X=A+t·AB" /> — أين تقع <MathInline tex="t=0.5" />؟</>}
        hints={['X= (0,0,0)+0.5·(2,0,0)', '(1,0,0) منتصف']}
        solution={<><MathInline tex="(1,0,0)" /></>}
        placeholder="مثال: 1,0,0"
        check={(ans) => {
          const n = ans.replace(/[()]/g, '').split(',').map(Number)
          return n[0] === 1 && n[1] === 0 && n[2] === 0 ? { ok: true } : { ok: false, msg: '(1,0,0) منتصف' }
        }}
      />

      <ExerciseCard
        id="ln-mid8"
        title="تمرين 8 — هل تنتمي؟"
        difficulty="متوسط"
        question={<><MathInline tex="g: X=(0|0|0)+t(1|0|0)" /> هل <MathInline tex="P(2|1|0)" /> على g؟</>}
        hints={['هل يوجد t يحقق؟ P = (t,0,0)', 'y=1≠0 → لا']}
        solution={<>لا — y=1 لا يمكن</>}
        placeholder="نعم أو لا"
        check={(ans) => (ans.includes('لا') ? { ok: true } : { ok: false, msg: 'y يجب أن يكون 0' })}
      />

      <ExerciseCard
        id="ln-9"
        title="تمرين 9 — الفرق"
        difficulty="متوسط"
        question={<>ما الفرق بين المستقيم والقطعة ونصف المستقيم من حيث مجال t؟</>}
        hints={['مستقيم t∈ℝ', 'قطعة 0≤t≤1', 'نصف t≥0']}
        solution={<>مستقيم ℝ، قطعة [0,1]، نصف [0,∞)</>}
        placeholder="مثال: R, [0,1], [0,inf)"
        check={(ans) => (ans.includes('ℝ') || ans.toLowerCase().includes('r') ? { ok: true } : { ok: false, msg: 'ℝ، [0,1]، [0,∞)' })}
      />

      <ExerciseCard
        id="ln-10"
        title="تمرين 10 — خطأ شائع"
        difficulty="متقدم"
        question={<>طالب كتب لمستقيم عبر <MathInline tex="A(1|1|1), B(2|2|2)" />: <MathInline tex="X=B+t·AB" /> — هل هذا خطأ؟ وأين؟</>}
        hints={['AB=(1,1,1)', 'X=B+t·AB يبدأ من B عند t=0، ليس A — لكنه لا يزال نفس المستقيم', 'الصحيح X=A+t·AB أو X=B+t·AB كلاهما صحيح لكن النقطة الثابتة مختلفة']}
        solution={<>ليس خطأً جوهرياً — كلاهما يمثل نفس المستقيم (متكافئ)، لكن إذا طلب X=A+t·AB فالأفضل استخدام A.</>}
        placeholder="مثال: ليس خطأ"
        check={(ans) => (ans.includes('ليس') || ans.includes('صح') ? { ok: true } : { ok: false, msg: 'ليس خطأً — يمثل نفس المستقيم' })}
      />

      {/* تفاعلي 3D */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: 12 }}>
        <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>تمرين 11 — تفاعلي: أين تقع النقاط؟</div>
        <div style={{ height: 320, borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white', marginBottom: 10 }}>
          <SceneShell>
            <CoordinateSystem3D />
            <Line3D line={line} mode="segment" color="#22c55e" />
            <Line3D line={line} mode="line" color="#94a3b8" />
            <Point3D position={Ptest} label="P(3|0|0)" color="#f59e0b" showProjection={false} />
            <Point3D position={Qtest} label="Q(1|1|0)" color="#ef4444" showProjection={false} />
          </SceneShell>
        </div>
        <div style={{ fontSize: 13, color: '#334155', marginBottom: 8 }}>
          القطعة الخضراء من <MathInline tex="A(0|0|0)" /> إلى <MathInline tex="B(2|0|0)" />، الخط الرمادي امتداد المستقيم. النقطة <MathInline tex="P(3|0|0)" /> على المستقيم لكن خارج القطعة (t=1.5)، و <MathInline tex="Q(1|1|0)" /> خارج المستقيم.
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => setPick('P')} style={{ padding: '6px 12px', borderRadius: 999, border: '1px solid', borderColor: pick === 'P' ? '#0f172a' : '#e2e8f0', background: pick === 'P' ? '#0f172a' : 'white', color: pick === 'P' ? 'white' : '#334155', cursor: 'pointer', fontSize: 12 }}>P على المستقيم خارج القطعة</button>
          <button onClick={() => setPick('Q')} style={{ padding: '6px 12px', borderRadius: 999, border: '1px solid', borderColor: pick === 'Q' ? '#0f172a' : '#e2e8f0', background: pick === 'Q' ? '#0f172a' : 'white', color: pick === 'Q' ? 'white' : '#334155', cursor: 'pointer', fontSize: 12 }}>Q خارج المستقيم</button>
        </div>
        {pick === 'P' && <div style={{ marginTop: 8, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: 8, color: '#166534', fontSize: 13 }}>✅ صحيح — P t=1.5 على المستقيم لكن ليست على القطعة [0,1]</div>}
        {pick === 'Q' && <div style={{ marginTop: 8, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: 8, color: '#166534', fontSize: 13 }}>✅ صحيح — Q لا تحقق y=0</div>}
      </div>
    </div>
  )
}
