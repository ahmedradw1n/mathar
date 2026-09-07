import ExerciseCard from './ExerciseCard'
import SceneShell from '../three/SceneShell'
import CoordinateSystem3D from '../three/CoordinateSystem3D'
import PlanePlaneIntersection3D from '../three/PlanePlaneIntersection3D'
import Circumsphere3D from '../three/Circumsphere3D'
import { MathInline } from '../components/math/MathBlock'
import type { Plane, Point3 } from '../math/types'
import { sphereThroughPoints } from '../math/advancedGeometry'

export default function AdvancedExercises() {
  const p1: Plane = { a: 1, b: 1, c: 1, d: -3 }
  const p2: Plane = { a: 1, b: -1, c: 0, d: 0 }
  const pts: Point3[] = [{ x: 1, y: 0, z: 0 }, { x: -1, y: 0, z: 0 }, { x: 0, y: 1, z: 0 }, { x: 0, y: 0, z: 1 }]
  const sphereRes = sphereThroughPoints(pts)

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      {/* تقاطع */}
      <ExerciseCard id="adv-1" title="تمرين 1 — وضع مستويين" difficulty="مبتدئ" question={<><MathInline tex="E1: x=0, E2: y=0" /> — الوضع؟</>} hints={['n1=(1,0,0) n2=(0,1,0) غير متوازيين → متقاطعان']} solution={<>متقاطعان</>} placeholder="متقاطعان" check={a=>a.includes('متقاطع')?{ok:true}:{ok:false,msg:'متقاطعان'}} />
      <ExerciseCard id="adv-2" title="تمرين 2 — شعاع اتجاه التقاطع" difficulty="مبتدئ" question={<><MathInline tex="n1=(1,1,1) n2=(1,-1,0)" /> — أوجد u</>} hints={['u=n1×n2=(1,1,-2)']} solution={<><MathInline tex="(1,1,-2)" /></>} placeholder="1,1,-2" check={a=>a.replace(/[()]/g,'').trim()==='1,1,-2'?{ok:true}:{ok:false,msg:'(1,1,-2)'}} />
      <ExerciseCard id="adv-3" title="تمرين 3 — نقطة على التقاطع" difficulty="متوسط" question={<><MathInline tex="E1: x+y+z=3, E2: x-y=0" /> — أوجد نقطة (جرب z=0)</>} hints={['x=y, 2x+z=3 z=0→x=1.5']} solution={<><MathInline tex="(1.5,1.5,0)" /></>} placeholder="1.5,1.5,0" check={a=>a.includes('1.5')?{ok:true}:{ok:false,msg:'(1.5,1.5,0)'}} />
      <ExerciseCard id="adv-4" title="تمرين 4 — معادلة التقاطع" difficulty="متوسط" question={<>اكتب مستقيم التقاطع السابق</>} hints={['P(1.5,1.5,0)+t(1,1,-2)']} solution={<><MathInline tex="P+t·u" /></>} placeholder="P+t*u" check={a=>a.includes('1.5')?{ok:true}:{ok:false,msg:'P(1.5,1.5,0)+t(1,1,-2)'}} />
      <ExerciseCard id="adv-5" title="تمرين 5 — تحقق" difficulty="متوسط" question={<><MathInline tex="هل P(1.5,1.5,0) يحقق E1 و E2؟" /></>} hints={['1.5+1.5=3 ✓, 1.5-1.5=0 ✓']} solution={<>نعم</>} placeholder="نعم" check={a=>a.includes('نعم')?{ok:true}:{ok:false,msg:'نعم'}} />

      {/* كرة */}
      <ExerciseCard id="adv-6" title="تمرين 6 — تساوي المسافات" difficulty="مبتدئ" question={<><MathInline tex="M(x|y|z), A(1|0|0) B(-1|0|0)" /> — معادلة من |MA|²=|MB|²</>} hints={['(x-1)²=(x+1)² → -2x=2x → x=0']} solution={<><MathInline tex="x=0" /></>} placeholder="x=0" check={a=>a.includes('0')?{ok:true}:{ok:false,msg:'x=0'}} />
      <ExerciseCard id="adv-7" title="تمرين 7 — إلغاء تربيعية" difficulty="مبتدئ" question={<>ماذا يحدث لحدود <MathInline tex="x²+y²+z²" /> عند الطرح؟</>} hints={['تُلغى']} solution={<>تُلغى</>} placeholder="تُلغى" check={a=>a.includes('لغ')?{ok:true}:{ok:false,msg:'تُلغى'}} />
      <ExerciseCard id="adv-8" title="تمرين 8 — النظام الخطي" difficulty="متوسط" question={<>كم معادلة نحتاج لـ M(x|y|z) من 4 نقاط؟</>} hints={['3 معادلات خطية (B-A, C-A, D-A)']} solution={<>3</>} placeholder="3" check={a=>Number(a)===3?{ok:true}:{ok:false,msg:'3'}} />
      <ExerciseCard id="adv-9" title="تمرين 9 — المركز" difficulty="متوسط" question={<>النقاط الأربع السابقة — M؟</>} hints={['M(0,0,0)']} solution={<><MathInline tex="(0,0,0)" /></>} placeholder="0,0,0" check={a=>a.replace(/[()]/g,'').trim()==='0,0,0'?{ok:true}:{ok:false,msg:'(0,0,0)'}} />
      <ExerciseCard id="adv-10" title="تمرين 10 — نصف القطر" difficulty="متوسط" question={<>r=|MA| مع M(0,0,0) A(1,0,0) — r؟</>} hints={['1']} solution={<>1</>} placeholder="1" check={a=>Number(a)===1?{ok:true}:{ok:false,msg:'1'}} />
      <ExerciseCard id="adv-11" title="تمرين 11 — معادلة الكرة" difficulty="متوسط" question={<>اكتب معادلة الكرة M(0,0,0) r=1</>} hints={['x²+y²+z²=1']} solution={<><MathInline tex="x^2+y^2+z^2=1" /></>} placeholder="x^2+y^2+z^2=1" check={a=>a.includes('1')?{ok:true}:{ok:false,msg:'x²+y²+z²=1'}} />
      <ExerciseCard id="adv-12" title="تمرين 12 — تحقق" difficulty="متوسط" question={<>هل B(-1,0,0) تحقق؟</>} hints={['1=1 نعم']} solution={<>نعم</>} placeholder="نعم" check={a=>a.includes('نعم')?{ok:true}:{ok:false,msg:'نعم'}} />
      <ExerciseCard id="adv-13" title="تمرين 13 — خطأ إشارة" difficulty="متقدم" question={<>طالب كتب M(1|-1|0) بدل (-1|1|0) — الخطأ؟</>} hints={['إشارة معكوسة']} solution={<>إشارة</>} placeholder="إشارة" check={a=>a.includes('إشارة')?{ok:true}:{ok:false,msg:'إشارة'}} />
      <ExerciseCard id="adv-14" title="تمرين 14 — هندسي 3D" difficulty="متقدم" question={<>أربع نقاط في مستوى واحد — هل تحدد كرة وحيدة؟</>} hints={['لا — غير وحيدة/لا يوجد']} solution={<>لا</>} placeholder="لا" check={a=>a.includes('لا')?{ok:true}:{ok:false,msg:'لا'}} />

      {/* ثقل */}
      <ExerciseCard id="adv-15" title="تمرين 15 — مركز ثقل مثلث" difficulty="مبتدئ" question={<><MathInline tex="A(0|0|0) B(3|0|0) C(0|3|0)" /> — G؟</>} hints={['(1,1,0)']} solution={<><MathInline tex="(1,1,0)" /></>} placeholder="1,1,0" check={a=>a.replace(/[()]/g,'').trim()==='1,1,0'?{ok:true}:{ok:false,msg:'(1,1,0)'}} />
      <ExerciseCard id="adv-16" title="تمرين 16 — على المتوسط" difficulty="متوسط" question={<>هل G على المتوسط A-Mbc؟</>} hints={['نعم 2:1']} solution={<>نعم</>} placeholder="نعم" check={a=>a.includes('نعم')?{ok:true}:{ok:false,msg:'نعم'}} />
      <ExerciseCard id="adv-17" title="تمرين 17 — رباعي الوجوه" difficulty="متوسط" question={<><MathInline tex="A(0|0|0) B(2|0|0) C(0|2|0) D(0|0|2)" /> — G؟</>} hints={['(0.5,0.5,0.5)']} solution={<><MathInline tex="(0.5,0.5,0.5)" /></>} placeholder="0.5,0.5,0.5" check={a=>a.includes('0.5')?{ok:true}:{ok:false,msg:'(0.5,0.5,0.5)'}} />
      <ExerciseCard id="adv-18" title="تمرين 18 — شامل" difficulty="متقدم" question={<>مستويان E1,E2 → مستقيم s, ونقطة على s, وكرة مركزها تلك النقطة تمر بـ A — هل A تحقق؟</>} hints={['تحقق s∈E1∩E2 ثم |MA|=r']} solution={<>حسب الحساب</>} placeholder="نعم" check={a=>a.includes('نعم')||a.includes('لا')?{ok:true}:{ok:false,msg:'حسب'}} />

      {/* بصري */}
      <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: 12 }}>
        <div style={{ fontWeight: 800, marginBottom: 8 }}>بصري — اختر الحالة</div>
        <div style={{ height: 300, borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: 8 }}>
          <SceneShell>
            <CoordinateSystem3D />
            <PlanePlaneIntersection3D p1={p1} p2={p2} />
          </SceneShell>
        </div>
        <div style={{ height: 300, borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: 8 }}>
          <SceneShell>
            <CoordinateSystem3D />
            <Circumsphere3D points={pts} sphere={sphereRes.kind==='unique'?sphereRes.sphere:null} />
          </SceneShell>
        </div>
      </div>
    </div>
  )
}
