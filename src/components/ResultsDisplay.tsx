import { useState } from 'react'
import type { AnalysisResult, AnalysisSummary, FrictionPoint } from '../types/analysis'
import FrictionCard from './FrictionCard'
import ExportButton from './ExportButton'
import FollowUpChat from './FollowUpChat'

interface ResultsDisplayProps {
  result: AnalysisResult
  flowText: string
  activationMetric?: string
  isSample?: boolean
  streaming?: boolean
}

/**
 * True when every field FrictionCard relies on has landed from the stream.
 * Guards against rendering cards with undefined severity / effort / lift etc.
 */
function isCompleteFrictionPoint(p: Partial<FrictionPoint> | undefined): p is FrictionPoint {
  if (!p) return false
  return (
    typeof p.id === 'string' &&
    typeof p.title === 'string' &&
    typeof p.summary === 'string' &&
    typeof p.description === 'string' &&
    typeof p.hypothesis === 'string' &&
    typeof p.recommended_test === 'string' &&
    typeof p.risk === 'string' &&
    typeof p.lift_context === 'string' &&
    typeof p.sequence_order === 'number' &&
    (p.severity === 'high' || p.severity === 'medium' || p.severity === 'low') &&
    (p.effort === 'high' || p.effort === 'medium' || p.effort === 'low') &&
    (p.confidence === 'high' || p.confidence === 'medium' || p.confidence === 'low') &&
    (p.framework === 'TTV' || p.framework === 'Funnel' || p.framework === 'Aha' || p.framework === 'CogLoad' || p.framework === 'Skippable') &&
    !!p.expected_lift &&
    typeof p.expected_lift.low === 'number' &&
    typeof p.expected_lift.mid === 'number' &&
    typeof p.expected_lift.high === 'number'
  )
}

function isCompleteSummary(s: Partial<AnalysisSummary> | undefined): s is AnalysisSummary {
  if (!s) return false
  return (
    typeof s.total_friction_points === 'number' &&
    typeof s.top_recommendation === 'string' &&
    typeof s.average_expected_lift === 'number'
  )
}

export default function ResultsDisplay({ result, flowText, activationMetric, isSample, streaming }: ResultsDisplayProps) {
  const { summary, friction_points } = result
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  // During streaming, partial-json may hand us half-built objects. Render
  // only fully-complete cards; half-built ones slot in as they finish.
  const completePoints = (friction_points ?? []).filter(isCompleteFrictionPoint)
  const summaryReady = isCompleteSummary(summary)
  const allExpanded = expandedIds.size === completePoints.length && completePoints.length > 0

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
      setExpandedIds(new Set(completePoints.map((p) => p.id)))
    }
  }

  return (
    <div style={{ marginTop: 40 }}>
      {/* Sample-analysis disclosure — only shown when serving pre-computed JSON */}
      {isSample && (
        <div
          role="note"
          style={{
            background: 'rgba(26,111,240,0.06)',
            border: '1px solid rgba(26,111,240,0.18)',
            borderRadius: 8,
            padding: '9px 14px',
            marginBottom: 12,
            display: 'flex',
            gap: 10,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#1a6ff0',
              background: 'rgba(26,111,240,0.10)',
              borderRadius: 4,
              padding: '3px 7px',
              flexShrink: 0,
            }}
          >
            Sample
          </span>
          <span style={{ fontSize: 12.5, color: '#3a3a5a', lineHeight: 1.5 }}>
            Saved analysis of the built-in sample, served instantly. Edit the text or paste your own flow to run a fresh analysis against the Claude API.
          </span>
        </div>
      )}

      {/* Summary bar — hidden during streaming until the summary block
          finishes landing; summary is emitted after the friction_points
          array in the model's JSON, so it arrives last. */}
      {summaryReady && (
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
              {summary!.top_recommendation}
            </p>
          </div>

          <div style={{ textAlign: 'center' as const, minWidth: 72 }}>
            <p style={{ margin: '0 0 3px', fontSize: 30, fontWeight: 600, color: '#1a6ff0', lineHeight: 1 }}>
              {summary!.total_friction_points}
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
              {summary!.average_expected_lift}%
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
      )}

      {/* Ranking explainer + expand all toggle — hide the toggle until we
          have at least one fully-parsed card to expand. */}
      {completePoints.length > 0 && (
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
      )}

      {/* Cards — only fully-parsed ones. Half-built cards from a streaming
          partial JSON wait until every FrictionCard-required field lands. */}
      {completePoints.map((point) => (
        <FrictionCard
          key={point.id}
          point={point}
          expanded={expandedIds.has(point.id)}
          onToggle={() => toggleCard(point.id)}
        />
      ))}

      {/* Streaming indicator — shown while the live API is still producing
          output. Gives the user a legible "more is on the way" affordance
          between cards arriving. */}
      {streaming && (
        <div
          role="status"
          aria-live="polite"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '14px 18px',
            marginTop: completePoints.length > 0 ? 4 : 12,
            marginBottom: 12,
            background: 'rgba(26,111,240,0.04)',
            border: '1px dashed rgba(26,111,240,0.25)',
            borderRadius: 10,
            color: '#1a6ff0',
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          <span className="pulse-dot" aria-hidden="true" />
          {completePoints.length === 0
            ? 'Analyzing your flow — first friction point will land shortly...'
            : `Generating next friction point — ${completePoints.length} ready so far`}
        </div>
      )}

      {/* Export + follow-up chat — only once the stream has fully landed.
          Exporting partial analysis or chatting about it would be misleading. */}
      {!streaming && (
        <>
          <div style={{ marginTop: 16 }}>
            <ExportButton result={result} flowText={flowText} />
          </div>

          <div
            style={{
              borderTop: '1px solid rgba(0,0,0,0.07)',
              marginTop: 40,
            }}
          />

          <FollowUpChat
            result={result}
            flowDescription={activationMetric
              ? `My activation metric is: ${activationMetric}. Flow: ${flowText}`
              : flowText}
          />
        </>
      )}
    </div>
  )
}
