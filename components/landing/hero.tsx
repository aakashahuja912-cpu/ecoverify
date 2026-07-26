import { Radar, ScanEye, ShieldCheck, Leaf, ArrowDown } from 'lucide-react'

const STATS = [
  { value: '3', label: 'Adversarial agents' },
  { value: '0-100', label: 'Greenwash Risk Score' },
  { value: 'Cited', label: 'Evidence, every claim' },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      {/* soft background wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,var(--color-accent)_0%,transparent_70%)] opacity-60"
      />
      <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-16 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Radar className="size-3.5" />
          Autonomous claim investigation
        </span>

        <h1 className="mx-auto mt-5 max-w-3xl text-balance font-display text-4xl font-bold leading-[1.08] text-foreground sm:text-5xl md:text-6xl">
          Turn corporate green marketing into auditable truth.
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
          EcoVerify deploys three AI agents that read what a company claims about
          sustainability, cross-examine those claims against the public record,
          and output a defensible Greenwash Risk Score with cited evidence.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#audit"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <ShieldCheck className="size-4" />
            Run a free audit
          </a>
          <a
            href="#how"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            See how it works
            <ArrowDown className="size-4" />
          </a>
        </div>

        <div className="mx-auto mt-8 flex max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
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

        <dl className="mx-auto mt-12 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-card px-4 py-5 shadow-sm"
            >
              <dt className="font-display text-2xl font-bold text-primary">
                {s.value}
              </dt>
              <dd className="mt-1 text-sm text-muted-foreground">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
