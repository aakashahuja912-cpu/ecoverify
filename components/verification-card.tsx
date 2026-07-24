'use client'

import {
  Landmark,
  Newspaper,
  Users,
  Gavel,
  FlaskConical,
  FileText,
  Loader,
  Info,
} from 'lucide-react'
import {
  CATEGORY_LABELS,
  SOURCE_TYPE_LABELS,
  VERDICT_LABELS,
  type Claim,
  type ClaimVerdict,
  type Evidence,
  type EvidenceSourceType,
} from '@/lib/audit-types'
import { riskBg, stanceStyle, verdictToRisk } from '@/lib/risk-style'
import { cn } from '@/lib/utils'

const SOURCE_ICONS: Record<EvidenceSourceType, typeof Landmark> = {
  regulatory: Landmark,
  news: Newspaper,
  ngo: Users,
  court: Gavel,
  scientific: FlaskConical,
  financial: FileText,
}

interface VerificationCardProps {
  index: number
  claim: Claim
  evidence: Evidence[] | undefined
  verdict: ClaimVerdict | undefined
}

export function VerificationCard({
  index,
  claim,
  evidence,
  verdict,
}: VerificationCardProps) {
  const risk = verdict ? verdictToRisk[verdict.verdict] : null

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border p-5">
        <div className="flex-1 min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-[0.7rem] font-semibold text-muted-foreground">
              CLAIM {index}
            </span>
            <span className="rounded-md bg-accent px-1.5 py-0.5 text-[0.7rem] font-medium text-accent-foreground">
              {CATEGORY_LABELS[claim.category]}
            </span>
            {claim.isVague && (
              <span className="rounded-md bg-risk-medium/15 px-1.5 py-0.5 text-[0.7rem] font-medium text-risk-medium">
                Vague wording
              </span>
            )}
          </div>
          <p className="text-pretty text-base font-medium leading-relaxed text-foreground">
            &ldquo;{claim.text}&rdquo;
          </p>
        </div>
        {verdict && risk ? (
          <span
            className={cn(
              'shrink-0 rounded-full border px-3 py-1 text-xs font-semibold',
              riskBg[risk],
            )}
          >
            {VERDICT_LABELS[verdict.verdict]}
          </span>
        ) : (
          <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
            <Loader className="size-3 animate-spin" />
            Judging
          </span>
        )}
      </div>

      {/* Evidence */}
      <div className="p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Evidence from the public record
        </p>
        {!evidence ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader className="size-4 animate-spin" />
            Challenger is searching credible sources…
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {evidence.map((e, i) => {
              const Icon = SOURCE_ICONS[e.sourceType] ?? Info
              const stance = stanceStyle[e.stance]
              return (
                <li key={i} className="flex gap-3">
                  <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Icon className="size-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {e.source}
                      </span>
                      <span
                        className={cn(
                          'rounded px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase',
                          stance.className,
                        )}
                      >
                        {stance.label}
                      </span>
                      <span className="text-[0.65rem] text-muted-foreground">
                        {SOURCE_TYPE_LABELS[e.sourceType]} · {e.credibility}%
                        cred.
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                      {e.summary}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Verdict reasoning */}
      {verdict && risk && (
        <div
          className={cn(
            'flex flex-col gap-1 border-t p-5',
            risk === 'high'
              ? 'border-risk-high/20 bg-risk-high/5'
              : risk === 'medium'
                ? 'border-risk-medium/20 bg-risk-medium/5'
                : 'border-risk-low/20 bg-risk-low/5',
          )}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Judge&rsquo;s reasoning
            </p>
            <span className="text-xs font-medium text-muted-foreground">
              {verdict.confidence}% confidence
            </span>
          </div>
          <p className="text-sm leading-relaxed text-foreground">
            {verdict.reasoning}
          </p>
        </div>
      )}
    </article>
  )
}
