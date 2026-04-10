import type { ReactNode } from 'react'
import type { Effort, FrictionPoint, Framework } from '../types/analysis'

const SEVERITY_STYLES = {
  high: {
    bg: '#fff5f5',
    border: 'rgba(200,50,50,0.2)',
    topBorder: '#c83232',
    dot: '#c83232',
  },
  medium: {
    bg: '#fffaf0',
    border: 'rgba(200,140,30,0.2)',
    topBorder: '#c88c1e',
    dot: '#c88c1e',
  },
  low: {
    bg: '#f2faf4',
    border: 'rgba(40,160,80,0.18)',
    topBorder: '#28a050',
    dot: '#28a050',
  },
}

const IMPACT_SCORE = {
  high: { label: 'High Impact', color: '#c83232', bg: 'rgba(200,50,50,0.08)' },
  medium: { label: 'Med Impact', color: '#c88c1e', bg: 'rgba(200,140,30,0.08)' },
  low: { label: 'Low Impact', color: '#28a050', bg: 'rgba(40,160,80,0.08)' },
}

const EFFORT_SCORE: Record<Effort, { label: string; color: string; bg: string }> = {
  low: { label: 'Low Effort', color: '#28a050', bg: 'rgba(40,160,80,0.08)' },
  medium: { label: 'Med Effort', color: '#c88c1e', bg: 'rgba(200,140,30,0.08)' },
  high: { label: 'High Effort', color: '#c83232', bg: 'rgba(200,50,50,0.08)' },
}

const CONFIDENCE_SCORE = {
  high: { label: 'High Confidence', color: '#1a6ff0', bg: 'rgba(26,111,240,0.08)' },
  medium: { label: 'Med Confidence', color: '#c88c1e', bg: 'rgba(200,140,30,0.08)' },
  low: { label: 'Low Confidence', color: '#5a5a7a', bg: 'rgba(0,0,0,0.06)' },
}

const SEQUENCE_LABELS: Record<number, string> = {
  1: 'Run first',
  2: 'Run second',
  3: 'Run third',
  4: 'Run fourth',
  5: 'Run fifth',
}

const FRAMEWORK_LABELS: Record<Framework, string> = {
  TTV: 'Time to Value',
  Funnel: 'Funnel Drop-off',
  Aha: 'Aha Moment',
  CogLoad: 'Cognitive Load',
  Skippable: 'Skippable Step',
}

function Tag({ children, color, bg }: { children: ReactNode; color: string; bg: string }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        color,
        background: bg,
        borderRadius: 4,
        padding: '3px 8px',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.05em',
        whiteSpace: 'nowrap' as const,
      }}
    >
      {children}
    </span>
  )
}

function ScoreChip({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        color,
        background: bg,
        borderRadius: 4,
        padding: '4px 9px',
        whiteSpace: 'nowrap' as const,
      }}
    >
      {label}
    </span>
  )
}

interface FrictionCardProps {
  point: FrictionPoint
}

export default function FrictionCard({ point }: FrictionCardProps) {
  const s = SEVERITY_STYLES[point.severity]
  const impact = IMPACT_SCORE[point.severity]
  const effort = EFFORT_SCORE[point.effort]
  const confidence = CONFIDENCE_SCORE[point.confidence]

  return (
    <div
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderTop: `3px solid ${s.topBorder}`,
        borderRadius: 10,
        padding: '20px 22px',
        marginBottom: 12,
      }}
    >
      {/* Title row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: s.dot,
              flexShrink: 0,
              marginTop: 1,
            }}
          />
          <h3
            style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 600,
              color: '#1a1a2e',
              lineHeight: 1.3,
            }}
          >
            {point.title}
          </h3>
        </div>
        <div style={{ display: 'flex', gap: 6, flexShrink: 0, flexWrap: 'wrap' as const, justifyContent: 'flex-end' }}>
          <Tag color="#6c47d4" bg="rgba(108,71,212,0.09)">
            {FRAMEWORK_LABELS[point.framework]}
          </Tag>
          <Tag color="#5a5a7a" bg="rgba(0,0,0,0.06)">
            {SEQUENCE_LABELS[point.sequence_order] ?? `Run #${point.sequence_order}`}
          </Tag>
        </div>
      </div>

      {/* Scoring breakdown — Impact × Confidence, Effort tiebreaker */}
      <div
        style={{
          display: 'flex',
          gap: 6,
          marginBottom: 12,
          paddingLeft: 17,
          flexWrap: 'wrap' as const,
        }}
      >
        <ScoreChip label={impact.label} color={impact.color} bg={impact.bg} />
        <ScoreChip label={effort.label} color={effort.color} bg={effort.bg} />
        <ScoreChip label={confidence.label} color={confidence.color} bg={confidence.bg} />
      </div>

      {/* Description */}
      <p
        style={{
          margin: '0 0 12px',
          fontSize: 14,
          color: '#5a5a7a',
          lineHeight: 1.65,
          paddingLeft: 17,
        }}
      >
        {point.description}
      </p>

      {/* Hypothesis */}
      <div
        style={{
          background: 'rgba(108,71,212,0.06)',
          border: '1px solid rgba(108,71,212,0.13)',
          borderRadius: 7,
          padding: '10px 14px',
          marginBottom: 8,
        }}
      >
        <p style={{ margin: 0, fontSize: 13, color: '#3d2a8a', lineHeight: 1.6 }}>
          <strong style={{ fontWeight: 600 }}>Hypothesis </strong>
          {point.hypothesis}
        </p>
      </div>

      {/* Recommended test */}
      <div
        style={{
          background: 'rgba(26,111,240,0.06)',
          border: '1px solid rgba(26,111,240,0.13)',
          borderRadius: 7,
          padding: '10px 14px',
          marginBottom: 8,
        }}
      >
        <p style={{ margin: 0, fontSize: 13, color: '#0f3d99', lineHeight: 1.6 }}>
          <strong style={{ fontWeight: 600 }}>Test </strong>
          {point.recommended_test}
        </p>
      </div>

      {/* Risk */}
      <div
        style={{
          background: 'rgba(200,50,50,0.05)',
          border: '1px solid rgba(200,50,50,0.13)',
          borderRadius: 7,
          padding: '10px 14px',
          marginBottom: 14,
        }}
      >
        <p style={{ margin: 0, fontSize: 13, color: '#8b2020', lineHeight: 1.6 }}>
          <strong style={{ fontWeight: 600 }}>Watch out for </strong>
          {point.risk}
        </p>
      </div>

      {/* Lift */}
      <div style={{ paddingLeft: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 4 }}>
          <span style={{ fontSize: 12, color: '#5a5a7a' }}>
            Expected lift:{' '}
            <strong style={{ color: '#1a1a2e', fontWeight: 600 }}>
              {point.expected_lift.low}% to {point.expected_lift.high}%
            </strong>
          </span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#28a050' }}>
            ~{point.expected_lift.mid}% mid estimate
          </span>
        </div>
        <p style={{ margin: 0, fontSize: 11, color: '#5a5a7a', fontStyle: 'italic' }}>
          {point.lift_context}
        </p>
      </div>
    </div>
  )
}
