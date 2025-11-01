import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Mark this route as dynamic - it uses cookies for authentication
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const isVSCodeCallback = requestUrl.searchParams.get('callback') === 'vscode'
  
  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(`/login?error=auth_failed`)
    }

    // If this is a VS Code callback, redirect to dashboard with instruction
    if (isVSCodeCallback && data?.user) {
      try {
        console.log(' VS Code callback detected for user:', data.user.email)
        
        // Get user tier
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
            tier = 'enterprise'
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

        console.log(` User authenticated, redirecting to dashboard with tier: ``)
        
        // Redirect to dashboard with VS Code callback flag
        // Users will manually generate API key from dashboard
        return NextResponse.redirect(
          `/dashboard?` +
          `callback=vscode&` +
          `tier=`` +
          `&email=`
        )
      } catch (err) {
        console.error(' Error handling VS Code callback:', err)
        return NextResponse.redirect(`/login?error=vscode_redirect_failed`)
      }
    }

    // Regular web authentication flow
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
          return NextResponse.redirect(`/dashboard?show_trial=true`)
        }
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`/dashboard`)
}
