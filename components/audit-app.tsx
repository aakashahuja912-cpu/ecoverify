'use client'

import { useState, type KeyboardEvent } from 'react'
import {
  Search,
  Radar,
  TriangleAlert,
  RotateCcw,
  Building2,
  Info,
  FileDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAudit } from '@/lib/use-audit'
import { generateAuditReport } from '@/lib/generate-report'
import { AgentPipeline } from '@/components/agent-pipeline'
import { RiskGauge } from '@/components/risk-gauge'
import { VerificationCard } from '@/components/verification-card'

const EXAMPLES = [
  { label: 'Fast fashion brand', url: 'https://www.shein.com/About-Us-a-117.html' },
  { label: 'Major airline', url: 'https://www.ryanair.com/gb/en/useful-info/about-ryanair/environment' },
  { label: 'Oil & gas major', url: 'https://corporate.exxonmobil.com/sustainability-and-reports' },
  { label: 'Global apparel', url: 'https://hmgroup.com/sustainability/' },
]

export function AuditApp() {
  const { state, run, reset } = useAudit()
  const [url, setUrl] = useState('')
  const [lastUrl, setLastUrl] = useState('')

  const isRunning = state.status === 'running'
  const hasStarted = state.status !== 'idle'

  const submit = () => {
    const trimmed = url.trim()
    if (!trimmed || isRunning) return
    const normalized = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`
    setUrl(normalized)
    setLastUrl(normalized)
    run(normalized)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (
      e.key === 'Enter' &&
      !e.nativeEvent.isComposing &&
      e.keyCode !== 229
    ) {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Input */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <label
          htmlFor="audit-url"
          className="mb-2 block text-sm font-medium text-foreground"
        >
          Sustainability page URL
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="audit-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="https://company.com/sustainability"
              disabled={isRunning}
              className="h-11 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 disabled:opacity-60"
            />
          </div>
          <Button
            onClick={submit}
            disabled={isRunning || !url.trim()}
            className="h-11 px-5"
          >
            <Radar className="size-4" />
            {isRunning ? 'Auditing…' : 'Run Audit'}
          </Button>
          {hasStarted && !isRunning && (
            <Button
              variant="outline"
              onClick={() => {
                reset()
                setUrl('')
                setLastUrl('')
              }}
              className="h-11 px-3"
            >
              <RotateCcw className="size-4" />
              Reset
            </Button>
          )}
        </div>

        {!hasStarted && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground">Try:</span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex.url}
                onClick={() => {
                  setUrl(ex.url)
                  setLastUrl(ex.url)
                  run(ex.url)
                }}
                className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {ex.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error */}
      {state.status === 'error' && (
        <div className="flex items-start gap-3 rounded-xl border border-risk-high/30 bg-risk-high/8 p-4">
          <TriangleAlert className="mt-0.5 size-5 shrink-0 text-risk-high" />
          <div>
            <p className="text-sm font-semibold text-risk-high">
              Audit failed
            </p>
            <p className="text-sm text-muted-foreground">{state.error}</p>
          </div>
        </div>
      )}

      {/* Live pipeline */}
      {hasStarted && state.status !== 'error' && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Agent pipeline
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {state.company && (
                <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                  <Building2 className="size-3.5" />
                  {state.company}
                  {!state.fetched && ' · from knowledge base'}
                </span>
              )}
            </div>
          </div>
          <AgentPipeline agents={state.agents} />
        </section>
      )}

      {/* Result summary */}
      {state.result && (
        <section className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col items-center gap-6 md:flex-row md:items-center md:gap-8">
            <RiskGauge score={state.result.score} grade={state.result.grade} />
            <div className="flex-1 text-center md:text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Greenwash verdict
              </p>
              <h3 className="mt-1 text-balance font-display text-2xl font-bold text-foreground">
                {state.result.headline}
              </h3>
              <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">
                {state.result.summary}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-foreground">
              Export the full verdict and every verification card as a
              shareable PDF.
            </p>
            <Button
              variant="outline"
              onClick={() => generateAuditReport(state, lastUrl)}
              className="h-10 shrink-0 px-4"
            >
              <FileDown className="size-4" />
              Download PDF report
            </Button>
          </div>
        </section>
      )}

      {/* Verification cards */}
      {state.claims.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Verification cards
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              {state.claims.length} claim
              {state.claims.length === 1 ? '' : 's'} examined
            </span>
          </h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {state.claims.map((claim, i) => (
              <VerificationCard
                key={claim.id}
                index={i + 1}
                claim={claim}
                evidence={state.evidence[claim.id]}
                verdict={state.verdicts[claim.id]}
              />
            ))}
          </div>
          <p className="flex items-start gap-2 rounded-lg bg-muted/60 p-3 text-xs leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0" />
            Evidence is drawn from the model&rsquo;s knowledge of public
            regulatory, legal, news, and NGO records. In production, the
            Challenger connects to live source APIs (EPA ECHO, court dockets,
            news wires) so every finding links to a primary citation.
          </p>
        </section>
      )}
    </div>
  )
}
