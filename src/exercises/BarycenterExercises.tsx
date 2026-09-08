import ExerciseCard from './ExerciseCard'
import { MathInline } from '../components/math/MathBlock'

function checkNum(ans: string, expected: number, eps = 0.02): boolean {
  const normalized = ans.replace(/[()]/g, ' ').replace(/,/g, ' ')
  const nums = normalized.trim().split(/\s+/).map(Number).filter(n => !isNaN(n))
  if (nums.length === 1) return Math.abs(nums[0] - expected) < eps
  return false
}
function checkPoint(ans: string, exp: [number, number, number], eps = 0.05): boolean {
  const nums = ans.replace(/[()|]/g, ' ').replace(/,/g, ' ').trim().split(/\s+/).map(Number).filter(n => !isNaN(n))
  if (nums.length < 3) return false
  return Math.abs(nums[0] - exp[0]) < eps && Math.abs(nums[1] - exp[1]) < eps && Math.abs(nums[2] - exp[2]) < eps
}

export default function BarycenterExercises() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {/* أساسيات 5 */}
      <ExerciseCard id="bc-1" title="تمرين 1 — تعريف" difficulty="مبتدئ" question={<><MathInline tex="(A,\\alpha)" /> — ما عنصراها؟</>} hints={['نقطة + وزن', 'α عدد حقيقي', 'الوزن يحدد ثقل النقطة']} solution={<>نقطة A ووزن α</>} placeholder="نقطة ووزن" check={a => a.includes('وزن') || a.includes('نقطة') ? { ok: true } : { ok: false, msg: 'نقطة ووزن' }} />
      <ExerciseCard id="bc-2" title="تمرين 2 — معنى الوزن الصفري" difficulty="مبتدئ" question={<><MathInline tex="(B,0)" /> مع <MathInline tex="(A,1)" /> — هل B تؤثر؟</>} hints={['وزن صفر → لا تأثير', 'G=A', 'كأن B غير موجودة']} solution={<>لا تؤثر — G=A</>} placeholder="لا" check={a => a.includes('لا') ? { ok: true } : { ok: false, msg: 'لا تؤثر' }} />
      <ExerciseCard id="bc-3" title="تمرين 3 — شرط المجموع" difficulty="مبتدئ" question={<><MathInline tex="(A,2),(B,-2)" /> — هل يوجد M.A.M؟</>} hints={['Σ=0', 'الشرط Σ≠0', 'لا يوجد مركز']} solution={<>لا — المجموع صفر</>} placeholder="لا" check={a => a.includes('لا') || a.includes('صفر') ? { ok: true } : { ok: false, msg: 'لا — Σ=0' }} />
      <ExerciseCard id="bc-4" title="تمرين 4 — قراءة مركز" difficulty="مبتدئ" question={<><MathInline tex="A(0|0|0) B(2|0|0) (A,1)(B,1)" /> — G؟</>} hints={['منتصف', '(1,0,0)', 'متوسط']} solution={<><MathInline tex="(1,0,0)" /></>} placeholder="1,0,0" check={a => checkPoint(a, [1, 0, 0]) ? { ok: true } : { ok: false, msg: '(1,0,0)' }} />
      <ExerciseCard id="bc-5" title="تمرين 5 — حالة غير صالحة" difficulty="مبتدئ" question={<><MathInline tex="(A,3)(B,-3)" /> — صنفها</>} hints={['Σ=0 → غير صالح', 'invalid', 'لا يوجد مركز']} solution={<>غير صالح</>} placeholder="غير صالح" check={a => a.includes('غير') || a.includes('لا') ? { ok: true } : { ok: false, msg: 'غير صالح' }} />

      {/* نقطتان 5 */}
      <ExerciseCard id="bc-6" title="تمرين 6 — حساب G نقطتين" difficulty="مبتدئ" question={<><MathInline tex="A(0|0|0) B(3|0|0) (A,1)(B,2)" /> — G؟</>} hints={['AG=2/3 AB', '(2,0,0)', 'β/(α+β)=2/3']} solution={<><MathInline tex="(2,0,0)" /></>} placeholder="2,0,0" check={a => checkPoint(a, [2, 0, 0]) ? { ok: true } : { ok: false, msg: '(2,0,0)' }} />
      <ExerciseCard id="bc-7" title="تمرين 7 — AG" difficulty="متوسط" question={<><MathInline tex="A(0|0|0) B(4|0|0) α=1 β=3" /> — طول AG؟</>} hints={['AG=3/4·AB=3', '3', 'β/(α+β)·|AB|']} solution={<>3</>} placeholder="3" check={a => checkNum(a, 3) ? { ok: true } : { ok: false, msg: '3' }} />
      <ExerciseCard id="bc-8" title="تمرين 8 — موقع G (خارج)" difficulty="متوسط" question={<><MathInline tex="A(0|0|0) B(2|0|0) (A,3)(B,-1)" /> — داخل أم خارج؟</>} hints={['إشارتان مختلفتان → خارج', 'خارج القطعة', 'α+β=2 لكن خارج']} solution={<>خارج القطعة</>} placeholder="خارج" check={a => a.includes('خارج') ? { ok: true } : { ok: false, msg: 'خارج' }} />
      <ExerciseCard id="bc-9" title="تمرين 9 — وزن صفر" difficulty="متوسط" question={<><MathInline tex="A(1|2|3) B(5|6|7) (A,0)(B,5)" /> — G؟</>} hints={['G=B', '(5,6,7)', 'وزن A صفر']} solution={<><MathInline tex="(5,6,7)" /></>} placeholder="5,6,7" check={a => checkPoint(a, [5, 6, 7]) ? { ok: true } : { ok: false, msg: '(5,6,7)' }} />
      <ExerciseCard id="bc-10" title="تمرين 10 — تأثير تغيير الوزن" difficulty="متوسط" question={<>إذا ضاعفنا β، هل G يقترب من B؟</>} hints={['نعم', 'β أكبر → أقرب لـ B', 'نسبة β/(α+β) تزداد']} solution={<>نعم يقترب من B</>} placeholder="نعم" check={a => a.includes('نعم') ? { ok: true } : { ok: false, msg: 'نعم' }} />

      {/* ثلاث نقاط 4 */}
      <ExerciseCard id="bc-11" title="تمرين 11 — ثلاث نقاط متساوية" difficulty="متوسط" question={<><MathInline tex="A(0|0|0) B(3|0|0) C(0|3|0) α=β=γ=1" /> — G؟</>} hints={['(A+B+C)/3', '(1,1,0)', 'متوسط']} solution={<><MathInline tex="(1,1,0)" /></>} placeholder="1,1,0" check={a => checkPoint(a, [1, 1, 0]) ? { ok: true } : { ok: false, msg: '(1,1,0)' }} />
      <ExerciseCard id="bc-12" title="تمرين 12 — أوزان سالبة ثلاث نقاط" difficulty="متوسط" question={<><MathInline tex="A(0|0|0) B(2|0|0) C(0|2|0) α=1 β=1 γ=-1" /> — G؟</>} hints={['Σ=1', 'G=(2, -2,0)؟ احسب: (0+2+0)/1=2, (0+0-2)/1=-2', '(2,-2,0)']} solution={<><MathInline tex="(2,-2,0)" /></>} placeholder="2,-2,0" check={a => checkPoint(a, [2, -2, 0]) ? { ok: true } : { ok: false, msg: '(2,-2,0)' }} />
      <ExerciseCard id="bc-13" title="تمرين 13 — إحداثيات 3D" difficulty="متوسط" question={<><MathInline tex="A(1|0|2) B(3|1|0) C(2|2|1) α=2 β=1 γ=1" /> — xG؟</>} hints={['(2·1+1·3+1·2)/4=1.75', '1.75']} solution={<>1.75</>} placeholder="1.75" check={a => checkNum(a, 1.75) ? { ok: true } : { ok: false, msg: '1.75' }} />
      <ExerciseCard id="bc-14" title="تمرين 14 — مركز ثقل مثلث" difficulty="مبتدئ" question={<><MathInline tex="مثلث A(0|0|0) B(6|0|0) C(0|6|0)" /> — مركز ثقله؟</>} hints={['(2,2,0)', 'متوسط الرؤوس', 'AG=2/3 المتوسط']} solution={<><MathInline tex="(2,2,0)" /></>} placeholder="2,2,0" check={a => checkPoint(a, [2, 2, 0]) ? { ok: true } : { ok: false, msg: '(2,2,0)' }} />

      {/* تجميع 3 */}
      <ExerciseCard id="bc-15" title="تمرين 15 — تجميع نقطتين" difficulty="متوسط" question={<><MathInline tex="(A,1)(B,2)→(G1,3)" /> ثم <MathInline tex="(G1,3)(C,1)" /> — ما وزن G1؟</>} hints={['3', 'α+β', 'مجموع']} solution={<>3</>} placeholder="3" check={a => checkNum(a, 3) ? { ok: true } : { ok: false, msg: '3' }} />
      <ExerciseCard id="bc-16" title="تمرين 16 — تجميع ثلاث نقاط" difficulty="متوسط" question={<><MathInline tex="A(0|0|0) B(2|0|0) C(0|2|0) α=1 β=1 γ=2" /> — G النهائي؟</>} hints={['G1=(1,0,0) وزن2', 'G=(G1·2+C·2)/4=(0.5,1,0)', '(0.5,1,0)']} solution={<><MathInline tex="(0.5,1,0)" /></>} placeholder="0.5,1,0" check={a => checkPoint(a, [0.5, 1, 0]) ? { ok: true } : { ok: false, msg: '(0.5,1,0)' }} />
      <ExerciseCard id="bc-17" title="تمرين 17 — اختيار التجميع" difficulty="متقدم" question={<>أفضل تجميع لإثبات أن G على متوسط مثلث؟</>} hints={['جمع رأسي القاعدة', 'G1 منتصف BC', 'ثم مع A']} solution={<>منتصف BC ثم مع A</>} placeholder="منتصف BC" check={a => a.includes('BC') || a.includes('منتصف') ? { ok: true } : { ok: false, msg: 'منتصف BC' }} />

      {/* نسب 3 */}
      <ExerciseCard id="bc-18" title="تمرين 18 — استخراج t" difficulty="متوسط" question={<><MathInline tex="A(0|0|0) B(4|0|0) M(1|0|0)" /> — t حيث AM=tAB؟</>} hints={['0.25', '1/4', 'AM=1 AB=4']} solution={<>0.25</>} placeholder="0.25" check={a => checkNum(a, 0.25) ? { ok: true } : { ok: false, msg: '0.25' }} />
      <ExerciseCard id="bc-19" title="تمرين 19 — استخراج الأوزان من t" difficulty="متوسط" question={<><MathInline tex="t=0.3" /> — أوزان A وB؟</>} hints={['0.7 و 0.3', '1-t و t', '0.7,0.3']} solution={<><MathInline tex="(0.7,0.3)" /></>} placeholder="0.7,0.3" check={a => a.includes('0.7') && a.includes('0.3') ? { ok: true } : { ok: false, msg: '0.7,0.3' }} />
      <ExerciseCard id="bc-20" title="تمرين 20 — مسألة عكسية" difficulty="متوسط" question={<><MathInline tex="M=bar((A,2)(B,3))" /> — t؟</>} hints={['3/5=0.6', 'β/(α+β)', '0.6']} solution={<>0.6</>} placeholder="0.6" check={a => checkNum(a, 0.6) ? { ok: true } : { ok: false, msg: '0.6' }} />

      {/* هندسية 5 */}
      <ExerciseCard id="bc-21" title="تمرين 21 — رباعي وجوه منتصف" difficulty="متوسط" question={<><MathInline tex="M منتصف AB في رباعي" /> — مثله مثقلاً؟</>} hints={['(A,1)(B,1)', '1,1', 'منتصف']} solution={<><MathInline tex="(A,1)(B,1)" /></>} placeholder="1,1" check={a => a.includes('1') ? { ok: true } : { ok: false, msg: '(A,1)(B,1)' }} />
      <ExerciseCard id="bc-22" title="تمرين 22 — استقامة" difficulty="متقدم" question={<>كيف تثبت استقامة A,G,Gbcd في رباعي؟</>} hints={['تجميع B,C,D', 'G=bar(A,1)(Gbcd,3)', 'على استقامة واحدة']} solution={<>بتجميع B,C,D ثم مع A</>} placeholder="تجميع" check={a => a.includes('تجميع') || a.includes('Gbcd') ? { ok: true } : { ok: false, msg: 'تجميع' }} />
      <ExerciseCard id="bc-23" title="تمرين 23 — انتماء لمستوى" difficulty="متقدم" question={<>نقطة G ثلاث نقاط — هل تنتمي لمستوى ABC؟</>} hints={['نعم إذا Σ≠0', 'كل G داخل المستوى ABC إذا A,B,C فيه', 'نعم']} solution={<>نعم</>} placeholder="نعم" check={a => a.includes('نعم') ? { ok: true } : { ok: false, msg: 'نعم' }} />
      <ExerciseCard id="bc-24" title="تمرين 24 — مكعب" difficulty="متوسط" question={<><MathInline tex="مكعب A(0|0|0) B(2|0|0) M على AB بـ t=0.5" /> — M؟</>} hints={['(1,0,0)', 'منتصف', '1,0,0']} solution={<><MathInline tex="(1,0,0)" /></>} placeholder="1,0,0" check={a => checkPoint(a, [1, 0, 0]) ? { ok: true } : { ok: false, msg: '(1,0,0)' }} />
      <ExerciseCard id="bc-25" title="تمرين 25 — مركز ثقل رباعي الوجوه" difficulty="متوسط" question={<><MathInline tex="A(0|0|0) B(2|0|0) C(0|2|0) D(0|0|2)" /> — G؟</>} hints={['(0.5,0.5,0.5)', '(A+B+C+D)/4', '0.5,0.5,0.5']} solution={<><MathInline tex="(0.5,0.5,0.5)" /></>} placeholder="0.5,0.5,0.5" check={a => checkPoint(a, [0.5, 0.5, 0.5]) ? { ok: true } : { ok: false, msg: '(0.5,0.5,0.5)' }} />
    </div>
  )
}
