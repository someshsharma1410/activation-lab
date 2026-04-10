import { useState } from 'react'

const SOFT_WARN_THRESHOLD = 50

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
  const canSubmit = count > 0 && !loading

  return (
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
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: isTooShort ? '#c88c1e' : '#5a5a7a',
            transition: 'color 0.2s',
            lineHeight: 1.4,
          }}
        >
          {isTooShort
            ? 'Add more detail for a more complete analysis. At least 2 to 3 steps works best.'
            : count > 0
              ? `${count} characters`
              : ''}
        </span>
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
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
  )
}
