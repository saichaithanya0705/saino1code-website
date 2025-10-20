import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Mark this route as dynamic - it uses cookies for authentication
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const supabase = createClient()

  await supabase.auth.signOut()

  return NextResponse.redirect(`${requestUrl.origin}/login?message=You have been signed out.`)
}