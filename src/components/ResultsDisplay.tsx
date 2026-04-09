import type { AnalysisResult } from '../types/analysis'
import FrictionCard from './FrictionCard'
import ExportButton from './ExportButton'

interface ResultsDisplayProps {
  result: AnalysisResult
  flowText: string
}

export default function ResultsDisplay({ result, flowText }: ResultsDisplayProps) {
  const { summary, friction_points } = result

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
          <p style={{ margin: '0 0 10px', fontSize: 14, color: '#1a1a2e', lineHeight: 1.55 }}>
            {summary.top_recommendation}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              color: '#5a5a7a',
              lineHeight: 1.55,
              fontStyle: 'italic',
            }}
          >
            {summary.sequence_rationale}
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

      {/* Cards */}
      {friction_points.map((point) => (
        <FrictionCard key={point.id} point={point} />
      ))}

      {/* Export */}
      <div style={{ marginTop: 16 }}>
        <ExportButton result={result} flowText={flowText} />
      </div>
    </div>
  )
}
