import { Component, Suspense } from 'react'
import AskMe from './AskMe.jsx'

/**
 * ─────────────────────────────────────────────────────
 *  Error Boundary
 *  Catches render errors in the AskMe component tree
 *  and shows a graceful fallback UI.
 * ─────────────────────────────────────────────────────
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[Ask Me] Render error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.errorContainer}>
          <div style={styles.errorCard}>
            {/* Logo mark */}
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" style={{ marginBottom: 20 }}>
              <defs>
                <linearGradient id="elg" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>
              <rect width="56" height="56" rx="16" fill="url(#elg)" />
              <path
                d="M21 21c0-3.866 3.134-7 7-7s7 3.134 7 7c0 3-2 4.5-4 6-1.5 1.1-2 2-2 3.5"
                stroke="white"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              <circle cx="28" cy="41" r="2.4" fill="white" />
            </svg>

            <h1 style={styles.errorTitle}>Something went wrong</h1>
            <p style={styles.errorMsg}>
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              style={styles.errorBtn}
              onClick={() => {
                this.setState({ hasError: false, error: null })
                window.location.reload()
              }}
            >
              Reload Ask Me
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * ─────────────────────────────────────────────────────
 *  Loading Fallback
 *  Shown while AskMe suspends (e.g. lazy imports)
 * ─────────────────────────────────────────────────────
 */
function LoadingFallback() {
  return (
    <div style={styles.loadingContainer}>
      <div style={styles.loadingInner}>
        <svg width="52" height="52" viewBox="0 0 56 56" fill="none" style={styles.loadingLogo}>
          <defs>
            <linearGradient id="llg" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
          <rect width="56" height="56" rx="16" fill="url(#llg)" />
          <path
            d="M21 21c0-3.866 3.134-7 7-7s7 3.134 7 7c0 3-2 4.5-4 6-1.5 1.1-2 2-2 3.5"
            stroke="white"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <circle cx="28" cy="41" r="2.4" fill="white" />
        </svg>
        <p style={styles.loadingText}>Loading Ask Me…</p>
        <div style={styles.loadingBar}>
          <div style={styles.loadingFill} />
        </div>
      </div>

      <style>{`
        @keyframes askme-slide {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        @keyframes askme-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        .askme-loading-logo {
          animation: askme-float 2s ease-in-out infinite;
        }
        .askme-loading-fill {
          animation: askme-slide 1.4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

/** Inline styles — no CSS file dependency */
const styles = {
  // Error boundary
  errorContainer: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #e0f2fe 0%, #f5f0e8 50%, #f8f9fb 100%)',
    fontFamily: "'Lato', system-ui, sans-serif",
    padding: 24,
  },
  errorCard: {
    background: 'white',
    borderRadius: 20,
    padding: '48px 40px',
    maxWidth: 440,
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 12px 48px rgba(14,30,50,.16)',
    border: '1.5px solid #e2e8f0',
  },
  errorTitle: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: 24,
    fontWeight: 800,
    color: '#1a2232',
    marginBottom: 12,
    letterSpacing: '-0.02em',
  },
  errorMsg: {
    fontSize: 14,
    color: '#5a6c82',
    lineHeight: 1.7,
    marginBottom: 28,
    fontWeight: 300,
  },
  errorBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: 'linear-gradient(135deg, #0369a1, #0ea5e9)',
    color: 'white',
    border: 'none',
    borderRadius: 12,
    padding: '12px 28px',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
    letterSpacing: '0.01em',
    boxShadow: '0 4px 14px rgba(3,105,161,.3)',
    transition: 'all 0.2s',
  },

  // Loading fallback
  loadingContainer: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #e0f2fe 0%, #f5f0e8 50%, #f8f9fb 100%)',
    fontFamily: "'Lato', system-ui, sans-serif",
  },
  loadingInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  loadingLogo: {
    animation: 'askme-float 2s ease-in-out infinite',
  },
  loadingText: {
    fontSize: 14,
    color: '#5a6c82',
    fontWeight: 300,
    letterSpacing: '0.02em',
  },
  loadingBar: {
    width: 160,
    height: 3,
    background: '#e0f2fe',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingFill: {
    height: '100%',
    width: '40%',
    background: 'linear-gradient(90deg, #0ea5e9, #38bdf8)',
    borderRadius: 2,
    animation: 'askme-slide 1.4s ease-in-out infinite',
  },
}

/**
 * ─────────────────────────────────────────────────────
 *  Root App Component
 * ─────────────────────────────────────────────────────
 */
export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <AskMe />
      </Suspense>
    </ErrorBoundary>
  )
}
