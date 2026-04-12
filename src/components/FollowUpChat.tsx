import { useState, useRef, useEffect } from 'react'
import type { AnalysisResult } from '../types/analysis'
import { chatWithAnalysis } from '../lib/api'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface FollowUpChatProps {
  result: AnalysisResult
  flowDescription: string
}

const SUGGESTED_QUESTIONS = [
  'Why this order?',
  'What tool should I use?',
  'How do I measure the lift?',
]

export default function FollowUpChat({ result, flowDescription }: FollowUpChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  async function handleSend(question?: string) {
    const text = (question ?? input).trim()
    if (!text || loading) return

    const userMsg: Message = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }))
      const reply = await chatWithAnalysis(text, result, flowDescription, history)
      setMessages([...newMessages, { role: 'assistant', content: reply }])
    } catch (e) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: e instanceof Error ? e.message : 'Something went wrong. Try again.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSend()
    }
  }

  return (
    <div style={{ marginTop: 40 }}>
      {/* Section header */}
      <div style={{ marginBottom: 14 }}>
        <p
          style={{
            margin: '0 0 4px',
            fontSize: 11,
            fontWeight: 600,
            color: '#5a5a7a',
            textTransform: 'uppercase',
            letterSpacing: '0.09em',
          }}
        >
          Ask a follow up question
        </p>
        <p style={{ margin: 0, fontSize: 13, color: '#5a5a7a' }}>
          Ask anything about these friction points. The full analysis stays in context.
        </p>
      </div>


      {/* Message thread */}
      {messages.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                marginBottom: 12,
                display: 'flex',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                gap: 10,
                alignItems: 'flex-start',
              }}
            >
              {/* Avatar dot */}
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: msg.role === 'user' ? '#1a6ff0' : '#eeecea',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  fontWeight: 700,
                  color: msg.role === 'user' ? '#ffffff' : '#5a5a7a',
                  marginTop: 2,
                }}
              >
                {msg.role === 'user' ? 'Y' : 'A'}
              </div>

              {/* Bubble */}
              <div
                style={{
                  maxWidth: '82%',
                  background: msg.role === 'user' ? '#1a6ff0' : '#ffffff',
                  border: msg.role === 'user' ? 'none' : '1px solid rgba(0,0,0,0.08)',
                  borderRadius: msg.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                  padding: '10px 14px',
                  fontSize: 14,
                  color: msg.role === 'user' ? '#ffffff' : '#1a1a2e',
                  lineHeight: 1.65,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: '#eeecea',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#5a5a7a',
                  marginTop: 2,
                }}
              >
                A
              </div>
              <div
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: '12px 12px 12px 4px',
                  padding: '10px 16px',
                  display: 'flex',
                  gap: 5,
                  alignItems: 'center',
                }}
              >
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#5a5a7a',
                      opacity: 0.4,
                      animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Suggested questions — always visible */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
        {SUGGESTED_QUESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => void handleSend(q)}
            disabled={loading}
            style={{
              background: '#ffffff',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 20,
              padding: '5px 13px',
              fontSize: 12,
              fontWeight: 500,
              color: '#5a5a7a',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              transition: 'border-color 0.15s, color 0.15s',
              opacity: loading ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.borderColor = '#1a6ff0'
                e.currentTarget.style.color = '#1a6ff0'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)'
              e.currentTarget.style.color = '#5a5a7a'
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
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
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Ask about any friction point or experiment..."
          rows={2}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px 16px 10px',
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontSize: 14,
            fontWeight: 400,
            color: '#1a1a2e',
            lineHeight: 1.55,
            background: 'transparent',
            boxSizing: 'border-box',
            display: 'block',
            fontFamily: 'inherit',
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '6px 12px 8px 16px',
            borderTop: '1px solid rgba(0,0,0,0.06)',
            background: '#eeecea',
          }}
        >
          <span style={{ fontSize: 11, color: '#5a5a7a' }}>
            Enter to send, Shift+Enter for new line
          </span>
          <button
            onClick={() => void handleSend()}
            disabled={!input.trim() || loading}
            style={{
              background: input.trim() && !loading ? '#1a6ff0' : 'rgba(0,0,0,0.10)',
              color: input.trim() && !loading ? '#ffffff' : '#5a5a7a',
              border: 'none',
              borderRadius: 7,
              padding: '6px 18px',
              fontSize: 13,
              fontWeight: 600,
              cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
