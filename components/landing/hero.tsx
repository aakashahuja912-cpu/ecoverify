'use client'

import { motion } from 'motion/react'
import {
  ArrowRight,
  Github,
  Sparkles,
  Network,
  Search,
  FileText,
  Bot,
  Quote,
} from 'lucide-react'

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-4 pt-32 pb-16 sm:pt-40 sm:pb-24"
    >
      {/* ambient lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_60%,transparent_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-primary/25 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-20 right-0 h-[320px] w-[320px] rounded-full bg-secondary/20 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-40 left-0 h-[280px] w-[280px] rounded-full bg-accent/15 blur-[130px]"
      />

      <div className="relative mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="size-3.5 text-accent" />
            Multi-agent RAG for the Context.dev Challenge
          </span>

          <h1 className="mt-6 text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
            Transform Unstructured Data into{' '}
            <span className="text-gradient">Intelligent Decisions</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Collect information from websites, GitHub repositories, PDFs, APIs,
            documentation, and research papers. Use AI agents and
            Retrieval-Augmented Generation to build structured knowledge and
            automate decision-making.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#demo"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 hover:shadow-[0_18px_50px_-16px_rgba(37,99,235,0.8)] sm:w-auto"
            >
              Launch Demo
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card/60 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:bg-card sm:w-auto"
            >
              <Github className="size-4" />
              View GitHub
            </a>
          </div>
        </motion.div>

        <HeroDashboard />
      </div>
    </section>
  )
}

function HeroDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto mt-16 max-w-5xl"
    >
      <div className="gradient-border overflow-hidden rounded-2xl shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-2 border-b border-border bg-background/60 px-4 py-3">
          <span className="size-2.5 rounded-full bg-destructive/70" />
          <span className="size-2.5 rounded-full bg-risk-medium/70" />
          <span className="size-2.5 rounded-full bg-risk-low/70" />
          <span className="ml-3 text-xs text-muted-foreground">
            contextforge.ai / workspace
          </span>
          <span className="ml-auto hidden items-center gap-1.5 rounded-md border border-border px-2 py-1 text-[11px] text-muted-foreground sm:flex">
            <span className="size-1.5 animate-pulse rounded-full bg-risk-low" />
            Live
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 bg-card/40 p-4 sm:p-6 lg:grid-cols-3">
          {/* Knowledge graph */}
          <div className="rounded-xl border border-border bg-background/50 p-4 lg:col-span-2">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
              <Network className="size-4 text-primary" />
              Knowledge Graph
            </div>
            <KnowledgeGraph />
          </div>

          {/* Live analytics */}
          <div className="flex flex-col gap-4">
            <div className="rounded-xl border border-border bg-background/50 p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
                <Search className="size-4 text-accent" />
                Semantic Search
              </div>
              <div className="space-y-2">
                {[92, 78, 64].map((w, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[11px] text-muted-foreground">
                      <span>result_{i + 1}</span>
                      <span>{w}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${w}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 + i * 0.15 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <MiniStat icon={FileText} label="Docs" value="12.4k" />
              <MiniStat icon={Bot} label="Agents" value="6" />
            </div>
          </div>

          {/* Agent activity + citation */}
          <div className="rounded-xl border border-border bg-background/50 p-4 lg:col-span-2">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
              <Bot className="size-4 text-secondary" />
              Agent Collaboration
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                'Research',
                'Summarizer',
                'Planner',
                'Memory',
                'Citation',
                'Automation',
              ].map((a, i) => (
                <motion.span
                  key={a}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-foreground"
                >
                  <span
                    className="size-1.5 rounded-full bg-accent"
                    style={{ animation: `cf-pulse-line 2s ${i * 0.3}s infinite` }}
                  />
                  {a}
                </motion.span>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background/50 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
              <Quote className="size-4 text-primary" />
              Grounded Answer
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Emissions fell 18% YoY, verified across 3 filings.
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {['[1]', '[2]', '[3]'].map((c) => (
                <span
                  key={c}
                  className="rounded border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function MiniStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileText
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-border bg-background/50 p-3">
      <Icon className="size-4 text-muted-foreground" />
      <p className="mt-2 font-display text-lg font-semibold text-foreground">
        {value}
      </p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  )
}

function KnowledgeGraph() {
  const nodes = [
    { cx: 50, cy: 50, r: 6, color: 'var(--primary)' },
    { cx: 130, cy: 30, r: 4, color: 'var(--accent)' },
    { cx: 210, cy: 60, r: 5, color: 'var(--secondary)' },
    { cx: 90, cy: 110, r: 4, color: 'var(--accent)' },
    { cx: 180, cy: 120, r: 5, color: 'var(--primary)' },
    { cx: 260, cy: 40, r: 4, color: 'var(--accent)' },
    { cx: 250, cy: 110, r: 4, color: 'var(--secondary)' },
  ]
  const edges = [
    [0, 1],
    [0, 3],
    [1, 2],
    [2, 5],
    [3, 4],
    [2, 6],
    [4, 6],
    [1, 4],
  ]
  return (
    <svg
      viewBox="0 0 300 150"
      className="h-40 w-full"
      role="img"
      aria-label="Animated knowledge graph visualization"
    >
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].cx}
          y1={nodes[a].cy}
          x2={nodes[b].cx}
          y2={nodes[b].cy}
          stroke="var(--primary)"
          strokeWidth="1"
          style={{ animation: `cf-pulse-line 3s ${i * 0.25}s infinite` }}
        />
      ))}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.cx}
          cy={n.cy}
          r={n.r}
          fill={n.color}
          style={{ animation: `cf-pulse-line 2.5s ${i * 0.2}s infinite` }}
        />
      ))}
    </svg>
  )
}
