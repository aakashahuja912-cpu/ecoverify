import {
  User,
  MonitorSmartphone,
  Server,
  Share2,
  Bot,
  Layers,
  Database,
  Cpu,
  FileCheck2,
  ChevronDown,
  type LucideIcon,
} from 'lucide-react'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'

const LAYERS: { icon: LucideIcon; label: string; hint: string }[] = [
  { icon: User, label: 'User', hint: 'Asks a question' },
  { icon: MonitorSmartphone, label: 'Frontend', hint: 'React workspace' },
  { icon: Server, label: 'API Gateway', hint: 'FastAPI' },
  { icon: Share2, label: 'LangGraph', hint: 'Orchestration' },
  { icon: Bot, label: 'Multi-Agent System', hint: 'Specialized agents' },
  { icon: Layers, label: 'RAG Pipeline', hint: 'Retrieve + augment' },
  { icon: Database, label: 'Vector Database', hint: 'ChromaDB' },
  { icon: Cpu, label: 'OpenAI', hint: 'Reasoning models' },
  { icon: FileCheck2, label: 'Structured Response', hint: 'Cited answer' },
]

export function Architecture() {
  return (
    <section
      id="architecture"
      className="border-y border-border bg-card/30 px-4 py-24"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Architecture"
          title="A clean, inspectable data flow"
          description="Every request travels a predictable path from the workspace through orchestration, retrieval, and reasoning back to a structured, cited response."
        />

        <div className="mx-auto mt-14 flex max-w-md flex-col items-center">
          {LAYERS.map((layer, i) => {
            const Icon = layer.icon
            const isLast = i === LAYERS.length - 1
            return (
              <Reveal key={layer.label} delay={i * 0.35} className="w-full">
                <div className="flex flex-col items-center">
                  <div className="flex w-full items-center gap-4 rounded-2xl border border-border bg-background/50 px-5 py-4 transition-colors hover:border-primary/40">
                    <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <p className="font-display text-sm font-semibold text-foreground">
                        {layer.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {layer.hint}
                      </p>
                    </div>
                    <span className="ml-auto font-display text-xs font-semibold text-muted-foreground/40">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  {!isLast && (
                    <ChevronDown
                      aria-hidden
                      className="my-1.5 size-5 text-primary/50"
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
