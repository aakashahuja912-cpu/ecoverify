import { generateText, Output } from 'ai'
import { z } from 'zod'
import type { AuditEvent, Claim, Evidence } from '@/lib/audit-types'

export const maxDuration = 60

// Routes through the Vercel AI Gateway (default transport in the AI SDK).
// No provider API key lives in this code; the Gateway handles auth and billing.
// We pass an ordered list of models so that if the primary provider is rate-
// limited or out of credits, the pipeline automatically fails over to the next.
const MODELS = [
  'google/gemini-2.5-flash',
  'openai/gpt-4o-mini',
  'anthropic/claude-3-5-haiku',
] as const

// ---------------------------------------------------------------------------
// Schemas (server-side validation for each agent's structured output)
// ---------------------------------------------------------------------------

const claimSchema = z.object({
  text: z.string().describe('The verbatim or lightly-paraphrased claim.'),
  category: z.enum([
    'emissions',
    'energy',
    'water',
    'waste',
    'sourcing',
    'biodiversity',
    'social',
    'other',
  ]),
  metric: z
    .string()
    .nullable()
    .describe('The specific number/target in the claim, or null if none.'),
  timeframe: z
    .string()
    .nullable()
    .describe('The year or period referenced, or null.'),
  isVague: z
    .boolean()
    .describe('True if the claim uses unverifiable puffery like "eco-friendly".'),
})

const factFinderSchema = z.object({
  company: z.string().describe('Best guess of the company / brand name.'),
  claims: z.array(claimSchema).min(1).max(5),
})

const evidenceSchema = z.object({
  source: z
    .string()
    .describe('Named source, e.g. "US EPA ECHO enforcement records" or "Reuters (2022)".'),
  sourceType: z.enum([
    'regulatory',
    'news',
    'ngo',
    'court',
    'scientific',
    'financial',
  ]),
  stance: z.enum(['contradicts', 'supports', 'context']),
  summary: z.string().describe('One sentence describing what the source shows.'),
  credibility: z.number().min(0).max(100),
})

const challengerSchema = z.object({
  evidence: z.array(evidenceSchema).max(4),
})

const judgeSchema = z.object({
  verdicts: z.array(
    z.object({
      claimId: z.string(),
      verdict: z.enum([
        'verified',
        'needs_context',
        'misleading',
        'unsubstantiated',
      ]),
      riskLevel: z.enum(['low', 'medium', 'high']),
      confidence: z.number().min(0).max(100),
      reasoning: z.string(),
    }),
  ),
  score: z
    .number()
    .min(0)
    .max(100)
    .describe('Overall greenwash risk score. Higher = more risk.'),
  headline: z.string().describe('A punchy 6-10 word verdict headline.'),
  summary: z.string().describe('2-3 sentence executive summary for an analyst.'),
})

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function scoreToGrade(score: number): string {
  if (score < 25) return 'Low Risk'
  if (score < 50) return 'Moderate Risk'
  if (score < 75) return 'Elevated Risk'
  return 'High Risk'
}

async function fetchPageText(
  url: string,
): Promise<{ text: string; fetched: boolean }> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 9000)
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; EcoVerifyBot/1.0; +https://ecoverify.example)',
      },
    })
    clearTimeout(timeout)
    if (!res.ok) return { text: '', fetched: false }
    const html = await res.text()
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[a-z]+;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 7000)
    return { text, fetched: text.length > 200 }
  } catch {
    return { text: '', fetched: false }
  }
}

function domainToName(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    const base = host.split('.')[0]
    return base.charAt(0).toUpperCase() + base.slice(1)
  } catch {
    return 'the company'
  }
}

// Runs a generateText call against the Gateway, trying each model in MODELS
// until one succeeds. If a model is rate-limited / out of credits, we advance
// to the next provider so a single exhausted key never breaks the audit.
async function generateWithFallback<T extends Parameters<typeof generateText>[0]>(
  args: Omit<T, 'model'>,
) {
  let lastErr: unknown
  for (const model of MODELS) {
    try {
      return await generateText({ ...(args as object), model } as T)
    } catch (err) {
      lastErr = err
      console.log(`[v0] model "${model}" failed, trying next fallback:`, (err as Error)?.message)
    }
  }
  throw lastErr
}

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------

