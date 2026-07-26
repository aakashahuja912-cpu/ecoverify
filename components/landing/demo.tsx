'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  FileText,
  Globe,
  Github,
  BookOpen,
  Play,
  RotateCcw,
  Check,
  Loader2,
  type LucideIcon,
} from 'lucide-react'
import { SectionHeading } from './section-heading'

type Source = { id: string; icon: LucideIcon; label: string; sample: string }

const SOURCES: Source[] = [
  { id: 'pdf', icon: FileText, label: 'PDF', sample: 'annual-report-2024.pdf' },
  { id: 'web', icon: Globe, label: 'Website', sample: 'company.com/sustainability' },
  { id: 'repo', icon: Github, label: 'GitHub Repo', sample: 'org/climate-model' },
  { id: 'paper', icon: BookOpen, label: 'Research Paper', sample: 'arxiv.org/2401.04521' },
]

const STAGES = [
  'Extraction',
  'Chunking',
  'Embeddings',
  'Agent Collaboration',
  'Final Answer',
]

export function Demo() {
  const [source, setSource] = useState<Source>(SOURCES[0])
  const [active, setActive] = useState(-1)
  const [running, setRunning] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  const run = () => {
    clearTimers()
    setRunning(true)
    setActive(0)
    STAGES.forEach((_, i) => {
      timers.current.push(
        setTimeout(
          () => {
            setActive(i + 1)
            if (i === STAGES.length - 1) setRunning(false)
          },
          (i + 1) * 900,
        ),
      )
    })
  }

  const reset = () => {
    clearTimers()
    setRunning(false)
    setActive(-1)
  }

  useEffect(() => () => clearTimers(), [])

  const done = active >= STAGES.length

  return (
    <section id="demo" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Live demo"
          title="Watch ContextForge think"
          description="Pick a source, run the pipeline, and see extraction, retrieval, and agent collaboration produce a grounded, cited answer."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {/* Controls */}
          <div className="rounded-2xl border border-border bg-card/40 p-6">
            <p className="text-sm font-medium text-foreground">
              1. Choose a source to ingest
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {SOURCES.map((s) => {
                const Icon = s.icon
                const selected = s.id === source.id
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setSource(s)
                      reset()
                    }}
                    aria-pressed={selected}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                      selected
                        ? 'border-primary/50 bg-primary/10 text-foreground'
                        : 'border-border bg-background/50 text-muted-foreground hover:border-border hover:text-foreground'
                    }`}
                  >
                    <Icon
                      className={`size-4 ${selected ? 'text-primary' : ''}`}
                    />
                    {s.label}
                  </button>
                )
              })}
            </div>

            <div className="mt-4 rounded-xl border border-border bg-background/60 px-4 py-3 font-mono text-xs text-muted-foreground">
              <span className="text-accent">source</span> →{' '}
              <span className="text-foreground">{source.sample}</span>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={run}
                disabled={running}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-60"
              >
                {running ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Play className="size-4" />
                )}
                {running ? 'Processing…' : 'Run pipeline'}
              </button>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/50 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <RotateCcw className="size-4" />
                Reset
              </button>
            </div>
          </div>

          {/* Output */}
          <div className="rounded-2xl border border-border bg-card/40 p-6">
            <p className="text-sm font-medium text-foreground">2. Pipeline</p>
            <ol className="mt-4 space-y-2.5">
              {STAGES.map((stage, i) => {
                const state =
                  active > i ? 'done' : active === i && running ? 'active' : 'idle'
                return (
                  <li
                    key={stage}
                    className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm transition-all ${
                      state === 'idle'
                        ? 'border-border bg-background/40 text-muted-foreground'
                        : 'border-primary/40 bg-primary/5 text-foreground'
                    }`}
                  >
                    <span className="flex size-5 items-center justify-center">
                      {state === 'done' ? (
                        <Check className="size-4 text-risk-low" />
                      ) : state === 'active' ? (
                        <Loader2 className="size-4 animate-spin text-primary" />
                      ) : (
                        <span className="size-2 rounded-full bg-muted-foreground/40" />
                      )}
                    </span>
                    {stage}
                  </li>
                )
              })}
            </ol>

            <AnimatePresence>
              {done && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 rounded-xl border border-accent/30 bg-accent/5 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                    Grounded answer
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">
                    Based on {source.label.toLowerCase()} ingestion, the entity
                    reduced Scope 1 &amp; 2 emissions by 18% year-over-year, with
                    targets independently verified across three cited sources.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {['[1] p.14', '[2] §3.2', '[3] fig.4'].map((c) => (
                      <span
                        key={c}
                        className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
