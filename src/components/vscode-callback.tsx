'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createHash } from 'crypto'
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

  const handleVSCodeRedirect = async () => {
    try {
      const supabase = createClient()

      console.log('🔵 Generating API key for VS Code...')

      // Generate API key
      const generatedApiKey = `sk_${Buffer.from(crypto.getRandomValues(new Uint8Array(24))).toString('hex')}`
      const keyPrefix = generatedApiKey.slice(0, 6)
      const hashedKey = createHash('sha256').update(generatedApiKey).digest('hex')

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
        setMessage('Failed to generate API key. Please try again.')
        return
      }

      console.log('✅ API key generated successfully')
      setApiKey(generatedApiKey)

      // Construct the VS Code callback URL
      const vscodeUrl = `vscode://sainocode.sainocode-ai/auth?` +
        `key=${encodeURIComponent(generatedApiKey)}` +
        `&email=${encodeURIComponent(email)}` +
        `&tier=${encodeURIComponent(tier)}`

      console.log(`✅ Redirecting to VS Code...`)
      setStatus('success')
      setMessage('API key generated! Redirecting to VS Code...')

      // Redirect to VS Code after a short delay
      setTimeout(() => {
        window.location.href = vscodeUrl
      }, 1500)

    } catch (err) {
      console.error('❌ Error handling VS Code redirect:', err)
      setStatus('error')
      setMessage('An error occurred. Please try again.')
    }
  }

  const copyToClipboard = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey)
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
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Your API key has been generated. If the redirect doesn't work, you can copy the key below:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={apiKey}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm border rounded-md bg-muted"
                />
                <Button onClick={copyToClipboard} variant="outline" size="sm">
                  Copy
                </Button>
              </div>
            </div>
          )}
          {status === 'error' && (
            <Button onClick={() => window.location.reload()} className="w-full">
              Try Again
            </Button>
          )}
          {status === 'loading' && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
