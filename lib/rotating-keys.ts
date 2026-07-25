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

// Classify why a key failed so we can react appropriately:
//   - 'rate-limit'  → transient; cool the key down and retry it later
//   - 'auth'        → permanent (bad/unauthorized key); disable it for good
//   - 'other'       → not key-related; do not rotate, surface the error
type KeyFailure = 'rate-limit' | 'auth' | 'other'

function classifyError(err: unknown): KeyFailure {
  const msg = (err as Error)?.message?.toLowerCase() ?? ''
  const status = (err as { statusCode?: number; status?: number })?.statusCode ??
    (err as { status?: number })?.status

  if (
    status === 401 ||
    status === 403 ||
    /unauthor|permission|invalid.?api.?key|api key not valid/.test(msg)
  ) {
    return 'auth'
  }
  if (
    status === 429 ||
    /rate.?limit|quota|resource.?exhausted|too many requests/.test(msg)
  ) {
    return 'rate-limit'
  }
  return 'other'
}

// How long a rate-limited key is skipped before we try it again.
const COOLDOWN_MS = 60_000

// Per-key health tracked across requests on the same warm serverless instance:
// a timestamp until which the key should be skipped. `Infinity` means the key
// is permanently disabled (auth failure). Keyed by the API key string.
const cooldownUntil = new Map<string, number>()

// Module-level cursor gives round-robin behavior across requests handled by the
// same warm serverless instance, so we don't hammer a single key every time.
let cursor = 0

function isAvailable(key: string, now: number): boolean {
  const until = cooldownUntil.get(key)
  return until === undefined || now >= until
}

export interface RotatingKeyPool {
  /** Number of keys available in the pool. */
  size: number
  /**
   * Runs `fn` with a Gemini model bound to a specific key. Tries healthy keys
   * first (round-robin). On a rate-limit it cools the key down for a while; on
   * an auth error it disables the key; either way it fails over to the next
   * healthy key. Non-key errors are surfaced immediately without rotating.
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
      const now = Date.now()

      // Build this request's candidate order: healthy keys first (starting at
      // the round-robin cursor), so we never waste an attempt on a key we
      // already know is cooling down or disabled. If every key is currently
      // unavailable, fall back to trying them all (cooldowns may have just
      // lapsed, or the provider may have recovered).
      const order: number[] = []
      const cooling: number[] = []
      for (let i = 0; i < keys.length; i++) {
        const index = (cursor + i) % keys.length
        if (isAvailable(keys[index], now)) order.push(index)
        else cooling.push(index)
      }
      const candidates = order.length > 0 ? order : cooling
      cursor = (cursor + 1) % keys.length

      let lastError: unknown
      for (let attempt = 0; attempt < candidates.length; attempt++) {
        const index = candidates[attempt]
        const key = keys[index]
        const provider = createGoogleGenerativeAI({ apiKey: key })
        try {
          const result = await fn(provider(modelId))
          // Success clears any prior cooldown on this key.
          cooldownUntil.delete(key)
          return result
        } catch (err) {
          lastError = err
          const failure = classifyError(err)

          if (failure === 'auth') {
            // Permanently bad key — disable it so future requests skip it.
            cooldownUntil.set(key, Number.POSITIVE_INFINITY)
            console.log(
              `[v0] key ${maskKey(key)} is invalid/unauthorized; disabling for this instance`,
            )
          } else if (failure === 'rate-limit') {
            cooldownUntil.set(key, Date.now() + COOLDOWN_MS)
            console.log(
              `[v0] key ${maskKey(key)} rate-limited; cooling down for ${
                COOLDOWN_MS / 1000
              }s`,
            )
          } else {
            // Not a key problem (bad request, network, etc.) — do not rotate.
            throw err
          }

          if (attempt === candidates.length - 1) throw err
          // Point the shared cursor past the failed key for the next request.
          cursor = (index + 1) % keys.length
        }
      }
      throw lastError
    },
  }
}
