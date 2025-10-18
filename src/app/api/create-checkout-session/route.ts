import { createClient } from '@/lib/supabase/server'
import { razorpay } from '@/lib/razorpay'
import { NextResponse } from 'next/server'

// Force dynamic rendering - don't pre-render this API route
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const { priceId, planName, billingCycle } = await request.json()
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

  try {
    // Create Razorpay subscription
    const subscription = await razorpay.subscriptions.create({
      plan_id: priceId, // This should be the Razorpay plan_id created in Razorpay Dashboard
      customer_notify: 1, // Send notification to customer
      total_count: billingCycle === 'annual' ? 12 : 1, // 12 for annual, 1 for monthly
      notes: {
        userId: user.id,
        userEmail: user.email || '',
        planName: planName,
        billingCycle: billingCycle || 'monthly',
      },
    })

    return NextResponse.json({ 
      subscriptionId: subscription.id,
      razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: subscription.plan_id, // Keep for reference
    })
  } catch (err: any) {
    console.error('Error creating Razorpay subscription:', err)
    return new NextResponse(
      JSON.stringify({ 
        error: 'Could not create checkout session',
        details: err.message 
      }), 
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}