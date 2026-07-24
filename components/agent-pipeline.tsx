'use client'

import { FileSearch, Scale, Search, Loader, Check } from 'lucide-react'
import { AGENTS, type AgentId, type AgentState } from '@/lib/audit-types'
import { cn } from '@/lib/utils'

const ICONS: Record<AgentId, typeof FileSearch> = {
  'fact-finder': FileSearch,
  challenger: Search,
  judge: Scale,
}

interface AgentPipelineProps {
  agents: Record<AgentId, AgentState | 'idle'>
}

export function AgentPipeline({ agents }: AgentPipelineProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {AGENTS.map((agent) => {
        const state = agents[agent.id]
        const Icon = ICONS[agent.id]
        const running = state === 'running'
        const done = state === 'done'
        return (
          <div
            key={agent.id}
            className={cn(
              'flex flex-col gap-2 rounded-xl border p-4 transition-colors',
              running && 'border-primary/50 bg-primary/5',
              done && 'border-risk-low/40 bg-risk-low/5',
              state === 'idle' && 'border-border bg-card opacity-70',
            )}
          >
            <div className="flex items-center justify-between">
              <div
                className={cn(
                  'flex size-8 items-center justify-center rounded-lg',
                  running && 'bg-primary/15 text-primary',
                  done && 'bg-risk-low/15 text-risk-low',
                  state === 'idle' && 'bg-muted text-muted-foreground',
                )}
              >
                <Icon className="size-4" />
              </div>
              {running && (
                <Loader className="size-4 animate-spin text-primary" />
              )}
              {done && <Check className="size-4 text-risk-low" />}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {agent.name}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                {agent.role}
              </p>
            </div>
            <span
              className={cn(
                'mt-auto text-[0.7rem] font-medium uppercase tracking-wide',
                running && 'text-primary',
                done && 'text-risk-low',
                state === 'idle' && 'text-muted-foreground',
              )}
            >
              {running ? 'Investigating…' : done ? 'Complete' : 'Standing by'}
            </span>
          </div>
        )
      })}
    </div>
  )
}
