import { useState } from 'react'
import InputForm from './components/InputForm'
import ResultsDisplay from './components/ResultsDisplay'
import { analyzeFlow } from './lib/api'
import type { AnalysisResult } from './types/analysis'

const EXAMPLE_FLOWS = [
  {
    label: 'SaaS with credit card wall',
    text: 'User lands on the marketing page and clicks Start Free Trial. Goes to a signup form requiring email, password, full name, company name, job title, team size, and a credit card even for the free trial. After signup, lands on an empty dashboard with a tooltip tour. The first useful action requires creating a project and inviting a teammate before seeing any value.',
  },
  {
    label: 'Mobile app permissions wall',
    text: 'User downloads the app and sees a welcome screen with three value props. Then immediately asked to allow notifications, then allow location access, then allow contacts. After permissions, asked to create an account with email and password. Then prompted to complete a profile with photo, bio, and interests before seeing any content.',
  },
  {
    label: 'Marketplace seller onboarding',
    text: 'Seller signs up with email and must verify before proceeding. Then must complete a full profile including payment info, tax ID, and business address before listing a first item. The product listing form has 24 required fields. First listing requires manual approval which takes 48 to 72 hours. Seller gets no indication of where they are in the process.',
  },
]

export default function App() {
  const [flowText, setFlowText] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await analyzeFlow(flowText)
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
        <div style={{ marginBottom: 36 }}>
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
              margin: '0 0 18px',
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
              margin: '0 0 28px',
              maxWidth: 520,
            }}
          >
            Describe any onboarding flow. Get ranked A/B test hypotheses grounded in real PM
            frameworks.
          </p>

          {/* Example chips */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {EXAMPLE_FLOWS.map((flow) => (
              <button
                key={flow.label}
                onClick={() => setFlowText(flow.text)}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: 20,
                  padding: '6px 15px',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#1a1a2e',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.15s, background 0.15s',
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
        {result && !loading && <ResultsDisplay result={result} flowText={flowText} />}

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
