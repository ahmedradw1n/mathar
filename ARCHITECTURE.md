# Architecture

## Math Core (pure, EPS统一)
- `src/math/eps.ts` — EPS=1e-9
- `src/math/vectors.ts`, `points.ts`, `lines.ts`, `planes.ts`, `distances.ts`, `spheres.ts`, `advancedGeometry.ts`, `geometryShapes.ts`
- **جديد**: `src/math/barycenter.ts` — weightedBarycenter, 2/3/4, verify, weightsFromRatio, ratioFromWeights, tFromPosition, combine, associative, classify, invariant
- **جديد**: `src/math/sections.ts` — intersectPlaneWithSegment, planeSegmentT, buildSectionPolygon, cuboid/tetra helpers, sectionKindLabel
- كل الدوال pure، ترجع null/Result عند Σ≈0 أو مستو غير صالح، لا NaN/Infinity

## 3D Components (React Three Fiber)
- `SceneShell`, `CoordinateSystem3D`, `Cuboid3D`, `Tetrahedron3D`, `Plane3D` إلخ
- **جديد**: `Barycenter2D3D`, `Barycenter3D3D`, `BarycenterGrouping3D`, `BarycenterTetra3D`, `SolidSection3D`

## Lessons
- `PointLesson`, `VectorsStage`, `PlaneStage`, `LineStage`, `RelationsStage`, `DistancesStage`, `SphereStage`, `AdvancedStage`, `ShapesStage`
- **جديد**: `BarycenterStage` (9 خطوات)، `SectionsStage` (6 خطوات)، `IntegrationStage` (ربط تكاملي)

## Exercises
- كل مرحلة لها ملف تمارين مع ExerciseCard (hints[3], solution, check EPS)
- **جديد**: `BarycenterExercises` (25)، `SectionsExercises` (18 تكاملي ضمنها)

## Data Flow
- Lesson → Math Core → 3D visualizer (لا حساب داخل Canvas)
- Sliders → useMemo(Math Core) → props → Three
- Exercises → Math Core للتحقق

## Navigation
- `App.tsx` stages: basics, vectors, planes, lines, relations, distances, spheres, advanced, shapes, barycenter, sections, integration
- RTL, عربية، شعاع (لا فيكتور)، dir=ltr للمعادلات
