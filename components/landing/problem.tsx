import { Check, X } from 'lucide-react'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'

const WITHOUT = [
  'Hundreds of browser tabs',
  'Scattered PDFs',
  'Manual research',
  'Duplicate effort',
  'Slow decision-making',
]

const WITH = [
  'Unified knowledge',
  'Semantic search',
  'AI reasoning',
  'Knowledge graph',
  'Reliable citations',
  'Faster research',
]

export function Problem() {
  return (
    <section id="problem" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="The problem"
          title={
            <>
              Information is everywhere.
              <br />
              <span className="text-muted-foreground">Context is missing.</span>
            </>
          }
          description="Knowledge is scattered across websites, PDFs, repositories, APIs, and papers. Generic chatbots answer questions but never organize, validate, or maintain structured knowledge."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-2xl border border-border bg-card/40 p-6 sm:p-8">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
                <span className="flex size-7 items-center justify-center rounded-lg bg-destructive/15 text-destructive">
                  <X className="size-4" />
                </span>
                Without ContextForge
              </h3>
              <ul className="mt-6 space-y-3">
                {WITHOUT.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm text-muted-foreground"
                  >
                    <X className="size-4 shrink-0 text-destructive/70" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="gradient-border h-full rounded-2xl p-6 sm:p-8">
              <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
                <span className="flex size-7 items-center justify-center rounded-lg bg-risk-low/15 text-risk-low">
                  <Check className="size-4" />
                </span>
                With ContextForge
              </h3>
              <ul className="mt-6 space-y-3">
                {WITH.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm text-foreground"
                  >
                    <Check className="size-4 shrink-0 text-risk-low" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
