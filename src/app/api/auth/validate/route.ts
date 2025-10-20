import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createHash } from 'crypto'

// Mark this route as dynamic - it validates API keys dynamically
export const dynamic = 'force-dynamic'
export const revalidate = 0

// Load special user config with fallback to environment variables
// This allows the app to work on Netlify even if config file is gitignored
let SPECIAL_USER_ID: string | null = null
let SPECIAL_USER_EMAIL: string | null = null
let ENABLE_SPECIAL_USER: boolean = false

try {
  // Try to import the config file (will work locally if file exists)
  const config = require('@/config/special-user.config')
  SPECIAL_USER_ID = config.SPECIAL_USER_ID
  SPECIAL_USER_EMAIL = config.SPECIAL_USER_EMAIL
  ENABLE_SPECIAL_USER = config.ENABLE_SPECIAL_USER
} catch {
  // Config file doesn't exist, use environment variables instead
  SPECIAL_USER_ID = process.env.SPECIAL_USER_ID || null
  SPECIAL_USER_EMAIL = process.env.SPECIAL_USER_EMAIL || null
  ENABLE_SPECIAL_USER = process.env.ENABLE_SPECIAL_USER === 'true'
}

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

    // Look up the API key in the database (only active keys)
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('user_id')
      .eq('hashed_key', hashedKey)
      .eq('is_active', true)  // Only match active keys
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

    // Fetch user profile information from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('subscription_status, plan_name')
      .eq('id', keyData.user_id)
      .maybeSingle()

    if (profileError) {
      console.error('Database error fetching profile:', profileError)
      return NextResponse.json(
        { error: 'Error fetching user profile' },
        { status: 500 }
      )
    }

    // Fetch user tier information from user_tiers table (fallback if profiles not set)
    const { data: tierData, error: tierError } = await supabase
      .from('user_tiers')
      .select('tier')
      .eq('user_id', keyData.user_id)
      .maybeSingle()

    if (tierError) {
      console.error('Database error fetching user tier:', tierError)
    }

    // Use profile data if available, otherwise fall back to tier data
    const userTier = tierData?.tier || 'free'
    const subscriptionStatus = profile?.subscription_status || 'inactive'
    const planName = profile?.plan_name || 'Free'

    // Fetch user email from auth.users
    // Note: This requires Service Role access, so we use the server client
    const { data: userData } = await supabase.auth.admin.getUserById(keyData.user_id)

    // Check if this is the special admin user (configured in special-user.config.ts)
    // This user gets unlimited Pro access
    let isSpecialUser = false
    
    if (ENABLE_SPECIAL_USER) {
      if (SPECIAL_USER_ID) {
        // Check by user ID
        isSpecialUser = keyData.user_id === SPECIAL_USER_ID
      } else if (SPECIAL_USER_EMAIL && userData?.user?.email) {
        // Check by email
        isSpecialUser = userData.user.email.toLowerCase() === SPECIAL_USER_EMAIL.toLowerCase()
      }
    }

    // Determine user tier and plan based on profiles table or special user status
    let tier = 'individual'
    let plan = planName
    let unlimited = false
    let finalSubscriptionStatus = subscriptionStatus

    if (isSpecialUser) {
      // Special user gets unlimited Pro access
      tier = 'professional'
      plan = 'Professional (Unlimited)'
      unlimited = true
      finalSubscriptionStatus = 'active'
      console.log('🔑 Special user detected:', userData?.user?.email || keyData.user_id)
    } else if (subscriptionStatus === 'active') {
      // Active subscription from profiles table
      if (userTier === 'professional' || planName?.includes('Professional')) {
        tier = 'professional'
        plan = planName || 'Professional'
      } else if (userTier === 'enterprise' || planName?.includes('Enterprise')) {
        tier = 'enterprise'
        plan = planName || 'Enterprise'
      } else {
        tier = 'professional' // Default for active subscriptions
        plan = planName || 'Professional'
      }
    } else if (subscriptionStatus === 'trial') {
      tier = 'trial'
      plan = planName || 'Free Trial'
    } else if (userTier === 'professional') {
      // Fallback to user_tiers if profiles not set
      tier = 'professional'
      plan = 'Professional'
      finalSubscriptionStatus = 'active'
    } else if (userTier === 'enterprise') {
      tier = 'enterprise'
      plan = 'Enterprise'
      finalSubscriptionStatus = 'active'
    } else {
      // Free tier
      tier = 'individual'
      plan = 'Free'
      finalSubscriptionStatus = 'inactive'
    }

    // Return validation success with user information
    return NextResponse.json({
      valid: true,
      user: {
        id: keyData.user_id,
        email: userData?.user?.email || null,
        full_name: userData?.user?.user_metadata?.full_name || userData?.user?.email?.split('@')[0] || 'User',
        tier: tier,
        plan: plan,
        subscription_status: finalSubscriptionStatus,
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
