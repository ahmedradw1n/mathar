import React from 'react'

export function LessonLayout({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 16px' }}>
      <header style={{ marginBottom: 18 }}>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ color: '#475569', marginTop: 8, fontSize: 15, lineHeight: 1.6 }}>{subtitle}</p>
        )}
      </header>
      <div>{children}</div>
    </div>
  )
}

export function StepBlock({
  num,
  title,
  children,
}: {
  num: number | string
  title: string
  children: React.ReactNode
}) {
  return (
    <section
      style={{
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
      }}
    >
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10 }}>
        <span
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: '#0f172a',
            color: 'white',
            display: 'grid',
            placeItems: 'center',
            fontWeight: 700,
            fontSize: 14,
            flexShrink: 0,
          }}
        >
          {num}
        </span>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{title}</h3>
      </div>
      <div style={{ color: '#334155', lineHeight: 1.75, fontSize: 14.5 }}>{children}</div>
    </section>
  )
}

export function HintBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#fefce8',
        border: '1px solid #fde68a',
        borderRadius: 12,
        padding: '10px 12px',
        fontSize: 13.5,
        color: '#92400e',
        lineHeight: 1.6,
      }}
    >
      💡 {children}
    </div>
  )
}
