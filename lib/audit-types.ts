// Shared types for the EcoVerify multi-agent audit pipeline.
// These mirror the zod schemas used server-side so the client can render
// streamed events with full type-safety.

export type ClaimCategory =
  | 'emissions'
  | 'energy'
  | 'water'
  | 'waste'
  | 'sourcing'
  | 'biodiversity'
  | 'social'
  | 'other'

export type EvidenceSourceType =
  | 'regulatory'
  | 'news'
  | 'ngo'
  | 'court'
  | 'scientific'
  | 'financial'

export type EvidenceStance = 'contradicts' | 'supports' | 'context'

export type RiskLevel = 'low' | 'medium' | 'high'

export type Verdict =
  | 'verified'
  | 'needs_context'
  | 'misleading'
  | 'unsubstantiated'

export interface Claim {
  id: string
  text: string
  category: ClaimCategory
  metric: string | null
  timeframe: string | null
  isVague: boolean
}

export interface Evidence {
  source: string
  sourceType: EvidenceSourceType
  stance: EvidenceStance
  summary: string
  credibility: number // 0-100
}

export interface ClaimVerdict {
  claimId: string
  verdict: Verdict
  riskLevel: RiskLevel
  confidence: number // 0-100
  reasoning: string
}

// Discriminated union of every event streamed from the audit route.
export type AuditEvent =
  | {
      type: 'meta'
      company: string
      fetched: boolean
      url: string
    }
  | { type: 'agent'; agent: AgentId; state: AgentState; detail?: string }
  | { type: 'claims'; claims: Claim[] }
  | { type: 'evidence'; claimId: string; evidence: Evidence[] }
  | { type: 'verdict'; verdict: ClaimVerdict }
  | {
      type: 'result'
      score: number
      grade: string
      headline: string
      summary: string
    }
  | { type: 'error'; message: string }

export type AgentId = 'fact-finder' | 'challenger' | 'judge'
export type AgentState = 'running' | 'done' | 'error'

export const AGENTS: {
  id: AgentId
  name: string
  role: string
}[] = [
  {
    id: 'fact-finder',
    name: 'Fact-Finder',
    role: 'Extracts concrete, verifiable sustainability claims from the page.',
  },
  {
    id: 'challenger',
    name: 'Challenger',
    role: 'Cross-examines each claim against the public record for contradicting evidence.',
  },
  {
    id: 'judge',
    name: 'Judge',
    role: 'Weighs claims against evidence and issues a cited greenwash verdict.',
  },
]

export const CATEGORY_LABELS: Record<ClaimCategory, string> = {
  emissions: 'Emissions',
  energy: 'Energy',
  water: 'Water',
  waste: 'Waste',
  sourcing: 'Sourcing',
  biodiversity: 'Biodiversity',
  social: 'Social',
  other: 'Other',
}

export const VERDICT_LABELS: Record<Verdict, string> = {
  verified: 'Verified',
  needs_context: 'Needs Context',
  misleading: 'Misleading',
  unsubstantiated: 'Unsubstantiated',
}

export const SOURCE_TYPE_LABELS: Record<EvidenceSourceType, string> = {
  regulatory: 'Regulatory',
  news: 'News',
  ngo: 'NGO Report',
  court: 'Court Record',
  scientific: 'Scientific',
  financial: 'Financial Filing',
}
