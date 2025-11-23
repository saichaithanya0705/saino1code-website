'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

// Mark this page as dynamic - it uses search params
export const dynamic = 'force-dynamic'

function AuthSuccessContent() {
  const searchParams = useSearchParams()
  const [vscodeUrl, setVscodeUrl] = useState<string>('')
  const [countdown, setCountdown] = useState(3)
  const [autoRedirectFailed, setAutoRedirectFailed] = useState(false)

  useEffect(() => {
    // Build VS Code URL from query params
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (code) {
      const url = `vscode://sainocode.sainocode-ai/auth/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state || '')}`
      setVscodeUrl(url)

      // Attempt automatic redirect after countdown
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval)
            // Try automatic redirect
            window.location.href = url

            // If still on page after 2 seconds, show manual button
            setTimeout(() => {
              setAutoRedirectFailed(true)
            }, 2000)

            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(countdownInterval)
    }
  }, [searchParams])

  const handleOpenVSCode = () => {
    if (vscodeUrl) {
      window.location.href = vscodeUrl
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        maxWidth: '500px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          margin: '0 auto 20px',
          backgroundColor: '#10b981',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px'
        }}>
          ✓
        </div>

        <h1 style={{
          fontSize: '24px',
          fontWeight: '600',
          marginBottom: '12px',
          color: '#1f2937'
        }}>
          Authentication Successful!
        </h1>

        <p style={{
          fontSize: '16px',
          color: '#6b7280',
          marginBottom: '24px'
        }}>
          Your VS Code extension has been authenticated.
        </p>

        {countdown > 0 && (
          <p style={{
            fontSize: '14px',
            color: '#9ca3af',
            marginBottom: '20px'
          }}>
            Redirecting to VS Code in {countdown}...
          </p>
        )}

        {(countdown === 0 || autoRedirectFailed) && (
          <>
            <p style={{
              fontSize: '14px',
              color: '#9ca3af',
              marginBottom: '20px'
            }}>
              If VS Code didn't open automatically, click the button below:
            </p>

            <button
              onClick={handleOpenVSCode}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '12px 32px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
            >
              Open VS Code
            </button>
          </>
        )}

        <div style={{
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{
            fontSize: '12px',
            color: '#9ca3af'
          }}>
            You can close this window once VS Code opens.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AuthSuccessPage() {
  return (
    <Suspense fallback={<div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>Loading...</div>}>
      <AuthSuccessContent />
    </Suspense>
  )
}
