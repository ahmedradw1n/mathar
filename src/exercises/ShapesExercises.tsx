import { useState } from 'react'
import ExerciseCard from './ExerciseCard'
import SceneShell from '../three/SceneShell'
import CoordinateSystem3D from '../three/CoordinateSystem3D'
import Cuboid3D from '../three/Cuboid3D'
import { MathInline } from '../components/math/MathBlock'

export default function ShapesExercises() {
  const [pick, setPick] = useState<string | null>(null)
  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {/* أساسيات */}
      <ExerciseCard id="sh-1" title="تمرين 1 — رؤوس" difficulty="مبتدئ" question={<>متوازي أبعاده <MathInline tex="a=2,b=3,c=1" /> — ما إحداثيات <MathInline tex="G" /> (الركن المقابل لـ A)؟</>} hints={['A(0,0,0) → G(2,3,1)']} solution={<><MathInline tex="(2,3,1)" /></>} placeholder="2,3,1" check={a=>a.replace(/[()]/g,'').trim()==='2,3,1'?{ok:true}:{ok:false,msg:'(2,3,1)'}} />
      <ExerciseCard id="sh-2" title="تمرين 2 — شعاع حافة" difficulty="مبتدئ" question={<><MathInline tex="A(0|0|0) B(2|0|0)" /> — أوجد <MathInline tex="AB" /></>} hints={['B−A=(2,0,0)']} solution={<><MathInline tex="(2,0,0)" /></>} placeholder="2,0,0" check={a=>a.replace(/[()]/g,'').trim()==='2,0,0'?{ok:true}:{ok:false,msg:'(2,0,0)'}} />
      <ExerciseCard id="sh-3" title="تمرين 3 — توازي" difficulty="مبتدئ" question={<><MathInline tex="AB=(2,0,0) DC=(2,0,0)" /> — متوازيان؟</>} hints={['نعم λ=1']} solution={<>نعم</>} placeholder="نعم" check={a=>a.includes('نعم')?{ok:true}:{ok:false,msg:'نعم'}} />
      <ExerciseCard id="sh-4" title="تمرين 4 — تعامد" difficulty="مبتدئ" question={<><MathInline tex="AB=(2,0,0) AD=(0,3,0)" /> — هل متعامدان؟</>} hints={['·=0 → نعم']} solution={<>نعم</>} placeholder="نعم" check={a=>a.includes('نعم')?{ok:true}:{ok:false,msg:'نعم'}} />
      <ExerciseCard id="sh-5" title="تمرين 5 — قطر" difficulty="مبتدئ" question={<><MathInline tex="a=2,b=2,c=2" /> — طول قطر فراغي؟</>} hints={['2√3≈3.46']} solution={<><MathInline tex="2\\sqrt3" /></>} placeholder="3.46" check={a=> Math.abs(Number(a)-3.464)<0.05 || a.includes('√3')?{ok:true}:{ok:false,msg:'2√3'}} />

      {/* مستويات */}
      <ExerciseCard id="sh-6" title="تمرين 6 — مستوى وجه" difficulty="متوسط" question={<><MathInline tex="A(0|0|0) B(2|0|0) C(2|1.5|0)" /> — ناظم الوجه؟</>} hints={['AB×AC=(0,0,3)']} solution={<><MathInline tex="(0,0,3)" /></>} placeholder="0,0,3" check={a=>a.replace(/[()]/g,'').trim()==='0,0,3'?{ok:true}:{ok:false,msg:'(0,0,3)'}} />
      <ExerciseCard id="sh-7" title="تمرين 7 — شعاع ناظم" difficulty="متوسط" question={<><MathInline tex="مستوى z=0" /> — ناظمه؟</>} hints={['(0,0,1)']} solution={<><MathInline tex="(0,0,1)" /></>} placeholder="0,0,1" check={a=>a.replace(/[()]/g,'').trim()==='0,0,1'?{ok:true}:{ok:false,msg:'(0,0,1)'}} />
      <ExerciseCard id="sh-8" title="تمرين 8 — نقطة على الوجه؟" difficulty="متوسط" question={<><MathInline tex="E: z=0, P(1|1|0)" /> — هل P∈E؟</>} hints={['z=0 نعم']} solution={<>نعم</>} placeholder="نعم" check={a=>a.includes('نعم')?{ok:true}:{ok:false,msg:'نعم'}} />
      <ExerciseCard id="sh-9" title="تمرين 9 — وسيطي" difficulty="متوسط" question={<><MathInline tex="P(0|0|0) u(1|0|0) v(0|1|0) r=0.5 s=0.5" /> — X؟</>} hints={['(0.5,0.5,0)']} solution={<><MathInline tex="(0.5,0.5,0)" /></>} placeholder="0.5,0.5,0" check={a=>a.includes('0.5')?{ok:true}:{ok:false,msg:'(0.5,0.5,0)'}} />
      <ExerciseCard id="sh-10" title="تمرين 10 — محوري" difficulty="متوسط" question={<><MathInline tex="A(0|0|0) B(2|0|0)" /> — مستوى محوري؟</>} hints={['x=1']} solution={<><MathInline tex="x=1" /></>} placeholder="x=1" check={a=>a.includes('1')?{ok:true}:{ok:false,msg:'x=1'}} />

      {/* مسافات */}
      <ExerciseCard id="sh-11" title="تمرين 11 — ارتفاع هرم" difficulty="متوسط" question={<><MathInline tex="قاعدة z=0, S(1|1|2)" /> — الارتفاع؟</>} hints={['2']} solution={<>2</>} placeholder="2" check={a=>Number(a)===2?{ok:true}:{ok:false,msg:'2'}} />
      <ExerciseCard id="sh-12" title="تمرين 12 — مسافة نقطة من وجه" difficulty="متوسط" question={<><MathInline tex="E: z=0, P(0|0|3)" /> — المسافة؟</>} hints={['3']} solution={<>3</>} placeholder="3" check={a=>Number(a)===3?{ok:true}:{ok:false,msg:'3'}} />
      <ExerciseCard id="sh-13" title="تمرين 13 — مسقط" difficulty="متوسط" question={<><MathInline tex="E: z=0, P(1|1|5)" /> — H؟</>} hints={['(1,1,0)']} solution={<><MathInline tex="(1,1,0)" /></>} placeholder="1,1,0" check={a=>a.replace(/[()]/g,'').trim()==='1,1,0'?{ok:true}:{ok:false,msg:'(1,1,0)'}} />
      <ExerciseCard id="sh-14" title="تمرين 14 — تحقق تعامد" difficulty="متوسط" question={<><MathInline tex="SH=(0|0|-5) n=(0|0|1)" /> — هل SH∥n؟</>} hints={['نعم — متوازيان']} solution={<>نعم</>} placeholder="نعم" check={a=>a.includes('نعم')?{ok:true}:{ok:false,msg:'نعم'}} />

      {/* مساحات وأحجام */}
      <ExerciseCard id="sh-15" title="تمرين 15 — مساحة مثلث" difficulty="متوسط" question={<><MathInline tex="A(0|0|0) B(2|0|0) C(0|2|0)" /> — المساحة؟</>} hints={['½|AB×AC|=½·4=2']} solution={<>2</>} placeholder="2" check={a=>Number(a)===2?{ok:true}:{ok:false,msg:'2'}} />
      <ExerciseCard id="sh-16" title="تمرين 16 — حجم رباعي" difficulty="متوسط" question={<><MathInline tex="A(0|0|0) B(2|0|0) C(0|2|0) D(0|0|2)" /> — الحجم؟</>} hints={['1/6·|8|=1.33']} solution={<>1.33</>} placeholder="1.33" check={a=> Math.abs(Number(a)-1.333)<0.05?{ok:true}:{ok:false,msg:'1.33'}} />
      <ExerciseCard id="sh-17" title="تمرين 17 — حجم" difficulty="متوسط" question={<><MathInline tex="إذا كان الجداء الثلاثي 12" /> — حجم رباعي؟</>} hints={['2']} solution={<>2</>} placeholder="2" check={a=>Number(a)===2?{ok:true}:{ok:false,msg:'2'}} />

      {/* متقدم */}
      <ExerciseCard id="sh-18" title="تمرين 18 — مكعب شامل" difficulty="متقدم" question={<><MathInline tex="مكعب a=2" /> — قطر فراغي ومساحة وجه وزاوية بين قطرين؟</>} hints={['2√3, 4, 70.5°']} solution={<>2√3, 4</>} placeholder="2√3" check={a=>a.includes('√3')||a.includes('3.46')?{ok:true}:{ok:false,msg:'2√3'}} />
      <ExerciseCard id="sh-19" title="تمرين 19 — هرم شامل" difficulty="متقدم" question={<><MathInline tex="هرم قاعدة 2×2 ارتفاع 3" /> — حجم الهرم؟ (هرم = 1/3 قاعدة×ارتفاع)</>} hints={['(4×3)/3=4']} solution={<>4</>} placeholder="4" check={a=>Number(a)===4?{ok:true}:{ok:false,msg:'4'}} />
      <ExerciseCard id="sh-20" title="تمرين 20 — كرة+مستوى+شكل" difficulty="متقدم" question={<><MathInline tex="كرة M(0|0|0) r=2, مستوى z=1" /> — نصف قطر الدائرة؟</>} hints={['√3≈1.73']} solution={<>1.73</>} placeholder="1.73" check={a=> Math.abs(Number(a)-1.732)<0.05?{ok:true}:{ok:false,msg:'√3'}} />

      {/* بصري */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: 12 }}>
        <div style={{ fontWeight: 800, marginBottom: 8 }}>بصري — اختر</div>
        <div style={{ height: 320, borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: 8 }}>
          <SceneShell>
            <CoordinateSystem3D />
            <Cuboid3D a={2} b={1.5} c={1} highlightEdges={[['A','B'],['A','D']]} />
          </SceneShell>
        </div>
        <div style={{ fontSize: 13, marginBottom: 6 }}>هل `AB` متعامد مع `AD`؟</div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => setPick('yes')} style={{ padding: '6px 12px', borderRadius: 999, border: '1px solid', borderColor: pick === 'yes' ? '#0f172a' : '#e2e8f0', background: pick === 'yes' ? '#0f172a' : 'white', color: pick === 'yes' ? 'white' : '#334155', cursor: 'pointer' }}>نعم</button>
          <button onClick={() => setPick('no')} style={{ padding: '6px 12px', borderRadius: 999, border: '1px solid', borderColor: pick === 'no' ? '#0f172a' : '#e2e8f0', background: pick === 'no' ? '#0f172a' : 'white', color: pick === 'no' ? 'white' : '#334155', cursor: 'pointer' }}>لا</button>
        </div>
        {pick === 'yes' && <div style={{ marginTop: 8, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: 8, color: '#166534', fontSize: 13 }}>✓ صحيح — `AB·AD=0`</div>}
        {pick === 'no' && <div style={{ marginTop: 8, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: 8, color: '#991b1b', fontSize: 13 }}>✗ خطأ — الجداء صفر</div>}
      </div>
    </div>
  )
}
