import ExerciseCard from './ExerciseCard'
import { MathInline } from '../components/math/MathBlock'
import { buildSectionPolygon, cuboidVertices, cuboidEdges } from '../math/sections'
import type { Plane } from '../math/types'

function checkNum(ans: string, exp: number, eps = 0.05): boolean { const n = Number(ans.replace(',', '.')); return !isNaN(n) && Math.abs(n - exp) < eps }
function checkPoint(ans: string, exp: [number, number, number], eps = 0.06): boolean {
  const nums = ans.replace(/[()|]/g, ' ').replace(/,/g, ' ').trim().split(/\s+/).map(Number).filter(n => !isNaN(n))
  if (nums.length < 3) return false
  return Math.abs(nums[0] - exp[0]) < eps && Math.abs(nums[1] - exp[1]) < eps && Math.abs(nums[2] - exp[2]) < eps
}

export default function SectionsExercises() {
  void buildSectionPolygon(cuboidVertices(2, 2, 2), cuboidEdges(), { a: 0, b: 0, c: 1, d: -1 } as Plane)

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <ExerciseCard id="sec-1" title="تمرين 1 — معنى المقطع" difficulty="مبتدئ" question={<>مقطع مجسم بمستوى هو؟</>} hints={['تقاطع المجسم مع المستوى', 'نقاط المجسم التي في المستوى', 'S∩E']} solution={<>تقاطع المجسم مع المستوى</>} placeholder="تقاطع" check={a => a.includes('تقاطع') ? { ok: true } : { ok: false, msg: 'تقاطع' }} />
      <ExerciseCard id="sec-2" title="تمرين 2 — تقاطع مع حرف" difficulty="مبتدئ" question={<><MathInline tex="A(0|0|0) B(2|0|0) E: x=1" /> — نقطة التقاطع؟</>} hints={['(1,0,0)', 't=0.5', 'منتصف']} solution={<><MathInline tex="(1,0,0)" /></>} placeholder="1,0,0" check={a => checkPoint(a, [1, 0, 0]) ? { ok: true } : { ok: false, msg: '(1,0,0)' }} />
      <ExerciseCard id="sec-3" title="تمرين 3 — حساب t" difficulty="مبتدئ" question={<><MathInline tex="A(0|0|0) B(2|0|0) E: x=1" /> — t؟</>} hints={['0.5', 'منتصف', '1/2']} solution={<>0.5</>} placeholder="0.5" check={a => checkNum(a, 0.5) ? { ok: true } : { ok: false, msg: '0.5' }} />
      <ExerciseCard id="sec-4" title="تمرين 4 — موازية" difficulty="متوسط" question={<><MathInline tex="A(0|0|0) B(2|0|0) E: y=1" /> — هل تقاطع؟</>} hints={['لا — القطعة موازية للمستوى', 'المقام صفر', 'لا']} solution={<>لا</>} placeholder="لا" check={a => a.includes('لا') ? { ok: true } : { ok: false, msg: 'لا' }} />
      <ExerciseCard id="sec-5" title="تمرين 5 — عدد رؤوس مقطع مكعب" difficulty="متوسط" question={<><MathInline tex="مكعب 2×2×2 E: z=1" /> — عدد رؤوس المقطع؟</>} hints={['4', 'رباعي', 'مستوى موازي للقاعدة']} solution={<>4</>} placeholder="4" check={a => checkNum(a, 4) ? { ok: true } : { ok: false, msg: '4' }} />
      <ExerciseCard id="sec-6" title="تمرين 6 — مثلث" difficulty="متوسط" question={<><MathInline tex="مكعب E يمر بثلاث رؤوس متجاورة" /> — نوع المقطع؟</>} hints={['مثلث', '3 نقاط تقاطع', 'triangle']} solution={<>مثلث</>} placeholder="مثلث" check={a => a.includes('مثلث') ? { ok: true } : { ok: false, msg: 'مثلث' }} />
      <ExerciseCard id="sec-7" title="تمرين 7 — رباعي" difficulty="متوسط" question={<><MathInline tex="مكعب E: x+y=2" /> — نوع المقطع؟</>} hints={['رباعي', '4 نقاط', 'quadrilateral']} solution={<>رباعي</>} placeholder="رباعي" check={a => a.includes('رباعي') ? { ok: true } : { ok: false, msg: 'رباعي' }} />
      <ExerciseCard id="sec-8" title="تمرين 8 — موازٍ لوجه" difficulty="متوسط" question={<><MathInline tex="E: z=1 موازٍ لـ z=0" /> — المقطع موازٍ للوجه؟</>} hints={['نعم', 'متوازيان', 'parallel']} solution={<>نعم</>} placeholder="نعم" check={a => a.includes('نعم') ? { ok: true } : { ok: false, msg: 'نعم' }} />
      <ExerciseCard id="sec-9" title="تمرين 9 — مقطع رباعي وجوه مثلث" difficulty="متوسط" question={<><MathInline tex="رباعي A(0|0|0) B(2|0|0) C(0|2|0) D(0|0|2) E: x+y+z=1" /> — النوع؟</>} hints={['مثلث', 'يقطع 3 أحرف', 'triangle']} solution={<>مثلث</>} placeholder="مثلث" check={a => a.includes('مثلث') ? { ok: true } : { ok: false, msg: 'مثلث' }} />
      <ExerciseCard id="sec-10" title="تمرين 10 — رباعي أو مثلث؟" difficulty="متوسط" question={<><MathInline tex="نفس الرباعي E: x+y+z=0.5" /> — يقطع؟</>} hints={['مثلث صغير', '3 نقاط', 'مثلث']} solution={<>مثلث</>} placeholder="مثلث" check={a => a.includes('مثلث') ? { ok: true } : { ok: false, msg: 'مثلث' }} />
      <ExerciseCard id="sec-11" title="تمرين 11 — رباعي الوجوه رباعي" difficulty="متقدم" question={<><MathInline tex="رباعي E: x+y=1" /> — النوع؟</>} hints={['رباعي', '4 نقاط', 'quadrilateral']} solution={<>رباعي</>} placeholder="رباعي" check={a => a.includes('رباعي') ? { ok: true } : { ok: false, msg: 'رباعي' }} />
      <ExerciseCard id="sec-12" title="تمرين 12 — مستوى لا يقطع" difficulty="متوسط" question={<><MathInline tex="مكعب 0≤x≤2 E: x=5" /> — النتيجة؟</>} hints={['لا يوجد مقطع', 'خارج المجسم', 'none']} solution={<>لا يوجد</>} placeholder="لا يوجد" check={a => a.includes('لا') ? { ok: true } : { ok: false, msg: 'لا يوجد' }} />
      <ExerciseCard id="sec-13" title="تمرين 13 — نسب على الحرف" difficulty="متوسط" question={<><MathInline tex="A(0|0|0) B(2|0|0) ت: x=1.5" /> — t؟</>} hints={['0.75', '1.5/2', '3/4']} solution={<>0.75</>} placeholder="0.75" check={a => checkNum(a, 0.75) ? { ok: true } : { ok: false, msg: '0.75' }} />
      <ExerciseCard id="sec-14" title="تمرين 14 — تطبيق M.A.M مع مقطع" difficulty="متقدم" question={<><MathInline tex="تقاطع E مع AB عند t=0.4" /> — مثله كمركز مثقل؟</>} hints={['(A,0.6)(B,0.4)', '1-t و t', '0.6,0.4']} solution={<><MathInline tex="(A,0.6)(B,0.4)" /></>} placeholder="0.6,0.4" check={a => a.includes('0.6') ? { ok: true } : { ok: false, msg: '(A,0.6)(B,0.4)' }} />
      <ExerciseCard id="sec-15" title="تمرين 15 — شامل" difficulty="متقدم" question={<><MathInline tex="مكعب 2×2×2 E: x+y+z=2" /> — هل المقطع مثلث؟</>} hints={['مثلث', '3 نقاط', 'نعم']} solution={<>مثلث</>} placeholder="مثلث" check={a => a.includes('مثلث') ? { ok: true } : { ok: false, msg: 'مثلث' }} />
      {/* تكاملية 3 */}
      <ExerciseCard id="sec-16" title="تمرين 16 — تكاملي 1" difficulty="متقدم" question={<><MathInline tex="M على AB بـ t=0.3 ثم M∈E؟" /> — كيف تمثل M مثقلاً؟</>} hints={['(A,0.7)(B,0.3)', 'M=bar', '0.7,0.3']} solution={<><MathInline tex="(A,0.7)(B,0.3)" /></>} placeholder="0.7,0.3" check={a => a.includes('0.7') ? { ok: true } : { ok: false, msg: '(A,0.7)(B,0.3)' }} />
      <ExerciseCard id="sec-17" title="تمرين 17 — تكاملي 2" difficulty="متقدم" question={<><MathInline tex="E: x=1 يقطع AB(0|0|0)-(2|0|0) — t ووزنان؟" /></>} hints={['t=0.5 → 0.5,0.5', 'منتصف', '1,1']} solution={<>0.5 → (A,1)(B,1)</>} placeholder="0.5" check={a => a.includes('0.5') || a.includes('1') ? { ok: true } : { ok: false, msg: '0.5' }} />
      <ExerciseCard id="sec-18" title="تمرين 18 — تكاملي 3" difficulty="متقدم" question={<><MathInline tex="N على CD في مكعب بـ t=0.6" /> — إحداثيات N إذا C(2|2|0) D(0|2|0)؟</>} hints={['C+(0.6)(D-C)=(0.8,2,0)', '0.8,2,0', 'احسب']} solution={<><MathInline tex="(0.8,2,0)" /></>} placeholder="0.8,2,0" check={a => checkPoint(a, [0.8, 2, 0]) ? { ok: true } : { ok: false, msg: '(0.8,2,0)' }} />
    </div>
  )
}
