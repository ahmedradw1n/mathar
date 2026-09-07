import { useState } from 'react'
import PointLesson from './lessons/PointLesson'
import PointExercise from './exercises/PointExercise'
import VectorsStage from './lessons/VectorsStage'
import VectorsExercises from './exercises/VectorsExercises'
import PlaneStage from './lessons/PlaneStage'
import PlaneExercises from './exercises/PlaneExercises'
import LineStage from './lessons/LineStage'
import LineExercises from './exercises/LineExercises'
import RelationsStage from './lessons/RelationsStage'
import RelationsExercises from './exercises/RelationsExercises'
import DistancesStage from './lessons/DistancesStage'
import DistancesExercises from './exercises/DistancesExercises'
import SphereStage from './lessons/SphereStage'
import SphereExercises from './exercises/SphereExercises'
import AdvancedStage from './lessons/AdvancedStage'
import AdvancedExercises from './exercises/AdvancedExercises'
import ShapesStage from './lessons/ShapesStage'
import ShapesExercises from './exercises/ShapesExercises'

export default function App() {
  const [point, setPoint] = useState<[number, number, number]>([3, 2, 4])
  const [tab, setTab] = useState<'lesson' | 'exercise'>('lesson')
  const [stage, setStage] = useState<'basics' | 'vectors' | 'planes' | 'lines' | 'relations' | 'distances' | 'spheres' | 'advanced' | 'shapes'>('shapes')

  return (
    <div dir="rtl" lang="ar" style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* شريط علوي بسيط — ليس تسويقياً */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #e2e8f0',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#0f172a',
              color: 'white',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 800,
              fontSize: 16,
            }}
          >
            هـ
          </span>
          <div>
            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: 15, lineHeight: 1.1 }}>
              هندسة الفضاء التفاعلية
            </div>
            <div style={{ fontSize: 11, color: '#64748b' }}>المرحلة 1 — الأساسيات · مكتمل ✓</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 2, background: '#f1f5f9', borderRadius: 999, padding: 2, overflowX: 'auto', maxWidth: '100%' }}>
            <button onClick={() => setStage('basics')} style={{ padding: '4px 4px', borderRadius: 999, border: 'none', background: stage === 'basics' ? 'white' : 'transparent', boxShadow: stage === 'basics' ? '0 1px 4px rgba(0,0,0,0.12)' : 'none', fontWeight: 700, fontSize: 6, cursor: 'pointer', color: '#0f172a', whiteSpace: 'nowrap' }}>الأساسيات</button>
            <button onClick={() => setStage('vectors')} style={{ padding: '4px 4px', borderRadius: 999, border: 'none', background: stage === 'vectors' ? 'white' : 'transparent', boxShadow: stage === 'vectors' ? '0 1px 4px rgba(0,0,0,0.12)' : 'none', fontWeight: 700, fontSize: 6, cursor: 'pointer', color: '#0f172a', whiteSpace: 'nowrap' }}>الأشعة</button>
            <button onClick={() => setStage('planes')} style={{ padding: '4px 4px', borderRadius: 999, border: 'none', background: stage === 'planes' ? 'white' : 'transparent', boxShadow: stage === 'planes' ? '0 1px 4px rgba(0,0,0,0.12)' : 'none', fontWeight: 700, fontSize: 6, cursor: 'pointer', color: '#0f172a', whiteSpace: 'nowrap' }}>المستوى</button>
            <button onClick={() => setStage('lines')} style={{ padding: '4px 4px', borderRadius: 999, border: 'none', background: stage === 'lines' ? 'white' : 'transparent', boxShadow: stage === 'lines' ? '0 1px 4px rgba(0,0,0,0.12)' : 'none', fontWeight: 700, fontSize: 6, cursor: 'pointer', color: '#0f172a', whiteSpace: 'nowrap' }}>المستقيمات</button>
            <button onClick={() => setStage('relations')} style={{ padding: '4px 4px', borderRadius: 999, border: 'none', background: stage === 'relations' ? 'white' : 'transparent', boxShadow: stage === 'relations' ? '0 1px 4px rgba(0,0,0,0.12)' : 'none', fontWeight: 700, fontSize: 6, cursor: 'pointer', color: '#0f172a', whiteSpace: 'nowrap' }}>العلاقات</button>
            <button onClick={() => setStage('distances')} style={{ padding: '4px 4px', borderRadius: 999, border: 'none', background: stage === 'distances' ? 'white' : 'transparent', boxShadow: stage === 'distances' ? '0 1px 4px rgba(0,0,0,0.12)' : 'none', fontWeight: 700, fontSize: 6, cursor: 'pointer', color: '#0f172a', whiteSpace: 'nowrap' }}>المسافات</button>
            <button onClick={() => setStage('spheres')} style={{ padding: '4px 4px', borderRadius: 999, border: 'none', background: stage === 'spheres' ? 'white' : 'transparent', boxShadow: stage === 'spheres' ? '0 1px 4px rgba(0,0,0,0.12)' : 'none', fontWeight: 700, fontSize: 6, cursor: 'pointer', color: '#0f172a', whiteSpace: 'nowrap' }}>الكرة</button>
            <button onClick={() => setStage('advanced')} style={{ padding: '4px 4px', borderRadius: 999, border: 'none', background: stage === 'advanced' ? 'white' : 'transparent', boxShadow: stage === 'advanced' ? '0 1px 4px rgba(0,0,0,0.12)' : 'none', fontWeight: 700, fontSize: 6, cursor: 'pointer', color: '#0f172a', whiteSpace: 'nowrap' }}>متقدمة</button>
            <button onClick={() => setStage('shapes')} style={{ padding: '4px 4px', borderRadius: 999, border: 'none', background: stage === 'shapes' ? 'white' : 'transparent', boxShadow: stage === 'shapes' ? '0 1px 4px rgba(0,0,0,0.12)' : 'none', fontWeight: 700, fontSize: 6, cursor: 'pointer', color: '#0f172a', whiteSpace: 'nowrap' }}>الأشكال</button>
          </div>
          <div style={{ width: 1, height: 18, background: '#e2e8f0', margin: '0 2px' }} />
          <button
            onClick={() => setTab('lesson')}
            style={{
              padding: '8px 14px',
              borderRadius: 999,
              border: '1px solid',
              borderColor: tab === 'lesson' ? '#0f172a' : '#e2e8f0',
              background: tab === 'lesson' ? '#0f172a' : 'white',
              color: tab === 'lesson' ? 'white' : '#334155',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              minHeight: 36,
            }}
          >
            الدرس
          </button>
          <button
            onClick={() => setTab('exercise')}
            style={{
              padding: '8px 14px',
              borderRadius: 999,
              border: '1px solid',
              borderColor: tab === 'exercise' ? '#0f172a' : '#e2e8f0',
              background: tab === 'exercise' ? '#0f172a' : 'white',
              color: tab === 'exercise' ? 'white' : '#334155',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
              minHeight: 36,
            }}
          >
            التمارين
          </button>
        </div>
      </nav>

      {/* شريط حالة Foundation */}
      <div
        style={{
          maxWidth: 1100,
          margin: '12px auto 0',
          padding: '0 16px',
        }}
      >
        <div
          style={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            padding: '10px 12px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
            fontSize: 12,
            color: '#334155',
          }}
        >
          <span style={{ fontWeight: 800 }}>الأساس:</span>
          <span style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 999, padding: '2px 8px' }}>
            ✓ محرك الرياضيات
          </span>
          <span style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 999, padding: '2px 8px' }}>
            ✓ نظام الإحداثيات
          </span>
          <span style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 999, padding: '2px 8px' }}>
            ✓ النقطة
          </span>
          <span style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 999, padding: '2px 8px' }}>
            ✓ الشعاع
          </span>
          <span style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 999, padding: '2px 8px' }}>
            ✓ تفاعل الهاتف
          </span>
          <span style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 999, padding: '2px 8px' }}>
            ✓ الدرس الأول
          </span>
          <span style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 999, padding: '2px 8px' }}>
            ✓ التمارين
          </span>
        </div>
      </div>

      {stage === 'basics' ? (
        tab === 'lesson' ? (
          <PointLesson point={point} onChange={setPoint} />
        ) : (
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px' }}>
            <h2 style={{ margin: '8px 0 4px', color: '#0f172a' }}>التمارين — النقطة والإحداثيات</h2>
            <p style={{ color: '#64748b', fontSize: 13.5, margin: 0 }}>حاول بنفسك. كل تمرين يعطي تلميحاً عند الخطأ ولا يكشف الحل مباشرة.</p>
            <PointExercise />
          </div>
        )
      ) : stage === 'vectors' ? (
        tab === 'lesson' ? (
          <VectorsStage />
        ) : (
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px' }}>
            <h2 style={{ margin: '8px 0 4px', color: '#0f172a' }}>التمارين — الأشعة والجداء السلمي</h2>
            <p style={{ color: '#64748b', fontSize: 13.5, margin: 0 }}>تمارين متدرجة: مبتدئ → متوسط → متقدم + تطبيق هندسي.</p>
            <VectorsExercises />
          </div>
        )
      ) : stage === 'planes' ? (
        tab === 'lesson' ? (
          <PlaneStage />
        ) : (
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px' }}>
            <h2 style={{ margin: '8px 0 4px', color: '#0f172a' }}>التمارين — المستوى في الفضاء</h2>
            <p style={{ color: '#64748b', fontSize: 13.5, margin: 0 }}>مبتدئ → متوسط → بصري → متعدد الخطوات → اكتشاف خطأ</p>
            <PlaneExercises />
          </div>
        )
      ) : stage === 'lines' ? (
        tab === 'lesson' ? (
          <LineStage />
        ) : (
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px' }}>
            <h2 style={{ margin: '8px 0 4px', color: '#0f172a' }}>التمارين — المستقيمات في الفضاء</h2>
            <p style={{ color: '#64748b', fontSize: 13.5, margin: 0 }}>11 تمرين + تفاعلي 3D (مستقيم/قطعة/نصف)</p>
            <LineExercises />
          </div>
        )
      ) : stage === 'relations' ? (
        tab === 'lesson' ? (
          <RelationsStage />
        ) : (
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px' }}>
            <h2 style={{ margin: '8px 0 4px', color: '#0f172a' }}>التمارين — العلاقات والتقاطعات</h2>
            <p style={{ color: '#64748b', fontSize: 13.5, margin: 0 }}>16 تمرين: مستقيمان (5) + خط-مستوى (4) + مستويان (5) + بصري</p>
            <RelationsExercises />
          </div>
        )
      ) : stage === 'distances' ? (
        tab === 'lesson' ? (
          <DistancesStage />
        ) : (
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px' }}>
            <h2 style={{ margin: '8px 0 4px', color: '#0f172a' }}>التمارين — المسافات والمساقط</h2>
            <p style={{ color: '#64748b', fontSize: 13.5, margin: 0 }}>16 تمرين: مبتدئ 4 + متوسط 6 + متقدم 6 + بصري + أخطاء</p>
            <DistancesExercises />
          </div>
        )
      ) : stage === 'spheres' ? (
        tab === 'lesson' ? (
          <SphereStage />
        ) : (
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px' }}>
            <h2 style={{ margin: '8px 0 4px', color: '#0f172a' }}>التمارين — الكرة في الفضاء</h2>
            <p style={{ color: '#64748b', fontSize: 13.5, margin: 0 }}>18 تمرين: مبتدئ 4 + متوسط 6 + متقدم 8 + بصري + أخطاء</p>
            <SphereExercises />
          </div>
        )
      ) : stage === 'advanced' ? (
        tab === 'lesson' ? (
          <AdvancedStage />
        ) : (
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px' }}>
            <h2 style={{ margin: '8px 0 4px', color: '#0f172a' }}>التمارين — التقاطعات ومركز الكرة ومركز الثقل</h2>
            <p style={{ color: '#64748b', fontSize: 13.5, margin: 0 }}>18 تمرين: تقاطع 5 + كرة 9 + ثقل 4 + بصري</p>
            <AdvancedExercises />
          </div>
        )
      ) : tab === 'lesson' ? (
        <ShapesStage />
      ) : (
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px' }}>
          <h2 style={{ margin: '8px 0 4px', color: '#0f172a' }}>التمارين — الأشكال والتطبيقات</h2>
          <p style={{ color: '#64748b', fontSize: 13.5, margin: 0 }}>20 تمرين: أساسيات 5 + مستويات 5 + مسافات 4 + مساحات 3 + شاملة 3 + بصري</p>
          <ShapesExercises />
        </div>
      )}

      <footer
        style={{
          textAlign: 'center',
          padding: '18px 16px',
          fontSize: 11.5,
          color: '#94a3b8',
          borderTop: '1px solid #e2e8f0',
          marginTop: 20,
          background: 'white',
        }}
      >
        منصة تعليمية تفاعلية — هندسة الفضاء ثلاثي الأبعاد · تفاعل باللمس ·{' '}
        <span dir="ltr" style={{ unicodeBidi: 'isolate' }}>
          A(3|2|4) → |⃗OA| = √(29)
        </span>
      </footer>
    </div>
  )
}
