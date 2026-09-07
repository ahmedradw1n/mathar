import { useState } from 'react'
import ExerciseCard from './ExerciseCard'
import SceneShell from '../three/SceneShell'
import CoordinateSystem3D from '../three/CoordinateSystem3D'
import LineRelation3D from '../three/LineRelation3D'
import { MathInline } from '../components/math/MathBlock'
import type { Line3 } from '../math/types'

function makeLine(P: [number, number, number], u: [number, number, number]): Line3 {
  return { point: { x: P[0], y: P[1], z: P[2] }, direction: { x: u[0], y: u[1], z: u[2] } }
}

export default function RelationsExercises() {
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {/* Line-Line */}
      <ExerciseCard id="rl-1" title="تمرين 1 — هل متوازيان؟" difficulty="مبتدئ" question={<><MathInline tex="g: X=(0|0|0)+t(2|0|0),\; h: X=(0|1|0)+t(4|0|0)" /> — هل متوازيان؟</>} hints={['u=(2,0,0), v=(4,0,0)', 'v=2u → متوازيان', 'u×v=0']} solution={<><MathInline tex="نعم متوازيان" /></>} placeholder="نعم/لا" check={a => a.includes('نعم') ? { ok: true } : { ok: false, msg: 'v=2u → متوازيان' }} />
      <ExerciseCard id="rl-2" title="تمرين 2 — هل متطابقان؟" difficulty="مبتدئ" question={<><MathInline tex="g: X=(0|0|0)+t(1|0|0),\; h: X=(1|0|0)+t(2|0|0)" /> — متطابقان أم متوازيان مختلفان؟</>} hints={['u∥v', 'هل Q=(1,0,0) على g؟ نعم → متطابقان', 'لو Q=(0,1,0) → متوازيان مختلفان']} solution={<>متطابقان</>} placeholder="متطابقان/متوازيان" check={a => a.includes('متطابق') ? { ok: true } : { ok: false, msg: 'Q على g → متطابقان' }} />
      <ExerciseCard id="rl-3" title="تمرين 3 — نقطة التقاطع" difficulty="متوسط" question={<><MathInline tex="g: (0|0|0)+t(1|0|0),\; h: (0|0|0)+s(0|1|0)" /> أين التقاطع؟</>} hints={['P=(0,0,0) مشتركة', 't=0,s=0 → (0,0,0)']} solution={<><MathInline tex="(0,0,0)" /></>} placeholder="0,0,0" check={a => a.replace(/[()]/g,'').trim()==='0,0,0' ? { ok: true } : { ok: false, msg: '(0,0,0)' }} />
      <ExerciseCard id="rl-4" title="تمرين 4 — تصنيف" difficulty="متوسط" question={<><MathInline tex="g: (0|0|0)+t(1|0|0),\; h: (0|1|1)+t(0|1|0)" /> — صنف: متوازيان/متقاطعان/متخالفان/متطابقان</>} hints={['u=(1,0,0), v=(0,1,0) غير متوازيين', 'هل يوجد حل؟ لا → متخالفان']} solution={<>متخالفان</>} placeholder="متخالفان" check={a => a.includes('متخالف') ? { ok: true } : { ok: false, msg: 'متخالفان — لا تقاطع ولا توازٍ' }} />
      <ExerciseCard id="rl-5" title="تمرين 5 — متخالفان" difficulty="متوسط" question={<>لماذا قد لا يتقاطع مستقيمان غير متوازيين في الفضاء؟</>} hints={['في المستوى: غير متوازيين → يتقاطعان', 'في الفضاء: قد يكونان متخالفين', 'مثال: محور x ومستقيم y=1,z=1']} solution={<>لأنهما متخالفان</>} placeholder="متخالفان" check={a => a.includes('متخالف') ? { ok: true } : { ok: false, msg: 'متخالفان' }} />

      {/* Line-Plane */}
      <ExerciseCard id="rl-6" title="تمرين 6 — n·u" difficulty="مبتدئ" question={<><MathInline tex="E: z=0 (n=(0,0,1)),\; g: X=(0|0|1)+t(0|0|-1)" /> احسب <MathInline tex="n\\cdot u" /></>} hints={['(0,0,1)·(0,0,−1)=−1','≠0 → يقطع']} solution={<><MathInline tex="-1" /></>} placeholder="-1" check={a => Number(a)===-1 ? { ok: true } : { ok: false, msg: '−1' }} />
      <ExerciseCard id="rl-7" title="تمرين 7 — تصنيف خط-مستوى" difficulty="متوسط" question={<><MathInline tex="E: z=0,\; g: X=(0|0|1)+t(1|0|0)" /> — متقاطع/موازٍ/واقع؟</>} hints={['n·u=0','P=(0,0,1) z=1≠0 → موازٍ']} solution={<>موازٍ</>} placeholder="موازٍ" check={a => a.includes('مواز') ? { ok: true } : { ok: false, msg: 'موازٍ' }} />
      <ExerciseCard id="rl-8" title="تمرين 8 — t التقاطع" difficulty="متوسط" question={<><MathInline tex="E: z=0,\; g: X=(0|0|2)+t(0|0|-1)" /> أوجد t</>} hints={['z=2−t=0 → t=2','n·P + t n·u =0']} solution={<><MathInline tex="t=2" /></>} placeholder="2" check={a => Number(a)===2 ? { ok: true } : { ok: false, msg: 't=2' }} />
      <ExerciseCard id="rl-9" title="تمرين 9 — نقطة التقاطع" difficulty="متوسط" question={<>نفس السابق — نقطة التقاطع؟</>} hints={['t=2 → (0,0,0)','X=P+2u']} solution={<><MathInline tex="(0,0,0)" /></>} placeholder="0,0,0" check={a => a.replace(/[()]/g,'').trim()==='0,0,0' ? { ok: true } : { ok: false, msg: '(0,0,0)' }} />

      {/* Plane-Plane */}
      <ExerciseCard id="rl-10" title="تمرين 10 — هل متوازيان؟" difficulty="مبتدئ" question={<><MathInline tex="E1: x=0,\; E2: x=2" /> — متوازيان؟</>} hints={['n1=(1,0,0), n2=(1,0,0) متوازيان','d مختلف → متوازيان مختلفان']} solution={<>نعم متوازيان</>} placeholder="نعم" check={a => a.includes('نعم') ? { ok: true } : { ok: false, msg: 'متوازيان' }} />
      <ExerciseCard id="rl-11" title="تمرين 11 — هل متطابقان؟" difficulty="متوسط" question={<><MathInline tex="E1: x+y=1,\; E2: 2x+2y=2" /> — متطابقان؟</>} hints={['2·(x+y)=2 → نفس المستوى','متطابقان']} solution={<>متطابقان</>} placeholder="متطابقان" check={a => a.includes('متطابق') ? { ok: true } : { ok: false, msg: 'متطابقان' }} />
      <ExerciseCard id="rl-12" title="تمرين 12 — اتجاه التقاطع" difficulty="متوسط" question={<><MathInline tex="E1: x=0 (n1=(1,0,0)), E2: y=0 (n2=(0,1,0))" /> — اتجاه خط التقاطع؟</>} hints={['u=n1×n2=(0,0,1)','محور z']} solution={<><MathInline tex="(0,0,1)" /></>} placeholder="0,0,1" check={a => a.replace(/[()]/g,'').trim()==='0,0,1' ? { ok: true } : { ok: false, msg: '(0,0,1)' }} />
      <ExerciseCard id="rl-13" title="تمرين 13 — نقطة على التقاطع" difficulty="متوسط" question={<><MathInline tex="E1: x=0, E2: y=0" /> — نقطة على التقاطع؟</>} hints={['x=0,y=0, z حر → (0,0,0)','أي z']} solution={<><MathInline tex="(0,0,0)" /></>} placeholder="0,0,0" check={a => a.includes('0,0,0') ? { ok: true } : { ok: false, msg: '(0,0,0)' }} />

      {/* متعدد الخطوات */}
      <ExerciseCard id="rl-14" title="تمرين 14 — متعدد الخطوات" difficulty="متقدم" question={<><MathInline tex="E1: x+y+z=1, E2: x−y=0" /> أوجد n1×n2 ثم معادلة خط التقاطع (اتجاه فقط)</>} hints={['n1=(1,1,1), n2=(1,−1,0)','u=(1,1,−2)']} solution={<><MathInline tex="(1,1,-2)" /></>} placeholder="1,1,-2" check={a => a.replace(/[()]/g,'').trim()==='1,1,-2' ? { ok: true } : { ok: false, msg: '(1,1,−2)' }} />

      {/* خطأ شائع */}
      <ExerciseCard id="rl-15" title="تمرين 15 — خطأ شائع" difficulty="متقدم" question={<>طالب قال: “مستقيمان غير متوازيين إذن متقاطعان” — هل هذا صحيح في الفضاء؟</>} hints={['في الفضاء قد يكونان متخالفين','خطأ']} solution={<>خطأ — قد يكونان متخالفين</>} placeholder="خطأ/صح" check={a => a.includes('خطأ') || a.includes('متخالف') ? { ok: true } : { ok: false, msg: 'خطأ — متخالفان' }} />

      {/* بصري */}
      <VisualExercise />
    </div>
  )
}

