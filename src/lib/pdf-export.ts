import { jsPDF } from 'jspdf'
import type { AnalysisResult } from '../types/analysis'

const BLUE = [26, 111, 240] as const
const DARK = [26, 26, 46] as const
const MUTED = [90, 90, 122] as const
const LIGHT_GRAY = [238, 236, 234] as const
const WHITE = [255, 255, 255] as const

function wrapText(doc: jsPDF, text: string, x: number, maxWidth: number, lineHeight: number): number {
  const lines = doc.splitTextToSize(text, maxWidth) as string[]
  lines.forEach((line: string) => {
    const pageHeight = doc.internal.pageSize.getHeight()
    if (x > pageHeight - 20) {
      doc.addPage()
      x = 20
    }
    doc.text(line, 14, x)
    x += lineHeight
  })
  return x
}

export function exportToPDF(result: AnalysisResult, flowDescription: string): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const contentW = pageW - 28
  let y = 20

  // Header bar
  doc.setFillColor(...BLUE)
  doc.rect(0, 0, pageW, 12, 'F')
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...WHITE)
  doc.text('ACTIVATION LAB', 14, 8)
  doc.setFont('helvetica', 'normal')
  doc.text('activation-lab-lime.vercel.app', pageW - 14, 8, { align: 'right' })

  y = 22

  // Title
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...DARK)
  doc.text('Experiment Brief', 14, y)
  y += 8

  // Summary stats row
  doc.setFillColor(...LIGHT_GRAY)
  doc.roundedRect(14, y, contentW, 14, 2, 2, 'F')
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...MUTED)
  doc.text('FRICTION POINTS', 20, y + 5)
  doc.setFontSize(13)
  doc.setTextColor(...BLUE)
  doc.text(String(result.summary.total_friction_points), 20, y + 11)
  doc.setFontSize(9)
  doc.setTextColor(...MUTED)
  doc.text('AVG LIFT', 55, y + 5)
  doc.setFontSize(13)
  doc.setTextColor(40, 160, 80)
  doc.text(`${result.summary.average_expected_lift}%`, 55, y + 11)
  doc.setFontSize(9)
  doc.setTextColor(...MUTED)
  doc.text('TOP RECOMMENDATION', 85, y + 5)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...DARK)
  const recLines = doc.splitTextToSize(result.summary.top_recommendation, contentW - 75) as string[]
  doc.text(recLines[0] ?? '', 85, y + 11)
  y += 20

  // Flow description
  doc.setFontSize(8)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...MUTED)
  doc.text('FLOW ANALYZED', 14, y)
  y += 4
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...DARK)
  y = wrapText(doc, flowDescription, y, contentW, 4.5)
  y += 6

  // Ranking logic
  doc.setFillColor(...LIGHT_GRAY)
  doc.roundedRect(14, y, contentW, 7, 1, 1, 'F')
  doc.setFontSize(8)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(...MUTED)
  doc.text('Ranked by Impact x Confidence, then Effort. High impact, high confidence, low effort goes first.', 18, y + 4.5)
  y += 12

  // Top 3 friction points
  const points = result.friction_points.slice(0, 3)
  const severityColors: Record<string, readonly [number, number, number]> = {
    high: [200, 50, 50],
    medium: [200, 140, 30],
    low: [40, 160, 80],
  }

  points.forEach((point, i) => {
    const pageHeight = doc.internal.pageSize.getHeight()
    if (y > pageHeight - 50) {
      doc.addPage()
      y = 20
    }

    const accentColor = severityColors[point.severity] ?? MUTED

    // Card background
    doc.setFillColor(255, 255, 255)
    doc.setDrawColor(...accentColor)
    doc.roundedRect(14, y, contentW, 2, 0, 0, 'F')
    doc.setFillColor(...accentColor)
    doc.rect(14, y, contentW, 1.5, 'F')
    y += 3

    // Card number + title
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...accentColor)
    doc.text(`0${i + 1}`, 14, y + 4)
    doc.setFontSize(11)
    doc.setTextColor(...DARK)
    doc.text(point.title, 22, y + 4)

    // Scores on the right
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...MUTED)
    doc.text(
      `${point.severity.toUpperCase()} IMPACT  •  ${point.effort.toUpperCase()} EFFORT  •  ${point.confidence.toUpperCase()} CONFIDENCE`,
      pageW - 14,
      y + 4,
      { align: 'right' },
    )
    y += 9

    // Description
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...DARK)
    y = wrapText(doc, point.description, y, contentW, 4.5)
    y += 3

    // Hypothesis label
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(108, 71, 212)
    doc.text('HYPOTHESIS', 14, y)
    y += 4
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...DARK)
    y = wrapText(doc, point.hypothesis, y, contentW, 4.5)
    y += 3

    // Test label
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...BLUE)
    doc.text('RECOMMENDED TEST', 14, y)
    y += 4
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...DARK)
    y = wrapText(doc, point.recommended_test, y, contentW, 4.5)
    y += 3

    // Lift
    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(40, 160, 80)
    doc.text(
      `Expected lift: ${point.expected_lift.low}% to ${point.expected_lift.high}%  (~${point.expected_lift.mid}% mid estimate)`,
      14,
      y,
    )
    y += 4
    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(...MUTED)
    doc.text(point.lift_context, 14, y)
    y += 10
  })

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight()
  doc.setFillColor(...LIGHT_GRAY)
  doc.rect(0, pageHeight - 10, pageW, 10, 'F')
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...MUTED)
  doc.text('Generated by Activation Lab — activation-lab-lime.vercel.app', pageW / 2, pageHeight - 4, { align: 'center' })

  doc.save('activation-lab-brief.pdf')
}
