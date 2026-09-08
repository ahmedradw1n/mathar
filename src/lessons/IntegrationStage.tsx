import SceneShell from '../three/SceneShell'
import CoordinateSystem3D from '../three/CoordinateSystem3D'
import SolidSection3D from '../three/SolidSection3D'
import Barycenter2D3D from '../three/Barycenter2D3D'
import { LessonLayout, StepBlock } from '../components/lessons/LessonLayout'
import { MathBlock, MathInline } from '../components/math/MathBlock'
import { weightedPointOnSegment } from '../math/barycenter'
import { buildSectionPolygon, cuboidVertices, cuboidEdges } from '../math/sections'
import type { Point3, Plane } from '../math/types'

export default function IntegrationStage() {
  const A: Point3 = { x: 0, y: 0, z: 0 }, B: Point3 = { x: 2, y: 0, z: 0 }
  const t = 0.4
  const M = weightedPointOnSegment(A, B, t)
  const plane: Plane = { a: 1, b: 1, c: 1, d: -2 }
  const verts = cuboidVertices(2, 2, 2)
  const edges = cuboidEdges()
  const sec = buildSectionPolygon(verts, edges, plane)

  return (
    <LessonLayout title="الربط التكاملي — من النسبة إلى المقطع" subtitle="النسب → النقاط المثقلة → الإحداثيات → نقاط التقاطع → شكل المقطع.">
      <StepBlock num="1" title="الفكرة">
        <p>نقطة على حرف: <MathInline tex="\\vec{AM}=t\\vec{AB}" />. هذه نفسها مركز مثقل <MathInline tex="M=bar((A,1-t),(B,t))" />. المستوى يقطع الحرف عند t محدد؛ هذا t هو نسبة، فيُكتب كأوزان، ومنه نحسب الإحداثيات ونبني المقطع.</p>
        <MathBlock tex="M = (1-t)A + tB,\\; t=0.4 \\Rightarrow M=bar((A,0.6),(B,0.4))" />
        <div style={{ height: 300, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white' }}>
          <SceneShell>
            <CoordinateSystem3D />
            <Barycenter2D3D A={A} B={B} G={M} />
          </SceneShell>
        </div>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: 8, fontSize: 12, marginTop: 8 }}>M=({M.x.toFixed(2)}, {M.y.toFixed(2)}, {M.z.toFixed(2)}) — أوزان 0.6 و 0.4</div>
      </StepBlock>
      <StepBlock num="2" title="من النسبة إلى مضلع المقطع">
        <p>مكعب 2×2×2 ومستوى <MathInline tex="x+y+z=2" /> — كل تقاطع مع حافة يُحسب t ثم يُمثل مثقلاً، والمجموع يعطي مثلث/رباعي المقطع.</p>
        <div style={{ height: 380, borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0', background: 'white' }}>
          <SceneShell>
            <CoordinateSystem3D />
            <SolidSection3D vertices={verts} edges={edges} plane={plane} sectionPoints={sec.points} labels={['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']} />
          </SceneShell>
        </div>
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: 10, fontSize: 13, marginTop: 8 }}>المقطع الحالي: {sec.points.length} نقاط — كل نقطة هي تقاطع حافة بنسبة t مقابلة لمركز مثقل.</div>
      </StepBlock>
      <StepBlock num="3" title="مسار الحل المتكامل">
        <MathBlock tex="\\text{نعطي } t → \\text{ نبني } M=bar → \\text{ نحسب إحداثيات } M → \\text{ نتحقق } M\\in E → \\text{ نجمع كل } M_i → \\text{ نرسم المضلع}" />
      </StepBlock>
    </LessonLayout>
  )
}
