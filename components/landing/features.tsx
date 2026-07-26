import {
  Gauge,
  FileSearch,
  Quote,
  Radar,
  ListChecks,
  ShieldCheck,
} from 'lucide-react'

const FEATURES = [
  {
    icon: Gauge,
    title: 'Greenwash Risk Score',
    desc: 'A single 0\u2013100 score with a letter grade, weighting contradicted and unsubstantiated claims most heavily.',
  },
  {
    icon: ListChecks,
    title: 'Claim-by-claim verdicts',
    desc: 'Every extracted claim gets its own verification card with a verdict, risk level, and confidence rating.',
  },
  {
    icon: Quote,
    title: 'Cited evidence',
    desc: 'Findings are grounded in public regulatory, legal, news, and NGO records \u2014 never unsupported assertions.',
  },
  {
    icon: Radar,
    title: 'Live agent pipeline',
    desc: 'Watch the Fact-Finder, Challenger, and Judge work in real time as the audit streams to your screen.',
  },
  {
    icon: FileSearch,
    title: 'Reads any page',
    desc: 'Point it at any company sustainability or ESG page and it extracts the concrete, checkable claims.',
  },
  {
    icon: ShieldCheck,
    title: 'Built to defend',
    desc: 'Structured, reproducible output designed for ESG analysts, regulators, and journalists who need receipts.',
  },
]

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 border-b border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wide text-primary">
            Capabilities
          </span>
          <h2 className="mt-2 text-balance font-display text-3xl font-bold text-foreground sm:text-4xl">
            Everything you need to hold claims to account
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary/40"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <f.icon className="size-5" />
              </div>
              <h3 className="mt-4 font-display text-base font-bold text-foreground">
                {f.title}
              </h3>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
