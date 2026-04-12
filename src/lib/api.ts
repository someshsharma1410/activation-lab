import type { AnalysisResult } from '../types/analysis'
import { SYSTEM_PROMPT } from './prompts'

export async function analyzeFlow(
  flowDescription: string,
  activationMetric?: string,
): Promise<AnalysisResult> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string

  const url = import.meta.env.DEV
    ? '/api/analyze'
    : 'https://api.anthropic.com/v1/messages'

  const userMessage = activationMetric
    ? `My activation metric is: ${activationMetric}. With that in mind, analyze this flow:\n\n${flowDescription}`
    : flowDescription

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`API error ${response.status}: ${text}`)
  }

  const data = await response.json() as { content: { text: string }[] }
  const raw = data.content[0].text
  const clean = raw.replace(/```json|```/g, '').trim()
  return JSON.parse(clean) as AnalysisResult
}

export async function chatWithAnalysis(
  question: string,
  result: AnalysisResult,
  flowDescription: string,
  history: { role: 'user' | 'assistant'; content: string }[],
): Promise<string> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string

  const url = import.meta.env.DEV
    ? '/api/analyze'
    : 'https://api.anthropic.com/v1/messages'

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

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
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
