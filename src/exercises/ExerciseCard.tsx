import { useState } from 'react'

type Props = {
  id: string
  title: string
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم'
  question: React.ReactNode
  hints: string[]
  solution: React.ReactNode
  check: (answer: string) => { ok: boolean; msg?: string }
  placeholder?: string
}

export default function ExerciseCard({ title, difficulty, question, hints, solution, check, placeholder = 'أدخل إجابتك...' }: Props) {
  const [answer, setAnswer] = useState('')
  const [hintIdx, setHintIdx] = useState(-1)
  const [result, setResult] = useState<null | { ok: boolean; msg?: string }>(null)
  const [showSolution, setShowSolution] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const handleCheck = () => {
    const r = check(answer.trim())
    setResult(r)
    setAttempts((n) => n + 1)
  }

  const diffColor: Record<string, string> = {
    مبتدئ: '#22c55e',
    متوسط: '#f59e0b',
    متقدم: '#ef4444',
  }

  return (
    <div
      style={{
        background: 'white',
        border: '1.5px solid #e2e8f0',
        borderRadius: 16,
        padding: 16,
        marginTop: 12,
      }}
    >
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 800, color: '#0f172a' }}>{title}</span>
        <span
          style={{
            background: diffColor[difficulty] ?? '#64748b',
            color: 'white',
            fontSize: 11,
            padding: '2px 8px',
            borderRadius: 999,
            fontWeight: 700,
          }}
        >
          {difficulty}
        </span>
        {attempts > 0 && <span style={{ fontSize: 12, color: '#64748b' }}>المحاولات: {attempts}</span>}
      </div>

      <div style={{ fontSize: 14.5, lineHeight: 1.7, color: '#334155', marginBottom: 12 }}>{question}</div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={placeholder}
          dir="ltr"
          style={{
            flex: '1 1 200px',
            minWidth: 160,
            padding: '10px 12px',
            borderRadius: 10,
            border: '1.5px solid #cbd5e1',
            fontSize: 15,
            outline: 'none',
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
        />
        <button
          onClick={handleCheck}
          style={{
            padding: '10px 18px',
            borderRadius: 10,
            border: 'none',
            background: '#0f172a',
            color: 'white',
            fontWeight: 700,
            cursor: 'pointer',
            minHeight: 44,
          }}
        >
          تحقق
        </button>
      </div>

      {result && (
        <div
          style={{
            marginTop: 10,
            padding: '10px 12px',
            borderRadius: 10,
            background: result.ok ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${result.ok ? '#bbf7d0' : '#fecaca'}`,
            color: result.ok ? '#166534' : '#991b1b',
            fontSize: 13.5,
            lineHeight: 1.6,
          }}
        >
          {result.ok ? '✅ أحسنت! إجابة صحيحة.' : `❌ ${result.msg ?? 'إجابة غير صحيحة، حاول مرة أخرى.'}`}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        <button
          onClick={() => setHintIdx((i) => Math.min(i + 1, hints.length - 1))}
          disabled={hintIdx >= hints.length - 1}
          style={{
            padding: '7px 12px',
            borderRadius: 999,
            border: '1px solid #e2e8f0',
            background: 'white',
            cursor: hintIdx >= hints.length - 1 ? 'not-allowed' : 'pointer',
            opacity: hintIdx >= hints.length - 1 ? 0.5 : 1,
            fontSize: 13,
          }}
        >
          تلميح {hintIdx + 2 <= hints.length ? `(${hintIdx + 2}/${hints.length})` : ''}
        </button>
        <button
          onClick={() => setShowSolution((v) => !v)}
          style={{
            padding: '7px 12px',
            borderRadius: 999,
            border: '1px solid #e2e8f0',
            background: '#f8fafc',
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          {showSolution ? 'إخفاء الحل' : 'أظهر الحل'}
        </button>
      </div>

      {hintIdx >= 0 && (
        <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
          {hints.slice(0, hintIdx + 1).map((h, i) => (
            <div
              key={i}
              style={{
                background: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: 10,
                padding: '8px 10px',
                fontSize: 13,
                color: '#92400e',
              }}
            >
              تلميح {i + 1}: {h}
            </div>
          ))}
        </div>
      )}

      {showSolution && (
        <div
          style={{
            marginTop: 10,
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 10,
            padding: '10px 12px',
            fontSize: 13.5,
            lineHeight: 1.7,
            color: '#334155',
          }}
        >
          <strong>الحل المشروح:</strong>
          <div style={{ marginTop: 6 }}>{solution}</div>
        </div>
      )}
    </div>
  )
}
