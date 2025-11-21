import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createHash, randomBytes } from 'crypto'

// Mark this route as dynamic
export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * VSCode OAuth Initiate Endpoint
 * 
 * This starts the OAuth flow for VSCode extension with PKCE.
 * Extension calls this, user authenticates, then we redirect back to vscode://
 * 
 * Query params:
 *   - state: CSRF protection token
 *   - code_challenge: PKCE challenge
 *   - code_challenge_method: Should be 'S256'
 */
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const state = searchParams.get('state')
        const codeChallenge = searchParams.get('code_challenge')
        const codeChallengeMethod = searchParams.get('code_challenge_method')

        // Validate required parameters
        if (!state || !codeChallenge || !codeChallengeMethod) {
            return NextResponse.json(
                { error: 'Missing required parameters: state, code_challenge, code_challenge_method' },
                { status: 400 }
            )
        }

        if (codeChallengeMethod !== 'S256') {
            return NextResponse.json(
                { error: 'Only S256 code_challenge_method is supported' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // Check if user is already authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            // User not authenticated - redirect to login with return URL
            const returnUrl = encodeURIComponent(
                `/api/auth/vscode/initiate?state=${state}&code_challenge=${codeChallenge}&code_challenge_method=${codeChallengeMethod}`
            )
            return NextResponse.redirect(
                `${request.nextUrl.origin}/login?redirect=${returnUrl}&callback=vscode`
            )
        }

        // User is authenticated - generate authorization code
        const authCode = randomBytes(32).toString('base64url')

        // Store the PKCE challenge and user info temporarily (in database)
        // We'll verify this when exchanging the code for a token
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

        const { error: insertError } = await supabase
            .from('oauth_codes')
            .insert({
                code: createHash('sha256').update(authCode).digest('hex'), // Store hashed
                user_id: user.id,
                code_challenge: codeChallenge,
                state: state,
                expires_at: expiresAt.toISOString()
            })

        if (insertError) {
            console.error('Error storing OAuth code:', insertError)
            return NextResponse.json(
                { error: 'Failed to create authorization code' },
                { status: 500 }
            )
        }

        // Redirect back to VSCode with authorization code
        const callbackUrl = `vscode://sainocode.sainocode-ai/auth/callback?code=${authCode}&state=${state}`

        return NextResponse.redirect(callbackUrl)

    } catch (error) {
        console.error('Error in VSCode OAuth initiate:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
