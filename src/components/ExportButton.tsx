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
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfDone, setPdfDone] = useState(false)
  const [pdfError, setPdfError] = useState<string | null>(null)

  async function handleCopy() {
    const md = buildMarkdown(result, flowText)
    await navigator.clipboard.writeText(md)
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  async function handlePDF() {
    setPdfLoading(true)
    setPdfError(null)
    setPdfDone(false)
    console.log('[Activation Lab] Export brief clicked — loading pdf-export chunk')
    try {
      // Lazy-load jsPDF + html2canvas only when the user actually exports.
      // Keeps ~394 KiB out of the initial bundle.
      const mod = await import('../lib/pdf-export')
      console.log('[Activation Lab] pdf-export chunk loaded, calling exportToPDF')
      mod.exportToPDF(result, flowText)
      console.log('[Activation Lab] exportToPDF returned cleanly')
      setPdfDone(true)
      setTimeout(() => setPdfDone(false), 4000)
    } catch (err) {
      console.error('[Activation Lab] PDF export failed:', err)
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setPdfError(msg)
      // Auto-clear the error after a bit so the button is usable again
      setTimeout(() => setPdfError(null), 8000)
    } finally {
      setTimeout(() => setPdfLoading(false), 400)
    }
  }

  return (
    <div>
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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

      <button
        onClick={handlePDF}
        disabled={pdfLoading}
        style={{
          background: pdfLoading
            ? 'rgba(0,0,0,0.06)'
            : pdfDone
              ? '#28a050'
              : '#1a6ff0',
          border: 'none',
          borderRadius: 8,
          padding: '8px 16px',
          fontSize: 13,
          fontWeight: 500,
          color: pdfLoading ? '#5a5a7a' : '#ffffff',
          cursor: pdfLoading ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
          transition: 'background 0.2s',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
        }}
      >
        {pdfLoading
          ? 'Generating...'
          : pdfDone
            ? '✓ Downloaded activation-lab-brief.pdf'
            : 'Export brief'}
      </button>
    </div>
    {pdfError && (
      <div
        role="alert"
        style={{
          marginTop: 8,
          padding: '8px 12px',
          background: 'rgba(200,50,50,0.06)',
          border: '1px solid rgba(200,50,50,0.25)',
          borderRadius: 6,
          color: '#8b2020',
          fontSize: 12.5,
          lineHeight: 1.5,
        }}
      >
        <strong>PDF export failed:</strong> {pdfError}. Open the browser console for the full stack trace, or use <em>Copy as markdown</em> as a fallback.
      </div>
    )}
    </div>
  )
}
