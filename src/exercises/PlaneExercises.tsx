import ExerciseCard from './ExerciseCard'
import SceneShell from '../three/SceneShell'
import CoordinateSystem3D from '../three/CoordinateSystem3D'
import Plane3D from '../three/Plane3D'
import Point3D from '../three/Point3D'
import { MathInline } from '../components/math/MathBlock'

export default function PlaneExercises() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {/* مبتدئ */}
      <ExerciseCard
        id="pl-m1"
        title="تمرين 1 — هل النقطة على المستوى؟"
        difficulty="مبتدئ"
        question={<>المستوى <MathInline tex="E: x+y+z=3" /> والنقطة <MathInline tex="P(1,1,1)" /> — هل <MathInline tex="P\\in E" />؟</>}
        hints={['عوّض: 1+1+1=3', '3=3 → نعم', 'لو كانت (1,1,2) → 4≠3']}
        solution={<>1+1+1=3 → <MathInline tex="P\\in E" /> ✓</>}
        placeholder="نعم أو لا"
        check={(ans) => {
          const n = ans.toLowerCase()
          if (n.includes('نعم') || n.includes('yes')) return { ok: true }
          return { ok: false, msg: 'عوّض: 1+1+1=3 → نعم' }
        }}
      />

      <ExerciseCard
        id="pl-m2"
        title="تمرين 2 — الشعاع الناظم"
        difficulty="مبتدئ"
        question={<>المستوى <MathInline tex="E: 2x+3y -z =5" /> — ما شعاعه الناظم؟ (أدخل a,b,c)</>}
        hints={['الناظم = (a,b,c)', '(2,3,−1)', 'd لا يدخل في الناظم']}
        solution={<> <MathInline tex="\\vec{n}=(2,3,-1)" /></>}
        placeholder="مثال: 2,3,-1"
        check={(ans) => {
          const n = ans.replace(/[()]/g, '').split(',').map(Number)
          return n[0] === 2 && n[1] === 3 && n[2] === -1 ? { ok: true } : { ok: false, msg: 'الناظم هو معاملات x,y,z → (2,3,−1)' }
        }}
      />

      <ExerciseCard
        id="pl-m3"
        title="تمرين 3 — الثابت d"
        difficulty="مبتدئ"
        question={<>المستوى <MathInline tex="2x+3y -z =5" /> — ما قيمة الطرف الأيمن d؟ ثم اكتب بصيغة <MathInline tex="ax+by+cz+d=0" /> ما d؟</>}
        hints={['2x+3y−z=5 → d=5', 'بصيغة ax+by+cz+d=0 → 2x+3y−z−5=0 → d=−5']}
        solution={<>بصيغة =d: d=5، بصيغة +d=0: d=−5</>}
        placeholder="مثال: 5 أو -5"
        check={(ans) => {
          const v = Number(ans)
          if (v === 5 || v === -5) return { ok: true }
          return { ok: false, msg: '2x+3y−z=5 → d=5، لكن بصيغة +d=0 يصبح −5' }
        }}
      />

      {/* متوسط */}
      <ExerciseCard
        id="pl-mid1"
        title="تمرين 4 — معادلة من نقطة وناظم"
        difficulty="متوسط"
        question={<>نقطة <MathInline tex="P_0(1,0,2)" /> وناظم <MathInline tex="\\vec{n}=(1,2,3)" /> — اكتب معادلة المستوى (أدخل a,b,c,d حيث ax+by+cz+d=0)</>}
        hints={['a(x−1)+b(y−0)+c(z−2)=0 → 1(x−1)+2y+3(z−2)=0', 'x−1+2y+3z−6=0 → x+2y+3z−7=0', 'd=−7']}
        solution={<> <MathInline tex="x+2y+3z-7=0" /> — (1,2,3,−7)</>}
        placeholder="مثال: 1,2,3,-7"
        check={(ans) => {
          const n = ans.replace(/[()]/g, '').split(',').map(Number)
          return n[0] === 1 && n[1] === 2 && n[2] === 3 && n[3] === -7 ? { ok: true } : { ok: false, msg: '1(x−1)+2y+3(z−2)=0 → x+2y+3z−7=0' }
        }}
      />

      <ExerciseCard
        id="pl-mid2"
        title="تمرين 5 — مستوى من ثلاث نقاط"
        difficulty="متوسط"
        question={<><MathInline tex="A(0,0,0), B(1,0,0), C(0,1,0)" /> — ما معادلة المستوى؟</>}
        hints={['AB=(1,0,0), AC=(0,1,0) → n=AB×AC=(0,0,1)', 'المستوى z=0', '0x+0y+1z+0=0']}
        solution={<> <MathInline tex="z=0" /> — المستوي xy</>}
        placeholder="مثال: 0,0,1,0"
        check={(ans) => {
          const n = ans.replace(/[()]/g, '').split(',').map(Number)
          if (n[0] === 0 && n[1] === 0 && n[2] === 1 && n[3] === 0) return { ok: true }
          if (ans.includes('z=0') || ans.includes('z = 0')) return { ok: true }
          return { ok: false, msg: 'AB×AC=(0,0,1) → z=0' }
        }}
      />

      {/* بصري */}
      <div style={{ height: 300, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white' }}>
        <SceneShell>
          <CoordinateSystem3D />
          <Plane3D plane={{ a: 0, b: 0, c: 1, d: 0 }} color="#22c55e" />
          <Point3D position={[0, 0, 0]} label="A على المستوى" color="#22c55e" showProjection={false} />
          <Point3D position={[1, 1, 1]} label="B خارج" color="#ef4444" showProjection />
        </SceneShell>
      </div>

      <ExerciseCard
        id="pl-vis1"
        title="تمرين 6 — بصري: أي نقطة على المستوى؟"
        difficulty="متوسط"
        question={<>في المشهد أعلاه المستوى <MathInline tex="z=0" /> (أخضر) — أي نقطة تقع عليه؟ A أم B؟</>}
        hints={['z=0 يعني كل نقطة ارتفاعها صفر', 'A (0,0,0) z=0 → على المستوى', 'B (1,1,1) z=1 → خارج']}
        solution={<>A على المستوى، B خارج — عوض z.</>}
        placeholder="A أو B"
        check={(ans) => {
          const n = ans.toLowerCase()
          if (n.includes('a') && !n.includes('b')) return { ok: true }
          return { ok: false, msg: 'z=0 → النقطة التي z=0 هي A' }
        }}
      />

      {/* متعدد الخطوات */}
      <ExerciseCard
        id="pl-multi"
        title="تمرين 7 — متعدد الخطوات"
        difficulty="متقدم"
        question={
          <>
            <MathInline tex="A(1,0,0), B(0,1,0), C(0,0,1)" /> — احسب <MathInline tex="AB" /> ثم <MathInline tex="AC" /> ثم <MathInline tex="n=AB\\times AC" /> ثم اكتب معادلة المستوى بصيغة ax+by+cz+d=0 (أدخل a,b,c,d)
          </>
        }
        hints={['AB=(−1,1,0), AC=(−1,0,1)', 'n = (1,1,1) (بعد الحساب)', 'باستخدام A: 1(x−1)+1·y+1·z=0 → x+y+z−1=0 → (1,1,1,−1)']}
        solution={<> <MathInline tex="AB=(-1,1,0), AC=(-1,0,1), n=(1,1,1),\; x+y+z-1=0" /></>}
        placeholder="مثال: 1,1,1,-1"
        check={(ans) => {
          const n = ans.replace(/[()]/g, '').split(',').map(Number)
          return n[0] === 1 && n[1] === 1 && n[2] === 1 && n[3] === -1 ? { ok: true } : { ok: false, msg: 'n=(1,1,1) → x+y+z-1=0' }
        }}
      />

      {/* خطأ شائع */}
      <ExerciseCard
        id="pl-err"
        title="تمرين 8 — اكتشاف الخطأ"
        difficulty="متقدم"
        question={
          <>
            طالب كتب لمستوى يمر بـ <MathInline tex="P_0(1,2,3)" /> وناظم <MathInline tex="(2,0,0)" /> المعادلة <MathInline tex="2x+3y+4z=7" /> — أين الخطأ؟
            <br />
            <span style={{ fontSize: 12, color: '#64748b' }}>أجب: الناظم / النقطة / الحساب</span>
          </>
        }
        hints={['الناظم (2,0,0) يعني المعادلة يجب أن تكون 2x + d =0 فقط', '2(x−1)=0 → 2x−2=0 → 2x=2', 'وجود 3y+4z خطأ — لا علاقة له بالناظم']}
        solution={<>الخطأ في المعادلة: بما أن الناظم (2,0,0) يملك b=c=0، المعادلة الصحيحة 2x=2، لا 2x+3y+4z=7.</>}
        placeholder="مثال: الناظم"
        check={(ans) => {
          const n = ans.toLowerCase()
          if (n.includes('ناظم') || n.includes('b') || n.includes('c')) return { ok: true }
          return { ok: false, msg: 'الناظم (2,0,0) → b=c=0 → لا 3y+4z' }
        }}
      />

      <ExerciseCard
        id="pl-intercept"
        title="تمرين 9 — صيغة المقطوعات"
        difficulty="متوسط"
        question={<>المستوى <MathInline tex="x/2 + y/3 + z/4 =1" /> — ما مقطوعاته مع المحاور؟ (أدخل a,b,c)</>}
        hints={['a=2, b=3, c=4 مباشرة', 'تقاطع مع x عند (2,0,0)']}
        solution={<> <MathInline tex="a=2,\;b=3,\;c=4" /></>}
        placeholder="مثال: 2,3,4"
        check={(ans) => {
          const n = ans.replace(/[()]/g, '').split(',').map(Number)
          return n[0] === 2 && n[1] === 3 && n[2] === 4 ? { ok: true } : { ok: false, msg: 'a=2,b=3,c=4' }
        }}
      />
    </div>
  )
}
