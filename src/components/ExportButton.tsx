import { useState } from 'react'
import type { AnalysisResult } from '../types/analysis'

interface ExportButtonProps {
  result: AnalysisResult
  flowText: string
}

function buildMarkdown(result: AnalysisResult, flowText: string): string {
  const { friction_points, summary } = result
  const lines: string[] = [
    '# Activation Lab Analysis',
    '',
    '## Flow Description',
    '',
    flowText,
    '',
    '## Summary',
    '',
    `**Total friction points:** ${summary.total_friction_points}`,
    `**Average expected lift:** ${summary.average_expected_lift}%`,
    `**Top recommendation:** ${summary.top_recommendation}`,
    '',
    '## Friction Points',
    '',
  ]

  friction_points.forEach((p, i) => {
    lines.push(`### ${i + 1}. ${p.title}`)
    lines.push('')
    lines.push(
      `**Impact:** ${p.severity} | **Effort:** ${p.effort} | **Confidence:** ${p.confidence} | **Framework:** ${p.framework}`,
    )
    lines.push('')
    lines.push(p.description)
    lines.push('')
    lines.push(`**Hypothesis:** ${p.hypothesis}`)
    lines.push('')
    lines.push(`**Recommended Test:** ${p.recommended_test}`)
    lines.push('')
    lines.push(
      `**Expected Lift:** ${p.expected_lift.low}% to ${p.expected_lift.high}% (mid: ~${p.expected_lift.mid}%)`,
    )
    lines.push('')
  })

  return lines.join('\n')
}

export default function ExportButton({ result, flowText }: ExportButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const md = buildMarkdown(result, flowText)
    await navigator.clipboard.writeText(md)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        background: 'transparent',
        border: '1px solid rgba(0,0,0,0.12)',
        borderRadius: 8,
        padding: '8px 16px',
        fontSize: 13,
        fontWeight: 500,
        color: copied ? '#28a050' : '#5a5a7a',
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'color 0.2s, border-color 0.2s',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        borderColor: copied ? 'rgba(40,160,80,0.3)' : 'rgba(0,0,0,0.12)',
      }}
    >
      {copied ? '✓ Copied to clipboard' : 'Copy as markdown'}
    </button>
  )
}
