import { Reveal } from './reveal'

const TECH = [
  'React',
  'FastAPI',
  'LangGraph',
  'LangChain',
  'OpenAI',
  'ChromaDB',
  'PostgreSQL',
  'Docker',
  'GitHub Actions',
]

export function TechStack() {
  return (
    <section className="border-y border-border bg-card/30 px-4 py-14">
      <div className="mx-auto max-w-6xl">
        <Reveal className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Built on a production-grade, open-source stack
        </Reveal>
        <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-3 md:grid-cols-9">
          {TECH.map((tech, i) => (
            <Reveal key={tech} delay={i * 0.5}>
              <div className="group flex items-center justify-center rounded-xl border border-border bg-background/50 px-3 py-4 text-center text-sm font-medium text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground">
                {tech}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
