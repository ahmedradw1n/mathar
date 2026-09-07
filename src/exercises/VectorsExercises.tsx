import ExerciseCard from './ExerciseCard'
import SceneShell from '../three/SceneShell'
import CoordinateSystem3D from '../three/CoordinateSystem3D'
import Vector3D from '../three/Vector3D'
import { MathInline } from '../components/math/MathBlock'

export default function VectorsExercises() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {/* مبتدئ — مركبات */}
      <ExerciseCard
        id="m-3"
        title="تمرين 3 — مركبات الشعاع AB"
        difficulty="مبتدئ"
        question={<>إذا كان <MathInline tex="A(1,2,1)" /> و <MathInline tex="B(4,5,3)" /> فما <MathInline tex="\vec{AB}" />؟<br /><span style={{ fontSize: 12, color: '#64748b' }}>أدخل بصيغة 3,3,2</span></>}
        hints={['AB = B − A', '(4−1, 5−2, 3−1)', 'النتيجة (3,3,2)']}
        solution={<> <MathInline tex="\vec{AB}=B-A=(3,3,2)" /></>}
        placeholder="مثال: 3,3,2"
        check={(ans) => {
          const n = ans.replace(/\|/g, ',').replace(/\s+/g, '').replace(/[()]/g, '').split(',').map(Number)
          if (n[0] === 3 && n[1] === 3 && n[2] === 2) return { ok: true }
          return { ok: false, msg: 'تذكر: AB = B − A = (4−1, 5−2, 3−1).' }
        }}
      />

      <ExerciseCard
        id="m-4"
        title="تمرين 4 — طول شعاع"
        difficulty="مبتدئ"
        question={<>احسب طول <MathInline tex="a=(2,3,6)" /></>}
        hints={['|a| = √(a₁²+a₂²+a₃²)', '4+9+36=49', '√49=7']}
        solution={<> <MathInline tex="|a|=\\sqrt{4+9+36}=\\sqrt{49}=7" /></>}
        placeholder="مثال: 7"
        check={(ans) => (Number(ans) === 7 ? { ok: true } : { ok: false, msg: 'احسب √(2²+3²+6²) = √49' })}
      />

      {/* متوسط — جمع/طرح/سلمي */}
      <ExerciseCard
        id="مت-1"
        title="تمرين 5 — جمع شعاعين"
        difficulty="متوسط"
        question={<><MathInline tex="a=(2,1,0),\; b=(1,2,1)" /> ما <MathInline tex="a+b" />؟</>}
        hints={['اجمع مركبة بمركبة', '(2+1, 1+2, 0+1)', '(3,3,1)']}
        solution={<> <MathInline tex="a+b=(3,3,1)" /></>}
        placeholder="مثال: 3,3,1"
        check={(ans) => {
          const n = ans.replace(/[()]/g, '').split(',').map(Number)
          return n[0] === 3 && n[1] === 3 && n[2] === 1 ? { ok: true } : { ok: false, msg: 'a+b = (2+1,1+2,0+1)' }
        }}
      />

      <ExerciseCard
        id="مت-2"
        title="تمرين 6 — الجداء السلمي"
        difficulty="متوسط"
        question={<><MathInline tex="a=(2,3,1),\; b=(4,-1,2)" /> احسب <MathInline tex="a\\cdot b" /></>}
        hints={['a·b = a₁b₁+a₂b₂+a₃b₃', '2·4 + 3·(−1) + 1·2 = 8−3+2', 'النتيجة 7']}
        solution={<> <MathInline tex="a\\cdot b=8-3+2=7" /></>}
        placeholder="مثال: 7"
        check={(ans) => (Number(ans) === 7 ? { ok: true } : { ok: false, msg: '2·4 + 3·(−1) + 1·2 = 7' })}
      />

      <ExerciseCard
        id="مت-3"
        title="تمرين 7 — ضرب بعدد"
        difficulty="متوسط"
        question={<>إذا كان <MathInline tex="a=(2,-1,3)" /> فما <MathInline tex="-2a" />؟</>}
        hints={['اضرب كل مركبة بـ −2', '(−4, 2, −6)']}
        solution={<> <MathInline tex="-2a=(-4,2,-6)" /></>}
        placeholder="مثال: -4,2,-6"
        check={(ans) => {
          const n = ans.replace(/[()]/g, '').split(',').map(Number)
          return n[0] === -4 && n[1] === 2 && n[2] === -6 ? { ok: true } : { ok: false, msg: '−2·(2,−1,3) = (−4,2,−6) — السالب يعكس الاتجاه' }
        }}
      />

      {/* متقدم — زاوية/تعامد/توازي */}
      <div style={{ height: 300, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white' }}>
        <SceneShell cameraPosition={[6, 5, 6]}>
          <CoordinateSystem3D />
          <Vector3D start={[0, 0, 0]} end={[2, 0, 0]} color="#0ea5e9" label="a(2,0,0)" />
          <Vector3D start={[0, 0, 0]} end={[0, 3, 0]} color="#f43f5e" label="b(0,3,0)" />
        </SceneShell>
      </div>

      <ExerciseCard
        id="مق-1"
        title="تمرين 8 — تعامد (بصري)"
        difficulty="متقدم"
        question={<>انظر للمشهد أعلاه: <MathInline tex="a=(2,0,0),\; b=(0,3,0)" /> — هل الشعاعان متعامدان؟ أجب بـ نعم/لا</>}
        hints={['a·b = 2·0+0·3+0·0 = 0', 'إذا كان الجداء صفراً فهما متعامدان', 'الإجابة نعم']}
        solution={<> <MathInline tex="a\\cdot b=0 \\Rightarrow a\\perp b" /> — الزاوية 90°</>}
        placeholder="نعم أو لا"
        check={(ans) => {
          const n = ans.trim().toLowerCase()
          if (n.includes('نعم') || n === 'yes' || n === 'نعم') return { ok: true }
          return { ok: false, msg: 'a·b = 0 → متعامدان — الزاوية 90°' }
        }}
      />

      <ExerciseCard
        id="مق-2"
        title="تمرين 9 — زاوية"
        difficulty="متقدم"
        question={<><MathInline tex="a=(1,0,0),\; b=(1,1,0)" /> ما الزاوية بينهما؟ (بالدرجات، قرّب لأقرب عدد صحيح)</>}
        hints={['cos α = (a·b)/(|a||b|) = 1/(1·√2) ≈0.707', 'arccos 0.707 ≈45°']}
        solution={<> <MathInline tex="\\alpha\\approx45^\\circ" /></>}
        placeholder="مثال: 45"
        check={(ans) => {
          const v = Number(ans.replace('°', ''))
          return Math.abs(v - 45) < 1 ? { ok: true } : { ok: false, msg: 'cos α = 1/√2 → α≈45°' }
        }}
      />

      <ExerciseCard
        id="مق-3"
        title="تمرين 10 — توازي"
        difficulty="متقدم"
        question={<><MathInline tex="a=(2,4,6),\; b=(1,2,3)" /> هل الشعاعان متوازيان؟</>}
        hints={['هل b = λa ؟', 'b = 0.5·a → نعم متوازيان بنفس الاتجاه']}
        solution={<> <MathInline tex="b=0.5a\\Rightarrow متوازيان" /></>}
        placeholder="نعم أو لا"
        check={(ans) => {
          const n = ans.trim().toLowerCase()
          if (n.includes('نعم') || n === 'yes') return { ok: true }
          return { ok: false, msg: 'b = 0.5·a → متوازيان' }
        }}
      />

      <ExerciseCard
        id="مق-4"
        title="تمرين 11 — المسقط القائم"
        difficulty="متقدم"
        question={<><MathInline tex="a=(4,0,0),\; b=(2,0,0)" /> ما مسقط <MathInline tex="a" /> على <MathInline tex="b" />؟ (أدخل المركبات)</>}
        hints={['proj_b(a) = (a·b/|b|²) b', 'a·b=8, |b|²=4 → النسبة=2', 'النتيجة (4,0,0) — نفس a لأنه موازٍ']}
        solution={<> <MathInline tex="proj_b(a)=(4,0,0)" /> — لأن a موازٍ لـ b</>}
        placeholder="مثال: 4,0,0"
        check={(ans) => {
          const n = ans.replace(/[()]/g, '').split(',').map(Number)
          return n[0] === 4 && n[1] === 0 && n[2] === 0 ? { ok: true } : { ok: false, msg: 'proj = (8/4)·(2,0,0) = (4,0,0)' }
        }}
      />

      {/* تطبيق هندسي */}
      <ExerciseCard
        id="ش-1"
        title="تمرين 12 — تطبيق هندسي (مكعب)"
        difficulty="متقدم"
        question={<>في مكعب طول ضلعه 2، الشعاعان <MathInline tex="AB" /> و <MathInline tex="AD" /> متعامدان. ما <MathInline tex="AB\\cdot AD" />؟</>}
        hints={['AB=(2,0,0), AD=(0,2,0)', 'الجداء =0', 'التعامد → الجداء صفر']}
        solution={<> <MathInline tex="AB\\cdot AD=0" /></>}
        placeholder="مثال: 0"
        check={(ans) => (Number(ans) === 0 ? { ok: true } : { ok: false, msg: 'AB·AD = 0 لأن الزاوية 90°' })}
      />

      <ExerciseCard
        id="ش-2"
        title="تمرين 13 — تجميع مفاهيم"
        difficulty="متقدم"
        question={<><MathInline tex="a=(1,2,3),\; b=(4,-1,2)" /> — احسب الطول |a| ثم الجداء a·b، وقل هل هما متعامدان؟ (أدخل: طول,جداء,نعم/لا — مثال: 3.74,7,لا)</>}
        hints={['|a|=√(1+4+9)=√14≈3.74', 'a·b=4-2+6=8', '8≠0 → غير متعامدين']}
        solution={<> <MathInline tex="|a|\\approx3.74,\\; a\\cdot b=8,\\; \\text{غير متعامدين}" /></>}
        placeholder="مثال: 3.74,8,لا"
        check={(ans) => {
          const parts = ans.split(',')
          if (parts.length < 3) return { ok: false, msg: 'أدخل: طول,جداء,نعم/لا' }
          const dot = Number(parts[1])
          const ortho = parts[2].trim().toLowerCase()
          if (dot !== 8) return { ok: false, msg: 'a·b = 4-2+6 = 8' }
          if (ortho.includes('لا') || ortho === 'no') return { ok: true }
          return { ok: false, msg: 'a·b=8 ≠0 → غير متعامدين → لا' }
        }}
      />
    </div>
  )
}
