'use client'

import { useState } from 'react'
import { ReviewResult, LANGUAGES } from '@/lib/types'
import { ScoreRing } from '@/components/ScoreRing'
import { IssueCard } from '@/components/IssueCard'

const SAMPLE_CODE = `function getUserData(userId) {
  const query = "SELECT * FROM users WHERE id = " + userId;
  const result = db.execute(query);
  
  var userData = result[0];
  
  if (userData != null) {
    console.log("User found: " + userData.password);
    return userData;
  }
}`

export default function Home() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('JavaScript')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ReviewResult | null>(null)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'issues' | 'positives' | 'tips'>('issues')

  const handleReview = async () => {
    if (!code.trim()) { setError('Please paste some code first.'); return }
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Review failed')
      setResult(data)
      setActiveTab('issues')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const criticalCount = result?.issues.filter(i => i.severity === 'critical').length ?? 0
  const warningCount = result?.issues.filter(i => i.severity === 'warning').length ?? 0
  const infoCount = result?.issues.filter(i => i.severity === 'info').length ?? 0

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', padding: '0 0 60px' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid #1e1e2e',
        padding: '0 24px',
        background: 'rgba(18,18,26,0.8)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px'
            }}>⚡</div>
            <span style={{ fontWeight: 700, fontSize: '16px', letterSpacing: '-0.02em' }}>CodeReview<span style={{ color: '#7c3aed' }}>AI</span></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: '#52525b', fontFamily: 'JetBrains Mono, monospace' }}>powered by</span>
            <span style={{
              fontSize: '11px', fontWeight: 600,
              background: 'linear-gradient(90deg, #7c3aed, #a855f7)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              fontFamily: 'JetBrains Mono, monospace'
            }}>Claude AI</span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px 0' }}>
        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: '12px',
          }}>
            AI Code Review,{' '}
            <span style={{
              background: 'linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>Instantly</span>
          </h1>
          <p style={{ color: '#71717a', fontSize: '15px', maxWidth: '420px', margin: '0 auto' }}>
            Paste your code. Get bugs, security issues, and improvements in seconds.
          </p>
        </div>

        <div className={`layout-grid ${result ? 'has-result' : ''}`}>
          {/* Left: Input panel */}
          <div>
            <div style={{
              background: '#12121a',
              border: '1px solid #1e1e2e',
              borderRadius: '12px',
              overflow: 'hidden',
            }}>
              {/* Panel header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px',
                borderBottom: '1px solid #1e1e2e',
                background: 'rgba(255,255,255,0.02)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#eab308' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
                  <span style={{ marginLeft: '8px', fontSize: '12px', color: '#52525b', fontFamily: 'JetBrains Mono, monospace' }}>your_code</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <select
                    value={language}
                    onChange={e => setLanguage(e.target.value)}
                    style={{
                      background: '#1e1e2e',
                      border: '1px solid #2a2a3e',
                      color: '#a1a1aa',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      fontFamily: 'JetBrains Mono, monospace',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <button
                    onClick={() => setCode(SAMPLE_CODE)}
                    style={{
                      background: 'rgba(124,58,237,0.1)',
                      border: '1px solid rgba(124,58,237,0.3)',
                      color: '#a855f7',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      fontFamily: 'JetBrains Mono, monospace',
                      transition: 'all 0.15s',
                    }}
                  >
                    sample
                  </button>
                </div>
              </div>

              {/* Code textarea */}
              <div style={{ padding: '4px' }}>
                <textarea
                  className="code-area"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  placeholder="// Paste your code here..."
                  rows={18}
                  style={{ borderRadius: '8px', border: '1px solid transparent' }}
                />
              </div>

              {/* Action bar */}
              <div style={{ padding: '12px 16px', borderTop: '1px solid #1e1e2e', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#3f3f46', fontFamily: 'JetBrains Mono, monospace' }}>
                  {code.length > 0 ? `${code.split('\n').length} lines · ${code.length} chars` : 'ready to analyze'}
                </span>
                <button
                  onClick={handleReview}
                  disabled={loading}
                  style={{
                    background: loading ? '#1e1e2e' : 'linear-gradient(135deg, #7c3aed, #a855f7)',
                    color: loading ? '#52525b' : 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 24px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                    fontFamily: 'Space Grotesk, sans-serif',
                    boxShadow: loading ? 'none' : '0 4px 20px rgba(124,58,237,0.4)',
                  }}
                >
                  {loading ? (
                    <>
                      <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid #52525b', borderTopColor: '#7c3aed', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                      Analyzing...
                    </>
                  ) : (
                    <> ⚡ Review Code </>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div style={{
                marginTop: '12px',
                padding: '12px 16px',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: '8px',
                color: '#ef4444',
                fontSize: '13px',
              }}>
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* Right: Results panel */}
          {result && (
            <div style={{ animation: 'fadeSlideUp 0.4s ease forwards' }}>
              {/* Score + summary */}
              <div style={{
                background: '#12121a',
                border: '1px solid #1e1e2e',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '16px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' }}>
                  <ScoreRing score={result.score} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', fontFamily: 'JetBrains Mono, monospace' }}>
                      Code Quality Score
                    </div>
                    <p style={{ fontSize: '13px', color: '#a1a1aa', lineHeight: '1.6' }}>{result.summary}</p>
                  </div>
                </div>

                {/* Issue counts */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { label: 'Critical', count: criticalCount, color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
                    { label: 'Warnings', count: warningCount, color: '#eab308', bg: 'rgba(234,179,8,0.08)' },
                    { label: 'Info', count: infoCount, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
                  ].map(({ label, count, color, bg }) => (
                    <div key={label} style={{
                      background: bg,
                      border: `1px solid ${color}30`,
                      borderRadius: '8px',
                      padding: '10px',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: '22px', fontWeight: 700, color, fontFamily: 'JetBrains Mono, monospace' }}>{count}</div>
                      <div style={{ fontSize: '11px', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', background: '#12121a', borderRadius: '8px', padding: '4px', border: '1px solid #1e1e2e' }}>
                {(['issues', 'positives', 'tips'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      flex: 1,
                      padding: '7px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'Space Grotesk, sans-serif',
                      textTransform: 'capitalize',
                      transition: 'all 0.15s',
                      background: activeTab === tab ? 'linear-gradient(135deg, #7c3aed, #a855f7)' : 'transparent',
                      color: activeTab === tab ? 'white' : '#52525b',
                    }}
                  >
                    {tab === 'issues' ? `Issues (${result.issues.length})` : tab === 'positives' ? `✅ Positives` : `💡 Tips`}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div style={{
                background: '#12121a',
                border: '1px solid #1e1e2e',
                borderRadius: '12px',
                padding: '16px',
                maxHeight: '400px',
                overflowY: 'auto',
              }}>
                {activeTab === 'issues' && (
                  result.issues.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '32px', color: '#22c55e' }}>
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                      <div style={{ fontSize: '14px', fontWeight: 600 }}>No issues found!</div>
                      <div style={{ fontSize: '12px', color: '#52525b', marginTop: '4px' }}>Clean code 🎉</div>
                    </div>
                  ) : (
                    result.issues.map((issue, i) => <IssueCard key={i} issue={issue} index={i} />)
                  )
                )}

                {activeTab === 'positives' && (
                  <div>
                    {result.positives.length === 0 ? (
                      <p style={{ color: '#52525b', fontSize: '13px', textAlign: 'center', padding: '24px' }}>No specific positives noted.</p>
                    ) : result.positives.map((p, i) => (
                      <div key={i} className="animate-issue" style={{
                        display: 'flex', alignItems: 'flex-start', gap: '10px',
                        padding: '10px 12px', marginBottom: '8px',
                        background: 'rgba(34,197,94,0.05)',
                        border: '1px solid rgba(34,197,94,0.15)',
                        borderRadius: '8px',
                        animationDelay: `${i * 0.06}s`,
                        opacity: 0,
                      }}>
                        <span style={{ color: '#22c55e', flexShrink: 0 }}>✓</span>
                        <span style={{ fontSize: '13px', color: '#a1a1aa', lineHeight: '1.5' }}>{p}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'tips' && (
                  <div>
                    {result.bestPractices.length === 0 ? (
                      <p style={{ color: '#52525b', fontSize: '13px', textAlign: 'center', padding: '24px' }}>No additional tips.</p>
                    ) : result.bestPractices.map((tip, i) => (
                      <div key={i} className="animate-issue" style={{
                        display: 'flex', alignItems: 'flex-start', gap: '10px',
                        padding: '10px 12px', marginBottom: '8px',
                        background: 'rgba(124,58,237,0.05)',
                        border: '1px solid rgba(124,58,237,0.15)',
                        borderRadius: '8px',
                        animationDelay: `${i * 0.06}s`,
                        opacity: 0,
                      }}>
                        <span style={{ color: '#7c3aed', flexShrink: 0 }}>→</span>
                        <span style={{ fontSize: '13px', color: '#a1a1aa', lineHeight: '1.5' }}>{tip}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reset */}
              <button
                onClick={() => { setResult(null); setCode(''); setError('') }}
                style={{
                  marginTop: '12px',
                  width: '100%',
                  padding: '10px',
                  background: 'transparent',
                  border: '1px solid #1e1e2e',
                  borderRadius: '8px',
                  color: '#52525b',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  fontFamily: 'Space Grotesk, sans-serif',
                }}
                onMouseEnter={e => { (e.target as HTMLButtonElement).style.borderColor = '#ef4444'; (e.target as HTMLButtonElement).style.color = '#ef4444' }}
                onMouseLeave={e => { (e.target as HTMLButtonElement).style.borderColor = '#1e1e2e'; (e.target as HTMLButtonElement).style.color = '#52525b' }}
              >
                ↺ Start New Review
              </button>
            </div>
          )}
        </div>

        {/* Features row */}
        {!result && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            marginTop: '40px',
          }}>
            {[
              { icon: '🐛', title: 'Bug Detection', desc: 'Finds logic errors & runtime issues' },
              { icon: '🔒', title: 'Security Scan', desc: 'SQL injection, XSS, and more' },
              { icon: '⚡', title: 'Performance', desc: 'Inefficiencies & bottlenecks' },
              { icon: '✨', title: 'Best Practices', desc: 'Clean code recommendations' },
            ].map(f => (
              <div key={f.title} style={{
                background: '#12121a',
                border: '1px solid #1e1e2e',
                borderRadius: '10px',
                padding: '16px',
                transition: 'border-color 0.2s, transform 0.2s',
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = '#7c3aed'; el.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = '#1e1e2e'; el.style.transform = 'translateY(0)' }}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{f.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>{f.title}</div>
                <div style={{ fontSize: '12px', color: '#52525b', lineHeight: '1.4' }}>{f.desc}</div>
              </div>
            ))}
          </div>
        )}
      </main>

      <style>{`
        .layout-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          transition: all 0.3s ease;
        }
        @media (min-width: 800px) {
          .layout-grid.has-result {
            grid-template-columns: 1fr 1fr;
          }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeSlideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  )
}
