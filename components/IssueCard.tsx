'use client'
import { useState } from 'react'
import { Issue, SEVERITY_CONFIG, TYPE_CONFIG } from '@/lib/types'

interface IssueCardProps {
  issue: Issue
  index: number
}

export function IssueCard({ issue, index }: IssueCardProps) {
  const [expanded, setExpanded] = useState(false)
  const sev = SEVERITY_CONFIG[issue.severity]
  const typ = TYPE_CONFIG[issue.type]

  return (
    <div
      className="issue-card animate-issue"
      style={{
        borderLeftColor: sev.color,
        animationDelay: `${index * 0.07}s`,
        opacity: 0,
      }}
    >
      <div
        className="flex items-start justify-between gap-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span style={{ fontSize: '16px', marginTop: '1px' }}>{typ.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#e4e4e7' }}>{issue.title}</span>
              {issue.line && (
                <span style={{
                  fontSize: '10px',
                  fontFamily: 'JetBrains Mono, monospace',
                  color: '#71717a',
                  background: '#1e1e2e',
                  padding: '1px 6px',
                  borderRadius: '4px'
                }}>
                  line {issue.line}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="badge" style={{ color: sev.color, background: sev.bg }}>
                {sev.label}
              </span>
              <span className="badge" style={{ color: '#71717a', background: 'rgba(113,113,122,0.1)' }}>
                {typ.label}
              </span>
            </div>
          </div>
        </div>
        <span style={{ color: '#52525b', fontSize: '16px', flexShrink: 0, transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▾
        </span>
      </div>

      {expanded && (
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #1e1e2e' }}>
          <p style={{ fontSize: '13px', color: '#a1a1aa', lineHeight: '1.6', marginBottom: '10px' }}>
            {issue.description}
          </p>
          {issue.fix && (
            <div>
              <div style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
                💡 Suggested Fix
              </div>
              <pre style={{
                background: '#0a0a0f',
                border: '1px solid #1e1e2e',
                borderRadius: '6px',
                padding: '10px 12px',
                fontSize: '12px',
                color: '#22c55e',
                fontFamily: 'JetBrains Mono, monospace',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
              }}>
                {issue.fix}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
