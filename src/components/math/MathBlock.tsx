import 'katex/dist/katex.min.css'
import katex from 'katex'

export function MathInline({ tex }: { tex: string }) {
  const html = katex.renderToString(tex, { throwOnError: false, displayMode: false })
  return <span dir="ltr" style={{ unicodeBidi: 'isolate' }} dangerouslySetInnerHTML={{ __html: html }} />
}

export function MathBlock({ tex }: { tex: string }) {
  const html = katex.renderToString(tex, { throwOnError: false, displayMode: true })
  return (
    <div
      dir="ltr"
      style={{
        unicodeBidi: 'isolate',
        overflowX: 'auto',
        padding: '8px 4px',
        margin: '8px 0',
        background: '#f8fafc',
        borderRadius: 10,
        border: '1px solid #e2e8f0',
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
