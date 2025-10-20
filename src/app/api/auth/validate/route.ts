import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createHash } from 'crypto'
import { SPECIAL_USER_ID, SPECIAL_USER_EMAIL, ENABLE_SPECIAL_USER } from '@/config/special-user.config'

/**
 * API Key Validation Endpoint
 * 
 * This endpoint validates API keys generated from the dashboard
 * and returns user information for the VS Code extension.
 * 
 * Request:
 *   POST /api/auth/validate
 *   Headers: Authorization: Bearer s1c_... OR x-api-key: s1c_...
 * 
 * Response:
 *   Success: { valid: true, user: { id, email, full_name, tier, plan } }
 *   Error: { error: string }
 */
export async function POST(request: NextRequest) {
  try {
    // Extract API key from either Authorization header or x-api-key header
    const authHeader = request.headers.get('authorization')
    const apiKeyHeader = request.headers.get('x-api-key')
    
    let apiKey: string | null = null
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      apiKey = authHeader.slice(7) // Remove 'Bearer ' prefix
    } else if (apiKeyHeader) {
      apiKey = apiKeyHeader
    }
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Missing API key. Provide either Authorization: Bearer s1c_... or x-api-key: s1c_...' },
        { status: 401 }
      )
    }

    // Validate API key format (support both s1c_ and sk_ prefixes for compatibility)
    if (!apiKey.startsWith('s1c_') && !apiKey.startsWith('sk_')) {
      return NextResponse.json(
        { error: 'Invalid API key format. API keys must start with s1c_ or sk_' },
        { status: 401 }
      )
    }

    // Hash the provided API key (same method used during generation)
    const hashedKey = createHash('sha256').update(apiKey).digest('hex')

    // Create Supabase client
    const supabase = createClient()

    // Look up the API key in the database
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('user_id')
      .eq('hashed_key', hashedKey)
      .maybeSingle()

    if (keyError) {
      console.error('Database error looking up API key:', keyError)
      return NextResponse.json(
        { error: 'Database error during validation' },
        { status: 500 }
      )
    }

    if (!keyData) {
      return NextResponse.json(
        { error: 'Invalid API key. Please check your key or generate a new one from the dashboard.' },
        { status: 401 }
      )
    }

    // Fetch user profile information
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, subscription_status, plan_name')
      .eq('id', keyData.user_id)
      .single()

    if (profileError) {
      console.error('Database error fetching profile:', profileError)
      return NextResponse.json(
        { error: 'Error fetching user profile' },
        { status: 500 }
      )
    }

    if (!profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      )
    }

    // Fetch user email from auth.users
    // Note: This requires Service Role access, so we use the server client
    const { data: userData } = await supabase.auth.admin.getUserById(keyData.user_id)

    // Check if this is the special admin user (configured in special-user.config.ts)
    // This user gets unlimited Pro access
    let isSpecialUser = false
    
    if (ENABLE_SPECIAL_USER) {
      if (SPECIAL_USER_ID) {
        // Check by user ID
        isSpecialUser = profile.id === SPECIAL_USER_ID
      } else if (SPECIAL_USER_EMAIL && userData?.user?.email) {
        // Check by email
        isSpecialUser = userData.user.email.toLowerCase() === SPECIAL_USER_EMAIL.toLowerCase()
      }
    }

    // Determine user tier based on subscription status or special user status
    let tier = 'individual'
    let plan = profile.plan_name || 'Free'
    let unlimited = false

    if (isSpecialUser) {
      // Special user gets unlimited Pro access
      tier = 'professional'
      plan = 'Professional (Unlimited)'
      unlimited = true
      console.log('🔑 Special user detected:', userData?.user?.email || profile.id)
    } else if (profile.subscription_status === 'active') {
      tier = 'enterprise'
      plan = profile.plan_name || 'Active'
    } else if (profile.subscription_status === 'trial') {
      tier = 'trial'
      plan = 'Free Trial'
    }

    // Return validation success with user information
    return NextResponse.json({
      valid: true,
      user: {
        id: profile.id,
        email: userData?.user?.email || null,
        full_name: profile.full_name || 'User',
        tier: tier,
        plan: plan,
        subscription_status: profile.subscription_status,
        unlimited: unlimited  // Flag for extension to bypass token limits
      }
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store', // Don't cache validation responses
      }
    })

  } catch (error) {
    console.error('Unexpected error in API key validation:', error)
    return NextResponse.json(
      { error: 'Internal server error during validation' },
      { status: 500 }
    )
  }
}

// Handle OPTIONS request for CORS (if needed)
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type, x-api-key',
    }
  })
}
