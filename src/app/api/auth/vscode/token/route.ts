import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createHash, createHmac, randomBytes } from 'crypto'

// Mark this route as dynamic
export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * VSCode OAuth Token Exchange Endpoint
 * 
 * Exchanges authorization code for access token (with PKCE verification)
 * 
 * Body:
 *   - code: Authorization code from initiate step
 *   - code_verifier: PKCE verifier (to verify against stored challenge)
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { code, code_verifier } = body

        if (!code || !code_verifier) {
            return NextResponse.json(
                { error: 'Missing required parameters: code, code_verifier' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // Hash the provided code to look it up
        const hashedCode = createHash('sha256').update(code).digest('hex')

        // Look up the authorization code
        const { data: oauthCode, error: codeError } = await supabase
            .from('oauth_codes')
            .select('*')
            .eq('code', hashedCode)
            .maybeSingle()

        if (codeError || !oauthCode) {
            return NextResponse.json(
                { error: 'Invalid authorization code' },
                { status: 401 }
            )
        }

        // Check if code is expired
        if (new Date(oauthCode.expires_at) < new Date()) {
            // Delete expired code
            await supabase.from('oauth_codes').delete().eq('code', hashedCode)

            return NextResponse.json(
                { error: 'Authorization code expired' },
                { status: 401 }
            )
        }

        // Verify PKCE challenge
        const computedChallenge = createHash('sha256')
            .update(code_verifier)
            .digest('base64url')

        if (computedChallenge !== oauthCode.code_challenge) {
            return NextResponse.json(
                { error: 'Invalid code_verifier' },
                { status: 401 }
            )
        }

        // PKCE verified - generate access token
        const accessToken = randomBytes(32).toString('base64url')
        const refreshToken = randomBytes(32).toString('base64url')
        const expiresIn = 3600 // 1 hour

        // Store the access token in database
        const expiresAt = new Date(Date.now() + expiresIn * 1000)

        const { error: tokenError } = await supabase
            .from('vscode_tokens')
            .insert({
                access_token: createHash('sha256').update(accessToken).digest('hex'),
                refresh_token: createHash('sha256').update(refreshToken).digest('hex'),
                user_id: oauthCode.user_id,
                expires_at: expiresAt.toISOString()
            })

        if (tokenError) {
            console.error('Error storing token:', tokenError)
            return NextResponse.json(
                { error: 'Failed to create access token' },
                { status: 500 }
            )
        }

        // Delete the used authorization code
        await supabase.from('oauth_codes').delete().eq('code', hashedCode)

        // Get user profile info
        const { data: profile } = await supabase
            .from('profiles')
            .select('subscription_status, plan_name')
            .eq('id', oauthCode.user_id)
            .single()

        // Get user email
        const { data: userData } = await supabase.auth.admin.getUserById(oauthCode.user_id)

        // Return access token with user info
        return NextResponse.json({
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: expiresIn,
            token_type: 'Bearer',
            user_id: oauthCode.user_id,
            email: userData?.user?.email || null,
            tier: profile?.subscription_status === 'active' ? 'professional' : 'individual'
        })

    } catch (error) {
        console.error('Error in VSCode OAuth token exchange:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
