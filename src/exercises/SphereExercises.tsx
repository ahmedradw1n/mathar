import { useState } from 'react'
import ExerciseCard from './ExerciseCard'
import SceneShell from '../three/SceneShell'
import CoordinateSystem3D from '../three/CoordinateSystem3D'
import SpherePlaneIntersection3D from '../three/SpherePlaneIntersection3D'
import { MathInline } from '../components/math/MathBlock'
import type { Sphere, Plane } from '../math/types'

export default function SphereExercises() {
  const [plane, setPlane] = useState<Plane>({ a: 0, b: 0, c: 1, d: 0 })
  const sphere: Sphere = { center: { x: 0, y: 0, z: 0 }, radius: 2 }

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {/* مبتدئ */}
      <ExerciseCard id="sp-m1" title="تمرين 1 — المركز ونصف القطر" difficulty="مبتدئ" question={<><MathInline tex="(x-2)^2+(y+3)^2+(z-1)^2=25" /> — أوجد M و r</>} hints={['M=(2,−3,1)', 'r²=25 → r=5']} solution={<><MathInline tex="M(2|-3|1), r=5" /></>} placeholder="2,-3,1,5" check={a => { const n=a.replace(/[()]/g,'').split(',').map(Number); return n[0]===2&&n[1]===-3&&n[2]===1&&n[3]===5 ? {ok:true}:{ok:false,msg:'M(2,−3,1), r=5'} }} />
      <ExerciseCard id="sp-m2" title="تمرين 2 — معادلة من مركز ونصف قطر" difficulty="مبتدئ" question={<><MathInline tex="M(0|0|0), r=3" /> — اكتب المعادلة</>} hints={['(x−0)²+...=9']} solution={<><MathInline tex="x^2+y^2+z^2=9" /></>} placeholder="x^2+y^2+z^2=9" check={a => a.includes('9') ? {ok:true}:{ok:false,msg:'=9'}} />
      <ExerciseCard id="sp-m3" title="تمرين 3 — نصف القطر من نقطة" difficulty="مبتدئ" question={<><MathInline tex="M(1|1|1), A(1|1|4)" /> — أوجد r</>} hints={['r=|MA|=3']} solution={<><MathInline tex="3" /></>} placeholder="3" check={a=> Number(a)===3?{ok:true}:{ok:false,msg:'3'}} />
      <ExerciseCard id="sp-m4" title="تمرين 4 — نقطة على الكرة؟" difficulty="مبتدئ" question={<><MathInline tex="(x)^2+y^2+z^2=9, A(0|0|3)" /> — هل A على الكرة؟</>} hints={['|MA|=3=r → نعم']} solution={<>نعم</>} placeholder="نعم" check={a=>a.includes('نعم')?{ok:true}:{ok:false,msg:'نعم'}} />

      {/* متوسط */}
      <ExerciseCard id="sp-mid5" title="تمرين 5 — موسعة: المركز" difficulty="متوسط" question={<><MathInline tex="x^2+y^2+z^2-4x+6y-2z-11=0" /> — أوجد M</>} hints={['M=(2,−3,1)', '-A/2']} solution={<><MathInline tex="(2|-3|1)" /></>} placeholder="2,-3,1" check={a=>{const n=a.replace(/[()]/g,'').split(',').map(Number); return n[0]===2&&n[1]===-3&&n[2]===1?{ok:true}:{ok:false,msg:'(2,−3,1)'}}} />
      <ExerciseCard id="sp-mid6" title="تمرين 6 — موسعة: نصف القطر" difficulty="متوسط" question={<>نفس المعادلة — أوجد r</>} hints={['r²=4+9+1+11=25 → r=5']} solution={<><MathInline tex="5" /></>} placeholder="5" check={a=>Number(a)===5?{ok:true}:{ok:false,msg:'5'}} />
      <ExerciseCard id="sp-mid7" title="تمرين 7 — إكمال المربع" difficulty="متوسط" question={<><MathInline tex="x^2-4x" /> → أكمل المربع</>} hints={['(x−2)²−4']} solution={<><MathInline tex="(x-2)^2-4" /></>} placeholder="(x-2)^2-4" check={a=>a.includes('2')?{ok:true}:{ok:false,msg:'(x-2)²−4'}} />
      <ExerciseCard id="sp-mid8" title="تمرين 8 — تصنيف نقطة" difficulty="متوسط" question={<><MathInline tex="كرة M(0|0|0) r=2, A(1|1|0)" /> — داخل/على/خارج؟</>} hints={['|MA|=√2≈1.41<2 → داخل']} solution={<>داخل</>} placeholder="داخل" check={a=>a.includes('داخل')?{ok:true}:{ok:false,msg:'داخل'}} />
      <ExerciseCard id="sp-mid9" title="تمرين 9 — مسافة مركز-مستوى" difficulty="متوسط" question={<><MathInline tex="M(0|0|2), E: z=0" /> — δ؟</>} hints={['δ=2']} solution={<><MathInline tex="2" /></>} placeholder="2" check={a=>Number(a)===2?{ok:true}:{ok:false,msg:'2'}} />
      <ExerciseCard id="sp-mid10" title="تمرين 10 — وضع كرة-مستوى" difficulty="متوسط" question={<><MathInline tex="r=2, δ=3" /> — الوضع؟</>} hints={['δ>r → لا تقاطع']} solution={<>لا تقاطع</>} placeholder="لا تقاطع" check={a=>a.includes('لا')?{ok:true}:{ok:false,msg:'لا تقاطع'}} />

      {/* متقدم */}
      <ExerciseCard id="sp-adv11" title="تمرين 11 — نقطة تماس" difficulty="متقدم" question={<><MathInline tex="كرة M(0|0|2) r=2, E: z=0" /> — نقطة التماس؟</>} hints={['H=proj_E(M)=(0,0,0)']} solution={<><MathInline tex="(0,0,0)" /></>} placeholder="0,0,0" check={a=>a.replace(/[()]/g,'').trim()==='0,0,0'?{ok:true}:{ok:false,msg:'(0,0,0)'}} />
      <ExerciseCard id="sp-adv12" title="تمرين 12 — مركز دائرة التقاطع" difficulty="متقدم" question={<><MathInline tex="M(0|0|1) r=2, E: z=0" /> — مركز الدائرة؟</>} hints={['H=(0,0,0)']} solution={<><MathInline tex="(0,0,0)" /></>} placeholder="0,0,0" check={a=>a.replace(/[()]/g,'').trim()==='0,0,0'?{ok:true}:{ok:false,msg:'(0,0,0)'}} />
      <ExerciseCard id="sp-adv13" title="تمرين 13 — نصف قطر الدائرة" difficulty="متقدم" question={<><MathInline tex="r=2, δ=1" /> — ρ؟</>} hints={['ρ=√(4−1)=√3≈1.73']} solution={<><MathInline tex="√3" /></>} placeholder="1.73" check={a=> Math.abs(Number(a)-Math.sqrt(3))<0.05 || a.includes('√3') ? {ok:true}:{ok:false,msg:'√3'}} />
      <ExerciseCard id="sp-adv14" title="تمرين 14 — متعدد الخطوات" difficulty="متقدم" question={<><MathInline tex="M(1|1|1) r=3, E: x+y+z=3" /> — أوجد δ ثم الوضع</>} hints={['δ=0 → r>δ → تقاطع', 'ρ=3']} solution={<>تقاطع ρ=3</>} placeholder="تقاطع" check={a=>a.includes('تقاطع')?{ok:true}:{ok:false,msg:'تقاطع'}} />
      <ExerciseCard id="sp-adv17" title="تمرين 17 — خطأ إشارة" difficulty="متقدم" question={<><MathInline tex="(x+2)^2+(y-3)^2=9" /> طالب كتب M(2|-3) — الخطأ؟</>} hints={['الإشارة معكوسة → M(−2|3)']} solution={<>الإشارة معكوسة</>} placeholder="الإشارة" check={a=>a.includes('إشارة')?{ok:true}:{ok:false,msg:'الإشارة معكوسة'}} />
      <ExerciseCard id="sp-adv18" title="تمرين 18 — جمع" difficulty="متقدم" question={<><MathInline tex="كرة M(0|0|0) r=2, مستوى z=1" /> — أوجد H و ρ</>} hints={['H=(0,0,1), ρ=√3']} solution={<><MathInline tex="H(0,0,1) ρ√3" /></>} placeholder="0,0,1" check={a=>a.includes('0,0,1')?{ok:true}:{ok:false,msg:'H(0,0,1)'}} />

      {/* بصري */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: 12 }}>
        <div style={{ fontWeight: 800, marginBottom: 8 }}>تمرين 16 — بصري</div>
        <div style={{ height: 340, borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: 8 }}>
          <SceneShell>
            <CoordinateSystem3D />
            <SpherePlaneIntersection3D sphere={sphere} plane={plane} />
          </SceneShell>
        </div>
        <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
          <button onClick={()=>setPlane({a:0,b:0,c:1,d:0})} style={{ padding:'6px 10px', borderRadius:999, border:'1px solid #e2e8f0', background:'white', fontSize:12, cursor:'pointer' }}>δ=0 (عظمى)</button>
          <button onClick={()=>setPlane({a:0,b:0,c:1,d:-2})} style={{ padding:'6px 10px', borderRadius:999, border:'1px solid #e2e8f0', background:'white', fontSize:12, cursor:'pointer' }}>تماس</button>
          <button onClick={()=>setPlane({a:0,b:0,c:1,d:-3})} style={{ padding:'6px 10px', borderRadius:999, border:'1px solid #e2e8f0', background:'white', fontSize:12, cursor:'pointer' }}>لا تقاطع</button>
        </div>
        <ExerciseCard id="sp-vis" title="تمرين 16 — بصري" difficulty="متقدم" question={<>في المشهد — ما وضع الكرة والمستوى الحالي؟</>} hints={['δ مقارنة r', 'δ=0→تقاطع','δ=2→تماس','δ=3→لا تقاطع']} solution={<>يتغير حسب δ</>} placeholder="تقاطع/تماس/لا" check={a=> a.includes('تقاطع')||a.includes('تماس')||a.includes('لا') ? {ok:true}:{ok:false,msg:'حسب δ'}} />
      </div>

      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#92400e', marginBottom: 6 }}>أخطاء شائعة</div>
        <ul style={{ margin: 0, paddingInlineStart: 18, fontSize: 12.5, lineHeight: 1.8, color: '#92400e' }}>
          <li>عكس إشارات المركز</li>
          <li>نسيان تربيع r</li>
          <li>نسيان | | في المسافة</li>
          <li>استخدام نقطة عشوائية بدل M</li>
          <li>√(r²−δ²) مع δ&gt;r</li>
          <li>ناظم صفري</li>
        </ul>
      </div>
    </div>
  )
}
