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
  const vscodeState = requestUrl.searchParams.get('state') || ''

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

        // Generate API key for VS Code
        const supabase2 = await createClient()

        // Generate API key using Node.js crypto
        const { randomBytes, createHash } = await import('crypto')
        const apiKeyBytes = randomBytes(24)
        const apiKey = `sk_${apiKeyBytes.toString('hex')}`
        const keyPrefix = apiKey.slice(0, 6)
        const hashedKey = createHash('sha256').update(apiKey).digest('hex')

        console.log(' Generated API key details:')
        console.log('   - Key prefix:', keyPrefix)
        console.log('   - Key length:', apiKey.length)
        console.log('   - Hash length:', hashedKey.length)
        console.log('   - User ID:', data.user.id)
        console.log('   - Email:', email)
        console.log('   - Tier:', tier)

        // Store API key in database with email and tier
        const { data: insertData, error: keyError } = await supabase2
          .from('api_keys')
          .insert({
            user_id: data.user.id,
            key_prefix: keyPrefix,
            hashed_key: hashedKey,
            is_active: true,
            email: email,
            tier: tier
          })
          .select()

        if (keyError) {
          console.error(' Failed to store API key:', keyError)
          return NextResponse.redirect(
            `${requestUrl.origin}/login?error=key_generation_failed`
          )
        }

        console.log(' API key stored successfully in database')
        console.log('   - Insert result:', insertData)

        // Verify the key can be retrieved immediately
        const { data: verifyData, error: verifyError } = await supabase2
          .from('api_keys')
          .select('key_prefix, is_active, email, tier')
          .eq('key_prefix', keyPrefix)
          .eq('hashed_key', hashedKey)
          .single()

        if (verifyError || !verifyData) {
          console.error(' WARNING: Could not verify API key after insert!')
          console.error('   - Verify error:', verifyError)
          console.error('   - Verify data:', verifyData)
        } else {
          console.log(' API key verified successfully:', verifyData)
        }

        // Redirect to success page which will open VS Code
        // Browsers block direct redirects to custom URI schemes for security
        const successUrl = new URL(`${requestUrl.origin}/auth/success`)
        successUrl.searchParams.set('code', apiKey)
        if (vscodeState) {
          successUrl.searchParams.set('state', vscodeState)
        }

        console.log(' Redirecting to success page')
        return NextResponse.redirect(successUrl.toString())
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
