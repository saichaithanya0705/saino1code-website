import { createClient } from '@/lib/supabase/server'
import { razorpay } from '@/lib/razorpay'
import { NextResponse } from 'next/server'

/**
 * Create Razorpay Customer Portal Session
 * 
 * Note: Razorpay doesn't have a built-in customer portal like Stripe.
 * This endpoint provides subscription management functionality by:
 * 1. Fetching current subscription details
 * 2. Returning data to be displayed in a custom portal UI
 * 
 * For subscription cancellation, users can:
 * - Use the Razorpay dashboard link
 * - Or implement a custom cancellation API route
 */

// Force dynamic rendering - don't pre-render this API route
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Retrieve the user's Razorpay subscription details from profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('razorpay_subscription_id, razorpay_customer_id, plan_name, subscription_status')
    .eq('id', user.id)
    .single()

  if (profileError || !profile?.razorpay_subscription_id) {
    console.error('Error fetching profile or missing subscription ID:', profileError)
    return new NextResponse(
      JSON.stringify({ error: 'Could not find subscription information.' }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  try {
    // Fetch subscription details from Razorpay
    const subscription = await razorpay.subscriptions.fetch(
      profile.razorpay_subscription_id
    )

    // Return subscription details for custom portal UI
    return NextResponse.json({ 
      subscription: {
        id: subscription.id,
        plan_id: subscription.plan_id,
        status: subscription.status,
        current_start: subscription.current_start,
        current_end: subscription.current_end,
        charge_at: subscription.charge_at,
        total_count: subscription.total_count,
        paid_count: subscription.paid_count,
        remaining_count: subscription.remaining_count,
      },
      planName: profile.plan_name,
      // Note: For actual cancellation/management, implement separate API routes
      // Razorpay API methods: razorpay.subscriptions.cancel(subscriptionId)
      managementUrl: `${requestUrl.origin}/dashboard/billing`,
    })
  } catch (err: any) {
    console.error('Error fetching Razorpay subscription:', err)
    return new NextResponse(
      JSON.stringify({ 
        error: 'Could not fetch subscription details.',
        details: err.message 
      }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}