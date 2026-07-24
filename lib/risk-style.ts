import type { RiskLevel, Verdict, EvidenceStance } from '@/lib/audit-types'

export const riskColor: Record<RiskLevel, string> = {
  low: 'text-risk-low',
  medium: 'text-risk-medium',
  high: 'text-risk-high',
}

export const riskBg: Record<RiskLevel, string> = {
  low: 'bg-risk-low/12 text-risk-low border-risk-low/25',
  medium: 'bg-risk-medium/15 text-risk-medium border-risk-medium/30',
  high: 'bg-risk-high/12 text-risk-high border-risk-high/25',
}

export const verdictToRisk: Record<Verdict, RiskLevel> = {
  verified: 'low',
  needs_context: 'medium',
  misleading: 'high',
  unsubstantiated: 'high',
}

export const stanceStyle: Record<
  EvidenceStance,
  { label: string; className: string }
> = {
  contradicts: {
    label: 'Contradicts',
    className: 'bg-risk-high/12 text-risk-high',
  },
  context: {
    label: 'Context',
    className: 'bg-risk-medium/15 text-risk-medium',
  },
  supports: {
    label: 'Supports',
    className: 'bg-risk-low/12 text-risk-low',
  },
}

// Score band -> gauge stroke color (uses theme tokens via css var lookup)
export function scoreBand(score: number): RiskLevel {
  if (score < 40) return 'low'
  if (score < 70) return 'medium'
  return 'high'
}

export function scoreVarColor(score: number): string {
  const band = scoreBand(score)
  return band === 'low'
    ? 'var(--risk-low)'
    : band === 'medium'
      ? 'var(--risk-medium)'
      : 'var(--risk-high)'
}