export async function POST(req: Request) {
  const { url } = (await req.json()) as { url?: string }

  if (!url || !/^https?:\/\//i.test(url)) {
    return new Response(JSON.stringify({ error: 'A valid URL is required.' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    })
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: AuditEvent) => {
        controller.enqueue(encoder.encode(JSON.stringify(event) + '\n'))
      }

      try {
        // ---- Prep: fetch the page -------------------------------------
        const { text, fetched } = await fetchPageText(url)
        const fallbackName = domainToName(url)
        const pageContext = fetched
          ? `Page content from ${url}:\n\n${text}`
          : `The page at ${url} could not be fetched. Reason about the company "${fallbackName}" using your knowledge of its public sustainability messaging.`

        // ---- Agent 1: Fact-Finder -------------------------------------
        send({ type: 'agent', agent: 'fact-finder', state: 'running' })
        const factFinder = await generateWithFallback({
          output: Output.object({ schema: factFinderSchema }),
          system:
            'You are the Fact-Finder, an investigative sustainability analyst. Extract 3-5 of the most concrete, checkable environmental/social claims a company makes about itself. Prefer claims with numbers, targets, dates, or specific practices. Flag vague marketing puffery.',
          prompt: pageContext,
        })

        const company = factFinder.output.company || fallbackName
        send({ type: 'meta', company, fetched, url })

        const claims: Claim[] = factFinder.output.claims.map((c, i) => ({
          id: `claim-${i + 1}`,
          text: c.text,
          category: c.category,
          metric: c.metric,
          timeframe: c.timeframe,
          isVague: c.isVague,
        }))
        send({ type: 'claims', claims })
        send({ type: 'agent', agent: 'fact-finder', state: 'done' })

        // ---- Agent 2: Challenger (per-claim, parallel) ----------------
        send({ type: 'agent', agent: 'challenger', state: 'running' })
        const evidenceByClaim = await Promise.all(
          claims.map(async (claim) => {
            try {
              const challenger = await generateWithFallback({
                output: Output.object({ schema: challengerSchema }),
                system:
                  'You are the Challenger, a skeptical investigative journalist. For the given corporate sustainability claim, search your knowledge of the PUBLIC RECORD (regulatory databases, court filings, reputable news, NGO reports, scientific studies, financial disclosures) for evidence that contradicts, contextualizes, or supports it. Be rigorous and fair. Never invent specific URLs. If you have no documented evidence, return a single honest "context" item stating that no corroborating public evidence was found and independent verification is required. Prefer contradicting or contextual evidence where the record genuinely warrants scrutiny.',
                prompt: `Company: ${company}\nClaim: "${claim.text}"\nCategory: ${claim.category}\nMetric: ${claim.metric ?? 'none'}\nTimeframe: ${claim.timeframe ?? 'none'}`,
              })
              const evidence: Evidence[] = challenger.output.evidence
              send({ type: 'evidence', claimId: claim.id, evidence })
              return { claimId: claim.id, evidence }
            } catch {
              const evidence: Evidence[] = [
                {
                  source: 'EcoVerify (pipeline)',
                  sourceType: 'news',
                  stance: 'context',
                  summary:
                    'Evidence retrieval failed for this claim; treat as unverified.',
                  credibility: 0,
                },
              ]
              send({ type: 'evidence', claimId: claim.id, evidence })
              return { claimId: claim.id, evidence }
            }
          }),
        )
        send({ type: 'agent', agent: 'challenger', state: 'done' })

        // ---- Agent 3: Judge -------------------------------------------
        send({ type: 'agent', agent: 'judge', state: 'running' })
        const dossier = claims
          .map((c) => {
            const ev = evidenceByClaim.find((e) => e.claimId === c.id)
            const evText =
              ev?.evidence
                .map(
                  (e) =>
                    `  - [${e.stance}] (${e.sourceType}, cred ${e.credibility}) ${e.source}: ${e.summary}`,
                )
                .join('\n') || '  - No evidence gathered.'
            return `${c.id} :: "${c.text}" (vague=${c.isVague})\n${evText}`
          })
          .join('\n\n')

        const judge = await generateWithFallback({
          output: Output.object({ schema: judgeSchema }),
          system:
            'You are the Judge. For each claim, weigh the claim against its evidence and issue a verdict: "verified" (strong support, no contradiction), "needs_context" (technically true but omits material context), "misleading" (contradicted or cherry-picked), or "unsubstantiated" (vague/no evidence). Assign a riskLevel and a confidence. Then compute an overall greenwash risk score 0-100 (higher = more greenwashing risk), weighting contradicted and unsubstantiated claims heavily. Ground every reasoning line in the supplied evidence. Return a verdict for every claim id.',
          prompt: `Company: ${company}\n\nDossier:\n${dossier}`,
        })

        for (const v of judge.output.verdicts) {
          send({ type: 'verdict', verdict: v })
        }
        send({ type: 'agent', agent: 'judge', state: 'done' })

        send({
          type: 'result',
          score: Math.round(judge.output.score),
          grade: scoreToGrade(judge.output.score),
          headline: judge.output.headline,
          summary: judge.output.summary,
        })
      } catch (err) {
        const raw = (err as Error)?.message || ''
        console.log('[v0] audit pipeline error:', raw)
        const message = /credit card|billing|payment|quota|api key|unauthor/i.test(
          raw,
        )
          ? `AI provider error: ${raw}`
          : 'The audit pipeline failed. Please try again.'
        send({ type: 'error', message })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'content-type': 'application/x-ndjson; charset=utf-8',
      'cache-control': 'no-cache, no-transform',
    },
  })
}
