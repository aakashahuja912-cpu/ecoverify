import { Leaf, ShieldCheck, ScanEye, Radar } from 'lucide-react'
import { AuditApp } from '@/components/audit-app'

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Leaf className="size-5" />
            </div>
            <div className="leading-tight">
              <p className="font-display text-base font-bold text-foreground">
                EcoVerify
              </p>
              <p className="text-xs text-muted-foreground">
                The Greenwash Sentinel
              </p>
            </div>
          </div>
          <span className="hidden items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground sm:flex">
            <ShieldCheck className="size-3.5 text-primary" />
            Multi-agent audit
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-6 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-xs font-medium text-primary">
          <Radar className="size-3.5" />
          Autonomous claim investigation
        </span>
        <h1 className="mx-auto mt-4 max-w-3xl text-balance font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl">
          Turn corporate green marketing into auditable truth.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          EcoVerify deploys three AI agents that read what a company claims about
          sustainability, cross-examine those claims against the public record,
          and output a defensible Greenwash Risk Score with cited evidence.
        </p>

        <div className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ScanEye className="size-4 text-primary" />
            Extracts verifiable claims
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-primary" />
            Challenges with public evidence
          </span>
          <span className="flex items-center gap-1.5">
            <Leaf className="size-4 text-primary" />
            Scores greenwash risk
          </span>
        </div>
      </section>

      {/* App */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <AuditApp />
      </section>

      {/* Footer */}
      <footer className="mt-8 border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-muted-foreground">
          EcoVerify · Adversarial sustainability auditing for ESG analysts,
          regulators, and journalists.
        </div>
      </footer>
    </main>
  )
}
