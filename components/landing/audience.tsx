import { LineChart, Landmark, Newspaper } from 'lucide-react'

const AUDIENCES = [
  {
    icon: LineChart,
    title: 'ESG analysts',
    desc: 'Screen portfolios for greenwashing exposure and back up ratings with reproducible, cited evidence.',
  },
  {
    icon: Landmark,
    title: 'Regulators',
    desc: 'Triage which sustainability disclosures warrant scrutiny under emerging anti-greenwashing rules.',
  },
  {
    icon: Newspaper,
    title: 'Journalists',
    desc: 'Move from a vague hunch to a documented story with claim-level verdicts and a defensible score.',
  },
]

export function Audience() {
  return (
    <section id="audience" className="scroll-mt-20 border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wide text-primary">
            Who it&rsquo;s for
          </span>
          <h2 className="mt-2 text-balance font-display text-3xl font-bold text-foreground sm:text-4xl">
            Adversarial auditing for people who need receipts
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {AUDIENCES.map((a) => (
            <div
              key={a.title}
              className="flex flex-col items-start rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <a.icon className="size-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-foreground">
                {a.title}
              </h3>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                {a.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
