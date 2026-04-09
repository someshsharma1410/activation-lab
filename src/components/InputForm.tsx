const MIN_CHARS = 100

interface InputFormProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  loading: boolean
}

export default function InputForm({ value, onChange, onSubmit, loading }: InputFormProps) {
  const count = value.length
  const canSubmit = count >= MIN_CHARS && !loading

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe your onboarding flow step by step. What does a new user experience from the landing page to their first value moment?"
        rows={7}
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
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: count >= MIN_CHARS ? '#28a050' : '#5a5a7a',
            transition: 'color 0.2s',
          }}
        >
          {count < MIN_CHARS
            ? `${MIN_CHARS - count} more characters needed`
            : `${count} characters`}
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
          }}
        >
          Analyze
        </button>
      </div>
    </div>
  )
}
