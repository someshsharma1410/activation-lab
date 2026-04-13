import { useState } from 'react'
import InputForm from './components/InputForm'
import ResultsDisplay from './components/ResultsDisplay'
import { analyzeFlow } from './lib/api'
import type { AnalysisResult } from './types/analysis'

// Exact neutral descriptions from v2 spec Section 3.2.1
const EXAMPLE_FLOWS = [
  {
    label: 'SaaS signup',
    text: 'User lands on pricing page, clicks Start Free Trial, enters email and password, fills out a 6 field profile form including company size and role, selects a plan, enters credit card details, lands on empty dashboard.',
  },
  {
    label: 'Mobile app',
    text: 'New user downloads the app, sees a welcome screen, taps Get Started, is asked to grant location and notification permissions, creates an account with email and password, is shown a 4 screen tutorial, lands on the home feed.',
  },
  {
    label: 'Marketplace',
    text: 'User lands on homepage, browses listings, clicks Contact Seller, is prompted to create an account, enters email and password, completes a profile with photo upload and bio, verifies phone number, can now message seller.',
  },
]

export default function App() {
  const [flowText, setFlowText] = useState('')
  const [activationMetric, setActivationMetric] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await analyzeFlow(flowText, activationMetric.trim() || undefined)
      setResult(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        background: '#f5f4f1',
        minHeight: '100vh',
        fontFamily: "'DM Sans', sans-serif",
        color: '#1a1a2e',
      }}
    >
      <div
        style={{
          maxWidth: 740,
          margin: '0 auto',
          padding: '72px 24px 80px',
        }}
      >
        {/* Hero */}
        <div style={{ marginBottom: 32 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#5a5a7a',
              margin: '0 0 14px',
            }}
          >
            Activation Lab
          </p>
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(34px, 6vw, 54px)',
              fontWeight: 400,
              lineHeight: 1.08,
              color: '#1a1a2e',
              margin: '0 0 16px',
              letterSpacing: '-0.01em',
            }}
          >
            Find friction worth fixing
          </h1>
          <p
            style={{
              fontSize: 17,
              fontWeight: 300,
              color: '#5a5a7a',
              lineHeight: 1.65,
              margin: '0 0 32px',
              maxWidth: 520,
            }}
          >
            Paste an onboarding flow. Get experiment ideas backed by proven product frameworks.
          </p>
        </div>

        {/* Activation metric — optional context field */}
        <div style={{ marginBottom: 12 }}>
          <label
            style={{
              display: 'block',
              fontSize: 11,
              fontWeight: 600,
              color: '#5a5a7a',
              textTransform: 'uppercase',
              letterSpacing: '0.09em',
              marginBottom: 7,
            }}
          >
            What does activation mean for your product?{' '}
            <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, opacity: 0.7 }}>
              optional
            </span>
          </label>
          <input
            type="text"
            value={activationMetric}
            onChange={(e) => setActivationMetric(e.target.value)}
            placeholder="e.g. first project created, day 1 retention, first purchase"
            style={{
              width: '100%',
              padding: '11px 16px',
              background: '#ffffff',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 400,
              color: '#1a1a2e',
              fontFamily: 'inherit',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(26,111,240,0.3)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)' }}
          />
        </div>

        {/* Example chips — visually separated from the input area */}
        <div
          style={{
            background: '#eeecea',
            borderRadius: 10,
            padding: '14px 18px',
            marginBottom: 12,
          }}
        >
          <p
            style={{
              margin: '0 0 10px',
              fontSize: 11,
              fontWeight: 600,
              color: '#5a5a7a',
              textTransform: 'uppercase',
              letterSpacing: '0.09em',
            }}
          >
            New here? Try an example:
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {EXAMPLE_FLOWS.map((flow) => (
              <button
                key={flow.label}
                onClick={() => setFlowText(flow.text)}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: 20,
                  padding: '5px 12px',
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#1a1a2e',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.15s, background 0.15s, color 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#1a6ff0'
                  e.currentTarget.style.background = '#f0f5ff'
                  e.currentTarget.style.color = '#1a6ff0'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'
                  e.currentTarget.style.background = '#ffffff'
                  e.currentTarget.style.color = '#1a1a2e'
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: '#5a5a7a',
                    background: 'rgba(0,0,0,0.06)',
                    borderRadius: 3,
                    padding: '1px 5px',
                  }}
                >
                  eg
                </span>
                {flow.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input form */}
        <InputForm
          value={flowText}
          onChange={setFlowText}
          onSubmit={handleSubmit}
          loading={loading}
        />

        {/* Loading */}
        {loading && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginTop: 32,
              color: '#5a5a7a',
            }}
          >
            <div className="spinner" />
            <span style={{ fontSize: 14, fontWeight: 400 }}>Analyzing your flow...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            style={{
              marginTop: 24,
              padding: '12px 16px',
              background: '#fff5f5',
              border: '1px solid rgba(200,50,50,0.2)',
              borderRadius: 8,
              color: '#c83232',
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            {error}
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <ResultsDisplay
            result={result}
            flowText={flowText}
            activationMetric={activationMetric.trim() || undefined}
          />
        )}

        {/* Footer */}
        <p
          style={{
            textAlign: 'center',
            fontSize: 12,
            color: '#5a5a7a',
            marginTop: 72,
            opacity: 0.65,
          }}
        >
          A side project for exploring product activation frameworks
        </p>
      </div>
    </div>
  )
}
