import {
  Telescope,
  FileText,
  ListChecks,
  Brain,
  Quote,
  Workflow,
  type LucideIcon,
} from 'lucide-react'
import { SectionHeading } from './section-heading'
import { Reveal } from './reveal'

type Agent = {
  icon: LucideIcon
  name: string
  purpose: string
  input: string
  output: string
}

const AGENTS: Agent[] = [
  {
    icon: Telescope,
    name: 'Research Agent',
    purpose: 'Discovers and gathers relevant sources across the web and repos.',
    input: 'Query + scope',
    output: 'Ranked source set',
  },
  {
    icon: FileText,
    name: 'Summarizer Agent',
    purpose: 'Condenses long documents into structured, faithful summaries.',
    input: 'Raw documents',
    output: 'Key findings',
  },
  {
    icon: ListChecks,
    name: 'Planner Agent',
    purpose: 'Decomposes complex questions into an ordered research plan.',
    input: 'Objective',
    output: 'Task graph',
  },
  {
    icon: Brain,
    name: 'Memory Agent',
    purpose: 'Maintains persistent context and prior findings across sessions.',
    input: 'Session state',
    output: 'Retrieved memory',
  },
  {
    icon: Quote,
    name: 'Citation Agent',
    purpose: 'Attaches verifiable source references to every generated claim.',
    input: 'Draft answer',
    output: 'Cited answer',
  },
  {
    icon: Workflow,
    name: 'Automation Agent',
    purpose: 'Executes recurring pipelines and triggers downstream actions.',
    input: 'Workflow spec',
    output: 'Completed runs',
  },
]

export function Agents() {
  return (
    <section id="agents" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Multi-agent system"
          title="A team of specialized AI agents"
          description="Each agent owns a single responsibility and collaborates through LangGraph for reliable, inspectable reasoning."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AGENTS.map((agent, i) => {
            const Icon = agent.icon
            return (
              <Reveal key={agent.name} delay={(i % 3) * 0.5}>
                <div className="group h-full rounded-2xl border border-border bg-card/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-secondary/40 hover:bg-card">
                  <div className="flex items-center gap-3">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="font-display text-base font-semibold text-foreground">
                      {agent.name}
                    </h3>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {agent.purpose}
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-2 border-t border-border pt-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground/70">
                        Input
                      </p>
                      <p className="mt-1 text-xs font-medium text-foreground">
                        {agent.input}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-muted-foreground/70">
                        Output
                      </p>
                      <p className="mt-1 text-xs font-medium text-foreground">
                        {agent.output}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
