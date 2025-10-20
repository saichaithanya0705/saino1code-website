"use client"

import Link from "next/link"
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { createHash } from "crypto"

function LoginForm() {
  const supabase = createClient()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [githubLoading, setGithubLoading] = useState(false)
  const [microsoftLoading, setMicrosoftLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Check if this is a VS Code callback
  const isVSCodeCallback = searchParams.get('callback') === 'vscode'

  useEffect(() => {
    // If user is already authenticated and this is a VS Code callback, redirect immediately
    const checkAuthAndRedirect = async () => {
      if (!isVSCodeCallback) return

      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await handleVSCodeRedirect(user.id, user.email || '')
      }
    }

    checkAuthAndRedirect()
  }, [isVSCodeCallback])

  const handleVSCodeRedirect = async (userId: string, email: string) => {
    try {
      console.log('🔵 Handling VS Code redirect for user:', email)
      
      // Check if user already has a recent key (prevents duplicate generation during testing)
      console.log('🔍 Checking if should generate new API key...')
      const { data: shouldGenerateRaw, error: checkError } = await supabase
        .rpc('should_generate_new_key', { p_cooldown_minutes: 5 })
        .maybeSingle()
      
      if (checkError) {
        console.warn('⚠️  Could not check key status:', checkError)
        // Continue anyway
      }

      const shouldGenerate = shouldGenerateRaw as any

      if (shouldGenerate && !shouldGenerate.should_generate) {
        // User has a recent key
        console.log(`ℹ️  ${shouldGenerate.reason}`)
        console.log(`   Active keys: ${shouldGenerate.active_key_count}`)
        console.log(`   Last generated: ${shouldGenerate.last_generated_seconds_ago}s ago`)
        
        const waitMinutes = Math.ceil((300 - (shouldGenerate.last_generated_seconds_ago || 0)) / 60)
        setError(`You generated an API key ${shouldGenerate.last_generated_seconds_ago} seconds ago. Please wait ${waitMinutes} more minute(s) before generating another key, or use your existing key from the extension.`)
        return
      }

      console.log('✅ Generating new API key...')
      const apiKey = `sk_${Buffer.from(crypto.getRandomValues(new Uint8Array(24))).toString('hex')}`
      const keyPrefix = 'sk_' // Just the prefix, not part of the random key
      const hashedKey = createHash('sha256').update(apiKey).digest('hex')

      // Use smart_generate_api_key which keeps up to 3 keys active
      const { data: keyResultRaw, error: keyError } = await supabase.rpc('smart_generate_api_key', {
        p_key_prefix: keyPrefix,
        p_hashed_key: hashedKey,
        p_max_active_keys: 3
      }).maybeSingle()

      if (keyError) {
        console.error('❌ Failed to generate API key:', keyError)
        setError('Failed to generate API key. Please try again.')
        return
      }

      const keyResult = keyResultRaw as any

      if (keyResult && !keyResult.was_generated) {
        console.log(`ℹ️  Key not generated: ${keyResult.message}`)
        setError(keyResult.message)
        return
      }

      console.log('✅ API key generated successfully')

      // Get user tier with graceful fallback
      let tier = 'individual'
      
      // Try profiles table first
      const { data: profile } = await supabase
        .from('profiles')
        .select('plan_name, unlimited_access')
        .eq('id', userId)
        .maybeSingle()

      if (profile) {
        if (profile.unlimited_access) {
          tier = 'enterprise' // Unlimited access = enterprise features
        } else if (profile.plan_name?.toLowerCase().includes('enterprise')) {
          tier = 'enterprise'
        } else if (profile.plan_name?.toLowerCase().includes('professional')) {
          tier = 'professional'
        }
      } else {
        // Fallback to user_tiers if profiles doesn't exist
        const { data: tierData } = await supabase
          .from('user_tiers')
          .select('tier_name')
          .eq('user_id', userId)
          .maybeSingle()
        
        if (tierData?.tier_name) {
          tier = tierData.tier_name.toLowerCase()
        }
      }

      // Construct the VS Code callback URL
      const callbackUrl = `vscode://sainocode.sainocode-ai/auth?` +
        `key=${encodeURIComponent(apiKey)}` +
        `&email=${encodeURIComponent(email)}` +
        `&tier=${encodeURIComponent(tier)}`

      console.log(`✅ Redirecting to VS Code with tier: ${tier}`)
      
      // Redirect to VS Code
      window.location.href = callbackUrl
    } catch (err) {
      console.error('❌ Error handling VS Code redirect:', err)
      setError('Failed to redirect to VS Code. Please try again.')
    }
  }

  const handleOAuthSignIn = async (provider: 'github' | 'google' | 'azure') => {
    try {
      setError(null)
      
      // Set loading state for specific provider
      if (provider === 'google') setGoogleLoading(true)
      else if (provider === 'github') setGithubLoading(true)
      else if (provider === 'azure') setMicrosoftLoading(true)

      // Construct redirect URL based on whether this is a VS Code callback
      const redirectTo = isVSCodeCallback 
        ? `${location.origin}/auth/callback?callback=vscode`
        : `${location.origin}/auth/callback`

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      })

      if (error) {
        console.error(`${provider} OAuth error:`, error)
        setError(`Failed to sign in with ${provider}. Please try again.`)
        // Reset loading state on error
        if (provider === 'google') setGoogleLoading(false)
        else if (provider === 'github') setGithubLoading(false)
        else if (provider === 'azure') setMicrosoftLoading(false)
      }
      // If successful, user will be redirected automatically
    } catch (err) {
      console.error('OAuth sign in error:', err)
      setError('An unexpected error occurred. Please try again.')
      // Reset loading states
      setGoogleLoading(false)
      setGithubLoading(false)
      setMicrosoftLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">
            {isVSCodeCallback ? 'Sign in for VS Code' : 'Login'}
          </CardTitle>
          <CardDescription>
            {isVSCodeCallback 
              ? 'Sign in to connect your VS Code extension'
              : 'Enter your email below to login to your account'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" formAction="/auth/login" className="w-full">
              Login
            </Button>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
             <Button 
              variant="outline" 
              onClick={() => handleOAuthSignIn('github')}
              disabled={isLoading || githubLoading}
            >
              {githubLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.gitHub className="mr-2 h-4 w-4" />
              )}
              GitHub
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleOAuthSignIn('google')}
              disabled={isLoading || googleLoading}
            >
              {googleLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.google className="mr-2 h-4 w-4" />
              )}
              Google
            </Button>
             <Button 
              variant="outline" 
              onClick={() => handleOAuthSignIn('azure')}
              disabled={isLoading || microsoftLoading}
            >
              {microsoftLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.microsoft className="mr-2 h-4 w-4" />
              )}
              Microsoft
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="container relative flex min-h-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <Card>
            <CardHeader>
              <CardTitle>Loading...</CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}