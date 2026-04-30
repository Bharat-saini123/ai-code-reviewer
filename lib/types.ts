export type IssueType = 'bug' | 'security' | 'performance' | 'style' | 'improvement'
export type Severity = 'critical' | 'warning' | 'info'

export interface Issue {
  type: IssueType
  severity: Severity
  title: string
  description: string
  line: string | null
  fix: string
}

export interface ReviewResult {
  score: number
  summary: string
  issues: Issue[]
  positives: string[]
  bestPractices: string[]
}

export const LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++',
  'C', 'Go', 'Rust', 'PHP', 'Ruby', 'Swift', 'Kotlin', 'SQL', 'Other'
]

export const SEVERITY_CONFIG: Record<Severity, { color: string; bg: string; label: string }> = {
  critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', label: 'Critical' },
  warning: { color: '#eab308', bg: 'rgba(234,179,8,0.1)', label: 'Warning' },
  info: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', label: 'Info' },
}

export const TYPE_CONFIG: Record<IssueType, { icon: string; label: string }> = {
  bug: { icon: '🐛', label: 'Bug' },
  security: { icon: '🔒', label: 'Security' },
  performance: { icon: '⚡', label: 'Performance' },
  style: { icon: '🎨', label: 'Style' },
  improvement: { icon: '✨', label: 'Improvement' },
}
