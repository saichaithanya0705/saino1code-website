import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

// Mark this route as dynamic
export const dynamic = 'force-dynamic'

/**
 * VS Code OAuth Token Refresh Endpoint
 * Refreshes an expired access token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { refresh_token } = body

    console.log('🔵 VS Code token refresh request')

    if (!refresh_token) {
      console.error('❌ Missing refresh_token')
      return NextResponse.json(
        { error: 'Missing refresh_token' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Extract key prefix and hash
    const keyPrefix = refresh_token.slice(0, 6)
    const hashedKey = crypto.createHash('sha256').update(refresh_token).digest('hex')

    // Verify the API key is still valid
    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from('api_keys')
      .select('user_id, is_active, email, tier')
      .eq('key_prefix', keyPrefix)
      .eq('hashed_key', hashedKey)
      .eq('is_active', true)
      .single()

    if (apiKeyError || !apiKeyData) {
      console.error('❌ Invalid refresh token:', apiKeyError)
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      )
    }

    const email = apiKeyData.email || ''
    const tier = apiKeyData.tier || 'free'

    console.log('✅ Token refresh successful:', { email: email ? 'found' : 'not found', tier })

    // Return refreshed token (same as original since API keys don't expire)
    return NextResponse.json({
      access_token: refresh_token,
      refresh_token: refresh_token,
      expires_in: 31536000,
      token_type: 'Bearer',
      user_id: apiKeyData.user_id,
      email: email,
      tier: tier
    })

  } catch (error) {
    console.error('❌ Error in token refresh:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
