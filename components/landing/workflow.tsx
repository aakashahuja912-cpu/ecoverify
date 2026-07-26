'use client'

import {
  Upload,
  ScanText,
  Sparkles,
  Scissors,
  Binary,
  Database,
  Search,
  BrainCircuit,
  Lightbulb,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'

const STEPS: { icon: LucideIcon; label: string }[] = [
  { icon: Upload, label: 'Upload' },
  { icon: ScanText, label: 'Extract' },
  { icon: Sparkles, label: 'Clean' },
  { icon: Scissors, label: 'Chunk' },
  { icon: Binary, label: 'Embed' },
  { icon: Database, label: 'Vector Database' },
  { icon: Search, label: 'Retrieve' },
  { icon: BrainCircuit, label: 'Reason' },
  { icon: Lightbulb, label: 'Generate Insight' },
]

export function WorkflowSection() {
  return (
    <section
      id="workflow"
      className="border-y border-border bg-card/30 px-4 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="How it works"
          title="From raw source to grounded insight"
          description="A transparent nine-stage pipeline processes every source the same reliable way."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            const isLast = i === STEPS.length - 1
            return (
              <Reveal key={step.label} delay={i * 0.4}>
                <div className="relative flex h-full flex-col items-center gap-3 rounded-2xl border border-border bg-background/50 p-5 text-center transition-colors hover:border-primary/40">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {step.label}
                  </span>
                  <span className="absolute left-3 top-3 font-display text-xs font-semibold text-muted-foreground/50">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {!isLast && (
                    <ArrowRight
                      aria-hidden
                      className="absolute -right-3 top-1/2 hidden size-4 -translate-y-1/2 text-muted-foreground/40 lg:block"
                    />
                  )}
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
