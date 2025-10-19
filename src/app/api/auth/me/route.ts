import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Get Current User Info
 * 
 * This endpoint helps you find your user ID to configure as the special admin user.
 * 
 * Usage:
 * 1. Log in to the website
 * 2. Visit: https://assistant7.netlify.app/api/auth/me
 * 3. Copy your user ID from the response
 * 4. Add it to src/config/special-user.config.ts
 */
export async function GET() {
  try {
    const supabase = createClient()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated. Please log in first.' },
        { status: 401 }
      )
    }

    // Get profile info
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, subscription_status, plan_name, created_at')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
    }

    // Return user info
    return NextResponse.json({
      success: true,
      message: 'Copy the userId below and add it to src/config/special-user.config.ts',
      user: {
        userId: user.id,
        email: user.email,
        fullName: profile?.full_name || 'N/A',
        currentPlan: profile?.plan_name || 'Free',
        subscriptionStatus: profile?.subscription_status || 'inactive',
        createdAt: profile?.created_at || user.created_at
      },
      instructions: {
        step1: 'Copy your userId from above',
        step2: 'Open: src/config/special-user.config.ts',
        step3: 'Set SPECIAL_USER_ID to your userId (in quotes)',
        step4: 'Rebuild and redeploy the website',
        step5: 'Regenerate your API key from the dashboard',
        step6: 'Use the new API key in VS Code extension',
        step7: 'You will now have unlimited access!'
      }
    }, {
      headers: {
        'Cache-Control': 'no-store' // Don't cache user info
      }
    })

  } catch (error) {
    console.error('Unexpected error in /api/auth/me:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
