'use client'

import { useCallback, useRef, useState } from 'react'
import type {
  AgentId,
  AgentState,
  AuditEvent,
  Claim,
  ClaimVerdict,
  Evidence,
} from '@/lib/audit-types'

export interface AuditState {
  status: 'idle' | 'running' | 'done' | 'error'
  company: string | null
  fetched: boolean
  agents: Record<AgentId, AgentState | 'idle'>
  claims: Claim[]
  evidence: Record<string, Evidence[]>
  verdicts: Record<string, ClaimVerdict>
  result: {
    score: number
    grade: string
    headline: string
    summary: string
  } | null
  error: string | null
}

const initialState: AuditState = {
  status: 'idle',
  company: null,
  fetched: false,
  agents: { 'fact-finder': 'idle', challenger: 'idle', judge: 'idle' },
  claims: [],
  evidence: {},
  verdicts: {},
  result: null,
  error: null,
}

export function useAudit() {
  const [state, setState] = useState<AuditState>(initialState)
  const abortRef = useRef<AbortController | null>(null)

  const reset = useCallback(() => {
    abortRef.current?.abort()
    setState(initialState)
  }, [])

  const apply = useCallback((event: AuditEvent) => {
    setState((prev) => {
      switch (event.type) {
        case 'meta':
          return { ...prev, company: event.company, fetched: event.fetched }
        case 'agent':
          return {
            ...prev,
            agents: { ...prev.agents, [event.agent]: event.state },
          }
        case 'claims':
          return { ...prev, claims: event.claims }
        case 'evidence':
          return {
            ...prev,
            evidence: { ...prev.evidence, [event.claimId]: event.evidence },
          }
        case 'verdict':
          return {
            ...prev,
            verdicts: {
              ...prev.verdicts,
              [event.verdict.claimId]: event.verdict,
            },
          }
        case 'result':
          return {
            ...prev,
            status: 'done',
            result: {
              score: event.score,
              grade: event.grade,
              headline: event.headline,
              summary: event.summary,
            },
          }
        case 'error':
          return { ...prev, status: 'error', error: event.message }
        default:
          return prev
      }
    })
  }, [])

  const run = useCallback(
    async (url: string) => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      setState({ ...initialState, status: 'running' })

      try {
        const res = await fetch('/api/audit', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ url }),
          signal: controller.signal,
        })

        if (!res.ok || !res.body) {
          const msg = await res.text().catch(() => '')
          throw new Error(msg || 'Request failed')
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''
          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed) continue
            try {
              apply(JSON.parse(trimmed) as AuditEvent)
            } catch {
              // ignore partial / malformed line
            }
          }
        }

        setState((prev) =>
          prev.status === 'running' ? { ...prev, status: 'done' } : prev,
        )
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        setState((prev) => ({
          ...prev,
          status: 'error',
          error:
            (err as Error).message ||
            'Something went wrong running the audit.',
        }))
      }
    },
    [apply],
  )

  return { state, run, reset }
}
