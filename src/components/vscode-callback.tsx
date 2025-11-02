'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'

interface VSCodeCallbackProps {
  email: string
  tier: string
  userId: string
}

export function VSCodeCallback({ email, tier, userId }: VSCodeCallbackProps) {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Generating API key...')
  const [apiKey, setApiKey] = useState<string | null>(null)

  useEffect(() => {
    handleVSCodeRedirect()
  }, [])

  const generateApiKey = (): string => {
    // Generate random bytes using Web Crypto API (browser-compatible)
    const array = new Uint8Array(24)
    crypto.getRandomValues(array)
    
    // Convert to hex string
    const hex = Array.from(array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    
    return `sk_${hex}`
  }

  const hashApiKey = async (apiKey: string): Promise<string> => {
    // Use Web Crypto API for SHA-256 hashing (browser-compatible)
    const encoder = new TextEncoder()
    const data = encoder.encode(apiKey)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return hashHex
  }

  const handleVSCodeRedirect = async () => {
    try {
      const supabase = createClient()

      console.log('🔵 Generating API key for VS Code...')

      // Generate API key using browser-native crypto
      const generatedApiKey = generateApiKey()
      const keyPrefix = generatedApiKey.slice(0, 6)
      const hashedKey = await hashApiKey(generatedApiKey)

      console.log('✅ API key generated:', keyPrefix + '...')

      // Store API key in database
      const { error: keyError } = await supabase
        .from('api_keys')
        .insert({
          user_id: userId,
          key_prefix: keyPrefix,
          hashed_key: hashedKey,
          is_active: true
        })

      if (keyError) {
        console.error('❌ Failed to store API key:', keyError)
        setStatus('error')
        setMessage(`Failed to generate API key: ${keyError.message}`)
        return
      }

      console.log('✅ API key stored in database')
      setApiKey(generatedApiKey)

      // Construct the VS Code callback URL
      const vscodeUrl = `vscode://sainocode.sainocode-ai/auth?` +
        `key=${encodeURIComponent(generatedApiKey)}` +
        `&email=${encodeURIComponent(email)}` +
        `&tier=${encodeURIComponent(tier)}`

      console.log('✅ Redirecting to VS Code:', vscodeUrl)
      setStatus('success')
      setMessage('API key generated! Redirecting to VS Code...')

      // Redirect to VS Code after a short delay
      setTimeout(() => {
        console.log('🚀 Executing redirect...')
        window.location.href = vscodeUrl
      }, 1500)

    } catch (err: any) {
      console.error('❌ Error handling VS Code redirect:', err)
      setStatus('error')
      setMessage(`An error occurred: ${err.message || 'Unknown error'}`)
    }
  }

  const copyToClipboard = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey)
      alert('API key copied to clipboard!')
    }
  }

  const manualRedirect = () => {
    if (apiKey) {
      const vscodeUrl = `vscode://sainocode.sainocode-ai/auth?` +
        `key=${encodeURIComponent(apiKey)}` +
        `&email=${encodeURIComponent(email)}` +
        `&tier=${encodeURIComponent(tier)}`
      window.location.href = vscodeUrl
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {status === 'loading' && <Loader2 className="h-5 w-5 animate-spin" />}
            {status === 'success' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
            {status === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
            VS Code Authentication
          </CardTitle>
          <CardDescription>
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'success' && apiKey && (
            <div className="space-y-4">
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800 font-medium">
                  ✅ Authentication successful!
                </p>
                <p className="text-xs text-green-700 mt-1">
                  You should be redirected automatically. If not, click the button below.
                </p>
              </div>
              
              <Button onClick={manualRedirect} className="w-full" size="lg">
                Open in VS Code
              </Button>

              <div className="space-y-2 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Or manually copy your API key:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={apiKey}
                    readOnly
                    className="flex-1 px-3 py-2 text-sm border rounded-md bg-muted font-mono"
                  />
                  <Button onClick={copyToClipboard} variant="outline" size="sm">
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Paste this key in VS Code if the automatic redirect doesn't work.
                </p>
              </div>
            </div>
          )}
          {status === 'error' && (
            <div className="space-y-4">
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">{message}</p>
              </div>
              <Button onClick={() => window.location.reload()} className="w-full">
                Try Again
              </Button>
            </div>
          )}
          {status === 'loading' && (
            <div className="flex justify-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
