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
import BarycenterStage from './lessons/BarycenterStage'
import BarycenterExercises from './exercises/BarycenterExercises'
import SectionsStage from './lessons/SectionsStage'
import SectionsExercises from './exercises/SectionsExercises'
import IntegrationStage from './lessons/IntegrationStage'

const STAGES = [
  ['basics', 'الأساسيات', '①'],
  ['vectors', 'الأشعة', '②'],
  ['planes', 'المستوى', '③'],
  ['lines', 'المستقيم', '④'],
  ['relations', 'العلاقات', '⑤'],
  ['distances', 'المسافات', '⑥'],
  ['spheres', 'الكرة', '⑦'],
  ['advanced', 'متقدمة', '⑧'],
  ['shapes', 'الأشكال', '⑨'],
  ['barycenter', 'مُثقَّل', '⑩'],
  ['sections', 'المقاطع', '⑪'],
  ['integration', 'تكامل', '⑫'],
] as const

export default function App() {
  const [point, setPoint] = useState<[number, number, number]>([3, 2, 4])
  const [tab, setTab] = useState<'lesson' | 'exercise'>('lesson')
  const [stage, setStage] = useState<'basics' | 'vectors' | 'planes' | 'lines' | 'relations' | 'distances' | 'spheres' | 'advanced' | 'shapes' | 'barycenter' | 'sections' | 'integration'>('basics')

  const stageIndex = STAGES.findIndex(([k]) => k === stage)
  const progress = ((stageIndex + 1) / STAGES.length) * 100

  return (
    <div dir="rtl" lang="ar" style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* شريط علوي — مضغوط للموبايل */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <span
              style={{
                width: 38, height: 38, borderRadius: 11, background: '#0f172a', color: 'white',
                display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 17, flexShrink: 0,
              }}
            >
              هـ
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 800, color: '#0f172a', fontSize: 15, lineHeight: 1.1, whiteSpace: 'nowrap' }}>
                هندسة الفضاء
              </div>
              <div style={{ fontSize: 11.5, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>تعلّم باللمس والرؤية — ليس بالحفظ</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0, background: '#f1f5f9', borderRadius: 999, padding: 3 }}>
            <button
              onClick={() => setTab('lesson')}
              style={{
                padding: '8px 16px', borderRadius: 999, border: 'none',
                background: tab === 'lesson' ? '#0f172a' : 'transparent',
                color: tab === 'lesson' ? 'white' : '#475569',
                fontWeight: 800, fontSize: 13.5, cursor: 'pointer', minHeight: 36,
                boxShadow: tab === 'lesson' ? '0 2px 8px rgba(15,23,42,0.2)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              📖 الدرس
            </button>
            <button
              onClick={() => setTab('exercise')}
              style={{
                padding: '8px 16px', borderRadius: 999, border: 'none',
                background: tab === 'exercise' ? '#0f172a' : 'transparent',
                color: tab === 'exercise' ? 'white' : '#475569',
                fontWeight: 800, fontSize: 13.5, cursor: 'pointer', minHeight: 36,
                boxShadow: tab === 'exercise' ? '0 2px 8px rgba(15,23,42,0.2)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              ✏️ تمارين
            </button>
          </div>
        </div>
        {/* شريط تقدم رفيع */}
        <div style={{ height: 3, background: '#e2e8f0' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: '#7c3aed', transition: 'width 0.4s ease', borderRadius: '0 999px 999px 0' }} />
        </div>
      </header>

      {/* شريط المراحل — تمرير سلس مع Snap */}
      <nav
        style={{
          position: 'sticky',
          top: 54,
          zIndex: 15,
          background: 'white',
          borderBottom: '1px solid #e2e8f0',
          padding: '8px 0',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 7,
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            scrollSnapType: 'x mandatory',
            padding: '0 14px 2px',
            alignItems: 'center',
          }}
        >
          {STAGES.map(([key, label, num]) => {
            const active = stage === key
            return (
              <button
                key={key}
                onClick={() => setStage(key as any)}
                style={{
                  scrollSnapAlign: 'start',
                  padding: '9px 14px',
                  borderRadius: 999,
                  border: '1.5px solid',
                  borderColor: active ? '#7c3aed' : '#e2e8f0',
                  background: active ? '#7c3aed' : 'white',
                  color: active ? 'white' : '#334155',
                  fontWeight: active ? 800 : 600,
                  fontSize: 13.5,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  minHeight: 40,
                  flexShrink: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: active ? '0 2px 10px rgba(124,58,237,0.25)' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: 11, opacity: active ? 0.9 : 0.6 }}>{num}</span> {label}
              </button>
            )
          })}
        </div>
        <div style={{ textAlign: 'center', fontSize: 10.5, color: '#94a3b8', marginTop: 4 }}>اسحب لليمين لرؤية باقي المراحل ←</div>
      </nav>

      {/* تلميح ودي بدل شريط الحالة الجاف */}
      <div style={{ maxWidth: 1100, margin: '10px auto 0', padding: '0 14px' }}>
        <div style={{ background: 'linear-gradient(135deg,#f5f3ff 0%,#eff6ff 100%)', border: '1px solid #ddd6fe', borderRadius: 14, padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>👋</span>
          <div style={{ fontSize: 13, color: '#334155', lineHeight: 1.6 }}>
            <strong style={{ color: '#0f172a' }}>
              {stage === 'basics' ? 'ابدأ من هنا — النقطة هي كل شيء' :
               stage === 'vectors' ? 'الأشعة: اتجاه وطول، مثل السهم' :
               stage === 'planes' ? 'المستوى: طاولة لا نهائية' :
               stage === 'lines' ? 'المستقيم: نقطة + اتجاه' :
               stage === 'relations' ? 'كيف تلتقي الأشكال؟' :
               stage === 'distances' ? 'أقصر مسافة = عمودي' :
               stage === 'spheres' ? 'الكرة: كل النقاط على نفس البُعد' :
               stage === 'barycenter' ? 'نقطة التوازن بين الأوزان' : 'مرحلة ' + (stageIndex+1) + ' من 12'}
            </strong>
            <span style={{ color: '#64748b' }}> — حرّك المنزلقات وشاهد الرياضيات تتحرك أمامك. لا تحفظ، افهم.</span>
          </div>
        </div>
      </div>

      {stage === 'basics' ? (
        tab === 'lesson' ? <PointLesson point={point} onChange={setPoint} /> : (
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '14px' }}>
            <h2 style={{ margin: '8px 0 4px', color: '#0f172a', fontSize: '1.25rem' }}>✏️ التمارين — النقطة والإحداثيات</h2>
            <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 12px', lineHeight: 1.6 }}>جرّب بنفسك — كل خطأ يعطيك تلميحًا، لا عقابًا.</p>
            <PointExercise />
          </div>
        )
      ) : stage === 'vectors' ? (
        tab === 'lesson' ? <VectorsStage /> : (
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '14px' }}>
            <h2 style={{ margin: '8px 0 4px', color: '#0f172a', fontSize: '1.25rem' }}>✏️ التمارين — الأشعة والجداء السلمي</h2>
            <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 12px' }}>تدرّج هادئ: سهل → متوسط → تحدّي + تطبيقات مكعب.</p>
            <VectorsExercises />
          </div>
        )
      ) : stage === 'planes' ? (
        tab === 'lesson' ? <PlaneStage /> : (
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '14px' }}>
            <h2 style={{ margin: '8px 0 4px', color: '#0f172a', fontSize: '1.25rem' }}>✏️ التمارين — المستوى</h2>
            <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>من التعويض البسيط إلى كشف الأخطاء الشائعة.</p>
            <PlaneExercises />
          </div>
        )
      ) : stage === 'lines' ? (
        tab === 'lesson' ? <LineStage /> : (
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '14px' }}>
            <h2 style={{ margin: '8px 0 4px', color: '#0f172a', fontSize: '1.25rem' }}>✏️ التمارين — المستقيمات</h2>
            <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>11 تمرين + تحكم كامل بالوسيط t.</p>
            <LineExercises />
          </div>
        )
      ) : stage === 'relations' ? (
        tab === 'lesson' ? <RelationsStage /> : (
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '14px' }}>
            <h2 style={{ margin: '8px 0 4px', color: '#0f172a', fontSize: '1.25rem' }}>✏️ التمارين — العلاقات</h2>
            <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>متوازيان؟ متقاطعان؟ متخالفان؟ تعرف بنفسك.</p>
            <RelationsExercises />
          </div>
        )
      ) : stage === 'distances' ? (
        tab === 'lesson' ? <DistancesStage /> : (
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '14px' }}>
            <h2 style={{ margin: '8px 0 4px', color: '#0f172a', fontSize: '1.25rem' }}>✏️ التمارين — المسافات</h2>
            <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>16 تمرين حول المسقط والعمود.</p>
            <DistancesExercises />
          </div>
        )
      ) : stage === 'spheres' ? (
        tab === 'lesson' ? <SphereStage /> : (
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '14px' }}>
            <h2 style={{ margin: '8px 0 4px', color: '#0f172a', fontSize: '1.25rem' }}>✏️ التمارين — الكرة</h2>
            <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>من المعادلة إلى التقاطع مع المستوى.</p>
            <SphereExercises />
          </div>
        )
      ) : stage === 'advanced' ? (
        tab === 'lesson' ? <AdvancedStage /> : (
          <div style={{ maxWidth: 1100, margin: '0 auto', padding: '14px' }}>
            <h2 style={{ margin: '8px 0 4px', color: '#0f172a', fontSize: '1.25rem' }}>✏️ التمارين — متقدمة</h2>
            <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>تقاطعات، مركز كرة، ومركز ثقل.</p>
            <AdvancedExercises />
          </div>
        )
      ) : stage === 'shapes' ? (
        tab === 'lesson' ? <ShapesStage /> : <div style={{ maxWidth: 1100, margin: '0 auto', padding: '14px' }}><h2 style={{ margin: '8px 0 4px', color: '#0f172a', fontSize: '1.25rem' }}>✏️ التمارين — الأشكال</h2><p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>20 تمرين تطبيقي</p><ShapesExercises /></div>
      ) : stage === 'barycenter' ? (
        tab === 'lesson' ? <BarycenterStage /> : <div style={{ maxWidth: 1100, margin: '0 auto', padding: '14px' }}><h2 style={{ margin: '8px 0 4px', color: '#0f172a', fontSize: '1.25rem' }}>✏️ التمارين — المركز المثقّل</h2><p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>25 تمرين — من نقطتين إلى رباعي الوجوه</p><BarycenterExercises /></div>
      ) : stage === 'sections' ? (
        tab === 'lesson' ? <SectionsStage /> : <div style={{ maxWidth: 1100, margin: '0 auto', padding: '14px' }}><h2 style={{ margin: '8px 0 4px', color: '#0f172a', fontSize: '1.25rem' }}>✏️ التمارين — المقاطع</h2><p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>18 تمرين + تكاملي</p><SectionsExercises /></div>
      ) : stage === 'integration' ? (
        tab === 'lesson' ? <IntegrationStage /> : <div style={{ maxWidth: 1100, margin: '0 auto', padding: '14px' }}><h2 style={{ margin: '8px 0 4px', color: '#0f172a', fontSize: '1.25rem' }}>✏️ التمارين — التكامل</h2><p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>راجع تمارين المقاطع 16-18</p><SectionsExercises /></div>
      ) : null}

      <footer style={{ textAlign: 'center', padding: '20px 14px', fontSize: 12.5, color: '#64748b', borderTop: '1px solid #e2e8f0', marginTop: 20, background: 'white', lineHeight: 1.7 }}>
        <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>هندسة الفضاء التفاعلية</div>
        <div>صُممت لتفهم، لا لتحفظ — كل معادلة تتحرك أمامك.</div>
        <div style={{ marginTop: 6, fontSize: 11, color: '#94a3b8' }} dir="ltr">Built with Three.js · React Three Fiber · KaTeX</div>
      </footer>
    </div>
  )
}
