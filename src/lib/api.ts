import { parse, Allow } from 'partial-json'
import type { AnalysisResult } from '../types/analysis'
import { SYSTEM_PROMPT } from './prompts'

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'
const DEV_PROXY_URL = '/api/analyze'

const COMMON_HEADERS = {
  'content-type': 'application/json',
  'anthropic-version': '2023-06-01',
  'anthropic-dangerous-direct-browser-access': 'true',
}

function apiUrl(): string {
  return import.meta.env.DEV ? DEV_PROXY_URL : ANTHROPIC_URL
}

function apiKey(): string {
  return import.meta.env.VITE_ANTHROPIC_API_KEY as string
}

/**
 * Stream an analysis from Claude and progressively parse partial JSON.
 * Calls onPartial with the latest best-effort Partial<AnalysisResult> each
 * time new text arrives. Returns the final fully-parsed result.
 */
export async function analyzeFlow(
  flowDescription: string,
  activationMetric?: string,
  onPartial?: (partial: Partial<AnalysisResult>) => void,
): Promise<AnalysisResult> {
  const userMessage = activationMetric
    ? `My activation metric is: ${activationMetric}. With that in mind, analyze this flow:\n\n${flowDescription}`
    : flowDescription

  const response = await fetch(apiUrl(), {
    method: 'POST',
    headers: { ...COMMON_HEADERS, 'x-api-key': apiKey() },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
      stream: true,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`API error ${response.status}: ${text}`)
  }
  if (!response.body) {
    throw new Error('No response stream available')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let textBuffer = '' // accumulated model output
  let sseBuffer = '' // accumulated SSE bytes not yet split on \n\n

  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      sseBuffer += decoder.decode(value, { stream: true })

      // SSE events are separated by a blank line (\n\n). Split, but keep
      // the trailing partial event in the buffer.
      const events = sseBuffer.split('\n\n')
      sseBuffer = events.pop() ?? ''

      for (const event of events) {
        const textDelta = extractTextDelta(event)
        if (textDelta === null) continue
        textBuffer += textDelta

        if (onPartial) {
          const partial = tryParsePartial(textBuffer)
          if (partial) onPartial(partial)
        }
      }
    }
  } finally {
    reader.releaseLock()
  }

  // Final parse — at this point textBuffer should be a complete JSON blob.
  const clean = textBuffer.replace(/```json|```/g, '').trim()
  return JSON.parse(clean) as AnalysisResult
}

/**
 * Pull the text delta out of a single SSE event frame. Returns null if the
 * event is anything other than a content_block_delta with a text payload.
 * Throws if the event is an explicit error event from the API.
 */
function extractTextDelta(event: string): string | null {
  const lines = event.split('\n')
  let eventType = ''
  let dataLine = ''
  for (const line of lines) {
    if (line.startsWith('event: ')) eventType = line.slice(7).trim()
    else if (line.startsWith('data: ')) dataLine = line.slice(6).trim()
  }
  if (!dataLine || dataLine === '[DONE]') return null

  let parsed: {
    type?: string
    delta?: { type?: string; text?: string }
    error?: { message?: string }
  }
  try {
    parsed = JSON.parse(dataLine)
  } catch {
    return null // malformed frame, skip
  }

  if (eventType === 'error' || parsed.type === 'error') {
    throw new Error(`Claude API stream error: ${parsed.error?.message ?? 'unknown'}`)
  }
  if (eventType === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
    return parsed.delta.text ?? ''
  }
  return null
}

/**
 * Try to parse the accumulated model text as an AnalysisResult in progress.
 * Strips any markdown fences defensively. Returns undefined if parsing fails
 * (which happens at the very start of the stream before any complete tokens
 * exist).
 */
function tryParsePartial(buffer: string): Partial<AnalysisResult> | undefined {
  const clean = buffer.replace(/```json|```/g, '').trim()
  if (!clean) return undefined
  try {
    return parse(clean, Allow.ALL) as Partial<AnalysisResult>
  } catch {
    return undefined
  }
}

// ---------------------------------------------------------------------------
// Follow-up chat — non-streaming for now. Answers are short (max 600 tokens)
// and land in ~3-5s, which is fast enough that streaming adds complexity
// without meaningful UX win.
// ---------------------------------------------------------------------------

export async function chatWithAnalysis(
  question: string,
  result: AnalysisResult,
  flowDescription: string,
  history: { role: 'user' | 'assistant'; content: string }[],
): Promise<string> {
  const systemPrompt = `You are the same activation analyst who produced the analysis below. Answer follow up questions about the friction points, hypotheses, and recommended experiments.

Rules:
- Keep answers to three paragraphs maximum
- Write in plain language, same voice as the analysis
- Be specific to this flow and these friction points, not generic
- No hyphens or dashes in any text
- No bullet lists, just short paragraphs
- If asked about a specific friction point, reference it by name
- If you don't know something, say so directly

Original flow analyzed:
${flowDescription}

Analysis produced:
${JSON.stringify(result, null, 2)}`

  const messages = [
    ...history,
    { role: 'user' as const, content: question },
  ]

  const response = await fetch(apiUrl(), {
    method: 'POST',
    headers: { ...COMMON_HEADERS, 'x-api-key': apiKey() },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      system: systemPrompt,
      messages,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`API error ${response.status}: ${text}`)
  }

  const data = await response.json() as { content: { text: string }[] }
  return data.content[0].text
}
