import { ScanEye, Gavel, Scale } from 'lucide-react'

const STEPS = [
  {
    icon: ScanEye,
    name: 'The Fact-Finder',
    step: 'Agent 01',
    desc: 'Reads a company\u2019s sustainability page and extracts the 3\u20135 most concrete, checkable claims \u2014 numbers, targets, and dates \u2014 while flagging vague marketing puffery.',
  },
  {
    icon: Gavel,
    name: 'The Challenger',
    step: 'Agent 02',
    desc: 'Acts as a skeptical investigative journalist, cross-examining each claim against the public record: regulators, court filings, reputable news, NGO reports, and scientific studies.',
  },
  {
    icon: Scale,
    name: 'The Judge',
    step: 'Agent 03',
    desc: 'Weighs each claim against its evidence, issues a verdict \u2014 verified, needs context, misleading, or unsubstantiated \u2014 and computes an overall Greenwash Risk Score.',
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 border-b border-border">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-wide text-primary">
            The pipeline
          </span>
          <h2 className="mt-2 text-balance font-display text-3xl font-bold text-foreground sm:text-4xl">
            Three adversarial agents, one defensible verdict
          </h2>
          <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
            Instead of taking a company at its word, EcoVerify runs each claim
            through a structured chain of investigation modeled on real
            due-diligence work.
          </p>
        </div>

        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {STEPS.map((s) => (
            <li
              key={s.name}
              className="relative flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <s.icon className="size-5" />
                </div>
                <span className="font-display text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {s.step}
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-foreground">
                {s.name}
              </h3>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                {s.desc}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
