import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Mark this route as dynamic - it uses cookies for authentication
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const formData = await request.formData()
  const email = String(formData.get('email'))
  const password = String(formData.get('password'))
  const fullName = String(formData.get('full_name'))
  const supabase = createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      // This email redirect is for the confirmation email
      emailRedirectTo: `${requestUrl.origin}/auth/callback`,
    },
  })

  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/signup?error=Could not create account. Please try again.`
    )
  }

  return NextResponse.redirect(
    `${requestUrl.origin}/login?message=Check email to continue sign in process`
  )
}