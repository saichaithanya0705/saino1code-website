import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_failed`)
    }

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