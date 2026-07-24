// Rotating API-key pool for the Google Generative AI (Gemini) provider.
//
// Why: a single free-tier Gemini key hits per-minute rate/quota limits quickly,
// especially since the Challenger agent fans out one call per claim. Supplying
// several keys lets us (a) spread load round-robin across the pool and
// (b) automatically fail over to the next key when one is rate-limited,
// exhausted, or unauthorized.
//
// How to configure (any combination works, duplicates are de-duped):
//   GOOGLE_GENERATIVE_AI_API_KEY = "keyA,keyB,keyC"   // comma/space separated
//   GOOGLE_GENERATIVE_AI_API_KEY_1 = "keyA"
//   GOOGLE_GENERATIVE_AI_API_KEY_2 = "keyB"           // ...up to _20

import { createGoogleGenerativeAI } from '@ai-sdk/google'

// Model instance type, inferred from the provider so we don't depend on the
// transitive `@ai-sdk/provider` package directly.
type GeminiModel = ReturnType<ReturnType<typeof createGoogleGenerativeAI>>

// A masked identifier used only for logging (never logs the full secret).
function maskKey(key: string): string {
  if (key.length <= 8) return '****'
  return `${key.slice(0, 4)}…${key.slice(-4)}`
}

/** Read and de-duplicate every configured Gemini key from the environment. */
export function loadApiKeys(): string[] {
  const keys = new Set<string>()

  const primary = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (primary) {
    for (const part of primary.split(/[\s,]+/)) {
      const trimmed = part.trim()
      if (trimmed) keys.add(trimmed)
    }
  }

  for (let i = 1; i <= 20; i++) {
    const numbered = process.env[`GOOGLE_GENERATIVE_AI_API_KEY_${i}`]
    if (numbered?.trim()) keys.add(numbered.trim())
  }

  return [...keys]
}

// Errors that mean "this key is temporarily/permanently unusable — try another".
function isRotatableError(err: unknown): boolean {
  const msg = (err as Error)?.message?.toLowerCase() ?? ''
  const status = (err as { statusCode?: number; status?: number })?.statusCode ??
    (err as { status?: number })?.status
  if (status === 429 || status === 401 || status === 403) return true
  return /rate.?limit|quota|resource.?exhausted|too many requests|unauthor|permission|invalid.?api.?key|api key/.test(
    msg,
  )
}

// Module-level cursor gives round-robin behavior across requests handled by the
// same warm serverless instance, so we don't hammer a single key every time.
let cursor = 0

export interface RotatingKeyPool {
  /** Number of keys available in the pool. */
  size: number
  /**
   * Runs `fn` with a Gemini model bound to a specific key. Starts at the
   * round-robin cursor and, on a rotatable error (429/quota/auth), advances to
   * the next key and retries — until the pool is exhausted.
   */
  run<T>(
    modelId: string,
    fn: (model: GeminiModel) => Promise<T>,
  ): Promise<T>
}

/**
 * Build a rotating key pool from the environment. Returns `null` when no keys
 * are configured so callers can surface a clear setup error.
 */
export function createRotatingKeyPool(): RotatingKeyPool | null {
  const keys = loadApiKeys()
  if (keys.length === 0) return null

  return {
    size: keys.length,
    async run(modelId, fn) {
      // Snapshot a starting offset, then try each key exactly once.
      const start = cursor
      cursor = (cursor + 1) % keys.length

      let lastError: unknown
      for (let attempt = 0; attempt < keys.length; attempt++) {
        const index = (start + attempt) % keys.length
        const key = keys[index]
        const provider = createGoogleGenerativeAI({ apiKey: key })
        try {
          return await fn(provider(modelId))
        } catch (err) {
          lastError = err
          if (!isRotatableError(err) || attempt === keys.length - 1) {
            throw err
          }
          console.log(
            `[v0] key ${maskKey(key)} failed (${
              (err as Error)?.message ?? 'unknown'
            }); rotating to next key`,
          )
          // advance shared cursor so future requests skip the bad key first
          cursor = (index + 1) % keys.length
        }
      }
      throw lastError
    },
  }
}
