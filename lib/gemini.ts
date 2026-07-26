import { createGoogleGenerativeAI } from '@ai-sdk/google'
import type { LanguageModel } from 'ai'

export const GEMINI_MODEL_ID = 'gemini-2.5-flash'

/**
 * Reads all Gemini API keys from numbered environment variables:
 * GEMINI_API_KEY_1, GEMINI_API_KEY_2, ... (and a bare GEMINI_API_KEY as a
 * fallback). Keys are collected in order and de-duplicated.
 */
export function getGeminiKeys(): string[] {
  const keys: string[] = []

  const bare = process.env.GEMINI_API_KEY?.trim()
  if (bare) keys.push(bare)

  // Collect GEMINI_API_KEY_1..N until a gap of missing indices is hit.
  for (let i = 1; i <= 50; i++) {
    const key = process.env[`GEMINI_API_KEY_${i}`]?.trim()
    if (key) keys.push(key)
  }

  return Array.from(new Set(keys))
}

/**
 * True when an error looks like a rate-limit / quota / transient auth failure
 * that is worth retrying with a different key.
 */
function isRotatableError(err: unknown): boolean {
  const anyErr = err as {
    statusCode?: number
    status?: number
    message?: string
  }
  const status = anyErr?.statusCode ?? anyErr?.status
  if (status === 429 || status === 403 || status === 401 || status === 503) {
    return true
  }
  const msg = (anyErr?.message || '').toLowerCase()
  return /rate.?limit|quota|resource.?exhausted|too many requests|overloaded|unavailable|permission|api key|unauthor/.test(
    msg,
  )
}

/**
 * Runs an AI SDK operation with a rotating pool of Gemini keys. The provided
 * `run` callback receives a language model bound to the current key. If the
 * call fails with a rate-limit / quota style error, the next key is tried.
 * The last error is thrown once every key is exhausted.
 */
export async function withRotatingGemini<T>(
  run: (model: LanguageModel) => Promise<T>,
): Promise<T> {
  const keys = getGeminiKeys()
  if (keys.length === 0) {
    throw new Error(
      'No Gemini API keys configured. Set GEMINI_API_KEY_1, GEMINI_API_KEY_2, ... in the environment.',
    )
  }

  let lastError: unknown
  for (let i = 0; i < keys.length; i++) {
    const google = createGoogleGenerativeAI({ apiKey: keys[i] })
    const model = google(GEMINI_MODEL_ID)
    try {
      return await run(model)
    } catch (err) {
      lastError = err
      if (isRotatableError(err) && i < keys.length - 1) {
        console.log(
          `[v0] Gemini key #${i + 1} hit a rate-limit/quota error, rotating to key #${i + 2}`,
        )
        continue
      }
      throw err
    }
  }

  throw lastError
}
