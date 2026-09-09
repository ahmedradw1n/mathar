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
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '16px 14px' }}>
      <header style={{ marginBottom: 16, background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: '14px 16px' }}>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.25 }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ color: '#475569', marginTop: 8, fontSize: 14.5, lineHeight: 1.7, marginBottom: 0 }}>{subtitle}</p>
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
      className="step-block"
      style={{
        background: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: 18,
        padding: 14,
        marginBottom: 14,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
        <span
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: '#0f172a',
            color: 'white',
            display: 'grid',
            placeItems: 'center',
            fontWeight: 800,
            fontSize: 14,
            flexShrink: 0,
            marginTop: 1,
          }}
        >
          {num}
        </span>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#0f172a', lineHeight: 1.4, paddingTop: 4 }}>{title}</h3>
      </div>
      <div style={{ color: '#334155', lineHeight: 1.85, fontSize: 15 }}>{children}</div>
    </section>
  )
}

export function HintBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#fffbeb',
        border: '1px solid #fde68a',
        borderRadius: 12,
        padding: '12px 14px',
        fontSize: 13.5,
        color: '#92400e',
        lineHeight: 1.75,
      }}
    >
      <span style={{ fontWeight: 800 }}>💡 تلميح سريع:</span> {children}
    </div>
  )
}

export function HumanNote({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: 12,
        padding: '12px 14px',
        fontSize: 13.5,
        color: '#166534',
        lineHeight: 1.75,
      }}
    >
      <span style={{ fontWeight: 800 }}>🗣️ ببساطة:</span> {children}
    </div>
  )
}

export function WarningBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: 12,
        padding: '12px 14px',
        fontSize: 13.5,
        color: '#991b1b',
        lineHeight: 1.75,
      }}
    >
      ⚠️ {children}
    </div>
  )
}
