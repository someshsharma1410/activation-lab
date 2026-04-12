import { useState } from 'react'
import type { AnalysisResult } from '../types/analysis'
import FrictionCard from './FrictionCard'
import ExportButton from './ExportButton'
import FollowUpChat from './FollowUpChat'

interface ResultsDisplayProps {
  result: AnalysisResult
  flowText: string
  activationMetric?: string
}

export default function ResultsDisplay({ result, flowText, activationMetric }: ResultsDisplayProps) {
  const { summary, friction_points } = result
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const allExpanded = expandedIds.size === friction_points.length

  function toggleCard(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll() {
    if (allExpanded) {
      setExpandedIds(new Set())
    } else {
      setExpandedIds(new Set(friction_points.map((p) => p.id)))
    }
  }

  return (
    <div style={{ marginTop: 40 }}>
      {/* Summary bar */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: 10,
          padding: '18px 22px',
          marginBottom: 20,
          display: 'flex',
          gap: 28,
          flexWrap: 'wrap' as const,
          alignItems: 'flex-start',
        }}
      >
        <div style={{ flex: 1, minWidth: 200 }}>
          <p
            style={{
              margin: '0 0 5px',
              fontSize: 10,
              fontWeight: 600,
              color: '#5a5a7a',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.09em',
            }}
          >
            Top Recommendation
          </p>
          <p style={{ margin: 0, fontSize: 14, color: '#1a1a2e', lineHeight: 1.55 }}>
            {summary.top_recommendation}
          </p>
        </div>

        <div style={{ textAlign: 'center' as const, minWidth: 72 }}>
          <p style={{ margin: '0 0 3px', fontSize: 30, fontWeight: 600, color: '#1a6ff0', lineHeight: 1 }}>
            {summary.total_friction_points}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 10,
              color: '#5a5a7a',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.07em',
              fontWeight: 600,
            }}
          >
            Friction Points
          </p>
        </div>

        <div style={{ textAlign: 'center' as const, minWidth: 72 }}>
          <p style={{ margin: '0 0 3px', fontSize: 30, fontWeight: 600, color: '#28a050', lineHeight: 1 }}>
            {summary.average_expected_lift}%
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 10,
              color: '#5a5a7a',
              textTransform: 'uppercase' as const,
              letterSpacing: '0.07em',
              fontWeight: 600,
            }}
          >
            Avg Lift
          </p>
        </div>
      </div>

      {/* Ranking explainer + expand all toggle */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
          paddingLeft: 2,
        }}
      >
        <p style={{ fontSize: 11, color: '#5a5a7a', margin: 0 }}>
          Ranked by Impact × Confidence, then Effort. High impact, high confidence, low effort goes first.
        </p>
        <button
          onClick={toggleAll}
          style={{
            background: 'transparent',
            border: '1px solid rgba(0,0,0,0.10)',
            borderRadius: 6,
            padding: '4px 12px',
            fontSize: 12,
            fontWeight: 500,
            color: '#5a5a7a',
            cursor: 'pointer',
            fontFamily: 'inherit',
            whiteSpace: 'nowrap' as const,
            flexShrink: 0,
            marginLeft: 16,
          }}
        >
          {allExpanded ? 'Collapse all' : 'Show all details'}
        </button>
      </div>

      {/* Cards */}
      {friction_points.map((point) => (
        <FrictionCard
          key={point.id}
          point={point}
          expanded={expandedIds.has(point.id)}
          onToggle={() => toggleCard(point.id)}
        />
      ))}

      {/* Export */}
      <div style={{ marginTop: 16 }}>
        <ExportButton result={result} flowText={flowText} />
      </div>

      {/* Divider */}
      <div
        style={{
          borderTop: '1px solid rgba(0,0,0,0.07)',
          marginTop: 40,
        }}
      />

      {/* Follow up chat */}
      <FollowUpChat
        result={result}
        flowDescription={activationMetric
          ? `My activation metric is: ${activationMetric}. Flow: ${flowText}`
          : flowText}
      />
    </div>
  )
}
