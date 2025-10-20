import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { createHash } from 'crypto'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const isVSCodeCallback = requestUrl.searchParams.get('callback') === 'vscode'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_failed`)
    }

    // If this is a VS Code callback, generate API key and redirect
    if (isVSCodeCallback && data?.user) {
      try {
        console.log('🔵 VS Code callback detected, generating API key...')
        
        // Generate API key
        const apiKey = `sk_${Buffer.from(crypto.getRandomValues(new Uint8Array(24))).toString('hex')}`
        const keyPrefix = apiKey.slice(0, 8)
        const hashedKey = createHash('sha256').update(apiKey).digest('hex')

        // Store/update API key
        const { error: keyError } = await supabase.rpc('transactional_regenerate_api_key', {
          p_key_prefix: keyPrefix,
          p_hashed_key: hashedKey,
        })

        if (keyError) {
          console.error('❌ Failed to generate API key:', keyError)
          return NextResponse.redirect(`${requestUrl.origin}/login?error=api_key_failed&callback=vscode`)
        }

        // Get user profile to determine tier
        const { data: profile } = await supabase
          .from('profiles')
          .select('plan_name')
          .eq('id', data.user.id)
          .single()

        const tier = profile?.plan_name?.toLowerCase().includes('enterprise') ? 'enterprise' : 'individual'
        const email = data.user.email || ''

        // Construct VS Code callback URL
        const vsCodeCallbackUrl = `vscode://sainocode.sainocode-ai/auth?` +
          `key=${encodeURIComponent(apiKey)}` +
          `&email=${encodeURIComponent(email)}` +
          `&tier=${encodeURIComponent(tier)}`

        console.log('✅ Redirecting to VS Code...')
        
        // Redirect to VS Code
        return NextResponse.redirect(vsCodeCallbackUrl)
      } catch (err) {
        console.error('❌ Error handling VS Code callback:', err)
        return NextResponse.redirect(`${requestUrl.origin}/login?error=vscode_redirect_failed`)
      }
    }

    // Regular web authentication flow
    // Check if this is a new user by checking profile creation timestamp
    if (data?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('created_at, subscription_status')
        .eq('id', data.user.id)
        .single()

      // If profile was just created (within last 5 seconds) and no subscription, redirect with new_user flag
      if (profile) {
        const profileAge = Date.now() - new Date(profile.created_at).getTime()
        const isNewUser = profileAge < 5000 // 5 seconds
        const hasNoSubscription = profile.subscription_status === 'inactive'

        if (isNewUser && hasNoSubscription) {
          return NextResponse.redirect(`${requestUrl.origin}/dashboard?show_trial=true`)
        }
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
}
