import { useState } from 'react'
import ExerciseCard from './ExerciseCard'
import SceneShell from '../three/SceneShell'
import CoordinateSystem3D from '../three/CoordinateSystem3D'
import PointLineProjection3D from '../three/PointLineProjection3D'
import PointPlaneProjection3D from '../three/PointPlaneProjection3D'
import { MathInline } from '../components/math/MathBlock'


export default function DistancesExercises() {
  const [visualMode, setVisualMode] = useState<'line' | 'plane'>('line')

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {/* مبتدئ */}
      <ExerciseCard id="d-m1" title="تمرين 1 — المسافة بين نقطتين" difficulty="مبتدئ" question={<><MathInline tex="A(0|0|0), B(1|2|2)" /> — أوجد المسافة</>} hints={['AB=(1,2,2)', '|AB|=√(1+4+4)=√9=3', 'فيثاغورس 3D']} solution={<><MathInline tex="3" /></>} placeholder="3" check={a => Number(a) === 3 ? { ok: true } : { ok: false, msg: '√(1+4+4)=3' }} />
      <ExerciseCard id="d-m2" title="تمرين 2 — طول شعاع" difficulty="مبتدئ" question={<><MathInline tex="u=(2|3|6)" /> — طوله؟</>} hints={['|u|=√(4+9+36)', '√49=7']} solution={<><MathInline tex="7" /></>} placeholder="7" check={a => Number(a) === 7 ? { ok: true } : { ok: false, msg: '√49=7' }} />
      <ExerciseCard id="d-m3" title="تمرين 3 — |u|²" difficulty="مبتدئ" question={<><MathInline tex="u=(1|2|2)" /> — احسب <MathInline tex="|u|^2" /></>} hints={['|u|²=u·u', '1+4+4=9']} solution={<><MathInline tex="9" /></>} placeholder="9" check={a => Number(a) === 9 ? { ok: true } : { ok: false, msg: '1+4+4=9' }} />
      <ExerciseCard id="d-m4" title="تمرين 4 — t للمسقط" difficulty="مبتدئ" question={<><MathInline tex="g: X=(0|0|0)+t(1|0|0), A(2|3|0)" /> — أوجد t للمسقط</>} hints={['t=((A-P)·u)/|u|²', '(2,3,0)·(1,0,0)=2, |u|²=1 → t=2']} solution={<><MathInline tex="t=2" /></>} placeholder="2" check={a => Number(a) === 2 ? { ok: true } : { ok: false, msg: 't=2' }} />

      {/* متوسط */}
      <ExerciseCard id="d-mid5" title="تمرين 5 — قدم المسقط H" difficulty="متوسط" question={<>نفس السابق — أوجد H</>} hints={['H=P+t·u', '(0,0,0)+2·(1,0,0)=(2,0,0)']} solution={<><MathInline tex="(2,0,0)" /></>} placeholder="2,0,0" check={a => a.replace(/[()]/g,'').trim()==='2,0,0' ? { ok: true } : { ok: false, msg: '(2,0,0)' }} />
      <ExerciseCard id="d-mid6" title="تمرين 6 — المسافة نقطة-مستقيم" difficulty="متوسط" question={<>السابق — المسافة d(A,g)</>} hints={['d=|A-H|', 'A(2,3,0) H(2,0,0) → (0,3,0) طوله 3']} solution={<><MathInline tex="3" /></>} placeholder="3" check={a => Number(a)===3 ? { ok: true } : { ok: false, msg: '3' }} />
      <ExerciseCard id="d-mid7" title="تمرين 7 — هل H على المستقيم؟" difficulty="متوسط" question={<><MathInline tex="g: X=(0|0|0)+t(1|0|0), H(2|0|0)" /> — هل H∈g؟</>} hints={['2=0+t·1 → t=2 موجود → نعم']} solution={<>نعم</>} placeholder="نعم/لا" check={a => a.includes('نعم') ? { ok: true } : { ok: false, msg: 'نعم' }} />
      <ExerciseCard id="d-mid8" title="تمرين 8 — التعامد" difficulty="متوسط" question={<><MathInline tex="A(2|3|0), H(2|0|0), u=(1|0|0)" /> — هل (A−H)·u=0؟</>} hints={['A−H=(0,3,0)', '(0,3,0)·(1,0,0)=0 → نعم']} solution={<>نعم متعامد</>} placeholder="نعم" check={a => a.includes('نعم') ? { ok: true } : { ok: false, msg: '0 → متعامد' }} />
      <ExerciseCard id="d-mid9" title="تمرين 9 — مسافة نقطة-مستوى" difficulty="متوسط" question={<><MathInline tex="E: z=0, A(0|0|5)" /> — المسافة؟</>} hints={['|5|/1=5', 'd=|ax0+by0+cz0+d|/√...']} solution={<><MathInline tex="5" /></>} placeholder="5" check={a => Number(a)===5 ? { ok: true } : { ok: false, msg: '5' }} />
      <ExerciseCard id="d-mid10" title="تمرين 10 — مسقط على مستوى" difficulty="متوسط" question={<><MathInline tex="E: z=0, A(1|2|5)" /> — أوجد H</>} hints={['H=(1,2,0)', 'إسقاط z']} solution={<><MathInline tex="(1,2,0)" /></>} placeholder="1,2,0" check={a => a.replace(/[()]/g,'').trim()==='1,2,0' ? { ok: true } : { ok: false, msg: '(1,2,0)' }} />

      {/* متقدم */}
      <ExerciseCard id="d-adv11" title="تمرين 11 — متعدد الخطوات (خط)" difficulty="متقدم" question={<><MathInline tex="A(1|2|3), g: X=(0|0|0)+t(1|1|0)" /> — أوجد H ثم d</>} hints={['t=((A-P)·u)/|u|² = (1+2)/2=1.5', 'H=(1.5,1.5,0)', 'd=√((−0.5)²+0.5²+3²)≈3.08']} solution={<><MathInline tex="H(1.5,1.5,0), d≈3.08" /></>} placeholder="1.5,1.5,0" check={a => a.includes('1.5') ? { ok: true } : { ok: false, msg: 'H(1.5,1.5,0)' }} />
      <ExerciseCard id="d-adv12" title="تمرين 12 — متعدد الخطوات (مستوى)" difficulty="متقدم" question={<><MathInline tex="A(1|1|1), E: x+y+z=3" /> — أوجد H</>} hints={['n=(1,1,1), n·A=3, d=3 → λ=0 → H=A', 'A على المستوى']} solution={<><MathInline tex="(1,1,1)" /></>} placeholder="1,1,1" check={a => a.replace(/[()]/g,'').trim()==='1,1,1' ? { ok: true } : { ok: false, msg: '(1,1,1) — على المستوى' }} />
      <ExerciseCard id="d-adv13" title="تمرين 13 — عكسي" difficulty="متقدم" question={<><MathInline tex="H(2|0|0) هو مسقط A على g: X=(0|0|0)+t(1|0|0) و d=3" /> — أوجد A إذا كانت A=(2|a|0)</>} hints={['AH ⟂ g → AH=(0,a,0) عمودي → a=±3', 'a=3']} solution={<><MathInline tex="(2,3,0)" /></>} placeholder="2,3,0" check={a => a.replace(/[()]/g,'').trim()==='2,3,0' ? { ok: true } : { ok: false, msg: '(2,3,0)' }} />
      <ExerciseCard id="d-adv14" title="تمرين 14 — اكتشاف خطأ (إشارة)" difficulty="متقدم" question={<>طالب كتب <MathInline tex="t=((P-A)·u)/|u|²" /> بدل <MathInline tex="((A-P)·u)/|u|²" /> — ما أثر الخطأ؟</>} hints={['P−A = −(A−P)', 't يصبح سالب ما يجب أن يكون موجب — H في الجهة المعاكسة']} solution={<>الإشارة معكوسة — H خاطئ</>} placeholder="الإشارة" check={a => a.includes('إشارة') || a.includes('سالب') ? { ok: true } : { ok: false, msg: 'الإشارة معكوسة' }} />
      <ExerciseCard id="d-adv15" title="تمرين 15 — هندسي 3D" difficulty="متقدم" question={<><MathInline tex="مكعب A(0|0|0)-G(2|2|2)" /> — مسافة G عن المستوى z=0؟</>} hints={['G(2,2,2) z=2 → d=2']} solution={<><MathInline tex="2" /></>} placeholder="2" check={a => Number(a)===2 ? { ok: true } : { ok: false, msg: '2' }} />

      {/* بصري */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: 12 }}>
        <div style={{ fontWeight: 800, marginBottom: 8 }}>تمرين 16 — بصري تفاعلي</div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          <button onClick={() => setVisualMode('line')} style={{ padding: '6px 12px', borderRadius: 999, border: '1px solid', borderColor: visualMode === 'line' ? '#0f172a' : '#e2e8f0', background: visualMode === 'line' ? '#0f172a' : 'white', color: visualMode === 'line' ? 'white' : '#334155', fontSize: 12, cursor: 'pointer' }}>نقطة-مستقيم</button>
          <button onClick={() => setVisualMode('plane')} style={{ padding: '6px 12px', borderRadius: 999, border: '1px solid', borderColor: visualMode === 'plane' ? '#0f172a' : '#e2e8f0', background: visualMode === 'plane' ? '#0f172a' : 'white', color: visualMode === 'plane' ? 'white' : '#334155', fontSize: 12, cursor: 'pointer' }}>نقطة-مستوى</button>
        </div>
        <div style={{ height: 340, borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: 8 }}>
          <SceneShell>
            <CoordinateSystem3D />
            {visualMode === 'line' ? <PointLineProjection3D A={{ x: 2, y: 2, z: 1 }} line={{ point: { x: 0, y: 0, z: 0 }, direction: { x: 2, y: 0, z: 0 } }} /> : <PointPlaneProjection3D A={{ x: 1, y: 1, z: 2 }} plane={{ a: 0, b: 0, c: 1, d: 0 }} />}
          </SceneShell>
        </div>
        <div style={{ fontSize: 12, color: '#475569' }}>{visualMode === 'line' ? 'حرّك الكاميرا — AH عمودي على المستقيم' : 'AH موازٍ للناظم'}</div>
        <ExerciseCard id="d-vis" title="تمرين 16 — بصري" difficulty="متقدم" question={<>في المشهد أعلاه — هل AH عمودي على المستقيم/المستوى؟</>} hints={['نعم — هذا تعريف المسقط', 'AH·u=0 أو AH∥n']} solution={<>نعم</>} placeholder="نعم" check={a => a.includes('نعم') ? { ok: true } : { ok: false, msg: 'نعم — مسقط قائم' }} />
      </div>

      {/* أخطاء شائعة */}
      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#92400e', marginBottom: 6 }}>أخطاء شائعة — انتبه</div>
        <ul style={{ margin: 0, paddingInlineStart: 18, fontSize: 12.5, lineHeight: 1.8, color: '#92400e' }}>
          <li>نسيان <MathInline tex="|u|^2" /> في المقام</li>
          <li>الخلط بين <MathInline tex="A-P" /> و <MathInline tex="P-A" /></li>
          <li>الخلط بين H و d</li>
          <li>شعاع صفري — لا خط/مستوى</li>
          <li>نسيان | | في مسافة المستوى</li>
        </ul>
      </div>
    </div>
  )
}
