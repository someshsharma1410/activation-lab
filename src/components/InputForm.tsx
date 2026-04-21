import { useState } from 'react'

const SOFT_WARN_THRESHOLD = 50
const SCOPE_CHECK_THRESHOLD = 80

// Signals that suggest a digital product onboarding flow.
// Keep these specific enough to avoid false positives on B2B/business process text.
const DIGITAL_SIGNALS = [
  // Product surface
  'app', 'website', 'web app', 'mobile app', 'desktop app', 'browser extension',
  // Auth & identity
  'signup', 'sign up', 'sign-up', 'sign up for', 'register', 'create an account',
  'log in', 'login', 'log-in', 'password', 'username', 'email address',
  // Navigation & UI
  'dashboard', 'modal', 'button', 'click', 'tap', 'swipe', 'onboarding screen',
  'landing page', 'home screen', 'settings page', 'profile page',
  // Installation
  'download', 'install', 'launch the app',
  // Onboarding-specific
  'onboard', 'onboarding', 'tutorial', 'walkthrough', 'product tour', 'in-app',
  // Notifications & prompts
  'push notification', 'in-app notification', 'pop-up', 'popup', 'tooltip', 'toast',
  // Product models
  'saas', 'freemium', 'free trial', 'trial period', 'subscription plan',
  // User action phrases (specific enough to be digital)
  'user lands on', 'user clicks', 'user taps', 'user sees', 'user enters',
  'user opens the', 'user downloads', 'user signs up', 'user logs in',
  // Dev/technical onboarding
  'api key', 'oauth', 'sso', 'sdk', 'code snippet', 'embed',
]

function looksLikeOnboardingFlow(text: string): boolean {
  const lower = text.toLowerCase()
  return DIGITAL_SIGNALS.some((signal) => lower.includes(signal))
}

interface InputFormProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  loading: boolean
}

export default function InputForm({ value, onChange, onSubmit, loading }: InputFormProps) {
  const [focused, setFocused] = useState(false)
  const count = value.length
  const isTooShort = count > 0 && count < SOFT_WARN_THRESHOLD
  const showScopeWarning =
    count >= SCOPE_CHECK_THRESHOLD && !looksLikeOnboardingFlow(value)
  const canSubmit = count > 0 && !loading

  return (
    <div>
      <div
        style={{
          background: '#ffffff',
          border: `1px solid ${focused ? 'rgba(26,111,240,0.3)' : 'rgba(0,0,0,0.08)'}`,
          borderRadius: 12,
          overflow: 'hidden',
          transition: 'border-color 0.15s',
        }}
      >
        <textarea
          id="onboarding-flow-input"
          aria-label="Describe your onboarding flow"
          aria-describedby="input-status input-privacy"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Describe your onboarding flow step by step. E.g. User lands on homepage, sees value prop, clicks sign up, enters email and password, verifies email, lands on dashboard..."
          rows={focused || value.length > 0 ? 8 : 4}
          style={{
            width: '100%',
            padding: '18px 20px',
            border: 'none',
            outline: 'none',
            resize: 'vertical',
            fontSize: 15,
            fontWeight: 400,
            color: '#1a1a2e',
            lineHeight: 1.65,
            background: 'transparent',
            boxSizing: 'border-box',
            display: 'block',
            transition: 'rows 0.2s',
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 16px 10px 20px',
            borderTop: '1px solid rgba(0,0,0,0.06)',
            background: '#eeecea',
            minHeight: 44,
          }}
        >
          <span
            id="input-status"
            role="status"
            aria-live="polite"
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: isTooShort ? '#c88c1e' : '#5a5a7a',
              transition: 'color 0.2s',
              lineHeight: 1.4,
            }}
          >
            {isTooShort
              ? 'A bit more detail will sharpen the analysis — 2 or 3 steps usually does it.'
              : count > 0
                ? `${count} characters`
                : ''}
          </span>
          <button
            onClick={onSubmit}
            disabled={!canSubmit}
            aria-label={loading ? 'Analyzing your onboarding flow' : 'Analyze your onboarding flow'}
            style={{
              background: canSubmit ? '#1a6ff0' : 'rgba(0,0,0,0.10)',
              color: canSubmit ? '#ffffff' : '#5a5a7a',
              border: 'none',
              borderRadius: 8,
              padding: '8px 22px',
              fontSize: 14,
              fontWeight: 600,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit',
              transition: 'background 0.15s, color 0.15s',
              letterSpacing: '0.01em',
              flexShrink: 0,
              marginLeft: 12,
            }}
          >
            Analyze
          </button>
        </div>
      </div>

      {/* Privacy disclosure — tells users what happens to their input */}
      <p
        id="input-privacy"
        style={{
          margin: '8px 4px 0',
          fontSize: 12,
          color: '#5a5a7a',
          lineHeight: 1.5,
        }}
      >
        Your input is sent to Anthropic's Claude API for analysis and isn't stored by Activation Lab.
      </p>

      {/* Scope warning — shown below the input box, non-blocking */}
      {showScopeWarning && (
        <div
          role="status"
          aria-live="polite"
          style={{
            marginTop: 10,
            padding: '10px 14px',
            background: 'rgba(200,140,30,0.08)',
            border: '1px solid rgba(200,140,30,0.25)',
            borderRadius: 8,
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
          }}
        >
          <span style={{ fontSize: 14, lineHeight: 1, marginTop: 1, flexShrink: 0 }}>⚠️</span>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: '#7a5a10',
              lineHeight: 1.5,
            }}
          >
            This looks like it might be a business process rather than a digital product flow.
            Activation Lab works best with software signup and onboarding descriptions.
            You can still analyze it, but results may not be relevant.
          </p>
        </div>
      )}
    </div>
  )
}
