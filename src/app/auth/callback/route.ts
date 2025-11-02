import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Mark this route as dynamic - it uses cookies for authentication
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const isVSCodeCallback = requestUrl.searchParams.get('callback') === 'vscode'

  if (code) {
    const supabase = await createClient()
    
    try {
      // Exchange code for session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error(' Auth error:', error)
        return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_failed`)
      }

      if (!data?.user) {
        console.error(' No user data after auth')
        return NextResponse.redirect(`${requestUrl.origin}/login?error=no_user`)
      }

      const email = data.user.email || ''
      console.log(` User authenticated: ${email}`)

      // Get user tier from database
      let tier = 'free'
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('tier')
          .eq('id', data.user.id)
          .single()

        if (profileError) {
          console.error(' Error fetching profile:', profileError)
        } else if (profile?.tier) {
          tier = profile.tier
          console.log(` User tier: ${tier}`)
        }
      } catch (err) {
        console.error(' Profile fetch error:', err)
      }

      // Handle VS Code callback
      if (isVSCodeCallback) {
        console.log(` VS Code callback detected for ${email}`)
        
        // Redirect to dashboard with VS Code callback flag
        // Users will manually generate API key from dashboard
        return NextResponse.redirect(
          `${requestUrl.origin}/dashboard?callback=vscode&tier=${tier}&email=${encodeURIComponent(email)}`
        )
      }

      // Regular web login - redirect to dashboard
      console.log(` Regular login for ${email}`)
      return NextResponse.redirect(`${requestUrl.origin}/dashboard`)

    } catch (err) {
      console.error(' Error handling VS Code callback:', err)
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=callback_failed`
      )
    }
  }

  // No code provided
  return NextResponse.redirect(`${requestUrl.origin}/login?error=no_code`)
}
