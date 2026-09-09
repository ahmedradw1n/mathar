import 'katex/dist/katex.min.css'
import katex from 'katex'

export function MathInline({ tex }: { tex: string }) {
  const html = katex.renderToString(tex, { throwOnError: false, displayMode: false })
  return <span dir="ltr" style={{ unicodeBidi: 'isolate', display: 'inline-block', maxWidth: '100%', overflowX: 'auto', verticalAlign: 'middle', WebkitOverflowScrolling: 'touch' as any }} dangerouslySetInnerHTML={{ __html: html }} />
}

export function MathBlock({ tex, label }: { tex: string; label?: string }) {
  const html = katex.renderToString(tex, { throwOnError: false, displayMode: true })
  return (
    <div
      className="math-block"
      style={{
        margin: '10px 0',
        background: '#f8fafc',
        borderRadius: 12,
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
      }}
    >
      {label && (
        <div style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', background: '#f5f3ff', padding: '6px 10px', borderBottom: '1px solid #ede9fe', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7c3aed', display: 'inline-block' }} /> {label}
        </div>
      )}
      <div
        dir="ltr"
        style={{
          unicodeBidi: 'isolate',
          overflowX: 'auto',
          padding: '12px 10px',
          WebkitOverflowScrolling: 'touch',
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
