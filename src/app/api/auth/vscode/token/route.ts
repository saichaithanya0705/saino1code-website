import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/request'
import { createClient } from '@/lib/supabase/server'
import crypto from 'crypto'

/**
 * VS Code OAuth Token Exchange Endpoint
 * Exchanges authorization code for access token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, code_verifier } = body

    console.log('🔵 VS Code token exchange request:', { code: code?.slice(0, 10) + '...', hasVerifier: !!code_verifier })

    if (!code || !code_verifier) {
      console.error('❌ Missing required parameters')
      return NextResponse.json(
        { error: 'Missing code or code_verifier' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Extract key prefix and hash the full API key
    const keyPrefix = code.slice(0, 6)
    const hashedKey = crypto.createHash('sha256').update(code).digest('hex')

    console.log('🔍 Looking up API key with prefix:', keyPrefix)

    // Look up the API key in database
    const { data: apiKeyData, error: apiKeyError } = await supabase
      .from('api_keys')
      .select('user_id, is_active, email, tier')
      .eq('key_prefix', keyPrefix)
      .eq('hashed_key', hashedKey)
      .eq('is_active', true)
      .single()

    if (apiKeyError || !apiKeyData) {
      console.error('❌ Invalid API key lookup failed')
      console.error('   - Key prefix:', keyPrefix)
      console.error('   - Error:', apiKeyError)
      console.error('   - Data:', apiKeyData)

      // Debug: Try to find ANY key with this prefix
      const { data: debugKeys } = await supabase
        .from('api_keys')
        .select('key_prefix, is_active, email, created_at')
        .eq('key_prefix', keyPrefix)
        .limit(5)

      console.error('   - Keys with this prefix:', debugKeys)

      return NextResponse.json(
        { error: 'Invalid authorization code' },
        { status: 401 }
      )
    }

    console.log('✅ API key found for user:', apiKeyData.user_id)

    // Use data from API key record
    const email = apiKeyData.email || ''
    const tier = apiKeyData.tier || 'free'

    console.log('✅ Token exchange successful:', { email: email ? 'found' : 'not found', tier })

    // Return token response in OAuth format
    return NextResponse.json({
      access_token: code,
      refresh_token: code,
      expires_in: 31536000, // 1 year
      token_type: 'Bearer',
      user_id: apiKeyData.user_id,
      email: email,
      tier: tier
    })

  } catch (error) {
    console.error('❌ Error in token exchange:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
