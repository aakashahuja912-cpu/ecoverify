'use client'

import {
  Bot,
  Layers,
  Network,
  Search,
  LayoutDashboard,
  Workflow,
  GitBranch,
  Sparkles,
  Quote,
  GitCompare,
  type LucideIcon,
} from 'lucide-react'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'

type Feature = {
  icon: LucideIcon
  title: string
  description: string
}

const FEATURES: Feature[] = [
  {
    icon: Bot,
    title: 'AI Multi-Agent Collaboration',
    description:
      'Specialized agents divide research, planning, and synthesis, then coordinate through a shared context.',
  },
  {
    icon: Layers,
    title: 'Retrieval-Augmented Generation',
    description:
      'Answers are grounded in your own sources, dramatically reducing hallucinations.',
  },
  {
    icon: Network,
    title: 'Knowledge Graph',
    description:
      'Entities and relationships are extracted automatically into a connected, queryable graph.',
  },
  {
    icon: Search,
    title: 'Semantic Search',
    description:
      'Vector embeddings surface meaning, not keywords, across every ingested document.',
  },
  {
    icon: LayoutDashboard,
    title: 'Research Workspace',
    description:
      'A unified surface to collect, annotate, and organize knowledge from any source.',
  },
  {
    icon: Workflow,
    title: 'Workflow Automation',
    description:
      'Chain ingestion, extraction, and reasoning into repeatable, scheduled pipelines.',
  },
  {
    icon: GitBranch,
    title: 'GitHub Repository Intelligence',
    description:
      'Index entire repositories to reason over code, issues, and documentation.',
  },
  {
    icon: Sparkles,
    title: 'Research Assistant',
    description:
      'Ask complex questions and get structured, multi-step answers with reasoning.',
  },
  {
    icon: Quote,
    title: 'Source Citations',
    description:
      'Every claim links back to the exact passage it came from for full traceability.',
  },
  {
    icon: GitCompare,
    title: 'Cross-document Comparison',
    description:
      'Compare findings across papers, filings, and reports to reveal contradictions.',
  },
]

export function Features() {
  return (
    <section id="features" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Capabilities"
          title="Everything you need to turn data into decisions"
          description="Ten tightly integrated capabilities that take you from raw sources to grounded, cited intelligence."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={(i % 3) * 0.5}>
              <FeatureCard feature={feature} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon
  return (
    <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-primary/0 blur-2xl transition-all duration-500 group-hover:bg-primary/20"
      />
      <span className="relative flex size-11 items-center justify-center rounded-xl border border-border bg-background/60 text-primary transition-colors group-hover:border-primary/40 group-hover:text-accent">
        <Icon className="size-5" />
      </span>
      <h3 className="relative mt-5 font-display text-base font-semibold text-foreground">
        {feature.title}
      </h3>
      <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
        {feature.description}
      </p>
    </div>
  )
}
