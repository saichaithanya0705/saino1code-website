import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * VS Code OAuth Initiation Endpoint
 * Redirects to login page with vscode callback parameter
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const state = searchParams.get('state')
    const codeChallenge = searchParams.get('code_challenge')
    const codeChallengeMethod = searchParams.get('code_challenge_method')

    console.log('🔵 VS Code OAuth initiation:', { state, codeChallenge, codeChallengeMethod })

    if (!state) {
      return NextResponse.json(
        { error: 'Missing state parameter' },
        { status: 400 }
      )
    }

    // Build login URL with VS Code callback flag
    const loginUrl = new URL(`${request.nextUrl.origin}/login`)
    loginUrl.searchParams.set('callback', 'vscode')
    loginUrl.searchParams.set('state', state)

    if (codeChallenge) {
      loginUrl.searchParams.set('code_challenge', codeChallenge)
    }
    if (codeChallengeMethod) {
      loginUrl.searchParams.set('code_challenge_method', codeChallengeMethod)
    }

    console.log('✅ Redirecting to login page:', loginUrl.toString())

    // Redirect to login page
    return NextResponse.redirect(loginUrl.toString())

  } catch (error) {
    console.error('❌ Error in VS Code OAuth initiation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
