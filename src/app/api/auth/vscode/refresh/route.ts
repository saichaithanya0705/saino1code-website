import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createHash, randomBytes } from 'crypto'

// Mark this route as dynamic
export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * VSCode OAuth Token Refresh Endpoint
 * 
 * Refreshes an expired access token using a refresh token
 * 
 * Body:
 *   - refresh_token: The refresh token from initial token exchange
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { refresh_token } = body

        if (!refresh_token) {
            return NextResponse.json(
                { error: 'Missing required parameter: refresh_token' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // Hash the provided refresh token
        const hashedRefreshToken = createHash('sha256').update(refresh_token).digest('hex')

        // Look up the refresh token
        const { data: tokenData, error: tokenError } = await supabase
            .from('vscode_tokens')
            .select('*')
            .eq('refresh_token', hashedRefreshToken)
            .maybeSingle()

        if (tokenError || !tokenData) {
            return NextResponse.json(
                { error: 'Invalid refresh token' },
                { status: 401 }
            )
        }

        // Generate new access token
        const newAccessToken = randomBytes(32).toString('base64url')
        const newRefreshToken = randomBytes(32).toString('base64url')
        const expiresIn = 3600 // 1 hour

        const expiresAt = new Date(Date.now() + expiresIn * 1000)

        // Update the token in database
        const { error: updateError } = await supabase
            .from('vscode_tokens')
            .update({
                access_token: createHash('sha256').update(newAccessToken).digest('hex'),
                refresh_token: createHash('sha256').update(newRefreshToken).digest('hex'),
                expires_at: expiresAt.toISOString()
            })
            .eq('refresh_token', hashedRefreshToken)

        if (updateError) {
            console.error('Error updating token:', updateError)
            return NextResponse.json(
                { error: 'Failed to refresh access token' },
                { status: 500 }
            )
        }

        // Get user profile info
        const { data: profile } = await supabase
            .from('profiles')
            .select('subscription_status, plan_name')
            .eq('id', tokenData.user_id)
            .single()

        // Get user email
        const { data: userData } = await supabase.auth.admin.getUserById(tokenData.user_id)

        // Return new tokens
        return NextResponse.json({
            access_token: newAccessToken,
            refresh_token: newRefreshToken,
            expires_in: expiresIn,
            token_type: 'Bearer',
            user_id: tokenData.user_id,
            email: userData?.user?.email || null,
            tier: profile?.subscription_status === 'active' ? 'professional' : 'individual'
        })

    } catch (error) {
        console.error('Error in VSCode OAuth token refresh:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
