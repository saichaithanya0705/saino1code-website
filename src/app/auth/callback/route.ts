import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { createHash } from 'crypto'

// Mark this route as dynamic - it uses cookies for authentication
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Type definitions for RPC function returns
type ShouldGenerateResult = {
  should_generate: boolean
  reason: string
  active_key_count: number
  last_generated_seconds_ago: number | null
}

type KeyGenerationResult = {
  was_generated: boolean
  message: string
}

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
        console.log('🔵 VS Code callback detected, checking if should generate API key...')
        
        // Check if user already has a recent key (prevents duplicate generation)
        const { data: shouldGenerateDataRaw, error: checkError } = await supabase
          .rpc('should_generate_new_key', { p_cooldown_minutes: 5 })
          .single()
        
        if (checkError) {
          console.warn('⚠️  Could not check key status:', checkError)
          // Continue anyway - will try to generate
        }

        const shouldGenerateData = shouldGenerateDataRaw as ShouldGenerateResult | null

        if (shouldGenerateData && !shouldGenerateData.should_generate) {
          // User has a recent key - don't generate new one
          console.log(`ℹ️  ${shouldGenerateData.reason}`)
          console.log(`   Active keys: ${shouldGenerateData.active_key_count}`)
          console.log(`   Last generated: ${shouldGenerateData.last_generated_seconds_ago}s ago`)
          
          // Show user-friendly message
          const waitSeconds = (5 * 60) - (shouldGenerateData.last_generated_seconds_ago || 0)
          const waitMinutes = Math.ceil(waitSeconds / 60)
          
          return NextResponse.redirect(
            `${requestUrl.origin}/login?` +
            `error=recent_key_exists&` +
            `wait=${waitMinutes}&` +
            `callback=vscode`
          )
        }
        
        console.log('✅ Generating new API key...')
        
        // Generate API key using smart_generate_api_key (keeps up to 3 active keys)
        const apiKey = `sk_${Buffer.from(crypto.getRandomValues(new Uint8Array(24))).toString('hex')}`
        const keyPrefix = 'sk_' // Just the prefix, not part of the random key
        const hashedKey = createHash('sha256').update(apiKey).digest('hex')

        // Use smart_generate_api_key which now returns success status
        const { data: keyResultRaw, error: keyError } = await supabase
          .rpc('smart_generate_api_key', {
            p_key_prefix: keyPrefix,
            p_hashed_key: hashedKey,
            p_max_active_keys: 3
          })
          .single()

        if (keyError) {
          console.error('❌ Failed to generate API key:', keyError)
          return NextResponse.redirect(`${requestUrl.origin}/login?error=api_key_failed&callback=vscode`)
        }

        const keyResult = keyResultRaw as KeyGenerationResult | null

        // Check if key was actually generated
        if (keyResult && !keyResult.was_generated) {
          console.log(`ℹ️  Key not generated: ${keyResult.message}`)
          return NextResponse.redirect(
            `${requestUrl.origin}/login?` +
            `error=key_not_generated&` +
            `message=${encodeURIComponent(keyResult.message)}&` +
            `callback=vscode`
          )
        }

        console.log('✅ API key generated successfully')

        // Get user tier with graceful fallback
        let tier = 'individual'
        const email = data.user.email || ''
        
        // Try profiles table first
        const { data: profile } = await supabase
          .from('profiles')
          .select('plan_name, unlimited_access')
          .eq('id', data.user.id)
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
            .eq('user_id', data.user.id)
            .maybeSingle()
          
          if (tierData?.tier_name) {
            tier = tierData.tier_name.toLowerCase()
          }
        }

        // Construct VS Code callback URL
        const vsCodeCallbackUrl = `vscode://sainocode.sainocode-ai/auth?` +
          `key=${encodeURIComponent(apiKey)}` +
          `&email=${encodeURIComponent(email)}` +
          `&tier=${encodeURIComponent(tier)}`

        console.log(`✅ Redirecting to VS Code with tier: ${tier}`)
        
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