function VisualExercise() {
  const [ans, setAns] = useState('')
  const [ok, setOk] = useState<boolean | null>(null)
  // مثال: زوج متخالف
  const l1 = makeLine([0, 0, 0], [2, 0, 0])
  const l2 = makeLine([0, 1, 1], [0, 2, 0])
  return (
    <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>تمرين 16 — بصري: صنف الزوج</div>
      <div style={{ height: 300, borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: 8 }}>
        <SceneShell>
          <CoordinateSystem3D />
          <LineRelation3D l1={l1} l2={l2} />
        </SceneShell>
      </div>
      <div style={{ fontSize: 13, marginBottom: 6 }}><MathInline tex="g: (0|0|0)+t(2|0|0),\; h: (0|1|1)+s(0|2|0)" /> — ما التصنيف؟</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {['متطابقان', 'متوازيان', 'متقاطعان', 'متخالفان'].map(o => (
          <button key={o} onClick={() => { setAns(o); setOk(o === 'متخالفان') }} style={{ padding: '6px 12px', borderRadius: 999, border: '1px solid', borderColor: ans === o ? '#0f172a' : '#e2e8f0', background: ans === o ? '#0f172a' : 'white', color: ans === o ? 'white' : '#334155', cursor: 'pointer', fontSize: 12 }}>{o}</button>
        ))}
      </div>
      {ok !== null && <div style={{ marginTop: 8, padding: 8, borderRadius: 10, background: ok ? '#f0fdf4' : '#fef2f2', border: `1px solid ${ok ? '#bbf7d0' : '#fecaca'}`, fontSize: 13, color: ok ? '#166534' : '#991b1b' }}>{ok ? '✅ أحسنت — متخالفان (u×v ≠0 ولا يوجد تقاطع)' : '❌ حاول — u=(2,0,0) v=(0,2,0) غير متوازيين لكن لا حل لنظام — متخالفان'}</div>}
      {ok === false && <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>تلميح: تحقق هل يوجد حل لـ P+t·u=Q+s·v — هنا لا.</div>}
    </div>
  )
}
