import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Top-level error boundary. Catches any uncaught render / lifecycle error
 * below it and renders a friendly fallback in the Activation Lab visual
 * language instead of the default white-screen-of-death. Logs the error
 * + React component stack to the console so the user can share it if
 * they care to report the issue.
 *
 * Note: error boundaries do NOT catch errors in event handlers, async
 * code, or the rendering of the error boundary itself. Anything thrown
 * inside a click handler (like the existing PDF export path) is handled
 * by the handler's own try/catch and is not meant to reach this boundary.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[Activation Lab] Uncaught error in React tree:', error)
    console.error('[Activation Lab] Component stack:', info.componentStack)
  }

  handleReload = (): void => {
    window.location.reload()
  }

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children

    return (
      <main
        style={{
          background: '#f5f4f1',
          minHeight: '100vh',
          fontFamily: "'DM Sans', sans-serif",
          color: '#1a1a2e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <div
          style={{
            maxWidth: 520,
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: 12,
            padding: '32px 32px 28px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          <p
            style={{
              margin: '0 0 10px',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#c83232',
            }}
          >
            Activation Lab
          </p>
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 32,
              fontWeight: 400,
              lineHeight: 1.15,
              color: '#1a1a2e',
              margin: '0 0 14px',
              letterSpacing: '-0.01em',
            }}
          >
            Something broke on my end.
          </h1>
          <p
            style={{
              fontSize: 15,
              fontWeight: 300,
              color: '#5a5a7a',
              lineHeight: 1.65,
              margin: '0 0 22px',
            }}
          >
            The page hit an unexpected error and couldn't recover. Reloading usually fixes it. If it keeps happening with the same flow, shoot me a note on LinkedIn with what you pasted in — I'd like to fix it.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              background: '#1a6ff0',
              color: '#ffffff',
              border: 'none',
              borderRadius: 8,
              padding: '10px 24px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              letterSpacing: '0.01em',
            }}
          >
            Reload the page
          </button>

          {this.state.error && (
            <details
              style={{
                marginTop: 22,
                fontSize: 12,
                color: '#5a5a7a',
              }}
            >
              <summary style={{ cursor: 'pointer', userSelect: 'none' }}>
                Show error details
              </summary>
              <pre
                style={{
                  marginTop: 10,
                  padding: '10px 12px',
                  background: 'rgba(0,0,0,0.03)',
                  borderRadius: 6,
                  fontSize: 11.5,
                  color: '#3a3a5a',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  lineHeight: 1.5,
                  fontFamily: "'SFMono-Regular', Menlo, Consolas, monospace",
                  maxHeight: 180,
                  overflow: 'auto',
                }}
              >
                {this.state.error.name}: {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      </main>
    )
  }
}
